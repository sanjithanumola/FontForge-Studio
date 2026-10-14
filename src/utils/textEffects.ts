import React from 'react';
import { TextLayer, SpecialEffect, ShadowConfig, StrokeConfig } from '../types';

/**
 * Builds CSS text-shadow string based on shadow configuration and special effects
 */
export function buildTextShadow(shadow: ShadowConfig, specialEffect: SpecialEffect, effectIntensity = 50): string {
  const shadows: string[] = [];

  // Special effect base shadows
  switch (specialEffect) {
    case 'metallic-gold':
      shadows.push('0 1px 1px rgba(255,255,255,0.8)');
      shadows.push('0 -1px 1px rgba(120,53,15,0.7)');
      shadows.push('1px 2px 4px rgba(0,0,0,0.5)');
      break;

    case 'silver-chrome':
      shadows.push('0 1px 1px rgba(255,255,255,0.9)');
      shadows.push('0 -1px 2px rgba(0,0,0,0.8)');
      shadows.push('1px 3px 6px rgba(0,0,0,0.6)');
      break;

    case 'neon-sign': {
      const glow = Math.round(15 * (effectIntensity / 50));
      shadows.push('0 0 4px #FFFFFF');
      shadows.push(`0 0 ${Math.round(glow * 0.4)}px #FF007F`);
      shadows.push(`0 0 ${glow}px #FF007F`);
      shadows.push(`0 0 ${Math.round(glow * 1.8)}px #FF007F`);
      shadows.push(`0 0 ${Math.round(glow * 2.5)}px rgba(255,0,127,0.5)`);
      break;
    }

    case 'fire':
      shadows.push('0 -2px 4px #FFF700');
      shadows.push('0 -4px 10px #FF8800');
      shadows.push('0 -8px 20px #FF2200');
      shadows.push('0 -14px 30px rgba(180,0,0,0.8)');
      break;

    case 'ice':
      shadows.push('0 0 5px #FFFFFF');
      shadows.push('0 0 12px #38BDF8');
      shadows.push('0 0 24px #0284C7');
      shadows.push('1px 2px 4px rgba(15,23,42,0.6)');
      break;

    case 'holographic':
      shadows.push('-2px 0 6px rgba(0,240,255,0.7)');
      shadows.push('2px 0 6px rgba(255,0,128,0.7)');
      shadows.push('0 0 12px rgba(168,85,247,0.5)');
      break;

    case 'retro-3d': {
      const depth = Math.round(7 * (effectIntensity / 50));
      for (let i = 1; i <= depth; i++) {
        shadows.push(`${i * 1.5}px ${i * 1.5}px 0px #0284C7`);
      }
      shadows.push(`${depth * 1.5 + 3}px ${depth * 1.5 + 3}px 6px rgba(0,0,0,0.5)`);
      break;
    }

    case 'emboss':
      shadows.push('-1px -1px 1px rgba(255,255,255,0.8)');
      shadows.push('1px 1px 2px rgba(0,0,0,0.8)');
      break;

    case 'engrave':
      shadows.push('1px 1px 1px rgba(255,255,255,0.7)');
      shadows.push('-1px -1px 2px rgba(0,0,0,0.9)');
      break;

    case 'glitch':
      shadows.push('-3px 0 0 #00FFFF');
      shadows.push('3px 0 0 #FF0055');
      shadows.push('0 2px 4px rgba(0,0,0,0.6)');
      break;

    case 'pixel':
      shadows.push('4px 4px 0px #000000');
      shadows.push('8px 8px 0px rgba(0,0,0,0.3)');
      break;

    case 'vintage-print':
      shadows.push('2px 2px 0px #C2410C');
      shadows.push('4px 4px 0px #431407');
      break;

    default:
      break;
  }

  // User configured shadow
  if (shadow.enabled) {
    const hex = shadow.color || '#000000';
    const op = Math.max(0, Math.min(1, shadow.opacity));
    const shadowColor = hexToRgba(hex, op);

    switch (shadow.type) {
      case 'drop':
        shadows.push(`${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadowColor}`);
        break;

      case 'soft':
        shadows.push(`0px ${Math.round(shadow.offsetY * 1.2)}px ${Math.max(12, shadow.blur * 1.5)}px ${shadowColor}`);
        break;

      case 'hard':
        shadows.push(`${shadow.offsetX}px ${shadow.offsetY}px 0px ${shadowColor}`);
        break;

      case 'layered': {
        const count = shadow.layers || 5;
        const stepX = shadow.offsetX / count;
        const stepY = shadow.offsetY / count;
        for (let i = 1; i <= count; i++) {
          shadows.push(`${(i * stepX).toFixed(1)}px ${(i * stepY).toFixed(1)}px 0px ${shadowColor}`);
        }
        if (shadow.blur > 0) {
          shadows.push(`${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px rgba(0,0,0,0.5)`);
        }
        break;
      }

      case 'neon': {
        const b = shadow.blur || 20;
        shadows.push(`0 0 ${Math.round(b * 0.2)}px #FFFFFF`);
        shadows.push(`0 0 ${Math.round(b * 0.5)}px ${shadowColor}`);
        shadows.push(`0 0 ${b}px ${shadowColor}`);
        shadows.push(`0 0 ${Math.round(b * 1.8)}px ${shadowColor}`);
        break;
      }
    }
  }

  return shadows.join(', ');
}

