import React, { useState, useEffect } from 'react';
import { 
  X, LayoutDashboard, Calendar as CalendarIcon, ClipboardList, PlusCircle, 
  Sparkles, Clock, Users, DollarSign, Settings, Bell, MessageCircle, 
  CheckCircle, Ban, AlertTriangle, Edit3, Trash2, Shield, LogOut, 
  Search, Filter, ChevronLeft, ChevronRight, Phone, Check, Eye
} from 'lucide-react';
import { 
  getAppointments, getServices, getSettings, getClients, 
  saveSettings, saveService, deleteService, updateAppointment, 
  createAppointment, getFinancialMetrics, playAppointmentChime,
  isDateAvailable
} from './storage';
import { Appointment, ServiceItem, ScheduleSettings, ClientRecord, AppointmentStatus, PaymentStatus } from './types';
import { LashIcon } from './DecorativeOrnament';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('gab@gabstudio.com.br');
  const [authPassword, setAuthPassword] = useState<string>('cilios123');
  const [loginError, setLoginError] = useState<string>('');

  // Active Tab
  type AdminTab = 'dashboard' | 'agenda' | 'agendamentos' | 'novo' | 'servicos' | 'disponibilidade' | 'clientes' | 'financeiro' | 'config';
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Live Data State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<ScheduleSettings>(getSettings());
  const [clients, setClients] = useState<ClientRecord[]>([]);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Agenda view state
  const [agendaViewMode, setAgendaViewMode] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [agendaCurrentDate, setAgendaCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Editing service state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Manual appointment form state
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('');
  const [manualServiceId, setManualServiceId] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState('10:00');
  const [manualPaymentStatus, setManualPaymentStatus] = useState<PaymentStatus>('pago');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'dinheiro' | 'pix' | 'cartao_credito'>('pix');
  const [manualFeedback, setManualFeedback] = useState<string | null>(null);

  // Load and subscribe
  const refreshData = () => {
    setAppointments(getAppointments());
    setServices(getServices());
    setSettings(getSettings());
    setClients(getClients());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      const handler = () => refreshData();
      window.addEventListener('gab-studio-data-changed', handler);
      return () => window.removeEventListener('gab-studio-data-changed', handler);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail.trim().toLowerCase() === 'gab@gabstudio.com.br' && authPassword === 'cilios123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciais inválidas. Use gab@gabstudio.com.br e cilios123.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Status updates
  const handleUpdateStatus = (id: string, status: AppointmentStatus, paymentStatus?: PaymentStatus) => {
    updateAppointment(id, { 
      status, 
      ...(paymentStatus ? { paymentStatus } : {}) 
    });
  };

  // Register manual payment
  const handleRegisterManualPayment = (id: string) => {
    const note = prompt('Forma de pagamento recebida no estúdio (Ex: Pix presencial, Dinheiro, Cartão na maquininha):', 'Pix no estúdio');
    if (note !== null) {
      updateAppointment(id, {
        paymentStatus: 'pago',
        manualPaymentNote: note,
      });
      alert('Pagamento registrado com sucesso!');
    }
  };

  // Submit manual booking
  const handleCreateManualAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find(s => s.id === manualServiceId);
    if (!service) {
      alert('Selecione um serviço');
      return;
    }
    if (!manualClientName.trim() || !manualClientPhone.trim()) {
      alert('Informe o nome e WhatsApp da cliente');
      return;
    }

    createAppointment({
      serviceId: service.id,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      price: service.price,
      depositAmount: service.price,
      remainingAmount: 0,
      date: manualDate,
      time: manualTime,
      clientName: manualClientName.trim(),
      clientPhone: manualClientPhone.trim(),
      status: 'confirmado',
      paymentStatus: manualPaymentStatus,
      paymentMethod: manualPaymentMethod,
      clientNotes: 'Agendamento manual criado pela Gab',
    });

    setManualFeedback('Agendamento manual criado com sucesso!');
    setManualClientName('');
    setManualClientPhone('');
    setTimeout(() => {
      setManualFeedback(null);
      setActiveTab('agendamentos');
    }, 1500);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments
    .filter(a => a.date === todayStr && a.status !== 'cancelado')
    .sort((a, b) => a.time.localeCompare(b.time));

  const metrics = getFinancialMetrics();

  // Filtered Appointments
  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus !== 'todos' && apt.status !== filterStatus) return false;
    if (filterDate && apt.date !== filterDate) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.clientName.toLowerCase().includes(q);
      const matchPhone = apt.clientPhone.includes(q);
      const matchId = apt.id.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative w-full max-w-6xl bg-[#0D0509] border border-[#FF2FA0]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-3.5 bg-[#1A0A12] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#FF2FA0]" />
            <div>
              <h2 className="font-display text-white text-base sm:text-lg font-medium flex items-center gap-2">
                <span>Painel de Controle Gab Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF2FA0]/20 text-[#FF8AD8] border border-[#FF2FA0]/30 font-sans">
                  Área da Gab
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={() => playAppointmentChime()}
                  title="Testar som de notificação"
                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-[#FF2FA0]" />
                  <span className="hidden sm:inline">Som Alerta</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sair do painel"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Fechar painel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Not Authenticated View */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#1A0A12] rounded-3xl border border-[#FF2FA0]/30 p-8 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#FF2FA0]/15 text-[#FF8AD8] flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-7 h-7 text-[#FF2FA0]" />
                </div>
                <h3 className="font-display text-2xl text-white font-medium">
                  Login da Gab Santos
                </h3>
                <p className="text-xs text-stone-400 font-light">
                  Acesso exclusivo para gerenciar agendamentos, clientes e finanças do estúdio.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-[#0D0509] border border-stone-800 focus:border-[#FF2FA0] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-[#0D0509] border border-stone-800 focus:border-[#FF2FA0] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
                    required
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-stone-400">
                  <span>Credenciais de demonstração: </span>
                  <strong className="text-stone-200">gab@gabstudio.com.br</strong> / <strong className="text-stone-200">cilios123</strong>
                </div>

                <button
                  type="submit"
                  className="w-full neon-button py-3 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-transform"
                >
                  <Shield className="w-4 h-4 text-[#FF8AD8]" />
                  <span>Acessar Painel da Gab</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-60 bg-[#1A0A12]/95 border-r border-stone-800/80 p-3 sm:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('agenda')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'agenda'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Agenda</span>
              </button>

              <button
                onClick={() => setActiveTab('agendamentos')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'agendamentos'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Agendamentos ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('novo')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'novo'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#FF8AD8]" />
                <span>Novo Agendamento</span>
              </button>

              <button
                onClick={() => setActiveTab('servicos')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'servicos'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Serviços & Preços</span>
              </button>

              <button
                onClick={() => setActiveTab('disponibilidade')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'disponibilidade'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Horários & Folgas</span>
              </button>

              <button
                onClick={() => setActiveTab('clientes')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'clientes'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Clientes CRM</span>
              </button>

              <button
                onClick={() => setActiveTab('financeiro')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'financeiro'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Financeiro</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'config'
                    ? 'bg-[#FF2FA0] text-white shadow-md shadow-[#FF2FA0]/20'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </button>
            </aside>

            {/* Main Admin Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0D0509]">
              
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800">
                      <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
                        Atendimentos Hoje
                      </span>
                      <p className="font-display text-2xl text-white font-bold mt-1 tabular-nums">
                        {metrics.appointmentsToday}
                      </p>
                      <span className="text-[11px] text-stone-400">Na agenda para hoje</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800">
                      <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
                        Atendimentos na Semana
                      </span>
                      <p className="font-display text-2xl text-white font-bold mt-1 tabular-nums">
                        {metrics.appointmentsWeek}
                      </p>
                      <span className="text-[11px] text-stone-400">Total desta semana</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800">
                      <span className="text-[11px] uppercase tracking-wider text-[#FF8AD8] block font-medium">
                        Faturamento do Dia
                      </span>
                      <p className="font-display text-2xl text-white font-bold mt-1 tabular-nums">
                        R$ {metrics.revenueToday.toFixed(2).replace('.', ',')}
                      </p>
                      <span className="text-[11px] text-stone-400">Sinais + pagamentos</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A0A12] border border-[#FF2FA0]/30">
                      <span className="text-[11px] uppercase tracking-wider text-[#FF8AD8] block font-medium">
                        Faturamento do Mês
                      </span>
                      <p className="font-display text-2xl text-[#FF8AD8] font-bold mt-1 tabular-nums">
                        R$ {metrics.revenueMonth.toFixed(2).replace('.', ',')}
                      </p>
                      <span className="text-[11px] text-stone-400">Acumulado do mês atual</span>
                    </div>
                  </div>

                  {/* Highlight: Today's Appointments */}
                  <div className="p-5 rounded-3xl bg-[#1A0A12] border border-[#FF2FA0]/40 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#FF2FA0]" />
                        <h3 className="font-display text-lg text-white font-medium">
                          Agendamentos de Hoje ({todayStr})
                        </h3>
                      </div>
                      <span className="text-xs text-[#FF8AD8] font-medium">
                        {todayAppointments.length} agendamento(s)
                      </span>
                    </div>

                    {todayAppointments.length === 0 ? (
                      <div className="py-8 text-center text-stone-400 text-xs">
                        Nenhum atendimento agendado para hoje ainda.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todayAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-4 rounded-2xl bg-[#0D0509] border border-stone-800 hover:border-[#FF2FA0]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#FF2FA0]/15 text-[#FF8AD8] flex flex-col items-center justify-center shrink-0">
                                <span className="font-display text-sm font-bold tabular-nums">{apt.time}</span>
                                <span className="text-[9px] uppercase">{apt.durationMinutes}m</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display text-white text-base font-medium">
                                    {apt.clientName}
                                  </h4>
                                  <span className="text-[10px] font-mono text-[#FF8AD8]">({apt.id})</span>
                                </div>
                                <p className="text-xs text-stone-300 font-light mt-0.5">
                                  {apt.serviceName} · Total: R$ {apt.price} (Sinal R$ {apt.depositAmount})
                                </p>
                                {apt.clientNotes && (
                                  <p className="text-[11px] text-stone-400 italic mt-0.5">
                                    Nota: {apt.clientNotes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-900">
                              <a
                                href={`https://wa.me/${apt.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `Olá, ${apt.clientName}! Aqui é a Gab do Gab Studio. Confirmando seu horário de hoje às ${apt.time} para o procedimento ${apt.serviceName}. Te espero!`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs flex items-center gap-1.5 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>

                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'concluido')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800 text-xs flex items-center gap-1 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Concluir</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: AGENDA (CALENDÁRIO DIA / SEMANA / MÊS) */}
              {activeTab === 'agenda' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-[#FF2FA0]" />
                      <h3 className="font-display text-lg text-white font-medium">
                        Agenda do Estúdio
                      </h3>
                      <input
                        type="date"
                        value={agendaCurrentDate}
                        onChange={(e) => setAgendaCurrentDate(e.target.value)}
                        className="bg-[#1A0A12] border border-stone-800 rounded-lg px-3 py-1 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-[#1A0A12] p-1 rounded-xl border border-stone-800">
                      <button
                        onClick={() => setAgendaViewMode('dia')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          agendaViewMode === 'dia' ? 'bg-[#FF2FA0] text-white' : 'text-stone-400'
                        }`}
                      >
                        Visão Dia
                      </button>
                      <button
                        onClick={() => setAgendaViewMode('semana')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          agendaViewMode === 'semana' ? 'bg-[#FF2FA0] text-white' : 'text-stone-400'
                        }`}
                      >
                        Visão Semana
                      </button>
                    </div>
                  </div>

                  {/* Day View */}
                  {agendaViewMode === 'dia' && (
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-wider text-stone-400">
                        Atendimentos em {agendaCurrentDate}
                      </h4>
                      {appointments.filter(a => a.date === agendaCurrentDate && a.status !== 'cancelado').length === 0 ? (
                        <div className="py-12 text-center text-stone-400 text-xs bg-[#1A0A12] rounded-2xl border border-stone-800">
                          Nenhum agendamento neste dia.
                        </div>
                      ) : (
                        appointments
                          .filter(a => a.date === agendaCurrentDate && a.status !== 'cancelado')
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map(apt => (
                            <div
                              key={apt.id}
                              className="p-4 rounded-xl bg-[#1A0A12] border border-stone-800 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-mono text-sm text-[#FF8AD8] font-bold mr-3">{apt.time}</span>
                                <strong className="text-white text-sm mr-2">{apt.clientName}</strong>
                                <span className="text-xs text-stone-400">({apt.serviceName})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-stone-400">R$ {apt.price}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  apt.paymentStatus === 'pago' ? 'bg-[#25D366]/20 text-[#25D366]' : 'bg-amber-950/40 text-amber-300'
                                }`}>
                                  {apt.paymentStatus.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  )}

                  {/* Week View */}
                  {agendaViewMode === 'semana' && (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dayName, idx) => (
                        <div key={dayName} className="p-3 rounded-2xl bg-[#1A0A12] border border-stone-800 min-h-[200px]">
                          <span className="text-xs uppercase tracking-wider text-[#FF8AD8] font-medium block border-b border-stone-800 pb-1 mb-2">
                            {dayName}
                          </span>
                          <div className="text-[11px] text-stone-400 space-y-1.5">
                            {appointments
                              .filter(a => a.status !== 'cancelado')
                              .slice(0, 3)
                              .map(apt => (
                                <div key={apt.id} className="p-1.5 rounded-lg bg-stone-900 border border-stone-800">
                                  <div className="font-semibold text-white truncate">{apt.clientName}</div>
                                  <div className="text-[10px] text-stone-400">{apt.time} · {apt.serviceName}</div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AGENDAMENTOS (TABELA COMPLETA COM FILTROS E AÇÕES) */}
              {activeTab === 'agendamentos' && (
                <div className="space-y-4">
                  {/* Filters Bar */}
                  <div className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px] relative">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar por cliente, WhatsApp ou código..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0D0509] border border-stone-800 focus:border-[#FF2FA0] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="todos">Todos os Status</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="pendente_pagamento">Pendente</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="faltou">Faltou</option>
                    </select>

                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                    />

                    {filterDate && (
                      <button
                        onClick={() => setFilterDate('')}
                        className="text-xs text-stone-400 hover:text-white"
                      >
                        Limpar data
                      </button>
                    )}
                  </div>

                  {/* Appointments Table */}
                  <div className="bg-[#1A0A12] rounded-2xl border border-stone-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-stone-300">
                        <thead className="bg-[#0D0509] uppercase text-[10px] tracking-wider text-stone-400 border-b border-stone-800">
                          <tr>
                            <th className="px-4 py-3">Código / Cliente</th>
                            <th className="px-4 py-3">Data & Hora</th>
                            <th className="px-4 py-3">Serviço</th>
                            <th className="px-4 py-3">Valores</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800/60">
                          {filteredAppointments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                                Nenhum agendamento encontrado com os filtros selecionados.
                              </td>
                            </tr>
                          ) : (
                            filteredAppointments.map((apt) => (
                              <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="font-mono text-[10px] text-[#FF8AD8] font-bold">{apt.id}</div>
                                  <div className="font-medium text-white text-sm">{apt.clientName}</div>
                                  <div className="text-[11px] text-stone-400">{apt.clientPhone}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-white font-medium">{apt.date}</div>
                                  <div className="text-[#E6C280]">{apt.time} ({apt.durationMinutes}m)</div>
                                </td>
                                <td className="px-4 py-3 font-medium text-white">
                                  {apt.serviceName}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-white font-medium tabular-nums">R$ {apt.price}</div>
                                  <div className="text-[10px] text-stone-400">
                                    Sinal: R$ {apt.depositAmount} · {apt.paymentStatus}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                                    apt.status === 'confirmado' ? 'bg-[#25D366]/20 text-[#25D366]' :
                                    apt.status === 'concluido' ? 'bg-emerald-950/50 text-emerald-300' :
                                    apt.status === 'cancelado' ? 'bg-rose-950/50 text-rose-300' :
                                    apt.status === 'faltou' ? 'bg-amber-950/50 text-amber-300' :
                                    'bg-purple-950/50 text-purple-300'
                                  }`}>
                                    {apt.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                                  {/* Direct WhatsApp button */}
                                  <a
                                    href={`https://wa.me/${apt.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Olá, ${apt.clientName}! Aqui é a Gab Santos do Gab Studio. Tudo bem?`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Chamar no WhatsApp"
                                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-[#25D366]/20 text-stone-300 hover:text-[#25D366] inline-block transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>

                                  {/* Register manual payment */}
                                  {apt.paymentStatus !== 'pago' && (
                                    <button
                                      onClick={() => handleRegisterManualPayment(apt.id)}
                                      title="Registrar pagamento manual (Pix direto / Dinheiro no estúdio)"
                                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-emerald-900 text-stone-300 hover:text-emerald-300 transition-colors"
                                    >
                                      <DollarSign className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {/* Mark completed */}
                                  {apt.status !== 'concluido' && (
                                    <button
                                      onClick={() => handleUpdateStatus(apt.id, 'concluido')}
                                      title="Marcar como Concluído"
                                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-emerald-900 text-stone-300 hover:text-emerald-300 transition-colors"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {/* Mark no-show */}
                                  {apt.status !== 'faltou' && apt.status !== 'cancelado' && (
                                    <button
                                      onClick={() => handleUpdateStatus(apt.id, 'faltou')}
                                      title="Marcar como Faltou"
                                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-amber-900 text-stone-300 hover:text-amber-300 transition-colors"
                                    >
                                      <AlertTriangle className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {/* Cancel */}
                                  {apt.status !== 'cancelado' && (
                                    <button
                                      onClick={() => handleUpdateStatus(apt.id, 'cancelado')}
                                      title="Cancelar agendamento"
                                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-rose-900 text-stone-300 hover:text-rose-300 transition-colors"
                                    >
                                      <Ban className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: NOVO AGENDAMENTO MANUAL */}
              {activeTab === 'novo' && (
                <div className="max-w-2xl mx-auto bg-[#1A0A12] rounded-3xl border border-[#FF2FA0]/30 p-6 space-y-6">
                  <div>
                    <h3 className="font-display text-xl text-white font-medium">
                      Criar Agendamento Manual
                    </h3>
                    <p className="text-xs text-stone-400 font-light mt-0.5">
                      Para clientes que entraram em contato direto pelo WhatsApp ou Instagram.
                    </p>
                  </div>

                  {manualFeedback && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300">
                      {manualFeedback}
                    </div>
                  )}

                  <form onSubmit={handleCreateManualAppointment} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                          Nome da Cliente *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualClientName}
                          onChange={(e) => setManualClientName(e.target.value)}
                          placeholder="Nome e Sobrenome"
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                          WhatsApp *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualClientPhone}
                          onChange={(e) => setManualClientPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                        Procedimento / Serviço *
                      </label>
                      <select
                        required
                        value={manualServiceId}
                        onChange={(e) => setManualServiceId(e.target.value)}
                        className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="">Selecione um procedimento</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} - R$ {s.price} ({s.durationMinutes} min)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                          Data do Atendimento
                        </label>
                        <input
                          type="date"
                          required
                          value={manualDate}
                          onChange={(e) => setManualDate(e.target.value)}
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                          Horário
                        </label>
                        <input
                          type="time"
                          required
                          value={manualTime}
                          onChange={(e) => setManualTime(e.target.value)}
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                          Forma de Pagamento
                        </label>
                        <select
                          value={manualPaymentMethod}
                          onChange={(e) => setManualPaymentMethod(e.target.value as 'dinheiro' | 'pix' | 'cartao_credito')}
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white"
                        >
                          <option value="pix">Pix</option>
                          <option value="dinheiro">Dinheiro</option>
                          <option value="cartao_credito">Cartão de Crédito</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-stone-300 font-medium block">
                          Status do Pagamento
                        </label>
                        <select
                          value={manualPaymentStatus}
                          onChange={(e) => setManualPaymentStatus(e.target.value as PaymentStatus)}
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white"
                        >
                          <option value="pago">Pago Totalmente</option>
                          <option value="pendente">Sinal Pago (Pendente Restante)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full neon-button py-3 rounded-xl text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 mt-4"
                    >
                      <PlusCircle className="w-4 h-4 text-[#FF8AD8]" />
                      <span>Salvar e Inserir na Agenda</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: SERVIÇOS & PREÇOS (CRUD) */}
              {activeTab === 'servicos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                    <div>
                      <h3 className="font-display text-lg text-white font-medium">
                        Gerenciar Serviços & Preços
                      </h3>
                      <p className="text-xs text-stone-400 font-light mt-0.5">
                        Edite valores, durações e descrições exibidos no site.
                      </p>
                    </div>

                    <button
                      onClick={() => setEditingService({
                        id: `serv-${Date.now()}`,
                        name: 'Novo Procedimento',
                        category: 'Extensão',
                        description: 'Descrição detalhada do novo procedimento.',
                        durationMinutes: 90,
                        price: 150,
                        isAvailable: true,
                        image: '/src/assets/images/hero_eyelash_model_1791255520464.jpg',
                      })}
                      className="neon-button px-4 py-2 rounded-xl text-white text-xs font-medium flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-[#FF8AD8]" />
                      <span>Adicionar Procedimento</span>
                    </button>
                  </div>

                  {/* List of services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase text-stone-400">{service.category}</span>
                            <h4 className="font-display text-white text-base font-medium">{service.name}</h4>
                          </div>
                          <span className="font-display text-base text-[#FF8AD8] font-bold tabular-nums">
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        <p className="text-xs text-stone-300 font-light line-clamp-2">
                          {service.description}
                        </p>

                        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                          <span className="text-stone-400">{service.durationMinutes} minutos</span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingService(service)}
                              className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3 text-[#FF2FA0]" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Deseja desativar o serviço ${service.name}?`)) {
                                  deleteService(service.id);
                                }
                              }}
                              className="p-1 rounded-lg hover:bg-rose-950/40 text-stone-400 hover:text-rose-400"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Editing Modal */}
                  {editingService && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                      <div className="bg-[#1A0A12] border border-[#FF2FA0]/40 rounded-2xl p-6 max-w-lg w-full space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-display text-white text-lg font-medium">Editar Serviço</h4>
                          <button onClick={() => setEditingService(null)} className="text-stone-400 hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="text-stone-400 block mb-1">Nome do Procedimento</label>
                            <input
                              type="text"
                              value={editingService.name}
                              onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                              className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-stone-400 block mb-1">Preço (R$)</label>
                              <input
                                type="number"
                                value={editingService.price}
                                onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-stone-400 block mb-1">Duração (minutos)</label>
                              <input
                                type="number"
                                value={editingService.durationMinutes}
                                onChange={(e) => setEditingService({ ...editingService, durationMinutes: Number(e.target.value) })}
                                className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-stone-400 block mb-1">Descrição</label>
                            <textarea
                              rows={3}
                              value={editingService.description}
                              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                              className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-white resize-none"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            onClick={() => setEditingService(null)}
                            className="px-4 py-2 rounded-xl border border-stone-800 text-stone-300 text-xs"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => {
                              saveService(editingService);
                              setEditingService(null);
                            }}
                            className="neon-button px-5 py-2 rounded-xl text-white text-xs font-medium"
                          >
                            Salvar Alterações
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: DISPONIBILIDADE & HORÁRIOS */}
              {activeTab === 'disponibilidade' && (
                <div className="max-w-2xl mx-auto bg-[#1A0A12] rounded-3xl border border-stone-800 p-6 space-y-6">
                  <div>
                    <h3 className="font-display text-xl text-white font-medium">
                      Horários de Atendimento & Folgas
                    </h3>
                    <p className="text-xs text-stone-400 font-light mt-0.5">
                      Configure os horários em que os clientes podem agendar online.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-stone-300 block mb-1">Início do Expediente</label>
                        <input
                          type="time"
                          value={settings.businessHoursStart}
                          onChange={(e) => setSettings({ ...settings, businessHoursStart: e.target.value })}
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-stone-300 block mb-1">Término do Expediente</label>
                        <input
                          type="time"
                          value={settings.businessHoursEnd}
                          onChange={(e) => setSettings({ ...settings, businessHoursEnd: e.target.value })}
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-stone-300 block mb-1">Início do Almoço / Intervalo</label>
                        <input
                          type="time"
                          value={settings.lunchBreakStart}
                          onChange={(e) => setSettings({ ...settings, lunchBreakStart: e.target.value })}
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-stone-300 block mb-1">Fim do Almoço / Intervalo</label>
                        <input
                          type="time"
                          value={settings.lunchBreakEnd}
                          onChange={(e) => setSettings({ ...settings, lunchBreakEnd: e.target.value })}
                          className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-stone-300 block mb-2">Dias de Atendimento na Semana</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 1, label: 'Segunda' },
                          { id: 2, label: 'Terça' },
                          { id: 3, label: 'Quarta' },
                          { id: 4, label: 'Quinta' },
                          { id: 5, label: 'Sexta' },
                          { id: 6, label: 'Sábado' },
                          { id: 0, label: 'Domingo' },
                        ].map((d) => {
                          const isOpen = settings.openDays.includes(d.id);
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => {
                                const newDays = isOpen
                                  ? settings.openDays.filter(day => day !== d.id)
                                  : [...settings.openDays, d.id];
                                setSettings({ ...settings, openDays: newDays });
                              }}
                              className={`px-3 py-1.5 rounded-xl border text-xs transition-colors ${
                                isOpen
                                  ? 'bg-[#FF2FA0] border-[#FF2FA0] text-white font-medium'
                                  : 'bg-[#0D0509] border-stone-800 text-stone-500'
                              }`}
                            >
                              {d.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        saveSettings(settings);
                        alert('Configurações de horários atualizadas com sucesso!');
                      }}
                      className="w-full neon-button py-2.5 rounded-xl text-white text-xs font-medium mt-4"
                    >
                      Salvar Horários
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: CLIENTES CRM */}
              {activeTab === 'clientes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div>
                      <h3 className="font-display text-lg text-white font-medium">
                        Cadastro de Clientes ({clients.length})
                      </h3>
                      <p className="text-xs text-stone-400 font-light mt-0.5">
                        Histórico de procedimentos, datas e observações importantes.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.length === 0 ? (
                      <div className="col-span-3 py-12 text-center text-stone-400 text-xs bg-[#1A0A12] rounded-2xl border border-stone-800">
                        Nenhum cliente cadastrado ainda. Conforme as pessoas agendam, elas aparecem automaticamente aqui.
                      </div>
                    ) : (
                      clients.map((cli) => (
                        <div
                          key={cli.id}
                          className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-display text-white text-base font-medium">{cli.name}</h4>
                              <p className="text-xs text-stone-400">{cli.phone}</p>
                            </div>
                            <a
                              href={`https://wa.me/${cli.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-stone-900 hover:bg-[#25D366]/20 text-stone-300 hover:text-[#25D366] transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>

                          <div className="text-xs text-stone-300 space-y-1 pt-2 border-t border-stone-800/80">
                            <div className="flex justify-between">
                              <span className="text-stone-400">Total de visitas:</span>
                              <span className="text-white font-semibold">{cli.totalAppointments}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-400">Total investido:</span>
                              <span className="text-white font-semibold tabular-nums">
                                R$ {cli.totalSpent.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-400">Último atendimento:</span>
                              <span className="text-[#FF8AD8]">{cli.lastVisitDate || 'Recente'}</span>
                            </div>
                            {cli.allergies && (
                              <p className="text-[11px] text-rose-300 italic pt-1">
                                Alergia: {cli.allergies}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8: FINANCEIRO */}
              {activeTab === 'financeiro' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl text-white font-medium">
                      Painel Financeiro & Entradas
                    </h3>
                    <p className="text-xs text-stone-400 font-light mt-0.5">
                      Controle dos pagamentos via Pix, Mercado Pago e presencial no estúdio.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800">
                      <span className="text-xs uppercase text-stone-400 block">Total Recebido Hoje</span>
                      <p className="font-display text-2xl text-white font-bold mt-1 tabular-nums">
                        R$ {metrics.revenueToday.toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A0A12] border border-stone-800">
                      <span className="text-xs uppercase text-stone-400 block">Total Recebido na Semana</span>
                      <p className="font-display text-2xl text-white font-bold mt-1 tabular-nums">
                        R$ {metrics.revenueWeek.toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A0A12] border border-[#FF2FA0]/40">
                      <span className="text-xs uppercase text-[#FF8AD8] block">Total Recebido no Mês</span>
                      <p className="font-display text-2xl text-[#FF8AD8] font-bold mt-1 tabular-nums">
                        R$ {metrics.revenueMonth.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>

                  {/* Payments list */}
                  <div className="bg-[#1A0A12] rounded-2xl border border-stone-800 p-4 space-y-3">
                    <h4 className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                      Histórico Recente de Entradas
                    </h4>
                    <div className="divide-y divide-stone-800/80">
                      {appointments
                        .filter(a => a.paymentStatus === 'pago')
                        .map(apt => (
                          <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-medium text-white">{apt.clientName}</span>
                              <span className="text-stone-400 ml-2">({apt.serviceName})</span>
                              <div className="text-[10px] text-stone-400">{apt.date} · {apt.paymentMethod.toUpperCase()}</div>
                            </div>
                            <span className="font-display text-sm text-[#25D366] font-bold tabular-nums">
                              + R$ {apt.price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: CONFIGURAÇÕES */}
              {activeTab === 'config' && (
                <div className="max-w-2xl mx-auto bg-[#1A0A12] rounded-3xl border border-stone-800 p-6 space-y-6">
                  <div>
                    <h3 className="font-display text-xl text-white font-medium">
                      Configurações do Estúdio
                    </h3>
                    <p className="text-xs text-stone-400 font-light mt-0.5">
                      Parâmetros gerais de agendamento, porcentagem de sinal e contatos.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-stone-300 block mb-1">Porcentagem do Sinal (% do valor do serviço)</label>
                      <input
                        type="number"
                        min={10}
                        max={100}
                        value={settings.depositPercentage}
                        onChange={(e) => setSettings({ ...settings, depositPercentage: Number(e.target.value) })}
                        className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-white"
                      />
                      <span className="text-[11px] text-stone-400 mt-1 block">
                        Padrão: 30%. O cliente paga este valor para reservar a vaga.
                      </span>
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1">Prazo Máximo para Cancelamento Gratuito (horas)</label>
                      <input
                        type="number"
                        min={1}
                        max={72}
                        value={settings.cancellationHoursLimit}
                        onChange={(e) => setSettings({ ...settings, cancellationHoursLimit: Number(e.target.value) })}
                        className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-white"
                      />
                      <span className="text-[11px] text-stone-400 mt-1 block">
                        Padrão: 24 horas antes do horário agendado.
                      </span>
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1">WhatsApp do Estúdio (com DDD e 55)</label>
                      <input
                        type="text"
                        value={settings.studioWhatsapp}
                        onChange={(e) => setSettings({ ...settings, studioWhatsapp: e.target.value })}
                        className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1">Instagram (@)</label>
                      <input
                        type="text"
                        value={settings.studioInstagram}
                        onChange={(e) => setSettings({ ...settings, studioInstagram: e.target.value })}
                        className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1">Endereço Completo</label>
                      <input
                        type="text"
                        value={settings.studioAddress}
                        onChange={(e) => setSettings({ ...settings, studioAddress: e.target.value })}
                        className="w-full bg-[#0D0509] border border-stone-800 rounded-xl px-4 py-2.5 text-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        saveSettings(settings);
                        alert('Configurações salvas com sucesso!');
                      }}
                      className="w-full neon-button py-3 rounded-xl text-white text-xs sm:text-sm font-medium mt-4"
                    >
                      Salvar Todas as Configurações
                    </button>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>
    </div>
  );
};
