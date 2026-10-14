import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Eye,
  Lock,
  Grid,
} from 'lucide-react';
import { TextLayer, CanvasBackground, CanvasConfig } from '../types';
import { getLayerTextStyle, generateCurvedTextSvgPath } from '../utils/textEffects';

interface CanvasAreaProps {
  layers: TextLayer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<TextLayer>) => void;
  background: CanvasBackground;
  canvasConfig: CanvasConfig;
  onUpdateCanvasConfig: (updates: Partial<CanvasConfig>) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onUpdateLayer,
  background,
  canvasConfig,
  onUpdateCanvasConfig,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSpaceHeld, setIsSpaceHeld] = useState(false);

  // Layer dragging
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [dragLayerStartPos, setDragLayerStartPos] = useState({ x: 0, y: 0 });
  const [dragMouseStart, setDragMouseStart] = useState({ x: 0, y: 0 });

  // Auto-fit canvas on initial load or resize
  useEffect(() => {
    const handleFit = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const padding = 80;
      const scaleX = (clientWidth - padding) / canvasConfig.width;
      const scaleY = (clientHeight - padding) / canvasConfig.height;
      const fitScale = Math.min(scaleX, scaleY, 1.2);
      setZoom(Math.max(0.2, fitScale));
      setPan({ x: 0, y: 0 });
    };

    handleFit();
  }, [canvasConfig.width, canvasConfig.height]);

  // Spacebar panning detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setIsSpaceHeld(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceHeld(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || isSpaceHeld || e.target === containerRef.current) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    if (draggingLayerId && canvasRef.current) {
      const activeLayer = layers.find((l) => l.id === draggingLayerId);
      if (!activeLayer || activeLayer.locked) return;

      const deltaX = (e.clientX - dragMouseStart.x) / zoom;
      const deltaY = (e.clientY - dragMouseStart.y) / zoom;

      let newPercentX = dragLayerStartPos.x + (deltaX / canvasConfig.width) * 100;
      let newPercentY = dragLayerStartPos.y + (deltaY / canvasConfig.height) * 100;

      if (canvasConfig.snapToCenter) {
        if (Math.abs(newPercentX - 50) < 2) newPercentX = 50;
        if (Math.abs(newPercentY - 50) < 2) newPercentY = 50;
      }

      onUpdateLayer(draggingLayerId, {
        x: Math.round(newPercentX * 10) / 10,
        y: Math.round(newPercentY * 10) / 10,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingLayerId(null);
  };

  const handleLayerMouseDown = (e: React.MouseEvent, layer: TextLayer) => {
    if (layer.locked || !layer.visible || isSpaceHeld) return;
    e.stopPropagation();
    onSelectLayer(layer.id);
    setDraggingLayerId(layer.id);
    setDragLayerStartPos({ x: layer.x, y: layer.y });
    setDragMouseStart({ x: e.clientX, y: e.clientY });
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    if (background.type === 'transparent') {
      return {};
    }
    if (background.type === 'solid') {
      return { backgroundColor: background.color };
    }
    if (background.type === 'gradient') {
      const stops = background.gradient.stops.map((s) => `${s.color} ${s.offset}%`).join(', ');
      return {
        background: `linear-gradient(${background.gradient.angle}deg, ${stops})`,
      };
    }
    return {};
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative flex-1 h-full overflow-hidden bg-neutral-900/60 select-none flex items-center justify-center p-4 ${
        isSpaceHeld ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Background canvas wrapper with zoom and pan */}
      <div
        className="transition-transform duration-75 ease-out relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Canvas Outer Box */}
        <div
          ref={canvasRef}
          style={{
            width: `${canvasConfig.width}px`,
            height: `${canvasConfig.height}px`,
            ...getBackgroundStyle(),
          }}
          className={`relative shadow-2xl transition-all rounded-sm overflow-hidden ${
            background.type === 'transparent' && canvasConfig.showCheckerboard
              ? 'checkerboard-bg'
              : ''
          }`}
        >
          {/* Background image if loaded */}
          {background.type === 'image' && background.imageUrl && (
            <div
              className="absolute inset-0 pointer-events-none bg-cover bg-center"
              style={{
                backgroundImage: `url(${background.imageUrl})`,
                opacity: background.imageOpacity ?? 1,
                filter: background.imageBlur ? `blur(${background.imageBlur}px)` : undefined,
              }}
            />
          )}

          {/* Alignment Center Guide Lines */}
          {canvasConfig.showGrid && (
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-400 border-dashed" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-400 border-dashed" />
            </div>
          )}

          {/* Render Text Layers */}
          {layers.map((layer) => {
            if (!layer.visible) return null;
            const isSelected = layer.id === activeLayerId;
            const style = getLayerTextStyle(layer);

            if (layer.curvedText.enabled) {
              const { pathD, startOffset } = generateCurvedTextSvgPath(
                canvasConfig.width,
                canvasConfig.height,
                layer.curvedText.radius,
                layer.curvedText.curvature,
                layer.curvedText.type,
                layer.curvedText.reverse
              );
              const pathId = `canvas-path-${layer.id}`;

              return (
                <div
                  key={layer.id}
                  onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                  className={`absolute inset-0 pointer-events-auto cursor-move ${
                    isSelected ? 'ring-1 ring-amber-400/80 ring-offset-1' : ''
                  }`}
                  style={{
                    transform: `rotate(${layer.rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <svg
                    className="w-full h-full overflow-visible pointer-events-none"
                    viewBox={`0 0 ${canvasConfig.width} ${canvasConfig.height}`}
                  >
                    <defs>
                      <path id={pathId} d={pathD} fill="none" />
                    </defs>
                    <text
                      fontFamily={`"${layer.fontFamily}", system-ui, sans-serif`}
                      fontSize={`${layer.fontSize}px`}
                      fontWeight={layer.fontWeight}
                      fontStyle={layer.fontStyle}
                      letterSpacing={`${layer.letterSpacing}px`}
                      fill={layer.colorMode === 'solid' ? layer.solidColor : '#FFE066'}
                      stroke={layer.stroke.enabled ? layer.stroke.color : 'none'}
                      strokeWidth={layer.stroke.enabled ? layer.stroke.width : 0}
                      opacity={layer.opacity}
                      style={{
                        filter: layer.shadow.enabled
                          ? `drop-shadow(${layer.shadow.offsetX}px ${layer.shadow.offsetY}px ${layer.shadow.blur}px ${layer.shadow.color})`
                          : undefined,
                      }}
                    >
                      <textPath href={`#${pathId}`} startOffset={startOffset} textAnchor="middle">
                        {layer.text}
                      </textPath>
                    </text>
                  </svg>
                </div>
              );
            }

            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                  transformOrigin: 'center center',
                }}
                className={`absolute pointer-events-auto cursor-move group max-w-[95%] transition-shadow ${
                  isSelected
                    ? 'ring-1 ring-amber-400 ring-dashed ring-offset-2 ring-offset-transparent'
                    : 'hover:ring-1 hover:ring-neutral-500/50'
                }`}
              >
                {isSelected && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-amber-400 border border-neutral-900 rounded-sm pointer-events-none" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 border border-neutral-900 rounded-sm pointer-events-none" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-amber-400 border border-neutral-900 rounded-sm pointer-events-none" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-amber-400 border border-neutral-900 rounded-sm pointer-events-none" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-900/90 text-[10px] text-amber-300 font-mono whitespace-nowrap shadow border border-neutral-700 pointer-events-none">
                      <span>{layer.name}</span>
                      {layer.locked && <Lock className="w-2.5 h-2.5 text-neutral-400" />}
                    </div>
                  </>
                )}

                <div
                  style={style}
                  className="whitespace-pre-wrap select-none break-words px-2 py-1 leading-snug"
                >
                  {layer.text || 'Double click or edit in inspector'}
                </div>
              </div>
            );
          })}

          {layers.filter((l) => l.visible).length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-2">
              <Eye className="w-8 h-8 opacity-40" />
              <p className="text-sm font-medium">All layers hidden</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Canvas Controls Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-xl shadow-xl z-20 text-neutral-300 text-xs">
        <span className="font-mono text-neutral-400 text-[11px] px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800">
          {canvasConfig.width} × {canvasConfig.height}
        </span>

        <div className="h-3 w-px bg-neutral-800 mx-0.5" />

        <button
          onClick={() => setZoom((z) => Math.max(0.2, Math.round((z - 0.1) * 10) / 10))}
          title="Zoom Out"
          className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono w-12 text-center text-[11px] text-neutral-300">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom((z) => Math.min(3.0, Math.round((z + 0.1) * 10) / 10))}
          title="Zoom In"
          className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            const fitScale = Math.min((clientWidth - 80) / canvasConfig.width, (clientHeight - 80) / canvasConfig.height, 1.2);
            setZoom(Math.max(0.2, fitScale));
            setPan({ x: 0, y: 0 });
          }}
          title="Fit to Screen"
          className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset Zoom (100%)"
          className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-3 w-px bg-neutral-800 mx-0.5" />

        <button
          onClick={() => onUpdateCanvasConfig({ showGrid: !canvasConfig.showGrid })}
          title="Toggle Center Alignment Guides"
          className={`p-1 rounded transition-colors ${
            canvasConfig.showGrid ? 'text-amber-400 bg-amber-400/10' : 'hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
