import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  RotateCw, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Layers,
  Leaf
} from 'lucide-react';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080F1E]/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111C30] border border-[#26364D] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-[#26364D] flex items-center justify-between sticky top-0 bg-[#111C30]/95 backdrop-blur z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] font-heading tracking-wide">
                ASTRAFORGE ICMC-CRS Architecture
              </h3>
              <p className="text-xs text-[#A7B4C8]">
                Intelligent Contained Manufacturing and Circular Recovery System
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0C1628] hover:bg-[#1E2D48] text-[#A7B4C8] hover:text-[#F8FAFC] border border-[#26364D] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-[#A7B4C8] leading-relaxed">
          
          <div className="p-4 rounded-xl bg-[#0C1628] border border-[#3973FF]/40 text-[#F8FAFC]">
            <h4 className="font-bold font-heading text-sm text-[#00D9FF] mb-1.5 tracking-wide">
              "Sustainable Manufacturing in Space for a Better Tomorrow"
            </h4>
            <p className="text-[#A7B4C8] text-xs leading-relaxed">
              The ICMC-CRS architecture eliminates space debris at the point of origin while establishing an autonomous, closed-loop circular economy for orbital platforms, lunar bases, and deep space exploration vessels.
            </p>
          </div>

          <div>
            <h4 className="font-bold font-heading text-[#F8FAFC] text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />
              Core Engineering Pillars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D]">
                <span className="font-bold text-[#00D9FF] font-heading block mb-1">1. Zero-Debris Containment</span>
                <span className="text-[#A7B4C8] text-[11px] leading-relaxed">
                  Hermetically isolated manufacturing zones with high-velocity localized vacuum suction nozzles capture airborne chips before they escape into microgravity habitats.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D]">
                <span className="font-bold text-amber-400 font-heading block mb-1">2. AI-Powered NIR Sorting</span>
                <span className="text-[#A7B4C8] text-[11px] leading-relaxed">
                  Real-time near-infrared spectroscopy and magnetic sensors classify aluminum, titanium, PEEK, and composites, routing them directly into designated recycling channels.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D]">
                <span className="font-bold text-emerald-400 font-heading block mb-1">3. In-Situ Feedstock Regeneration</span>
                <span className="text-[#A7B4C8] text-[11px] leading-relaxed">
                  Induction furnaces melt metal scraps into atomized powder and ingots, while polymer extruders convert chips into high-precision 1.75mm spools with 98%+ circular efficiency.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D]">
                <span className="font-bold text-[#3973FF] font-heading block mb-1">4. Supervisory Safety Protocol</span>
                <span className="text-[#A7B4C8] text-[11px] leading-relaxed">
                  Power-aware scheduling enforces a ≤150 W peak power ceiling across active modules with automated fault isolation and spacecraft telemetry integration.
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D] font-mono text-[11px] text-[#A7B4C8] space-y-1.5">
            <div className="text-[#F8FAFC] font-heading font-semibold tracking-wide mb-1">Operational Flow Types:</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
              <span className="text-[#00D9FF] font-medium">Product Flow:</span> 
              <span>Finished space assets safely transferred from Zone 1 to Zone 6</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-400 font-medium">Material/Debris Flow:</span> 
              <span>Continuous recycling path (1 → 3 → 4 → 5 → 6/7)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-medium">Data Flow:</span> 
              <span>34+ sensor channels reporting live status to central supervisor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-rose-400 font-medium">Control Signals:</span> 
              <span>Deterministic actuation commands and safety interlocks</span>
            </div>
          </div>

          {/* HAP-NRIP Zero-Reaction Section Overview */}
          <div className="p-4 rounded-xl bg-[#0C1628] border border-[#3973FF]/40 text-[#F8FAFC]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <h4 className="font-bold font-heading text-sm text-[#F8FAFC]">
                HAP-NRIP: Near-Zero-Reaction GaN MOCVD Platform
              </h4>
            </div>
            <p className="text-[#A7B4C8] text-xs leading-relaxed">
              Hybrid Adaptive Predictive Near-Zero-Reaction Isolation Platform provides dual-stage passive QZS (0.1–10 Hz) and active 6-DOF electromagnetic isolation (1–100 Hz), preventing momentum transfer to the spacecraft during high-temperature (800–1100°C) semiconductor wafer synthesis.
            </p>
          </div>

          {/* AERCS-GaN Robotic Containment & Recovery Overview */}
          <div className="p-4 rounded-xl bg-[#0C1628] border border-[#00D9FF]/30 text-[#F8FAFC]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <h4 className="font-bold font-heading text-sm text-[#F8FAFC]">
                AERCS-GaN: Autonomous Electrostatic Robotic Containment & Recovery
              </h4>
            </div>
            <p className="text-[#A7B4C8] text-xs leading-relaxed">
              Dual-path space-based manufacturing containment: Path A handles clean wafer extraction via conductive ceramic robotic pick-up and N₂-purged hermetic storage pods; Path B intercepts floating microgravity debris with pulsed Electrodynamic Dust Shields (EDS), 3-stage filtration (ΔP), and 3-stream material classification into sealed return canisters.
            </p>
          </div>

          {/* AATM-X Adaptive Autonomous Thermal Management Overview */}
          <div className="p-4 rounded-xl bg-[#0C1628] border border-[#26364D] text-[#F8FAFC]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold font-heading text-sm text-[#F8FAFC]">
                AATM-X: Adaptive Autonomous Thermal Management System
              </h4>
            </div>
            <p className="text-[#A7B4C8] text-xs leading-relaxed">
              Stabilizes orbital manufacturing across ±100°C day/night cycles: combines multi-layer insulation (MLI), high-k pyrolytic spreaders, phase change material (PCM) transient buffers, and variable thermal switches (VTS) with loop heat pipes (LHP) and variable-emittance radiators to preserve 1048°C MOCVD wafer growth at ≤ 150 W power.
            </p>
          </div>

          <div className="text-center pt-2 text-[11px] text-[#A7B4C8]/70 font-mono">
            ASTRAFORGE ICMC-CRS • HAP-NRIP • AERCS-GaN • AATM-X • Space-Qualified Autonomous Manufacturing Engine
          </div>

        </div>

      </div>
    </div>
  );
};
