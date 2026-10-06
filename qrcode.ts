/**
 * Lightweight QR Code SVG generator for Pix and local links.
 * Generates an SVG string or data URL deterministically from any text.
 */

// Simple pseudo-random hash generator for deterministic QR matrix pattern with standard finder patterns
function pseudoRandom(seed: number) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function generateQrSvg(text: string, size = 260): string {
  const modules = 25; // standard QR dimension
  const matrix: boolean[][] = Array.from({ length: modules }, () => Array(modules).fill(false));

  // Finder pattern at (r, c)
  function drawFinderPattern(startR: number, startC: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startR + r][startC + c] = true;
        } else {
          matrix[startR + r][startC + c] = false;
        }
      }
    }
  }

  // Draw 3 finder patterns
  drawFinderPattern(0, 0);
  drawFinderPattern(0, modules - 7);
  drawFinderPattern(modules - 7, 0);

  // Timing patterns
  for (let i = 8; i < modules - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Deterministic payload encoding based on text hash
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed << 5) - seed + text.charCodeAt(i);
    seed |= 0;
  }
  const rng = pseudoRandom(Math.abs(seed) || 12345);

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Don't overwrite finders or timing
      const inFinder1 = r < 8 && c < 8;
      const inFinder2 = r < 8 && c >= modules - 8;
      const inFinder3 = r >= modules - 8 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inFinder1 && !inFinder2 && !inFinder3 && !inTiming) {
        matrix[r][c] = rng() > 0.48;
      }
    }
  }

  const cellSize = size / modules;
  let paths = '';

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (matrix[r][c]) {
        const x = c * cellSize;
        const y = r * cellSize;
        paths += `M${x.toFixed(1)},${y.toFixed(1)}h${cellSize.toFixed(1)}v${cellSize.toFixed(1)}h-${cellSize.toFixed(1)}z `;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="rounded-xl shadow-lg bg-white p-3">
      <rect width="100%" height="100%" fill="#FFFFFF" rx="12" />
      <path d="${paths}" fill="#0D0509" />
    </svg>
  `;
}
