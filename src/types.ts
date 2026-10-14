export type FontCategory =
  | 'sans-serif'
  | 'serif'
  | 'monospace'
  | 'handwriting'
  | 'script'
  | 'display'
  | 'retro'
  | 'futuristic'
  | 'gaming'
  | 'elegant'
  | 'minimal'
  | 'decorative';

export interface FontItem {
  id: string;
  name: string;
  category: FontCategory;
  googleFont: string; // URL-safe name or family query
  weights: number[];
  fallback: string;
}

export type ColorMode = 'solid' | 'linear' | 'radial';

export interface GradientStop {
  color: string;
  offset: number; // 0 to 100
}

export interface GradientConfig {
  angle: number; // degrees
  stops: GradientStop[];
}

export type ShadowType = 'drop' | 'layered' | 'soft' | 'hard' | 'neon';

export interface ShadowConfig {
  enabled: boolean;
  type: ShadowType;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
  layers?: number; // for layered 3D extrusion
}

export interface StrokeConfig {
  enabled: boolean;
  color: string;
  width: number; // px
  hollow: boolean;
  doubleOutline: boolean;
  secondaryColor?: string;
  secondaryWidth?: number;
}

export type SpecialEffect =
  | 'none'
  | 'metallic-gold'
  | 'silver-chrome'
  | 'neon-sign'
  | 'fire'
  | 'ice'
  | 'holographic'
  | 'retro-3d'
  | 'emboss'
  | 'engrave'
  | 'glitch'
  | 'pixel'
  | 'vintage-print';

export interface SpecialEffectSettings {
  intensity: number; // 0 to 100
  depth?: number;
  colorShift?: number;
}

export interface CurvedTextConfig {
  enabled: boolean;
  type: 'arc' | 'circle';
  radius: number; // px
  curvature: number; // -100 to 100
  reverse: boolean;
}

export interface TextLayer {
  id: string;
  name: string;
  text: string;
  visible: boolean;
  locked: boolean;
  x: number; // percentage (0 to 100) or px
  y: number; // percentage (0 to 100) or px
  rotation: number; // -180 to 180

  fontFamily: string;
  fontCategory: FontCategory;
  fontSize: number; // px
  fontWeight: number; // 100 - 900
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  textDecorationColor?: string;

  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  lineHeight: number; // 0.8 to 2.5
  letterSpacing: number; // px (-5 to 30)
  wordSpacing: number; // px (-5 to 30)
  opacity: number; // 0 to 1

  colorMode: ColorMode;
  solidColor: string;
  gradient: GradientConfig;

  stroke: StrokeConfig;
  shadow: ShadowConfig;

  specialEffect: SpecialEffect;
  specialEffectSettings: SpecialEffectSettings;

  curvedText: CurvedTextConfig;
}

export type BackgroundType = 'transparent' | 'solid' | 'gradient' | 'image';

export interface CanvasBackground {
  type: BackgroundType;
  color: string;
  gradient: GradientConfig;
  imageUrl?: string;
  imageBlur: number; // 0 to 30px
  imageOpacity: number; // 0 to 1
}

export type AspectRatioType = '1:1' | '16:9' | '9:16' | '4:5' | '3:1' | 'custom';

export interface CanvasConfig {
  width: number;
  height: number;
  aspectRatio: AspectRatioType;
  showCheckerboard: boolean;
  showGrid: boolean;
  snapToCenter: boolean;
}

export interface Project {
  id: string;
  title: string;
  updatedAt: number;
  layers: TextLayer[];
  background: CanvasBackground;
  canvas: CanvasConfig;
}

export type PresetCategory =
  | 'Gaming Logos'
  | 'YouTube Thumbnails'
  | 'Social Media Titles'
  | 'Instagram Typography'
  | 'Modern Business Headings'
  | 'Luxury Branding'
  | 'Movie Titles'
  | 'Cyberpunk'
  | 'Graffiti'
  | 'Retro Arcade'
  | 'Futuristic Technology'
  | 'Minimalist Typography'
  | 'Wedding & Invitation'
  | 'Neon Signage'
  | '3D Headline Styles';

export interface TextPreset {
  id: string;
  name: string;
  category: PresetCategory;
  previewText: string;
  layer: Partial<TextLayer>;
  background?: Partial<CanvasBackground>;
}
