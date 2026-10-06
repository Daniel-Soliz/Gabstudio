/**
 * Firebase Cloud Functions para Gab Studio
 * Backend seguro para Mercado Pago (Token protegido em variável de ambiente)
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

admin.initializeApp();
const db = admin.firestore();

// Inicialização segura do Mercado Pago com Access Token das variáveis de ambiente
const getMpClient = () => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || functions.config().mercadopago?.token;
  if (!accessToken) {
    throw new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado no ambiente.');
  }
  return new MercadoPagoConfig({ accessToken });
};

/**
 * 1. Cloud Function: Criar Preferência / Pagamento Mercado Pago
 */
exports.createPaymentPreference = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { appointmentId, clientName, clientPhone, amount, serviceName } = req.body;

    if (!appointmentId || !amount) {
      return res.status(400).json({ error: 'Dados incompletos para criação do pagamento.' });
    }

    const client = getMpClient();
    const payment = new Payment(client);

    // Criação do pagamento via Pix
    const paymentResponse = await payment.create({
      body: {
        transaction_amount: Number(amount),
        description: `Sinal Gab Studio - ${serviceName} (${appointmentId})`,
        payment_method_id: 'pix',
        payer: {
          email: `${appointmentId.toLowerCase()}@gabstudio.com.br`,
          first_name: clientName || 'Cliente',
        },
        external_reference: appointmentId,
        notification_url: `${process.env.APP_URL || 'https://seu-projeto.cloudfunctions.net'}/mercadopagoWebhook`,
      },
    });

    const pointOfInteraction = paymentResponse.point_of_interaction;
    const qrCode = pointOfInteraction?.transaction_data?.qr_code;
    const qrCodeBase64 = pointOfInteraction?.transaction_data?.qr_code_base64;

    // Atualiza agendamento no Firestore com ID da transação
    await db.collection('appointments').doc(appointmentId).set({
      mercadopagoPaymentId: paymentResponse.id,
      paymentStatus: 'pendente',
      pixCopiaECola: qrCode,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return res.status(200).json({
      paymentId: paymentResponse.id,
      pixCopiaECola: qrCode,
      qrCodeBase64: qrCodeBase64,
      status: paymentResponse.status,
    });
  } catch (error) {
    console.error('Erro ao gerar pagamento no Mercado Pago:', error);
    return res.status(500).json({ error: error.message || 'Erro interno no gateway de pagamento' });
  }
});

/**
 * 2. Cloud Function: Webhook do Mercado Pago
 * Recebe notificações de status (pago, cancelado, reembolsado) e atualiza o Firestore
 */
exports.mercadopagoWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment' && data?.id) {
      const client = getMpClient();
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: data.id });

      const appointmentId = paymentInfo.external_reference;
      const status = paymentInfo.status; // 'approved', 'rejected', 'refunded', 'cancelled'

      if (appointmentId) {
        let appointmentStatus = 'pendente_pagamento';
        let paymentStatus = 'pendente';

        if (status === 'approved') {
          appointmentStatus = 'confirmado';
          paymentStatus = 'pago';
        } else if (status === 'refunded') {
          appointmentStatus = 'cancelado';
          paymentStatus = 'reembolsado';
        } else if (status === 'cancelled' || status === 'rejected') {
          appointmentStatus = 'cancelado';
          paymentStatus = 'cancelado';
        }

        await db.collection('appointments').doc(appointmentId).update({
          status: appointmentStatus,
          paymentStatus: paymentStatus,
          mercadopagoStatus: status,
          paidAt: status === 'approved' ? admin.firestore.FieldValue.serverTimestamp() : null,
        });

        console.log(`Agendamento ${appointmentId} atualizado para ${appointmentStatus} (${paymentStatus}).`);
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return res.status(500).send('Erro no webhook');
  }
});

/**
 * 3. Scheduled Cloud Function: Liberar horários não pagos após 15 minutos
 * Roda a cada 5 minutos
 */
exports.releaseUnpaidSlots = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  try {
    const snapshot = await db.collection('appointments')
      .where('status', '==', 'pendente_pagamento')
      .where('createdAt', '<=', fifteenMinutesAgo)
      .get();

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, {
        status: 'cancelado',
        paymentStatus: 'cancelado',
        cancelReason: 'Tempo limite de pagamento de 15 minutos expirado.',
      });
    });

    await batch.commit();
    console.log(`${snapshot.size} horários não pagos liberados.`);
    return null;
  } catch (error) {
    console.error('Erro ao liberar horários expirados:', error);
    return null;
  }
});
