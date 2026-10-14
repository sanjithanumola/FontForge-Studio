import { TextLayer, CanvasBackground, CanvasConfig } from '../types';
import { generateCurvedTextSvgPath, hexToRgba } from './textEffects';

/**
 * Escapes XML / SVG characters
 */
function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Creates clean, valid, standard standalone SVG (vector text, gradients, filters, curved text paths)
 * Fully compatible with Figma, Canva, Illustrator, Inkscape, and all modern browsers.
 */
export function buildCanvasSvgString(
  layers: TextLayer[],
  background: CanvasBackground,
  canvas: CanvasConfig,
  transparent = false
): string {
  const width = canvas.width;
  const height = canvas.height;

  const defs: string[] = [];

  // Google Font stylesheet links
  const fontFamilies = Array.from(
    new Set(layers.filter((l) => l.visible && l.fontFamily).map((l) => l.fontFamily))
  );
  if (fontFamilies.length > 0) {
    const familiesParam = fontFamilies
      .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,400;1,700`)
      .join('&');
    defs.push(`<style>
      @import url('https://fonts.googleapis.com/css2?${familiesParam}&amp;display=swap');
    </style>`);
  }

  // Background SVG element
  let bgElement = '';
  if (!transparent && background.type !== 'transparent') {
    if (background.type === 'solid') {
      bgElement = `<rect width="${width}" height="${height}" fill="${background.color}" />`;
    } else if (background.type === 'gradient') {
      const angleRad = ((background.gradient.angle - 90) * Math.PI) / 180;
      const x1 = Math.round(50 - Math.cos(angleRad) * 50);
      const y1 = Math.round(50 - Math.sin(angleRad) * 50);
      const x2 = Math.round(50 + Math.cos(angleRad) * 50);
      const y2 = Math.round(50 + Math.sin(angleRad) * 50);
      const stops = (background.gradient.stops || [])
        .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
        .join('');
      defs.push(`
        <linearGradient id="bg-grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          ${stops}
        </linearGradient>
      `);
      bgElement = `<rect width="${width}" height="${height}" fill="url(#bg-grad)" />`;
    } else if (background.type === 'image' && background.imageUrl) {
      bgElement = `<image href="${background.imageUrl}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity="${background.imageOpacity ?? 1}" />`;
    }
  }

  // Process layers
  const layerElements = layers
    .filter((l) => l.visible)
    .map((layer, index) => {
      const posX = (layer.x / 100) * width;
      const posY = (layer.y / 100) * height;
      const layerId = `layer-${layer.id || index}`;

      // Gradient fill definitions
      let fillAttr = layer.solidColor || '#FFFFFF';
      if (layer.colorMode === 'linear') {
        const angleRad = ((layer.gradient.angle - 90) * Math.PI) / 180;
        const x1 = Math.round(50 - Math.cos(angleRad) * 50);
        const y1 = Math.round(50 - Math.sin(angleRad) * 50);
        const x2 = Math.round(50 + Math.cos(angleRad) * 50);
        const y2 = Math.round(50 + Math.sin(angleRad) * 50);
        const stops = layer.gradient.stops
          .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
          .join('');
        defs.push(`
          <linearGradient id="fill-${layerId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
            ${stops}
          </linearGradient>
        `);
        fillAttr = `url(#fill-${layerId})`;
      } else if (layer.colorMode === 'radial') {
        const stops = layer.gradient.stops
          .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
          .join('');
        defs.push(`
          <radialGradient id="fill-${layerId}" cx="50%" cy="50%" r="50%">
            ${stops}
          </radialGradient>
        `);
        fillAttr = `url(#fill-${layerId})`;
      } else if (layer.specialEffect === 'metallic-gold') {
        defs.push(`
          <linearGradient id="fill-${layerId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFF6C5" />
            <stop offset="35%" stop-color="#F59E0B" />
            <stop offset="70%" stop-color="#D97706" />
            <stop offset="100%" stop-color="#78350F" />
          </linearGradient>
        `);
        fillAttr = `url(#fill-${layerId})`;
      } else if (layer.specialEffect === 'silver-chrome') {
        defs.push(`
          <linearGradient id="fill-${layerId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="30%" stop-color="#CBD5E1" />
            <stop offset="50%" stop-color="#475569" />
            <stop offset="70%" stop-color="#F8FAFC" />
            <stop offset="100%" stop-color="#1E293B" />
          </linearGradient>
        `);
        fillAttr = `url(#fill-${layerId})`;
      } else if (layer.specialEffect === 'fire') {
        defs.push(`
          <linearGradient id="fill-${layerId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFF700" />
            <stop offset="45%" stop-color="#FF8800" />
            <stop offset="100%" stop-color="#E11D48" />
          </linearGradient>
        `);
        fillAttr = `url(#fill-${layerId})`;
      } else if (layer.specialEffect === 'ice') {
        defs.push(`
          <linearGradient id="fill-${layerId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="40%" stop-color="#BAE6FD" />
            <stop offset="100%" stop-color="#0284C7" />
          </linearGradient>
        `);
        fillAttr = `url(#fill-${layerId})`;
      } else if (layer.specialEffect === 'holographic') {
        defs.push(`
          <linearGradient id="fill-${layerId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF6FD8" />
            <stop offset="25%" stop-color="#3813C2" />
            <stop offset="50%" stop-color="#00F0FF" />
            <stop offset="75%" stop-color="#50E3C2" />
            <stop offset="100%" stop-color="#FF6FD8" />
          </linearGradient>
        `);
        fillAttr = `url(#fill-${layerId})`;
      }

      if (layer.stroke.hollow) {
        fillAttr = 'none';
      }

      // Filter definition for shadow / glow
      let filterAttr = '';
      if (layer.shadow.enabled) {
        const filterId = `filter-${layerId}`;
        const shadowColor = layer.shadow.color || '#000000';
        const opacity = layer.shadow.opacity ?? 0.5;

        if (layer.shadow.type === 'neon') {
          defs.push(`
            <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="${Math.max(2, layer.shadow.blur * 0.4)}" flood-color="${shadowColor}" flood-opacity="${opacity}" />
              <feDropShadow dx="0" dy="0" stdDeviation="${layer.shadow.blur}" flood-color="${shadowColor}" flood-opacity="${opacity}" />
            </filter>
          `);
        } else {
          defs.push(`
            <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="${layer.shadow.offsetX}" dy="${layer.shadow.offsetY}" stdDeviation="${Math.max(1, layer.shadow.blur / 2)}" flood-color="${shadowColor}" flood-opacity="${opacity}" />
            </filter>
          `);
        }
        filterAttr = `filter="url(#${filterId})"`;
      }

      // Stroke attributes
      let strokeAttr = '';
      if (layer.stroke.enabled && layer.stroke.width > 0) {
        strokeAttr = `stroke="${layer.stroke.color}" stroke-width="${layer.stroke.width}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke fill"`;
      }

      // Text transform
      let textContent = layer.text || '';
      if (layer.textTransform === 'uppercase') textContent = textContent.toUpperCase();
      else if (layer.textTransform === 'lowercase') textContent = textContent.toLowerCase();
      else if (layer.textTransform === 'capitalize') {
        textContent = textContent.replace(/\b\w/g, (c) => c.toUpperCase());
      }

      const textAnchor =
        layer.textAlign === 'center'
          ? 'middle'
          : layer.textAlign === 'right'
          ? 'end'
          : 'start';

      const fontStyleAttr = layer.fontStyle === 'italic' ? 'font-style="italic"' : '';
      const letterSpacingAttr = layer.letterSpacing ? `letter-spacing="${layer.letterSpacing}px"` : '';
      const textDecorationAttr =
        layer.textDecoration !== 'none' ? `text-decoration="${layer.textDecoration}"` : '';

      // Curved Text support
      if (layer.curvedText.enabled) {
        const { pathD, startOffset } = generateCurvedTextSvgPath(
          width,
          height,
          layer.curvedText.radius,
          layer.curvedText.curvature,
          layer.curvedText.type,
          layer.curvedText.reverse
        );
        const curvePathId = `curve-path-${layerId}`;
        defs.push(`<path id="${curvePathId}" d="${pathD}" fill="none" />`);

        return `
          <g transform="rotate(${layer.rotation} ${width / 2} ${height / 2})" opacity="${layer.opacity}">
            <text
              font-family="'${layer.fontFamily}', system-ui, sans-serif"
              font-size="${layer.fontSize}px"
              font-weight="${layer.fontWeight}"
              ${fontStyleAttr}
              ${letterSpacingAttr}
              fill="${fillAttr}"
              ${strokeAttr}
              ${filterAttr}
            >
              <textPath href="#${curvePathId}" startOffset="${startOffset}" text-anchor="middle">
                ${escapeXml(textContent)}
              </textPath>
            </text>
          </g>
        `;
      }

      // Standard multi-line text
      const lines = textContent.split('\n');
      const lineHeightPx = layer.fontSize * (layer.lineHeight || 1.2);
      const totalHeight = lines.length * lineHeightPx;
      const startY = -(totalHeight / 2) + lineHeightPx * 0.75;

      const tspans = lines
        .map((line, lineIdx) => {
          const dy = lineIdx === 0 ? startY : lineHeightPx;
          return `<tspan x="0" dy="${dy}">${escapeXml(line)}</tspan>`;
        })
        .join('');

      return `
        <g transform="translate(${posX}, ${posY}) rotate(${layer.rotation})" opacity="${layer.opacity}">
          <text
            x="0"
            y="0"
            text-anchor="${textAnchor}"
            font-family="'${layer.fontFamily}', system-ui, sans-serif"
            font-size="${layer.fontSize}px"
            font-weight="${layer.fontWeight}"
            ${fontStyleAttr}
            ${letterSpacingAttr}
            ${textDecorationAttr}
            fill="${fillAttr}"
            ${strokeAttr}
            ${filterAttr}
          >
            ${tspans}
          </text>
        </g>
      `;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    ${defs.join('\n')}
  </defs>
  ${bgElement}
  ${layerElements}
</svg>`;
}

/**
 * Preloads all Google Fonts used in layers into the browser's FontFaceSet
 */
async function preloadProjectFonts(layers: TextLayer[]): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return;

  try {
    await document.fonts.ready;
    const fontPromises = layers
      .filter((l) => l.visible && l.fontFamily)
      .map(async (layer) => {
        try {
          const fontSpec = `${layer.fontStyle === 'italic' ? 'italic ' : ''}${layer.fontWeight} ${layer.fontSize}px "${layer.fontFamily}"`;
          await document.fonts.load(fontSpec);
        } catch {
          // ignore individual font timeout
        }
      });
    await Promise.all(fontPromises);
  } catch {
    // continue
  }
}

/**
 * Pure HTML5 Canvas 2D Renderer.
 * Highly robust, runs in all browsers, never taints canvas, generates 100% genuine PNG blobs.
 */
export async function renderProjectToCanvas2D(
  layers: TextLayer[],
  background: CanvasBackground,
  canvasConfig: CanvasConfig,
  scale = 2,
  transparent = false
): Promise<HTMLCanvasElement> {
  // Preload fonts
  await preloadProjectFonts(layers);

  const canvasWidth = canvasConfig.width;
  const canvasHeight = canvasConfig.height;

  const offscreen = document.createElement('canvas');
  offscreen.width = Math.round(canvasWidth * scale);
  offscreen.height = Math.round(canvasHeight * scale);

  const ctx = offscreen.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to obtain Canvas 2D rendering context');
  }

  // Scale context for ultra crisp resolution
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Clear canvas (ensures true alpha transparency)
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw background if not transparent
  if (!transparent && background.type !== 'transparent') {
    if (background.type === 'solid') {
      ctx.fillStyle = background.color || '#000000';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else if (background.type === 'gradient') {
      const angleDeg = background.gradient?.angle ?? 135;
      const angleRad = ((angleDeg - 90) * Math.PI) / 180;
      const cx = canvasWidth / 2;
      const cy = canvasHeight / 2;
      const diag = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight) / 2;
      const x0 = cx - Math.cos(angleRad) * diag;
      const y0 = cy - Math.sin(angleRad) * diag;
      const x1 = cx + Math.cos(angleRad) * diag;
      const y1 = cy + Math.sin(angleRad) * diag;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      const stops = background.gradient?.stops || [
        { offset: 0, color: '#0f172a' },
        { offset: 100, color: '#020617' },
      ];
      stops.forEach((s) => {
        grad.addColorStop(Math.max(0, Math.min(1, s.offset / 100)), s.color);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else if (background.type === 'image' && background.imageUrl) {
      try {
        const bgImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Background image load failed'));
          img.src = background.imageUrl!;
        });

        ctx.save();
        ctx.globalAlpha = background.imageOpacity ?? 1;
        if (background.imageBlur > 0) {
          ctx.filter = `blur(${background.imageBlur}px)`;
        }
        ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
        ctx.restore();
      } catch (e) {
        // Fallback dark background if external image blocked
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
  }

  // Draw each text layer
  for (const layer of layers) {
    if (!layer.visible) continue;

    ctx.save();
    ctx.globalAlpha = layer.opacity ?? 1;

    // Apply text transform
    let displayText = layer.text || '';
    if (layer.textTransform === 'uppercase') displayText = displayText.toUpperCase();
    else if (layer.textTransform === 'lowercase') displayText = displayText.toLowerCase();
    else if (layer.textTransform === 'capitalize') {
      displayText = displayText.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const posX = (layer.x / 100) * canvasWidth;
    const posY = (layer.y / 100) * canvasHeight;

    ctx.translate(posX, posY);
    ctx.rotate((layer.rotation * Math.PI) / 180);

    const fontStyle = layer.fontStyle === 'italic' ? 'italic ' : '';
    ctx.font = `${fontStyle}${layer.fontWeight} ${layer.fontSize}px "${layer.fontFamily}", system-ui, -apple-system, sans-serif`;

    // Apply letterSpacing if browser supports it
    if ('letterSpacing' in ctx) {
      (ctx as any).letterSpacing = `${layer.letterSpacing || 0}px`;
    }
    if ('wordSpacing' in ctx) {
      (ctx as any).wordSpacing = `${layer.wordSpacing || 0}px`;
    }

    // Helper to build gradient fill
    const getFillPattern = (boundWidth: number, boundHeight: number): string | CanvasGradient => {
      if (layer.specialEffect === 'metallic-gold') {
        const g = ctx.createLinearGradient(-boundWidth / 2, -boundHeight / 2, boundWidth / 2, boundHeight / 2);
        g.addColorStop(0, '#FFF6C5');
        g.addColorStop(0.35, '#F59E0B');
        g.addColorStop(0.7, '#D97706');
        g.addColorStop(1, '#78350F');
        return g;
      }
      if (layer.specialEffect === 'silver-chrome') {
        const g = ctx.createLinearGradient(-boundWidth / 2, -boundHeight / 2, boundWidth / 2, boundHeight / 2);
        g.addColorStop(0, '#FFFFFF');
        g.addColorStop(0.3, '#CBD5E1');
        g.addColorStop(0.5, '#475569');
        g.addColorStop(0.7, '#F8FAFC');
        g.addColorStop(1, '#1E293B');
        return g;
      }
      if (layer.specialEffect === 'fire') {
        const g = ctx.createLinearGradient(0, -boundHeight / 2, 0, boundHeight / 2);
        g.addColorStop(0, '#FFF700');
        g.addColorStop(0.45, '#FF8800');
        g.addColorStop(1, '#E11D48');
        return g;
      }
      if (layer.specialEffect === 'ice') {
        const g = ctx.createLinearGradient(0, -boundHeight / 2, 0, boundHeight / 2);
        g.addColorStop(0, '#FFFFFF');
        g.addColorStop(0.4, '#BAE6FD');
        g.addColorStop(1, '#0284C7');
        return g;
      }
      if (layer.specialEffect === 'holographic') {
        const g = ctx.createLinearGradient(-boundWidth / 2, 0, boundWidth / 2, 0);
        g.addColorStop(0, '#FF6FD8');
        g.addColorStop(0.25, '#3813C2');
        g.addColorStop(0.5, '#00F0FF');
        g.addColorStop(0.75, '#50E3C2');
        g.addColorStop(1, '#FF6FD8');
        return g;
      }
      if (layer.colorMode === 'linear') {
        const angleRad = ((layer.gradient.angle - 90) * Math.PI) / 180;
        const diag = Math.sqrt(boundWidth * boundWidth + boundHeight * boundHeight) / 2;
        const x0 = -Math.cos(angleRad) * diag;
        const y0 = -Math.sin(angleRad) * diag;
        const x1 = Math.cos(angleRad) * diag;
        const y1 = Math.sin(angleRad) * diag;
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        layer.gradient.stops.forEach((s) => {
          g.addColorStop(Math.max(0, Math.min(1, s.offset / 100)), s.color);
        });
        return g;
      }
      if (layer.colorMode === 'radial') {
        const radius = Math.max(boundWidth, boundHeight) / 2;
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        layer.gradient.stops.forEach((s) => {
          g.addColorStop(Math.max(0, Math.min(1, s.offset / 100)), s.color);
        });
        return g;
      }
      return layer.solidColor || '#FFFFFF';
    };

    // Curved Text Rendering on Canvas
    if (layer.curvedText.enabled) {
      const radius = Math.max(30, layer.curvedText.radius || 200);
      const curvature = layer.curvedText.curvature || 50;
      const reverse = layer.curvedText.reverse || false;
      const isCircle = layer.curvedText.type === 'circle';

      const chars = Array.from(displayText);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const charWidths = chars.map((ch) => ctx.measureText(ch).width + (layer.letterSpacing || 0));
      const totalWidth = charWidths.reduce((a, b) => a + b, 0);

      const fillStyle = getFillPattern(totalWidth, layer.fontSize);

      const arcAngle = isCircle
        ? Math.PI * 2
        : Math.min(Math.PI * 1.8, (totalWidth / radius) * (Math.abs(curvature) / 50));
      const dir = (curvature >= 0 ? 1 : -1) * (reverse ? -1 : 1);
      const startAngle = (-arcAngle / 2) * dir;

      let currAngle = startAngle;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const cWidth = charWidths[i];
        const cAngle = (cWidth / radius) * dir;
        const angle = currAngle + cAngle / 2;
        currAngle += cAngle;

        ctx.save();
        const cx = Math.sin(angle) * radius;
        const cy = -Math.cos(angle) * radius * (curvature < 0 ? -1 : 1);
        ctx.translate(cx, cy);
        ctx.rotate(angle * (curvature < 0 ? -1 : 1));

        // Shadow
        if (layer.shadow.enabled) {
          ctx.shadowColor = hexToRgba(layer.shadow.color || '#000000', layer.shadow.opacity ?? 0.5);
          ctx.shadowBlur = layer.shadow.blur || 0;
          ctx.shadowOffsetX = layer.shadow.offsetX || 0;
          ctx.shadowOffsetY = layer.shadow.offsetY || 0;
        }

        // Stroke
        if (layer.stroke.enabled && layer.stroke.width > 0) {
          ctx.lineWidth = layer.stroke.width * 2;
          ctx.strokeStyle = layer.stroke.color;
          ctx.strokeText(ch, 0, 0);
        }

        // Fill
        if (!layer.stroke.hollow) {
          ctx.fillStyle = fillStyle;
          ctx.fillText(ch, 0, 0);
        }

        ctx.restore();
      }

      ctx.restore();
      continue;
    }

    // Standard Multi-line Text
    const lines = displayText.split('\n');
    ctx.textAlign =
      layer.textAlign === 'center'
        ? 'center'
        : layer.textAlign === 'right'
        ? 'right'
        : 'left';
    ctx.textBaseline = 'middle';

    const lineHeight = layer.fontSize * (layer.lineHeight || 1.2);
    const totalHeight = lines.length * lineHeight;
    const startY = -(totalHeight / 2) + lineHeight / 2;

    // Approximate width of longest line
    let maxWidth = 100;
    for (const line of lines) {
      const w = ctx.measureText(line).width + line.length * (layer.letterSpacing || 0);
      if (w > maxWidth) maxWidth = w;
    }

    const fillStyle = getFillPattern(maxWidth, totalHeight);

    // 1. Draw 3D retro or layered shadows first
    const isRetro3D = layer.specialEffect === 'retro-3d';
    const isLayeredShadow = layer.shadow.enabled && layer.shadow.type === 'layered';

    if (isRetro3D || isLayeredShadow) {
      const depth = isRetro3D
        ? Math.round(7 * ((layer.specialEffectSettings?.intensity || 50) / 50))
        : layer.shadow.layers || 5;
      const stepX = isRetro3D ? 1.5 : (layer.shadow.offsetX || 4) / depth;
      const stepY = isRetro3D ? 1.5 : (layer.shadow.offsetY || 4) / depth;
      const shadowColor = isRetro3D ? '#0284C7' : layer.shadow.color || '#000000';

      ctx.save();
      ctx.fillStyle = shadowColor;
      for (let s = depth; s >= 1; s--) {
        for (let i = 0; i < lines.length; i++) {
          const y = startY + i * lineHeight;
          ctx.fillText(lines[i], s * stepX, y + s * stepY);
        }
      }
      ctx.restore();
    }

    // 2. Glitch RGB Split Effect
    if (layer.specialEffect === 'glitch') {
      ctx.save();
      ctx.fillStyle = '#00FFFF';
      lines.forEach((line, i) => {
        ctx.fillText(line, -3, startY + i * lineHeight);
      });
      ctx.fillStyle = '#FF0055';
      lines.forEach((line, i) => {
        ctx.fillText(line, 3, startY + i * lineHeight);
      });
      ctx.restore();
    }

    // 3. Neon sign multi-glow passes
    if (layer.specialEffect === 'neon-sign' || (layer.shadow.enabled && layer.shadow.type === 'neon')) {
      const glowColor =
        layer.specialEffect === 'neon-sign' ? '#FF007F' : layer.shadow.color || '#FF007F';
      ctx.save();
      ctx.shadowColor = glowColor;
      [15, 30, 50].forEach((blurVal) => {
        ctx.shadowBlur = blurVal;
        lines.forEach((line, i) => {
          ctx.strokeText(line, 0, startY + i * lineHeight);
          ctx.fillText(line, 0, startY + i * lineHeight);
        });
      });
      ctx.restore();
    }

    // 4. Configured Drop / Soft / Hard Shadow
    if (layer.shadow.enabled && !isLayeredShadow && layer.shadow.type !== 'neon') {
      ctx.shadowColor = hexToRgba(layer.shadow.color || '#000000', layer.shadow.opacity ?? 0.5);
      ctx.shadowBlur = layer.shadow.blur || 0;
      ctx.shadowOffsetX = layer.shadow.offsetX || 0;
      ctx.shadowOffsetY = layer.shadow.offsetY || 0;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // 5. Double Outline (draw secondary outer stroke first)
    if (
      layer.stroke.enabled &&
      layer.stroke.doubleOutline &&
      layer.stroke.secondaryColor &&
      (layer.stroke.secondaryWidth ?? 0) > 0
    ) {
      ctx.save();
      ctx.lineWidth = (layer.stroke.secondaryWidth || 6) * 2;
      ctx.strokeStyle = layer.stroke.secondaryColor;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      lines.forEach((line, i) => {
        ctx.strokeText(line, 0, startY + i * lineHeight);
      });
      ctx.restore();
    }

    // 6. Primary Stroke
    if (layer.stroke.enabled && layer.stroke.width > 0) {
      ctx.lineWidth = layer.stroke.width * 2;
      ctx.strokeStyle = layer.stroke.color;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      lines.forEach((line, i) => {
        ctx.strokeText(line, 0, startY + i * lineHeight);
      });
    }

    // 7. Text Fill
    if (!layer.stroke.hollow) {
      ctx.fillStyle = fillStyle;
      lines.forEach((line, i) => {
        ctx.fillText(line, 0, startY + i * lineHeight);
      });
    }

    // 8. Underline and strikethrough decorations
    if (layer.textDecoration && layer.textDecoration !== 'none') {
      ctx.strokeStyle = layer.textDecorationColor || layer.solidColor || '#FFFFFF';
      ctx.lineWidth = Math.max(2, layer.fontSize * 0.06);

      lines.forEach((line, i) => {
        const textMetric = ctx.measureText(line);
        const y = startY + i * lineHeight;
        let lineX1 = 0;
        let lineX2 = textMetric.width;

        if (layer.textAlign === 'center') {
          lineX1 = -textMetric.width / 2;
          lineX2 = textMetric.width / 2;
        } else if (layer.textAlign === 'right') {
          lineX1 = -textMetric.width;
          lineX2 = 0;
        }

        const lineY = layer.textDecoration === 'underline' ? y + layer.fontSize * 0.42 : y;
        ctx.beginPath();
        ctx.moveTo(lineX1, lineY);
        ctx.lineTo(lineX2, lineY);
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  return offscreen;
}

/**
 * Exports current canvas as PNG or Transparent PNG with scale factor
 */
export async function exportToPng(
  layers: TextLayer[],
  background: CanvasBackground,
  canvas: CanvasConfig,
  scale = 2,
  transparent = false
): Promise<Blob> {
  const renderedCanvas = await renderProjectToCanvas2D(layers, background, canvas, scale, transparent);

  return new Promise((resolve, reject) => {
    try {
      renderedCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Fallback via data URL if toBlob returns null
            try {
              const dataUrl = renderedCanvas.toDataURL('image/png', 1.0);
              const byteString = atob(dataUrl.split(',')[1]);
              const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              resolve(new Blob([ab], { type: mimeString }));
            } catch (fallbackErr) {
              reject(new Error('Failed to create PNG image blob'));
            }
          }
        },
        'image/png',
        1.0
      );
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Downloads a Blob as a file with a specified filename
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Copies the current canvas image directly to the clipboard
 */
export async function copyImageToClipboard(
  layers: TextLayer[],
  background: CanvasBackground,
  canvas: CanvasConfig,
  transparent = false
): Promise<boolean> {
  try {
    const blob = await exportToPng(layers, background, canvas, 2, transparent);
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('ClipboardItem API not supported in this browser');
    }
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    return false;
  }
}

/**
 * Generates reusable CSS rules for the active text layer
 */
export function getLayerCssCode(layer: TextLayer): string {
  const lines: string[] = [
    `font-family: "${layer.fontFamily}", system-ui, sans-serif;`,
    `font-size: ${layer.fontSize}px;`,
    `font-weight: ${layer.fontWeight};`,
    `font-style: ${layer.fontStyle};`,
    `line-height: ${layer.lineHeight};`,
    `letter-spacing: ${layer.letterSpacing}px;`,
    `word-spacing: ${layer.wordSpacing}px;`,
    `text-align: ${layer.textAlign};`,
    `text-transform: ${layer.textTransform};`,
    `opacity: ${layer.opacity};`,
  ];

  if (layer.colorMode === 'linear') {
    const stops = layer.gradient.stops.map((s) => `${s.color} ${s.offset}%`).join(', ');
    lines.push(`background: linear-gradient(${layer.gradient.angle}deg, ${stops});`);
    lines.push(`-webkit-background-clip: text;`);
    lines.push(`-webkit-text-fill-color: transparent;`);
  } else if (layer.colorMode === 'radial') {
    const stops = layer.gradient.stops.map((s) => `${s.color} ${s.offset}%`).join(', ');
    lines.push(`background: radial-gradient(circle, ${stops});`);
    lines.push(`-webkit-background-clip: text;`);
    lines.push(`-webkit-text-fill-color: transparent;`);
  } else {
    lines.push(`color: ${layer.solidColor};`);
  }

  if (layer.stroke.enabled) {
    lines.push(`-webkit-text-stroke: ${layer.stroke.width}px ${layer.stroke.color};`);
  }

  if (layer.shadow.enabled) {
    lines.push(
      `text-shadow: ${layer.shadow.offsetX}px ${layer.shadow.offsetY}px ${layer.shadow.blur}px ${layer.shadow.color};`
    );
  }

  return `.fontforge-text {\n  ${lines.join('\n  ')}\n}`;
}
