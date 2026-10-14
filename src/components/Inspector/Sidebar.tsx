import React from 'react';
import {
  Type,
  Palette,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Compass,
  Sliders,
} from 'lucide-react';
import { TextLayer, CanvasBackground, CanvasConfig, TextPreset } from '../../types';
import { TypographyPanel } from './TypographyPanel';
import { FontPicker } from './FontPicker';
import { ColorPanel } from './ColorPanel';
import { EffectsPanel } from './EffectsPanel';
import { BackgroundPanel } from './BackgroundPanel';
import { PresetsPanel } from './PresetsPanel';
import { LayersPanel } from './LayersPanel';

export type ActiveSidebarTab =
  | 'text'
  | 'font'
  | 'color'
  | 'effects'
  | 'presets'
  | 'background'
  | 'layers';

export interface SidebarProps {
  activeTab: ActiveSidebarTab;
  onChangeTab: (tab: ActiveSidebarTab) => void;
  activeLayer: TextLayer | null;
  onUpdateActiveLayer: (updates: Partial<TextLayer>) => void;
  layers: TextLayer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onAddLayer: () => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onReorderLayer: (id: string, dir: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onRenameLayer: (id: string, name: string) => void;
  onCenterLayer: (id: string, axis: 'x' | 'y' | 'both') => void;
  background: CanvasBackground;
  onChangeBackground: (bg: CanvasBackground) => void;
  canvasConfig: CanvasConfig;
  onChangeCanvasConfig: (config: Partial<CanvasConfig>) => void;
  onApplyPreset: (preset: TextPreset) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onChangeTab,
  activeLayer,
  onUpdateActiveLayer,
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onReorderLayer,
  onToggleVisibility,
  onToggleLock,
  onRenameLayer,
  onCenterLayer,
  background,
  onChangeBackground,
  canvasConfig,
  onChangeCanvasConfig,
  onApplyPreset,
}) => {
  const tabs = [
    { id: 'text' as const, label: 'Typography', icon: Type },
    { id: 'font' as const, label: 'Fonts', icon: Sliders },
    { id: 'color' as const, label: 'Color', icon: Palette },
    { id: 'effects' as const, label: 'Effects', icon: Sparkles },
    { id: 'presets' as const, label: 'Presets', icon: Compass },
    { id: 'background' as const, label: 'Canvas', icon: ImageIcon },
    { id: 'layers' as const, label: 'Layers', icon: Layers },
  ];

  return (
    <aside className="w-80 md:w-96 h-full flex flex-col bg-neutral-950 border-l border-neutral-800 z-20 shrink-0 select-none">
      {/* Tab Navigation Strip */}
      <div className="flex items-center border-b border-neutral-800 bg-neutral-900/40 px-2 py-1.5 overflow-x-auto scrollbar-none gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Panel Content Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'text' && (
          activeLayer ? (
            <TypographyPanel layer={activeLayer} onUpdateLayer={onUpdateActiveLayer} />
          ) : (
            <div className="text-neutral-500 text-xs py-8 text-center">No active layer selected</div>
          )
        )}

        {activeTab === 'font' && (
          activeLayer ? (
            <FontPicker
              currentFont={activeLayer.fontFamily}
              onSelectFont={(font) =>
                onUpdateActiveLayer({
                  fontFamily: font.name,
                  fontCategory: font.category,
                })
              }
            />
          ) : (
            <div className="text-neutral-500 text-xs py-8 text-center">No active layer selected</div>
          )
        )}

        {activeTab === 'color' && (
          activeLayer ? (
            <ColorPanel
              colorMode={activeLayer.colorMode}
              solidColor={activeLayer.solidColor}
              gradient={activeLayer.gradient}
              onChangeColorMode={(mode) => onUpdateActiveLayer({ colorMode: mode })}
              onChangeSolidColor={(solidColor) => onUpdateActiveLayer({ solidColor })}
              onChangeGradient={(gradient) => onUpdateActiveLayer({ gradient })}
            />
          ) : (
            <div className="text-neutral-500 text-xs py-8 text-center">No active layer selected</div>
          )
        )}

        {activeTab === 'effects' && (
          activeLayer ? (
            <EffectsPanel
              shadow={activeLayer.shadow}
              stroke={activeLayer.stroke}
              specialEffect={activeLayer.specialEffect}
              specialEffectSettings={activeLayer.specialEffectSettings}
              onChangeShadow={(shadow) => onUpdateActiveLayer({ shadow })}
              onChangeStroke={(stroke) => onUpdateActiveLayer({ stroke })}
              onChangeSpecialEffect={(specialEffect) => onUpdateActiveLayer({ specialEffect })}
              onChangeSpecialEffectSettings={(specialEffectSettings) =>
                onUpdateActiveLayer({ specialEffectSettings })
              }
            />
          ) : (
            <div className="text-neutral-500 text-xs py-8 text-center">No active layer selected</div>
          )
        )}

        {activeTab === 'presets' && activeLayer && (
          <PresetsPanel
            onApplyPreset={onApplyPreset}
            activeLayer={activeLayer}
            background={background}
          />
        )}

        {activeTab === 'background' && (
          <BackgroundPanel
            background={background}
            onChangeBackground={onChangeBackground}
            canvas={canvasConfig}
            onChangeCanvas={onChangeCanvasConfig}
          />
        )}

        {activeTab === 'layers' && (
          <LayersPanel
            layers={layers}
            activeLayerId={activeLayerId || layers[0]?.id || ''}
            onSelectLayer={onSelectLayer}
            onAddLayer={onAddLayer}
            onDuplicateLayer={onDuplicateLayer}
            onDeleteLayer={onDeleteLayer}
            onUpdateLayer={(id, updates) => {
              if (id === activeLayerId) onUpdateActiveLayer(updates);
            }}
            onReorderLayer={onReorderLayer}
          />
        )}
      </div>
    </aside>
  );
};
