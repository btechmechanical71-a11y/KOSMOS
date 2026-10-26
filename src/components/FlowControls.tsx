import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  SlidersHorizontal,
  Layers,
  Activity,
  Check
} from 'lucide-react';
import { WORKFLOW_STAGES } from '../data/workflowStages';
import { FlowType } from '../types';

interface FlowControlsProps {
  activeStageId: number;
  onSelectStage: (id: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevStage: () => void;
  onNextStage: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  visibleFlows: Record<FlowType, boolean>;
  onToggleFlow: (flow: FlowType) => void;
}

export const FlowControls: React.FC<FlowControlsProps> = ({
  activeStageId,
  onSelectStage,
  isPlaying,
  onTogglePlay,
  onPrevStage,
  onNextStage,
  speed,
  onChangeSpeed,
  visibleFlows,
  onToggleFlow
}) => {
  return (
    <div className="bg-[#0B1424] border-b border-[#26364D] px-4 py-2 transition-colors">
      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Step Scrubber / Stage buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
          <button
            id="prev-stage-btn"
            onClick={onPrevStage}
            className="p-1.5 rounded-lg bg-[#111C30] hover:bg-[#16243D] border border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] transition cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {WORKFLOW_STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                id={`stage-nav-btn-${stage.id}`}
                onClick={() => onSelectStage(stage.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#3973FF] text-[#F8FAFC] shadow-md shadow-[#3973FF]/30 ring-1 ring-[#00D9FF]'
                    : 'bg-[#111C30] hover:bg-[#16243D] text-[#A7B4C8] hover:text-[#F8FAFC] border border-[#26364D]'
                }`}
              >
                <span 
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                    isActive 
                      ? 'bg-[#00D9FF] text-[#080F1E]' 
                      : 'bg-[#1C2C42] text-[#CBD5E1] border border-[#26364D]'
                  }`}
                >
                  {stage.id}
                </span>
                <span className="hidden md:inline font-sans font-medium">{stage.shortName}</span>
                <span className="md:hidden">Step {stage.id}</span>
              </button>
            );
          })}

          <button
            id="next-stage-btn"
            onClick={onNextStage}
            className="p-1.5 rounded-lg bg-[#111C30] hover:bg-[#16243D] border border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] transition cursor-pointer"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Flow layer toggles */}
        <div className="flex items-center gap-1 shrink-0 self-end lg:self-auto text-[11px] font-mono">
          <span className="text-[#A7B4C8] text-[10px] uppercase mr-1">Flows:</span>
          
          <button
            onClick={() => onToggleFlow('product')}
            className={`px-2 py-0.5 rounded border transition cursor-pointer ${
              visibleFlows.product
                ? 'bg-[#00D9FF]/15 border-[#00D9FF]/50 text-[#00D9FF]'
                : 'bg-[#111C30] border-[#26364D] text-[#A7B4C8]'
            }`}
            title="Toggle Product Flow"
          >
            Product
          </button>

          <button
            onClick={() => onToggleFlow('material')}
            className={`px-2 py-0.5 rounded border transition cursor-pointer ${
              visibleFlows.material
                ? 'bg-[#3973FF]/20 border-[#3973FF]/50 text-[#82a8ff]'
                : 'bg-[#111C30] border-[#26364D] text-[#A7B4C8]'
            }`}
            title="Toggle Material & Scrap Flow"
          >
            Material
          </button>

          <button
            onClick={() => onToggleFlow('data')}
            className={`px-2 py-0.5 rounded border transition cursor-pointer ${
              visibleFlows.data
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-[#111C30] border-[#26364D] text-[#A7B4C8]'
            }`}
            title="Toggle Telemetry Data Flow"
          >
            Data
          </button>
        </div>

      </div>
    </div>
  );
};