/**
 * Builds CSS stroke styles, including fallback support for double stroke via filter drop-shadow
 */
export function buildStrokeStyles(stroke: StrokeConfig): {
  webkitTextStroke?: string;
  paintOrder?: string;
  filterExtra?: string;
} {
  if (!stroke.enabled || stroke.width <= 0) {
    return {};
  }

  const result: {
    webkitTextStroke?: string;
    paintOrder?: string;
    filterExtra?: string;
  } = {
    webkitTextStroke: `${stroke.width}px ${stroke.color}`,
    paintOrder: 'stroke fill',
  };

  if (stroke.doubleOutline && stroke.secondaryColor && (stroke.secondaryWidth ?? 0) > 0) {
    // Secondary stroke simulation via SVG or drop-shadow halo
    const sColor = stroke.secondaryColor;
    const sWidth = Math.max(1, (stroke.secondaryWidth || 6) - stroke.width);
    result.filterExtra = `drop-shadow(0 0 ${sWidth}px ${sColor}) drop-shadow(0 0 1px ${sColor})`;
  }

  return result;
}

/**
 * Generates full CSSProperties for rendering a TextLayer
 */
export function getLayerTextStyle(layer: TextLayer): React.CSSProperties {
  const textShadow = buildTextShadow(layer.shadow, layer.specialEffect, layer.specialEffectSettings?.intensity);
  const strokeStyles = buildStrokeStyles(layer.stroke);

  let fillStyle: React.CSSProperties = {
    color: layer.solidColor || '#FFFFFF',
  };

  // Gradient fill or special effect gradient overrides
  if (layer.specialEffect === 'metallic-gold') {
    fillStyle = {
      background: 'linear-gradient(135deg, #FFF6C5 0%, #F59E0B 35%, #D97706 70%, #78350F 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: layer.stroke.hollow ? 'transparent' : 'transparent',
    };
  } else if (layer.specialEffect === 'silver-chrome') {
    fillStyle = {
      background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 30%, #475569 50%, #F8FAFC 70%, #1E293B 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: layer.stroke.hollow ? 'transparent' : 'transparent',
    };
  } else if (layer.specialEffect === 'fire') {
    fillStyle = {
      background: 'linear-gradient(180deg, #FFF700 0%, #FF8800 45%, #E11D48 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: layer.stroke.hollow ? 'transparent' : 'transparent',
    };
  } else if (layer.specialEffect === 'ice') {
    fillStyle = {
      background: 'linear-gradient(180deg, #FFFFFF 0%, #BAE6FD 40%, #0284C7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: layer.stroke.hollow ? 'transparent' : 'transparent',
    };
  } else if (layer.specialEffect === 'holographic') {
    fillStyle = {
      background: 'linear-gradient(90deg, #FF6FD8 0%, #3813C2 25%, #00F0FF 50%, #50E3C2 75%, #FF6FD8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: layer.stroke.hollow ? 'transparent' : 'transparent',
    };
  } else if (layer.colorMode === 'linear') {
    const stopsStr = layer.gradient.stops
      .map((s) => `${s.color} ${s.offset}%`)
      .join(', ');
    fillStyle = {
      background: `linear-gradient(${layer.gradient.angle}deg, ${stopsStr})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: layer.stroke.hollow ? 'transparent' : 'transparent',
    };
  } else if (layer.colorMode === 'radial') {
    const stopsStr = layer.gradient.stops
      .map((s) => `${s.color} ${s.offset}%`)
      .join(', ');
    fillStyle = {
      background: `radial-gradient(circle, ${stopsStr})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: layer.stroke.hollow ? 'transparent' : 'transparent',
    };
  } else if (layer.stroke.hollow) {
    fillStyle = {
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
    };
  }

  const style: React.CSSProperties = {
    fontFamily: `"${layer.fontFamily}", system-ui, sans-serif`,
    fontSize: `${layer.fontSize}px`,
    fontWeight: layer.fontWeight,
    fontStyle: layer.fontStyle,
    textDecoration: layer.textDecoration,
    textDecorationColor: layer.textDecorationColor || 'currentColor',
    textAlign: layer.textAlign,
    textTransform: layer.textTransform,
    lineHeight: layer.lineHeight,
    letterSpacing: `${layer.letterSpacing}px`,
    wordSpacing: `${layer.wordSpacing}px`,
    opacity: layer.opacity,
    textShadow: textShadow || undefined,
    WebkitTextStroke: strokeStyles.webkitTextStroke,
    paintOrder: strokeStyles.paintOrder as any,
    filter: strokeStyles.filterExtra,
    ...fillStyle,
  };

  return style;
}

