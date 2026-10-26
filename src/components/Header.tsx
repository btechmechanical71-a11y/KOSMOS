import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Zap, 
  ShieldCheck, 
  Info,
  Layers,
  Atom,
  Disc,
  ThermometerSnowflake,
  Boxes
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onLaunchCycle: () => void;
  activeStageId: number;
  totalPowerW: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenInfo: () => void;
  onOpenDomainModal?: () => void;
  currentSection?: 'workflow' | 'hap-nrip' | 'aercs-gan' | 'aatm-x' | 'references';
  onChangeSection?: (section: 'workflow' | 'hap-nrip' | 'aercs-gan' | 'aatm-x' | 'references') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  onLaunchCycle,
  activeStageId,
  totalPowerW,
  soundEnabled,
  onToggleSound,
  onOpenInfo,
  onOpenDomainModal,
  currentSection = 'workflow',
  onChangeSection
}) => {
  return (
    <header className="border-b border-[#26364D] bg-[#111C30]/95 backdrop-blur-md px-4 py-2.5 sticky top-0 z-40 transition-colors">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-3">
        
        {/* Telemetry quick badges & Controls */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Brand + Domain Selector + Section Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* KOSMOS Brand Identifier */}
            <div className="flex items-center gap-2 pr-1 border-r border-[#26364D]/80">
              <span className="font-heading font-bold text-base tracking-tight text-[#F8FAFC]">
                KOSMOS
              </span>
            </div>

            {/* Manufacturing Domain Switcher Button */}
            {onOpenDomainModal && (
              <button
                id="domain-select-btn"
                onClick={onOpenDomainModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C1628] hover:bg-[#16243D] border border-[#26364D] hover:border-[#3973FF]/60 text-[#A7B4C8] hover:text-[#F8FAFC] text-xs font-mono font-medium transition cursor-pointer group shadow-sm"
                title="Select Manufacturing Domain (ZBLAN, Semiconductor, Pharma, Alloys)"
              >
                <Boxes className="w-3.5 h-3.5 text-[#00D9FF] group-hover:rotate-12 transition-transform" />
                <span className="text-[#A7B4C8] font-normal hidden sm:inline">DOMAIN:</span>
                <span className="text-[#F8FAFC] font-semibold">Semiconductor Wafers</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30">
                  ACTIVE
                </span>
              </button>
            )}

            {/* Primary Section Switcher */}
            {onChangeSection && (
              <div className="flex items-center p-1 rounded-xl bg-[#080F1E] border border-[#26364D] font-mono text-xs">
                <button
                  id="tab-workflow-btn"
                  onClick={() => {
                    onChangeSection('workflow');
                    soundEffects.playStepPulse();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    currentSection === 'workflow'
                      ? 'bg-[#3973FF] text-[#F8FAFC] shadow-md shadow-[#3973FF]/30 font-semibold'
                      : 'text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>Circular Lifecycle (8 Stages)</span>
                </button>

                <button
                  id="tab-hap-nrip-btn"
                  onClick={() => {
                    onChangeSection('hap-nrip');
                    soundEffects.playScanChime();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    currentSection === 'hap-nrip'
                      ? 'bg-[#3973FF] text-[#F8FAFC] shadow-md shadow-[#3973FF]/30 font-semibold ring-1 ring-[#00D9FF]/40'
                      : 'text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30]'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>HAP-NRIP Platform</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#111C30] text-[#A7B4C8] border border-[#26364D] font-mono">
                    GaN MOCVD
                  </span>
                </button>

                <button
                  id="tab-aercs-btn"
                  onClick={() => {
                    onChangeSection('aercs-gan');
                    soundEffects.playSuccessChime();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    currentSection === 'aercs-gan'
                      ? 'bg-[#3973FF] text-[#F8FAFC] shadow-md shadow-[#3973FF]/30 font-semibold ring-1 ring-[#00D9FF]/40'
                      : 'text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30]'
                  }`}
                >
                  <Disc className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>AERCS-GaN</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#111C30] text-[#A7B4C8] border border-[#26364D] font-mono">
                    Containment &amp; Recovery
                  </span>
                </button>

                <button
                  id="tab-aatm-btn"
                  onClick={() => {
                    onChangeSection('aatm-x');
                    soundEffects.playStepPulse();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    currentSection === 'aatm-x'
                      ? 'bg-[#3973FF] text-[#F8FAFC] shadow-md shadow-[#3973FF]/30 font-semibold ring-1 ring-[#00D9FF]/40'
                      : 'text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30]'
                  }`}
                >
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>AATM-X</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#111C30] text-[#A7B4C8] border border-[#26364D] font-mono">
                    Thermal Mgmt
                  </span>
                </button>

              </div>
            )}
          </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {currentSection === 'workflow' && (
                <button
                  id="cycle-launcher-btn"
                  onClick={onLaunchCycle}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00D9FF] hover:bg-[#28e0ff] text-[#080F1E] text-xs font-semibold shadow-md shadow-[#00D9FF]/20 transition active:scale-95 cursor-pointer font-sans"
                  title="Simulate a manufactured space asset traveling through all 8 stages"
                >
                  <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Simulate Part Cycle</span>
                </button>
              )}

              {currentSection !== 'workflow' && (
                <button
                  onClick={() => onChangeSection && onChangeSection('workflow')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16243D] hover:bg-[#1F314D] border border-[#26364D] text-[#F8FAFC] text-xs font-mono font-medium transition cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>Return to Circular Stages</span>
                </button>
              )}

              {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                soundEnabled 
                  ? 'bg-[#00D9FF]/15 border-[#00D9FF]/40 text-[#00D9FF]' 
                  : 'bg-[#0C1628] border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC]'
              }`}
              title={soundEnabled ? 'Mute Audio Effects' : 'Enable Synthesized Audio Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

          </div>

        </div>

      </div>
    </header>
  );
};
