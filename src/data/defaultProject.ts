import { Project, TextLayer, CanvasBackground, CanvasConfig } from '../types';

export const INITIAL_LAYER: TextLayer = {
  id: 'layer-1',
  name: 'Main Title',
  text: 'FONTFORGE',
  visible: true,
  locked: false,
  x: 50,
  y: 44,
  rotation: 0,

  fontFamily: 'Outfit',
  fontCategory: 'sans-serif',
  fontSize: 84,
  fontWeight: 800,
  fontStyle: 'normal',
  textDecoration: 'none',

  textAlign: 'center',
  textTransform: 'uppercase',
  lineHeight: 1.1,
  letterSpacing: 6,
  wordSpacing: 0,
  opacity: 1,

  colorMode: 'linear',
  solidColor: '#FFFFFF',
  gradient: {
    angle: 45,
    stops: [
      { color: '#FFE066', offset: 0 },
      { color: '#F59E0B', offset: 40 },
      { color: '#D97706', offset: 100 },
    ],
  },

  stroke: {
    enabled: true,
    color: '#0B0F19',
    width: 2,
    hollow: false,
    doubleOutline: false,
    secondaryColor: '#F59E0B',
    secondaryWidth: 6,
  },

  shadow: {
    enabled: true,
    type: 'layered',
    color: '#78350F',
    blur: 0,
    offsetX: 6,
    offsetY: 6,
    opacity: 0.95,
    layers: 6,
  },

  specialEffect: 'metallic-gold',
  specialEffectSettings: {
    intensity: 85,
    depth: 6,
  },

  curvedText: {
    enabled: false,
    type: 'arc',
    radius: 350,
    curvature: 0,
    reverse: false,
  },
};

export const INITIAL_SUBTITLE_LAYER: TextLayer = {
  id: 'layer-2',
  name: 'Subtitle',
  text: 'Advanced Typography & Effects Studio',
  visible: true,
  locked: false,
  x: 50,
  y: 62,
  rotation: 0,

  fontFamily: 'Plus Jakarta Sans',
  fontCategory: 'sans-serif',
  fontSize: 22,
  fontWeight: 600,
  fontStyle: 'normal',
  textDecoration: 'none',

  textAlign: 'center',
  textTransform: 'none',
  lineHeight: 1.2,
  letterSpacing: 4,
  wordSpacing: 2,
  opacity: 0.85,

  colorMode: 'solid',
  solidColor: '#CBD5E1',
  gradient: {
    angle: 90,
    stops: [
      { color: '#FFFFFF', offset: 0 },
      { color: '#94A3B8', offset: 100 },
    ],
  },

  stroke: {
    enabled: false,
    color: '#000000',
    width: 0,
    hollow: false,
    doubleOutline: false,
  },

  shadow: {
    enabled: true,
    type: 'soft',
    color: '#000000',
    blur: 12,
    offsetX: 0,
    offsetY: 4,
    opacity: 0.5,
  },

  specialEffect: 'none',
  specialEffectSettings: {
    intensity: 50,
  },

  curvedText: {
    enabled: false,
    type: 'arc',
    radius: 300,
    curvature: 0,
    reverse: false,
  },
};

export const INITIAL_BACKGROUND: CanvasBackground = {
  type: 'gradient',
  color: '#090D16',
  gradient: {
    angle: 135,
    stops: [
      { color: '#090D16', offset: 0 },
      { color: '#111827', offset: 50 },
      { color: '#05070B', offset: 100 },
    ],
  },
  imageBlur: 0,
  imageOpacity: 1,
};

export const INITIAL_CANVAS: CanvasConfig = {
  width: 1200,
  height: 675, // 16:9 widescreen
  aspectRatio: '16:9',
  showCheckerboard: false,
  showGrid: false,
  snapToCenter: true,
};

export const INITIAL_PROJECT: Project = {
  id: 'default-project',
  title: 'Untitled Design',
  updatedAt: Date.now(),
  layers: [INITIAL_LAYER, INITIAL_SUBTITLE_LAYER],
  background: INITIAL_BACKGROUND,
  canvas: INITIAL_CANVAS,
};