/**
 * Creates SVG path definition for curved text (arc or circular)
 */
export function generateCurvedTextSvgPath(
  width: number,
  height: number,
  radius: number,
  curvature: number, // -100 to 100
  type: 'arc' | 'circle',
  reverse = false
): { pathD: string; startOffset: string } {
  const cx = width / 2;
  const cy = height / 2;

  if (type === 'circle') {
    const r = Math.max(20, radius);
    if (!reverse) {
      // Clockwise circle starting from top
      return {
        pathD: `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`,
        startOffset: '50%',
      };
    } else {
      // Counter-clockwise
      return {
        pathD: `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx + 0.01} ${cy - r}`,
        startOffset: '50%',
      };
    }
  }

  // Arc path
  // Curvature > 0 curves upwards (smile), Curvature < 0 curves downwards (rainbow)
  const normCurvature = curvature / 100; // -1 to 1
  if (Math.abs(normCurvature) < 0.02) {
    // Near straight line
    return {
      pathD: `M ${cx - width * 0.45} ${cy} L ${cx + width * 0.45} ${cy}`,
      startOffset: '50%',
    };
  }

  const arcSpan = Math.min(width * 0.9, radius * 2);
  const r = Math.max(arcSpan / 2, Math.abs(radius) / (Math.abs(normCurvature) || 0.1));
  const x1 = cx - arcSpan / 2;
  const x2 = cx + arcSpan / 2;

  // Sagitta (depth of arc)
  const sweep = normCurvature > 0 ? (reverse ? 0 : 1) : reverse ? 1 : 0;
  const arcY = cy + (normCurvature > 0 ? 30 : -30);

  return {
    pathD: `M ${x1} ${arcY} A ${r} ${r} 0 0 ${sweep} ${x2} ${arcY}`,
    startOffset: '50%',
  };
}

/**
 * Converts hex + opacity to rgba string
 */
export function hexToRgba(hex: string, opacity: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(0, 0, 0, ${opacity})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
