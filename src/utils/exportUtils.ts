import { TextLayer, CanvasBackground, CanvasConfig } from '../types';
import { getLayerTextStyle, generateCurvedTextSvgPath } from './textEffects';

/**
 * Creates a standalone SVG string representing the canvas with all visible layers
 */
export function buildCanvasSvgString(
  layers: TextLayer[],
  background: CanvasBackground,
  canvas: CanvasConfig,
  transparent = false
): string {
  const width = canvas.width;
  const height = canvas.height;

  // Background SVG element
  let bgElement = '';
  if (!transparent && background.type !== 'transparent') {
    if (background.type === 'solid') {
      bgElement = `<rect width="${width}" height="${height}" fill="${background.color}" />`;
    } else if (background.type === 'gradient') {
      const angleRad = ((background.gradient.angle - 90) * Math.PI) / 180;
      const x1 = 50 - Math.cos(angleRad) * 50;
      const y1 = 50 - Math.sin(angleRad) * 50;
      const x2 = 50 + Math.cos(angleRad) * 50;
      const y2 = 50 + Math.sin(angleRad) * 50;
      const stops = background.gradient.stops
        .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
        .join('');
      bgElement = `
        <defs>
          <linearGradient id="bg-grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
            ${stops}
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bg-grad)" />
      `;
    }
  }

  // Layers in HTML foreignObject or SVG text
  const layerElements = layers
    .filter((l) => l.visible)
    .map((layer, index) => {
      const posX = (layer.x / 100) * width;
      const posY = (layer.y / 100) * height;
      const style = getLayerTextStyle(layer);

      if (layer.curvedText.enabled) {
        // True SVG Curved textPath
        const { pathD, startOffset } = generateCurvedTextSvgPath(
          width,
          height,
          layer.curvedText.radius,
          layer.curvedText.curvature,
          layer.curvedText.type,
          layer.curvedText.reverse
        );

        const pathId = `curve-path-${layer.id || index}`;
        const fillColor = layer.colorMode === 'solid' ? layer.solidColor : '#FFFFFF';
        const strokeAttr = layer.stroke.enabled
          ? `stroke="${layer.stroke.color}" stroke-width="${layer.stroke.width}"`
          : '';

        return `
          <g transform="rotate(${layer.rotation} ${width / 2} ${height / 2})">
            <defs>
              <path id="${pathId}" d="${pathD}" fill="none" />
            </defs>
            <text font-family="${layer.fontFamily}, sans-serif" font-size="${layer.fontSize}px" font-weight="${layer.fontWeight}" letter-spacing="${layer.letterSpacing}px" fill="${fillColor}" ${strokeAttr}>
              <textPath href="#${pathId}" startOffset="${startOffset}" text-anchor="middle">
                ${escapeXml(layer.text)}
              </textPath>
            </text>
          </g>
        `;
      }

      // ForeignObject for maximum CSS fidelity (gradients, shadows, custom letter spacing)
      const cssString = Object.entries(style)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => {
          const kebabKey = k.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `${kebabKey}: ${v};`;
        })
        .join(' ');

      return `
        <g transform="translate(${posX}, ${posY}) rotate(${layer.rotation})">
          <foreignObject x="-${width / 2}" y="-${height / 2}" width="${width}" height="${height}">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: ${
              layer.textAlign === 'center' ? 'center' : layer.textAlign === 'right' ? 'flex-end' : 'flex-start'
            };">
              <div style="${cssString} white-space: pre-wrap; word-break: break-word; max-width: 90%;">
                ${escapeXml(layer.text)}
              </div>
            </div>
          </foreignObject>
        </g>
      `;
    })
    .join('');

  return `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${bgElement}
  ${layerElements}
</svg>`;
}

/**
 * Escapes XML characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
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
  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue even if font readiness times out
    }
  }

  const svgString = buildCanvasSvgString(layers, background, canvas, transparent);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvas.width * scale;
        offscreenCanvas.height = canvas.height * scale;
        const ctx = offscreenCanvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Clear canvas (ensures 100% transparency if transparent flag is true)
        ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // If background image is used and not transparent
        if (!transparent && background.type === 'image' && background.imageUrl) {
          const bgImg = new Image();
          bgImg.crossOrigin = 'anonymous';
          bgImg.onload = () => {
            ctx.save();
            ctx.globalAlpha = background.imageOpacity ?? 1;
            if (background.imageBlur > 0) {
              ctx.filter = `blur(${background.imageBlur * scale}px)`;
            }
            ctx.drawImage(bgImg, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
            ctx.restore();
            ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
            URL.revokeObjectURL(url);
            offscreenCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG conversion failed'))), 'image/png');
          };
          bgImg.onerror = () => {
            ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
            URL.revokeObjectURL(url);
            offscreenCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG conversion failed'))), 'image/png');
          };
          bgImg.src = background.imageUrl;
          return;
        }

        ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        URL.revokeObjectURL(url);

        offscreenCanvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          },
          'image/png',
          1.0
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load rasterized SVG image for export'));
    };

    img.src = url;
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
  const style = getLayerTextStyle(layer);
  const lines = Object.entries(style)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => {
      const kebab = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${kebab}: ${v};`;
    });

  return `.fontforge-styled-text {\n${lines.join('\n')}\n}`;
}
