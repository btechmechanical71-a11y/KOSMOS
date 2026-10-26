import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Boxes, 
  ArrowRight, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  Flame, 
  Activity, 
  Check
} from 'lucide-react';
import { IsroLogo } from './IsroLogo';
import { soundEffects } from '../utils/audio';

export type ManufacturingDomain = 
  | 'zblan-optical-fiber'
  | 'semiconductor-wafers'
  | 'pharma-crystals'
  | 'specialty-alloys';

interface OpeningDomainModalProps {
  isOpen: boolean;
  onSelectSemiconductor: () => void;
}

export const OpeningDomainModal: React.FC<OpeningDomainModalProps> = ({
  isOpen,
  onSelectSemiconductor
}) => {
  const [selectedPreview, setSelectedPreview] = useState<ManufacturingDomain | null>(null);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCardClick = (domain: ManufacturingDomain) => {
    setSelectedPreview(domain);
    if (domain === 'semiconductor-wafers') {
      soundEffects.playSuccessChime();
    } else {
      soundEffects.playStepPulse();
    }
  };

  const handleLaunchSemiconductor = () => {
    setIsLaunching(true);
    soundEffects.playScanChime();
    setTimeout(() => {
      onSelectSemiconductor();
      setIsLaunching(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#080F1E]/90 backdrop-blur-xl overflow-y-auto">
      
      {/* Background ambient cosmic glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3973FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-6xl rounded-3xl bg-[#111C30] border border-[#26364D] shadow-2xl p-5 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#26364D] pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#080F1E] border border-[#26364D] p-1 flex items-center justify-center">
                <IsroLogo size={32} />
              </div>
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-medium text-[#A7B4C8] border border-[#26364D] bg-[#080F1E] tracking-wider">
                KOSMOS · AUTONOMOUS ORBITAL FOUNDRY
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              Select In-Space Manufacturing Domain
            </h1>
            <p className="text-xs sm:text-sm text-[#A7B4C8]">
              Autonomous Microgravity Engineering for Advanced Space Synthesis &amp; Circular Recovery
            </p>
          </div>
        </div>

        {/* 4 Interactive Option Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* OPTION 1: ZBLAN Optical Fiber */}
          <div
            onClick={() => handleCardClick('zblan-optical-fiber')}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              selectedPreview === 'zblan-optical-fiber'
                ? 'bg-[#15233C] border-[#3973FF] shadow-lg shadow-black/40 ring-1 ring-[#3973FF]'
                : 'bg-[#0C1628] hover:bg-[#132036] border-[#26364D] hover:border-[#3973FF]/60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#111C30] border border-[#26364D] flex items-center justify-center text-[#3973FF] shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#111C30] text-[#A7B4C8] border border-[#26364D] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> TRL-6 QUEUED
                </span>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#F8FAFC] group-hover:text-white transition">
                  ZBLAN Optical Fiber
                </h3>
                <p className="text-[11px] text-[#A7B4C8] font-mono mt-0.5">
                  Microgravity Fluoride Glass Draw
                </p>
              </div>

              <p className="text-xs text-[#A7B4C8] leading-relaxed">
                Heavy-metal fluoride glass (ZrF₄-BaF₂-LaF₃-AlF₃-NaF) manufactured in microgravity eliminates convective micro-crystallization, yielding 10–100× lower attenuation than terrestrial silica.
              </p>

              <div className="pt-2 border-t border-[#26364D] space-y-1 text-[11px] font-mono text-[#A7B4C8]">
                <div className="flex justify-between">
                  <span>Core Material:</span>
                  <span className="text-[#F8FAFC]">Zirconium Fluoride</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Loss:</span>
                  <span className="text-[#F8FAFC]">0.001 dB/km</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-[#3973FF] font-medium">Qualification Bay</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#26364D] flex items-center justify-between text-xs font-mono">
              <span className="text-[#A7B4C8] text-[10px]">Module Standby</span>
              <span className="text-[#3973FF] text-xs flex items-center gap-1">
                Preview Info
              </span>
            </div>
          </div>

          {/* OPTION 2: Semiconductor Wafers (PRIMARY ACTIVE OPTION) */}
          <div
            id="domain-card-semiconductor"
            onClick={handleLaunchSemiconductor}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:border-[#00D9FF] active:scale-[0.99] ${
              selectedPreview === 'semiconductor-wafers' || !selectedPreview
                ? 'bg-[#12223B] border-[#00D9FF] shadow-xl shadow-[#00D9FF]/10 ring-2 ring-[#00D9FF]/60 scale-[1.02]'
                : 'bg-[#0C1628] hover:bg-[#132036] border-[#26364D]'
            }`}
            title="Click anywhere to launch the Semiconductor Wafers console"
          >
            {/* Glow Pill */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#00D9FF] text-[#080F1E] font-mono text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#00D9FF]/30 flex items-center gap-1.5">
              {isLaunching ? (
                <>
                  <Sparkles className="w-3 h-3 animate-spin" />
                  INITIALIZING CONSOLE...
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  OPERATIONAL FLIGHT CONSOLE
                </>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#080F1E] border border-[#00D9FF]/50 flex items-center justify-center text-[#00D9FF] shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#00D9FF]" /> TRL-9 ACTIVE
                </span>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#F8FAFC] group-hover:text-white transition">
                  Semiconductor Wafers
                </h3>
                <p className="text-[11px] text-[#00D9FF] font-mono mt-0.5">
                  GaN / SiC In-Space Epitaxial Synthesis
                </p>
              </div>

              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Zero-gravity MOCVD wafer growth utilizing <strong className="text-white">HAP-NRIP</strong> zero-reaction isolation, <strong className="text-white">AERCS-GaN</strong> electrostatic containment, and <strong className="text-white">AATM-X</strong> thermal stabilization for ultra-high purity crystals.
              </p>

              <div className="pt-2 border-t border-[#26364D] space-y-1 text-[11px] font-mono text-[#A7B4C8]">
                <div className="flex justify-between">
                  <span>Growth Temp:</span>
                  <span className="text-[#F8FAFC] font-semibold">800°C – 1100°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Isolation Stage:</span>
                  <span className="text-[#00D9FF] font-semibold">6-DOF Active + QZS</span>
                </div>
                <div className="flex justify-between">
                  <span>Flight Status:</span>
                  <span className="text-emerald-400 font-bold">LAUNCH READY</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#26364D] flex items-center justify-between text-xs font-mono">
              <span className="text-[#00D9FF] text-[10px] font-semibold">Ready to Run</span>
              <span className="text-[#00D9FF] font-bold text-xs flex items-center gap-1">
                Enter Console →
              </span>
            </div>
          </div>

          {/* OPTION 3: Pharma Crystals */}
          <div
            onClick={() => handleCardClick('pharma-crystals')}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              selectedPreview === 'pharma-crystals'
                ? 'bg-[#15233C] border-[#3973FF] shadow-lg shadow-black/40 ring-1 ring-[#3973FF]'
                : 'bg-[#0C1628] hover:bg-[#132036] border-[#26364D] hover:border-[#3973FF]/60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#111C30] border border-[#26364D] flex items-center justify-center text-[#3973FF] shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#111C30] text-[#A7B4C8] border border-[#26364D] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> TRL-5 QUEUED
                </span>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#F8FAFC] group-hover:text-white transition">
                  Pharma Crystals
                </h3>
                <p className="text-[11px] text-[#A7B4C8] font-mono mt-0.5">
                  Macromolecular Protein Crystallography
                </p>
              </div>

              <p className="text-xs text-[#A7B4C8] leading-relaxed">
                Absence of buoyancy-driven convection and sedimentation allows proteins and antibodies to grow with exceptional crystalline order for high-precision drug design and room-temperature suspensions.
              </p>

              <div className="pt-2 border-t border-[#26364D] space-y-1 text-[11px] font-mono text-[#A7B4C8]">
                <div className="flex justify-between">
                  <span>Target Class:</span>
                  <span className="text-[#F8FAFC]">Monoclonal Antibodies</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth Method:</span>
                  <span className="text-[#F8FAFC]">Vapor Diffusion &amp; Dialysis</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-[#3973FF] font-medium">Station Flight Slot 2</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#26364D] flex items-center justify-between text-xs font-mono">
              <span className="text-[#A7B4C8] text-[10px]">Module Standby</span>
              <span className="text-[#3973FF] text-xs flex items-center gap-1">
                Preview Info
              </span>
            </div>
          </div>

          {/* OPTION 4: Specialty Alloys */}
          <div
            onClick={() => handleCardClick('specialty-alloys')}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              selectedPreview === 'specialty-alloys'
                ? 'bg-[#15233C] border-[#3973FF] shadow-lg shadow-black/40 ring-1 ring-[#3973FF]'
                : 'bg-[#0C1628] hover:bg-[#132036] border-[#26364D] hover:border-[#3973FF]/60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#111C30] border border-[#26364D] flex items-center justify-center text-[#3973FF] shadow-sm">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#111C30] text-[#A7B4C8] border border-[#26364D] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> TRL-5 QUEUED
                </span>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#F8FAFC] group-hover:text-white transition">
                  Specialty Alloys
                </h3>
                <p className="text-[11px] text-[#A7B4C8] font-mono mt-0.5">
                  Containerless Levitation &amp; Glass Metals
                </p>
              </div>

              <p className="text-xs text-[#A7B4C8] leading-relaxed">
                Containerless acoustic and electrostatic levitation furnaces melt high-temperature immiscible metals without crucible contamination, producing bulk metallic glasses and high-entropy superalloys.
              </p>

              <div className="pt-2 border-t border-[#26364D] space-y-1 text-[11px] font-mono text-[#A7B4C8]">
                <div className="flex justify-between">
                  <span>Core Tech:</span>
                  <span className="text-[#F8FAFC]">Electrostatic Levitation</span>
                </div>
                <div className="flex justify-between">
                  <span>Alloy Class:</span>
                  <span className="text-[#F8FAFC]">High-Entropy Superalloys</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-[#3973FF] font-medium">Ground Chamber Test</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#26364D] flex items-center justify-between text-xs font-mono">
              <span className="text-[#A7B4C8] text-[10px]">Module Standby</span>
              <span className="text-[#3973FF] text-xs flex items-center gap-1">
                Preview Info
              </span>
            </div>
          </div>

        </div>

        {/* Dynamic Context Panel if a non-semiconductor card is selected */}
        {selectedPreview && selectedPreview !== 'semiconductor-wafers' && (
          <div className="p-4 rounded-2xl bg-[#0C1628] border border-[#26364D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#00D9FF] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F8FAFC] block font-bold">
                  {selectedPreview === 'zblan-optical-fiber' && 'ZBLAN Optical Fiber Bay: Pre-Flight Technology Demonstration Phase'}
                  {selectedPreview === 'pharma-crystals' && 'Pharma Crystals Rig: Microgravity Crystallization Formulation Bay'}
                  {selectedPreview === 'specialty-alloys' && 'Specialty Alloys Bay: Levitation Metallurgy Crucibleless Furnace'}
                </strong>
                <p className="text-[#A7B4C8] text-[11px] mt-0.5">
                  This domain module is scheduled for future station payloads. The operational flight console is currently active and deployed for <strong className="text-[#00D9FF]">Semiconductor Wafers (GaN/SiC)</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={handleLaunchSemiconductor}
              className="px-4 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#25e0ff] text-[#080F1E] font-bold transition flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-[#00D9FF]/20"
            >
              <span>Launch Semiconductor Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
