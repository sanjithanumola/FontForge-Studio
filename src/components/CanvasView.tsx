import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Lock,
} from 'lucide-react';
import { TextLayer, CanvasBackground, CanvasConfig } from '../types';
import { getLayerTextStyle, generateCurvedTextSvgPath } from '../utils/textEffects';

interface CanvasViewProps {
  layers: TextLayer[];
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<TextLayer>) => void;
  background: CanvasBackground;
  canvas: CanvasConfig;
  onUpdateCanvas: (updates: Partial<CanvasConfig>) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onUpdateLayer,
  background,
  canvas,
  onUpdateCanvas,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [isDraggingLayer, setIsDraggingLayer] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showCenterGuideX, setShowCenterGuideX] = useState<boolean>(false);
  const [showCenterGuideY, setShowCenterGuideY] = useState<boolean>(false);

  // Auto-fit canvas to container on mount or size change
  useEffect(() => {
    const autoFit = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const padding = 64;
      const availableW = Math.max(200, clientWidth - padding);
      const availableH = Math.max(200, clientHeight - padding);

      const scaleW = availableW / canvas.width;
      const scaleH = availableH / canvas.height;
      const fitScale = Math.min(scaleW, scaleH, 1);
      setZoom(Number(fitScale.toFixed(2)));
    };

    autoFit();
    window.addEventListener('resize', autoFit);
    return () => window.removeEventListener('resize', autoFit);
  }, [canvas.width, canvas.height]);

  // Handle Layer Dragging
  const handleLayerMouseDown = (e: React.MouseEvent, layer: TextLayer) => {
    if (layer.locked || !layer.visible) return;
    e.stopPropagation();
    onSelectLayer(layer.id);

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentLayerPxX = (layer.x / 100) * rect.width;
    const currentLayerPxY = (layer.y / 100) * rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragOffset({
      x: mouseX - currentLayerPxX,
      y: mouseY - currentLayerPxY,
    });
    setIsDraggingLayer(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingLayer || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - dragOffset.x;
      const mouseY = e.clientY - rect.top - dragOffset.y;

      let newXPercent = (mouseX / rect.width) * 100;
      let newYPercent = (mouseY / rect.height) * 100;

      // Center snap check
      if (canvas.snapToCenter) {
        if (Math.abs(newXPercent - 50) < 2) {
          newXPercent = 50;
          setShowCenterGuideX(true);
        } else {
          setShowCenterGuideX(false);
        }

        if (Math.abs(newYPercent - 50) < 2) {
          newYPercent = 50;
          setShowCenterGuideY(true);
        } else {
          setShowCenterGuideY(false);
        }
      }

      // Constrain within bounds (-10% to 110%)
      newXPercent = Math.max(-10, Math.min(110, newXPercent));
      newYPercent = Math.max(-10, Math.min(110, newYPercent));

      onUpdateLayer(activeLayerId, {
        x: Number(newXPercent.toFixed(1)),
        y: Number(newYPercent.toFixed(1)),
      });
    };

    const handleMouseUp = () => {
      setIsDraggingLayer(false);
      setShowCenterGuideX(false);
      setShowCenterGuideY(false);
    };

    if (isDraggingLayer) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLayer, dragOffset, activeLayerId, canvas.snapToCenter, onUpdateLayer]);

  // Compute background style
  const getCanvasBackgroundStyle = (): React.CSSProperties => {
    if (background.type === 'transparent') {
      return { backgroundColor: 'transparent' };
    }
    if (background.type === 'solid') {
      return { backgroundColor: background.color };
    }
    if (background.type === 'gradient') {
      const stops = background.gradient.stops
        .map((s) => `${s.color} ${s.offset}%`)
        .join(', ');
      return {
        background: `linear-gradient(${background.gradient.angle}deg, ${stops})`,
      };
    }
    if (background.type === 'image' && background.imageUrl) {
      return {
        backgroundImage: `url(${background.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: background.imageBlur > 0 ? `blur(${background.imageBlur}px)` : undefined,
        opacity: background.imageOpacity ?? 1,
      };
    }
    return { backgroundColor: '#0F172A' };
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 h-full w-full overflow-hidden bg-neutral-900/60 flex items-center justify-center p-4 select-none"
    >
      {/* Canvas Controls Toolbar (Zoom, Fit, Checkerboard, Grid) */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-lg p-1 text-xs text-neutral-300 shadow-xl">
        <button
          onClick={() => setZoom((z) => Math.max(0.2, Number((z - 0.1).toFixed(2))))}
          title="Zoom Out"
          className="p-1.5 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          <ZoomOut size={14} />
        </button>
        <span className="px-2 py-0.5 font-mono text-neutral-400 min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.1).toFixed(2))))}
          title="Zoom In"
          className="p-1.5 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          <ZoomIn size={14} />
        </button>
        <div className="w-[1px] h-3.5 bg-neutral-800 my-auto" />
        <button
          onClick={() => setZoom(1)}
          title="Reset Zoom to 100%"
          className="px-1.5 py-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          1:1
        </button>
        <button
          onClick={() => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            const padding = 64;
            const scaleW = (clientWidth - padding) / canvas.width;
            const scaleH = (clientHeight - padding) / canvas.height;
            setZoom(Number(Math.min(scaleW, scaleH, 1).toFixed(2)));
          }}
          title="Fit Canvas to Screen"
          className="p-1.5 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          <Maximize2 size={14} />
        </button>
        <div className="w-[1px] h-3.5 bg-neutral-800 my-auto" />
        <button
          onClick={() => onUpdateCanvas({ showCheckerboard: !canvas.showCheckerboard })}
          title="Toggle Checkerboard Background"
          className={`p-1.5 rounded transition-colors ${
            canvas.showCheckerboard ? 'bg-amber-500/20 text-amber-400' : 'hover:text-white hover:bg-neutral-800'
          }`}
        >
          <div className="w-3.5 h-3.5 border border-current rounded-sm grid grid-cols-2 grid-rows-2 overflow-hidden">
            <div className="bg-current opacity-40" />
            <div />
            <div />
            <div className="bg-current opacity-40" />
          </div>
        </button>
        <button
          onClick={() => onUpdateCanvas({ showGrid: !canvas.showGrid })}
          title="Toggle Alignment Grid"
          className={`p-1.5 rounded transition-colors ${
            canvas.showGrid ? 'bg-amber-500/20 text-amber-400' : 'hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Grid size={14} />
        </button>
      </div>

      {/* Canvas Viewport Dimensions Badge */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-400 font-mono shadow-md">
        <span>
          {canvas.width} × {canvas.height} px
        </span>
        <span className="text-neutral-600">·</span>
        <span className="capitalize">{canvas.aspectRatio}</span>
      </div>

      {/* Checkerboard or Solid Backdrop wrapper */}
      <div
        className="relative transition-transform duration-75 shadow-2xl rounded-sm overflow-hidden"
        style={{
          width: `${canvas.width * zoom}px`,
          height: `${canvas.height * zoom}px`,
        }}
      >
        {/* Transparency Checkerboard Pattern */}
        {(canvas.showCheckerboard || background.type === 'transparent') && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #262626 25%, transparent 25%),
                linear-gradient(-45deg, #262626 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #262626 75%),
                linear-gradient(-45deg, transparent 75%, #262626 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              backgroundColor: '#171717',
            }}
          />
        )}

        {/* Scaled Canvas Container */}
        <div
          ref={canvasRef}
          className="relative w-full h-full z-10 overflow-hidden"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: `${canvas.width}px`,
            height: `${canvas.height}px`,
            ...getCanvasBackgroundStyle(),
          }}
        >
          {/* Subtle Alignment Grid Overlay */}
          {canvas.showGrid && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
          )}

          {/* Dynamic Snapping Center Guides */}
          {showCenterGuideX && (
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-400 shadow-[0_0_8px_#f59e0b] z-30 pointer-events-none" />
          )}
          {showCenterGuideY && (
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-amber-400 shadow-[0_0_8px_#f59e0b] z-30 pointer-events-none" />
          )}

          {/* Render Layers */}
          {layers.map((layer) => {
            if (!layer.visible) return null;

            const isSelected = layer.id === activeLayerId;
            const style = getLayerTextStyle(layer);

            // Handle Curved Text via SVG
            if (layer.curvedText.enabled) {
              const { pathD, startOffset } = generateCurvedTextSvgPath(
                canvas.width,
                canvas.height,
                layer.curvedText.radius,
                layer.curvedText.curvature,
                layer.curvedText.type,
                layer.curvedText.reverse
              );

              return (
                <div
                  key={layer.id}
                  onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                  className={`absolute inset-0 flex items-center justify-center cursor-move transition-opacity ${
                    layer.locked ? 'cursor-not-allowed' : ''
                  }`}
                  style={{
                    transform: `rotate(${layer.rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <svg
                    width={canvas.width}
                    height={canvas.height}
                    viewBox={`0 0 ${canvas.width} ${canvas.height}`}
                    className="overflow-visible"
                  >
                    <defs>
                      <path id={`curve-${layer.id}`} d={pathD} fill="none" />
                    </defs>
                    <text
                      fontFamily={layer.fontFamily}
                      fontSize={`${layer.fontSize}px`}
                      fontWeight={layer.fontWeight}
                      letterSpacing={`${layer.letterSpacing}px`}
                      fill={layer.colorMode === 'solid' ? layer.solidColor : '#FFE066'}
                      stroke={layer.stroke.enabled ? layer.stroke.color : undefined}
                      strokeWidth={layer.stroke.enabled ? layer.stroke.width : undefined}
                      opacity={layer.opacity}
                      style={{
                        textShadow: style.textShadow,
                      }}
                    >
                      <textPath href={`#curve-${layer.id}`} startOffset={startOffset} textAnchor="middle">
                        {layer.text}
                      </textPath>
                    </text>
                  </svg>

                  {/* Bounding indicator when active */}
                  {isSelected && (
                    <div className="absolute inset-8 border border-dashed border-amber-400/60 rounded pointer-events-none">
                      <span className="absolute -top-3 left-4 bg-amber-400 text-neutral-950 font-bold text-[10px] px-1.5 py-0.5 rounded shadow">
                        {layer.name} ({layer.rotation}°)
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            // Standard Rectangular Layer
            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                className={`absolute group cursor-move select-none transition-shadow ${
                  layer.locked ? 'cursor-not-allowed opacity-90' : ''
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {/* Active Layer Selection Box */}
                {isSelected && (
                  <div className="absolute -inset-3 border-2 border-amber-400/80 rounded-md pointer-events-none shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                    {/* Corner resize pins */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm" />

                    {/* Layer Tag */}
                    <div className="absolute -top-6 left-0 flex items-center gap-1 bg-amber-400 text-neutral-950 font-bold text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      <span>{layer.name}</span>
                      {layer.locked && <Lock size={10} />}
                    </div>
                  </div>
                )}

                {/* Rendered Text Element */}
                <div
                  style={{
                    ...style,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                  className="px-2 py-1"
                >
                  {layer.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
