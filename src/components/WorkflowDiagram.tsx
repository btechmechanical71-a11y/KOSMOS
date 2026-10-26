import React from 'react';
import { motion } from 'motion/react';
import { 
  Printer, 
  Bot, 
  Wind, 
  Layers, 
  RefreshCw, 
  Archive, 
  Trash2, 
  Cpu,
  ChevronRight,
  Activity,
  ArrowRight
} from 'lucide-react';
import { WorkflowStageData, FlowType } from '../types';
import { StageGraphic } from './StageGraphic';

interface WorkflowDiagramProps {
  stages: WorkflowStageData[];
  activeStageId: number;
  onSelectStage: (id: number) => void;
  visibleFlows: Record<FlowType, boolean>;
  cycleActive: boolean;
  cycleStageId: number;
}

const ICONS_MAP: Record<string, React.ElementType> = {
  Printer,
  Bot,
  Wind,
  Layers,
  RefreshCw,
  Archive,
  Trash2,
  Cpu
};

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({
  stages,
  activeStageId,
  onSelectStage,
  visibleFlows,
  cycleActive,
  cycleStageId
}) => {
  return (
    <div className="relative w-full py-4 px-2 sm:px-4">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP PIPELINE STATUS BAR                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between pb-3 px-1 text-xs font-mono text-[#A7B4C8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
          <span className="font-heading font-medium tracking-wide text-[#F8FAFC]">
            8-STAGE IN-ORBIT CLOSED-LOOP MANUFACTURING PIPELINE
          </span>
          <span className="text-[#A7B4C8] hidden sm:inline">•</span>
          <span className="text-[#A7B4C8] hidden sm:inline">Active: Module 0{activeStageId}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="hidden md:inline text-[#A7B4C8]">Circular Recovery:</span>
          <span className="px-2 py-0.5 rounded bg-[#111C30] border border-[#26364D] text-[#00D9FF] font-semibold">
            100% RECOVERY RATE
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 8-STAGE HORIZONTAL GRID                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8 gap-3.5">
        {stages.map((stage) => {
          const isSelected = stage.id === activeStageId;
          const isCycleCurrent = cycleActive && stage.id === cycleStageId;
          const IconComp = ICONS_MAP[stage.iconName] || Layers;

          return (
            <motion.div
              key={stage.id}
              id={`stage-card-${stage.id}`}
              onClick={() => onSelectStage(stage.id)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18 }}
              className={`relative flex flex-col justify-between rounded-xl bg-[#111C30] border transition-all cursor-pointer shadow-lg overflow-hidden group ${
                isCycleCurrent
                  ? 'border-[#00D9FF] ring-2 ring-[#00D9FF] shadow-[#00D9FF]/20'
                  : isSelected
                  ? 'border-[#00D9FF] ring-1 ring-[#00D9FF] shadow-lg shadow-[#00D9FF]/10 bg-[#142138]'
                  : 'border-[#26364D] hover:border-[#3973FF]/70 hover:bg-[#142138]'
              }`}
            >
              {/* Top Banner with Number Badge & Title */}
              <div className={`px-3 py-2.5 border-b flex items-center justify-between gap-2 transition ${
                isSelected 
                  ? 'bg-[#16263F] border-[#00D9FF]/40' 
                  : 'bg-[#0C1628] border-[#26364D]'
              }`}>
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 transition ${
                      isSelected 
                        ? 'bg-[#00D9FF] text-[#080F1E] shadow-sm' 
                        : 'bg-[#1C2C42] text-[#F8FAFC] border border-[#26364D]'
                    }`}
                  >
                    {stage.id}
                  </div>
                  <h3 className="font-heading text-xs font-semibold text-[#F8FAFC] tracking-tight leading-snug line-clamp-2">
                    {stage.name}
                  </h3>
                </div>

                <IconComp className={`w-3.5 h-3.5 shrink-0 transition ${
                  isSelected ? 'text-[#00D9FF]' : 'text-[#A7B4C8] group-hover:text-[#F8FAFC]'
                }`} />
              </div>

              {/* Animated Machine Graphic */}
              <div className="p-2.5 flex-1 flex flex-col justify-center bg-[#080F1E]/40">
                <StageGraphic 
                  stageId={stage.id} 
                  isActive={isSelected || isCycleCurrent} 
                />
              </div>

              {/* Bottom Summary Callout */}
              <div className="px-3 py-2 text-[10px] font-mono leading-relaxed border-t border-[#26364D] bg-[#0B1424] text-[#A7B4C8]">
                <div className="flex items-center justify-between pb-1 border-b border-[#26364D]/60 mb-1 text-[9px]">
                  <span className="text-[#A7B4C8] uppercase tracking-wider">{stage.shortName}</span>
                  <span className={`font-semibold ${isSelected ? 'text-[#00D9FF]' : 'text-emerald-400'}`}>
                    {isSelected ? 'ACTIVE NODE' : 'NOMINAL'}
                  </span>
                </div>
                <p className="line-clamp-2 text-slate-300">
                  {stage.summary}
                </p>
              </div>

              {/* Active Cycle Indicator overlay pill */}
              {isCycleCurrent && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#00D9FF] text-[#080F1E] font-mono font-bold text-[9px] uppercase tracking-wider shadow-md animate-bounce">
                  PROCESSING
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
