import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Code2,
  FileImage,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { TextLayer, CanvasBackground, CanvasConfig } from '../../types';
import {
  exportToPng,
  buildCanvasSvgString,
  triggerDownload,
  copyImageToClipboard,
  getLayerCssCode,
} from '../../utils/exportUtils';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: TextLayer[];
  background: CanvasBackground;
  canvasConfig: CanvasConfig;
  activeLayer: TextLayer | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  layers,
  background,
  canvasConfig,
  activeLayer,
}) => {
  const [scale, setScale] = useState<number>(2);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  if (!isOpen) return null;

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const exportWidth = canvasConfig.width * scale;
  const exportHeight = canvasConfig.height * scale;

  // Handle PNG download
  const handleDownloadPng = async (transparent = false) => {
    setIsExporting(true);
    try {
      const blob = await exportToPng(layers, background, canvasConfig, scale, transparent);
      const filename = `fontforge_${transparent ? 'transparent_' : ''}${Date.now()}.png`;
      triggerDownload(blob, filename);
      showStatus(
        `Successfully exported ${exportWidth}×${exportHeight}px PNG!`
      );
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || 'Failed to generate PNG image.';
      showStatus(msg, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle SVG download
  const handleDownloadSvg = () => {
    try {
      const svgStr = buildCanvasSvgString(layers, background, canvasConfig, false);
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      triggerDownload(blob, `fontforge_${Date.now()}.svg`);
      showStatus('Successfully exported vector SVG!');
    } catch (err) {
      console.error(err);
      showStatus('Failed to generate SVG.', 'error');
    }
  };

  // Handle Copy Image
  const handleCopyImage = async (transparent = false) => {
    setIsExporting(true);
    try {
      const success = await copyImageToClipboard(layers, background, canvasConfig, transparent);
      if (success) {
        showStatus('Image copied to clipboard!');
      } else {
        showStatus('Clipboard copying not supported by browser.', 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('Failed to copy image to clipboard.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Copy CSS
  const handleCopyCss = async () => {
    if (!activeLayer) return;
    try {
      const css = getLayerCssCode(activeLayer);
      await navigator.clipboard.writeText(css);
      showStatus('Layer CSS copied to clipboard!');
    } catch {
      showStatus('Failed to copy CSS.', 'error');
    }
  };

  // Handle Copy Plain Text
  const handleCopyText = async () => {
    const textContent = layers.map((l) => l.text).join('\n');
    try {
      await navigator.clipboard.writeText(textContent);
      showStatus('Plain text copied to clipboard!');
    } catch {
      showStatus('Failed to copy text.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export & Download</h3>
              <p className="text-xs text-neutral-400">
                High-resolution image rendering and formatted code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {statusMessage && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Scale Resolution Factor */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-300">Resolution Scale</span>
              <span className="font-mono text-amber-300 text-[11px]">
                {exportWidth} × {exportHeight} px
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { scale: 1, label: '1x Standard', desc: 'Web fast' },
                { scale: 2, label: '2x High-Res', desc: 'Retina crisp' },
                { scale: 3, label: '3x Ultra HD', desc: 'Print 300DPI' },
              ].map((opt) => (
                <button
                  key={opt.scale}
                  onClick={() => setScale(opt.scale)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    scale === opt.scale
                      ? 'bg-amber-400/15 border-amber-400/70 text-white shadow-sm'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-neutral-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Download Options */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-neutral-300">Image Downloads</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownloadPng(false)}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-md"
              >
                <FileImage className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={() => handleDownloadPng(true)}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs border border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Transparent PNG</span>
              </button>

              <button
                onClick={handleDownloadSvg}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-medium text-xs border border-neutral-800 transition-colors cursor-pointer col-span-2"
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Download Vector SVG</span>
              </button>
            </div>
          </div>

          {/* Clipboard & Code Copy */}
          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800">
            <span className="text-xs font-semibold text-neutral-300">Copy & Share</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCopyImage(false)}
                disabled={isExporting}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-800 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </button>

              <button
                onClick={handleCopyCss}
                disabled={!activeLayer}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-800 transition-colors cursor-pointer disabled:opacity-40"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Copy CSS</span>
              </button>

              <button
                onClick={handleCopyText}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-800 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
