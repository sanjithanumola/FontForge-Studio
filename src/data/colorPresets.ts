import { GradientConfig } from '../types';

export interface ColorPreset {
  name: string;
  category: 'gradient' | 'solid';
  gradient?: GradientConfig;
  color?: string;
  tags?: string[];
}

export const GRADIENT_PRESETS: { name: string; gradient: GradientConfig }[] = [
  {
    name: 'Royal Gold',
    gradient: {
      angle: 45,
      stops: [
        { color: '#FFE066', offset: 0 },
        { color: '#F59E0B', offset: 35 },
        { color: '#D97706', offset: 70 },
        { color: '#78350F', offset: 100 },
      ],
    },
  },
  {
    name: 'Sunset Ember',
    gradient: {
      angle: 90,
      stops: [
        { color: '#FF416C', offset: 0 },
        { color: '#FF4B2B', offset: 50 },
        { color: '#FFA07A', offset: 100 },
      ],
    },
  },
  {
    name: 'Neon Cyberpunk',
    gradient: {
      angle: 135,
      stops: [
        { color: '#00F2FE', offset: 0 },
        { color: '#4FACFE', offset: 40 },
        { color: '#F355DA', offset: 80 },
        { color: '#FA709A', offset: 100 },
      ],
    },
  },
  {
    name: 'Ocean Depths',
    gradient: {
      angle: 180,
      stops: [
        { color: '#2E3192', offset: 0 },
        { color: '#1BFFFF', offset: 100 },
      ],
    },
  },
  {
    name: 'Emerald Aurora',
    gradient: {
      angle: 45,
      stops: [
        { color: '#00B09B', offset: 0 },
        { color: '#96C93D', offset: 100 },
      ],
    },
  },
  {
    name: 'Rose Quartz',
    gradient: {
      angle: 60,
      stops: [
        { color: '#FF9A9E', offset: 0 },
        { color: '#FECFEF', offset: 99 },
        { color: '#FECFEF', offset: 100 },
      ],
    },
  },
  {
    name: 'Silver Chrome',
    gradient: {
      angle: 45,
      stops: [
        { color: '#E0E0E0', offset: 0 },
        { color: '#F5F5F5', offset: 30 },
        { color: '#888888', offset: 50 },
        { color: '#FAFAFA', offset: 70 },
        { color: '#555555', offset: 100 },
      ],
    },
  },
  {
    name: 'Rainbow Prism',
    gradient: {
      angle: 90,
      stops: [
        { color: '#FF0055', offset: 0 },
        { color: '#FFAA00', offset: 25 },
        { color: '#00FF66', offset: 50 },
        { color: '#00F0FF', offset: 75 },
        { color: '#9D00FF', offset: 100 },
      ],
    },
  },
  {
    name: 'Holographic',
    gradient: {
      angle: 120,
      stops: [
        { color: '#E0C3FC', offset: 0 },
        { color: '#8EC5FC', offset: 50 },
        { color: '#FFDEE9', offset: 100 },
      ],
    },
  },
  {
    name: 'Firestorm',
    gradient: {
      angle: 0,
      stops: [
        { color: '#F12711', offset: 0 },
        { color: '#F5AF19', offset: 100 },
      ],
    },
  },
  {
    name: 'Glacial Ice',
    gradient: {
      angle: 135,
      stops: [
        { color: '#89F7FE', offset: 0 },
        { color: '#66A6FF', offset: 100 },
      ],
    },
  },
  {
    name: 'Dark Obsidian',
    gradient: {
      angle: 180,
      stops: [
        { color: '#434343', offset: 0 },
        { color: '#000000', offset: 100 },
      ],
    },
  },
];

export const SOLID_PALETTES = [
  '#FFFFFF', '#F8FAFC', '#94A3B8', '#475569', '#1E293B', '#0F172A', '#000000',
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#FFD700', '#C0C0C0', '#00FFFF', '#39FF14', '#FF007F'
];

export const BACKGROUND_PRESETS = [
  {
    id: 'deep-slate',
    name: 'Deep Studio',
    type: 'solid' as const,
    color: '#0F172A',
    gradient: { angle: 180, stops: [{ color: '#0F172A', offset: 0 }] },
  },
  {
    id: 'cyber-dark',
    name: 'Cyber Void',
    type: 'gradient' as const,
    color: '#05050A',
    gradient: {
      angle: 135,
      stops: [
        { color: '#0F0C29', offset: 0 },
        { color: '#302B63', offset: 50 },
        { color: '#24243E', offset: 100 },
      ],
    },
  },
  {
    id: 'pure-black',
    name: 'OLED Black',
    type: 'solid' as const,
    color: '#000000',
    gradient: { angle: 0, stops: [{ color: '#000000', offset: 0 }] },
  },
  {
    id: 'clean-white',
    name: 'Studio White',
    type: 'solid' as const,
    color: '#FFFFFF',
    gradient: { angle: 0, stops: [{ color: '#FFFFFF', offset: 0 }] },
  },
  {
    id: 'luxury-velvet',
    name: 'Royal Velvet',
    type: 'gradient' as const,
    color: '#1a0026',
    gradient: {
      angle: 45,
      stops: [
        { color: '#1A002C', offset: 0 },
        { color: '#320A4B', offset: 60 },
        { color: '#110321', offset: 100 },
      ],
    },
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Glow',
    type: 'gradient' as const,
    color: '#360938',
    gradient: {
      angle: 180,
      stops: [
        { color: '#2B1055', offset: 0 },
        { color: '#7597DE', offset: 100 },
      ],
    },
  },
  {
    id: 'transparent-canvas',
    name: 'Transparent',
    type: 'transparent' as const,
    color: 'transparent',
    gradient: { angle: 0, stops: [] },
  },
];

// Helper: Hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return { r: 255, g: 255, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper: RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Helper: RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper: HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = (h % 360) / 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return { r, g, b };
}
