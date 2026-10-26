import React, { useState, useEffect } from 'react';
import { 
  ThermometerSnowflake, 
  Flame, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Cpu, 
  Layers, 
  Gauge, 
  Play, 
  Pause, 
  ChevronRight, 
  Sparkles, 
  Workflow, 
  Boxes, 
  Sliders, 
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { IsroLogo } from './IsroLogo';

type AatmTab = 'architecture' | 'physical-layout' | 'workflow' | 'orbit-cycle' | 'requirements';

export const AatmXSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AatmTab>('architecture');

  // Interactive 7-Step Operational Workflow State
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);
  const [isWorkflowAutoPlaying, setIsWorkflowAutoPlaying] = useState<boolean>(false);

  // Orbital thermal cycle simulation state
  const [orbitPhaseTimeMin, setOrbitPhaseTimeMin] = useState<number>(14); // 0 to 45 mins in half-orbit or 90 mins total
  const [isOrbitSimRunning, setIsOrbitSimRunning] = useState<boolean>(true);
  const [sunlitActive, setSunlitActive] = useState<boolean>(true);

  // Live Simulated Thermal Telemetry
  const [externalSkinTempC, setExternalSkinTempC] = useState<number>(78);
  const [mcvdSusceptorTempC, setMcvdSusceptorTempC] = useState<number>(1048);
  const [pcmBufferTempC, setPcmBufferTempC] = useState<number>(54.2);
  const [pcmLatentChargePct, setPcmLatentChargePct] = useState<number>(68);
  const [radiatorTempC, setRadiatorTempC] = useState<number>(-22);
  const [vtsConductanceState, setVtsConductanceState] = useState<'high' | 'throttled' | 'open'>('high');
  const [activeThermalPowerW, setActiveThermalPowerW] = useState<number>(44);

  // Auto-play for 7-step operational workflow
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWorkflowAutoPlaying) {
      timer = setInterval(() => {
        setActiveWorkflowStep((prev) => (prev >= 7 ? 1 : prev + 1));
      }, 2800);
    }
    return () => clearInterval(timer);
  }, [isWorkflowAutoPlaying]);

  // Orbital Thermal Cycle Ticker (45 min half-cycle: ~25 min sunlit, 5 min transition, 15 min eclipse)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOrbitSimRunning) {
      timer = setInterval(() => {
        setOrbitPhaseTimeMin((t) => {
          const next = t >= 45 ? 0 : t + 1;
          const isSun = next <= 25;
          setSunlitActive(isSun);

          // Update skin temperature based on orbital sine wave: -100°C to +100°C
          // t = 0 to 25 is Sunlit (heating up to +100°C)
          // t = 25 to 30 is Transition
          // t = 30 to 45 is Eclipse (cooling down to -100°C)
          let targetSkin = 0;
          if (next <= 22) {
            targetSkin = Math.round(20 + 80 * Math.sin((next / 22) * (Math.PI / 2)));
          } else if (next <= 28) {
            targetSkin = Math.round(80 - 100 * ((next - 22) / 6));
          } else {
            targetSkin = Math.round(-20 - 80 * Math.sin(((next - 28) / 17) * (Math.PI / 2)));
          }

          setExternalSkinTempC(targetSkin);

          // Radiator response
          setRadiatorTempC(Math.round(targetSkin * 0.35 - 15));

          // PCM buffer smooths out internal fluctuations
          setPcmBufferTempC((prev) => {
            const delta = isSun ? 0.08 : -0.06;
            return parseFloat(Math.min(58, Math.max(51, prev + delta)).toFixed(1));
          });

          setPcmLatentChargePct((prev) => {
            const delta = isSun ? 1.2 : -1.0;
            return Math.min(100, Math.max(20, Math.round(prev + delta)));
          });

          // MOCVD Susceptor holds firm at 1045°C - 1050°C
          setMcvdSusceptorTempC(1048 + Math.round((Math.random() - 0.5) * 2));

          // Thermal switch modulates to reject process heat
          setVtsConductanceState(isSun ? 'high' : 'throttled');

          // Active thermal power (trim heaters + VTS + sensors <= 150 W)
          setActiveThermalPowerW(isSun ? 38 + Math.round(Math.random() * 8) : 58 + Math.round(Math.random() * 10));

          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOrbitSimRunning]);

  return (
    <div className="w-full max-w-[1700px] mx-auto py-3 px-3 sm:px-6 space-y-6 animate-in fade-in duration-300">
      
      {/* ============================================================= */}
      {/* SECTION BANNER & HERO TITLE                                  */}
      {/* ============================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111C30] border border-[#26364D] p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#3973FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#080F1E] border border-[#26364D] p-1 flex items-center justify-center shadow-lg">
                <IsroLogo size={36} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#3973FF]/15 text-[#00D9FF] border border-[#3973FF]/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                ORBITAL THERMAL ARCHITECTURE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-[#00D9FF] border border-cyan-500/30 flex items-center gap-1">
                <ThermometerSnowflake className="w-3.5 h-3.5" />
                ADAPTIVE AUTONOMOUS THERMAL CONTROL
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-heading">
                AATM-X System
              </h1>
              <p className="text-sm font-semibold text-[#00D9FF] font-mono mt-0.5">
                Adaptive Autonomous Thermal Management System for Orbital Manufacturing
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#A7B4C8] max-w-3xl leading-relaxed">
              Provides robust thermal stabilization for space-based GaN semiconductor manufacturing across extreme orbital temperature swings (<strong>-100°C to +100°C</strong>). Combines passive multi-layer insulation (MLI), high-k pyrolytic spreaders, phase change material (PCM) thermal buffers, and variable thermal switches (VTS) with loop heat pipes (LHP) and deployable variable-emittance radiators governed within a <strong>≤ 150 W</strong> power budget.
            </p>
          </div>

          {/* Quick Real-Time Orbit Metric Column */}
          <div className="flex flex-wrap lg:flex-col gap-2 w-full lg:w-auto shrink-0 font-mono text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-[#0C1628] border border-[#26364D] flex items-center justify-between gap-4">
              <span className="text-[#A7B4C8] flex items-center gap-1.5">
                {sunlitActive ? <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} /> : <Moon className="w-3.5 h-3.5 text-[#3973FF]" />}
                Orbit Phase ({orbitPhaseTimeMin} min):
              </span>
              <span className={`font-bold ${sunlitActive ? 'text-amber-400' : 'text-[#00D9FF]'}`}>
                {sunlitActive ? 'SUNLIT (HEATING)' : 'ECLIPSE (COOLING)'}
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#0C1628] border border-[#26364D] flex items-center justify-between gap-4">
              <span className="text-[#A7B4C8]">External Skin Temp:</span>
              <span className={`font-bold ${externalSkinTempC > 0 ? 'text-amber-400' : 'text-[#00D9FF]'}`}>
                {externalSkinTempC > 0 ? `+${externalSkinTempC}` : externalSkinTempC}°C
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#0C1628] border border-[#26364D] flex items-center justify-between gap-4">
              <span className="text-[#A7B4C8]">GaN Susceptor Temp:</span>
              <span className="text-emerald-400 font-bold">{mcvdSusceptorTempC}°C (STABLE)</span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#0C1628] border border-[#26364D] flex items-center justify-between gap-4">
              <span className="text-[#A7B4C8]">PCM Thermal Reserve:</span>
              <span className="text-rose-400 font-bold">{pcmLatentChargePct}% Charged</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#26364D]">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Workflow className="w-4 h-4 text-[#00D9FF]" />
            <span>Block Diagram & Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('physical-layout')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'physical-layout'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Physical Layout & Cross-Section</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'workflow'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Operational Workflow (7 Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab('orbit-cycle')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'orbit-cycle'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Orbital Thermal Cycle (±100°C)</span>
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'requirements'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />
            <span>Requirements Verification & Simulator</span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: BLOCK DIAGRAM & ARCHITECTURE                          */}
      {/* ============================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          
          {/* Main 4-Block Pipeline Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Block 1: Orbital Environment */}
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase">
                    1. Orbital Environment
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400">External Heat Load</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span><strong>Solar radiation (Hot):</strong> Direct flux up to 1361 W/m²</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span><strong>Albedo (Reflected):</strong> Earth sunlight reflection (0.30)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span><strong>Planet IR (Planetshine):</strong> Earth thermal emission ~240 W/m²</span>
                </li>
                <li className="flex items-start gap-1.5 pt-1 border-t border-slate-800/60 text-amber-300 font-semibold">
                  <span>External surface temp cycle: -100°C to +100°C (≈ 45 min per orbit)</span>
                </li>
              </ul>
            </div>

            {/* Block 2: Thermal Protection */}
            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase">
                    2. Thermal Protection
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Attenuate External Heat</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Sunshield (multi-layer):</strong> Reflects solar flux</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Multi-layer insulation (MLI):</strong> 20–40 aluminized mylar sheets</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Low absorptivity / high emissivity:</strong> Tailored surface coatings</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Structural panel:</strong> Decoupled honey-comb composite skin</span>
                </li>
              </ul>
            </div>

            {/* Block 3: GaN Manufacturing Module */}
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase">
                    3. GaN Module (Process Zone)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Thermally Controlled</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>Process chamber (MOCVD):</strong> Pyrolytic vapor deposition</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>Heated susceptor:</strong> RF/Induction 800°C – 1100°C</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>GaN wafer:</strong> Epilayer growth zone</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>High-k thermal spreader:</strong> Pyrolytic graphite / Al-Cu composite</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>PCM thermal buffer:</strong> Phase change material absorbs heat peaks</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>Thermal isolation mounts:</strong> Interfaces to HAP-NRIP platform</span>
                </li>
              </ul>
            </div>

            {/* Block 4: Heat Transport & Rejection */}
            <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <ThermometerSnowflake className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase">
                    4. Heat Transport & Rejection
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-rose-400">Passive + Adaptive</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400">•</span>
                  <span><strong>Loop heat pipe (LHP):</strong> High conductance, low mass vapor loop</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400">•</span>
                  <span><strong>Variable thermal switch (VTS):</strong> Controls heat flow dynamically</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400">•</span>
                  <span><strong>High-emissivity radiator:</strong> Variable-emittance rejects heat to space</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400">•</span>
                  <span><strong>Deep space heat sink:</strong> Radiative rejection to 3 K background</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Block 5: Sensing, Control and Power Management (Autonomous) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  5. Sensing, Control and Power Management (Autonomous)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                Centralized Autonomous Thermal Control Unit (AATMS)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              
              {/* Column 1: Temperature & Heat Flux Sensors */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold block mb-1">
                  Temperature & Heat Flux Sensors
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• RTDs / Thermistors (process zone)</li>
                  <li>• Thermocouples (high-temp chamber)</li>
                  <li>• IR / Optical temp sensors (wafer)</li>
                  <li>• Heat flux sensors (heat pipes/radiator)</li>
                  <li>• Radiator temperature sensors</li>
                  <li>• Redundant sensor architecture</li>
                </ul>
              </div>

              {/* Column 2: Thermal-State Estimator & Predictive Controller */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-indigo-400 font-bold block mb-1">
                  Predictive Controller (Autonomous)
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Orbit phase prediction (Sunlit vs Eclipse)</li>
                  <li>• Thermal load dynamic estimation</li>
                  <li>• Control decision (heater / switch / radiator state)</li>
                  <li>• Autonomous fault detection and safe mode</li>
                  <li>• Closed-loop wafer temperature regulation</li>
                </ul>
              </div>

              {/* Column 3: Actuation Subsystem */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold block mb-1">
                  Actuation Subsystem
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Heaters (trim / survival)</li>
                  <li>• Variable thermal switch (VTS)</li>
                  <li>• Radiator emissivity control (electrochromic / louvers)</li>
                  <li>• Optional active cooler (if required)</li>
                  <li>• Non-contact thermal routing</li>
                </ul>
              </div>

              {/* Column 4: Power Management */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold block mb-1">
                  Power Management
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Smart power distribution</li>
                  <li>• Low-power control electronics</li>
                  <li>• Duty-cycling of actuators</li>
                  <li>• <strong>≤ 150 W</strong> (active thermal system limit)</li>
                  <li>• Passive-first energy preservation</li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: PHYSICAL LAYOUT & CROSS-SECTION (BLOCKS 8 & 9)        */}
      {/* ============================================================= */}
      {activeTab === 'physical-layout' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Block 8: Physical Layout of AATM-X on Spacecraft (3D View) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400" />
                  <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                    8. Physical Layout of AATM-X on Spacecraft (3D View)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">External Integration</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40">
                  <strong className="text-emerald-300 block mb-0.5">GaN Process Chamber (MOCVD)</strong>
                  <span className="text-[11px] text-slate-300">Pyrolytic synthesis reactor mounted on internal thermal deck.</span>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40">
                  <strong className="text-cyan-300 block mb-0.5">Thermal Enclosure (MLI + Insulation)</strong>
                  <span className="text-[11px] text-slate-300">Surrounds the process zone to attenuate external space orbital radiative flux.</span>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40">
                  <strong className="text-rose-300 block mb-0.5">AATM-X Thermal Hardware Core</strong>
                  <span className="text-[11px] text-slate-300">High-k pyrolytic graphite spreader, loop heat pipes (LHP), PCM buffer, and VTS switch.</span>
                </div>

                <div className="p-3 rounded-lg bg-indigo-950/60 border border-indigo-500/40">
                  <strong className="text-indigo-300 block mb-0.5">Deployable / Fixed Radiator Panel</strong>
                  <span className="text-[11px] text-slate-300">High-emissivity panel facing deep space, rejecting waste heat with variable emissivity louvers.</span>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500/40">
                  <strong className="text-amber-300 block mb-0.5">AATMS Control Unit</strong>
                  <span className="text-[11px] text-slate-300">Integrated autonomous sensors, control electronics, and ≤ 150 W power management.</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700">
                  <strong className="text-slate-300 block mb-0.5">Mechanical Interface to HAP-NRIP & Spacecraft Base</strong>
                  <span className="text-[11px] text-slate-400">Mounted atop HAP-NRIP isolation platform to decouple vibration while maintaining thermal isolation.</span>
                </div>

              </div>
            </div>

            {/* Block 9: Process Module Cross-sectional View (Thermal Integration) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-rose-400" />
                  <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                    9. Process Module Cross-Section (Thermal Integration)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Internal Layer Stack</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs space-y-2 text-center">
                
                {/* Layer 1: Top Thermal Shield */}
                <div className="p-2.5 rounded-lg bg-cyan-950/70 border border-cyan-500/50">
                  <span className="text-cyan-300 font-bold block">Top Thermal Shield (MLI Multi-Layer Insulation)</span>
                  <span className="text-[10px] text-slate-400">Aluminized Mylar / Kapton blanket attenuates solar radiation</span>
                </div>

                <div className="text-slate-600 text-[10px]">▼ Insulated Chamber Wall ▼</div>

                {/* Layer 2: MOCVD Chamber & Susceptor */}
                <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/60">
                  <span className="text-emerald-300 font-bold block text-sm">MOCVD Process Chamber</span>
                  <div className="p-2 mt-1 rounded bg-amber-950/80 border border-amber-500/50">
                    <span className="text-amber-300 font-bold block">Heated Susceptor (800°C – 1100°C)</span>
                    <span className="text-white font-semibold">GaN Wafer (Epitaxial Growth Zone)</span>
                  </div>
                </div>

                <div className="text-slate-600 text-[10px]">▼ Conductive Interfacial Plane ▼</div>

                {/* Layer 3: High-k Spreader & PCM Thermal Buffer */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                    <span className="text-white font-bold block">High-k Spreader</span>
                    <span className="text-[10px] text-slate-400">Pyrolytic graphite / Al-Cu composite</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/70 border border-rose-500/50">
                    <span className="text-rose-300 font-bold block">PCM Thermal Buffer</span>
                    <span className="text-[10px] text-slate-400">Phase change material absorbs heat peaks</span>
                  </div>
                </div>

                <div className="text-slate-600 text-[10px]">▼ Heat Pipe / LHP Routing ▼</div>

                {/* Layer 4: Variable Thermal Switch */}
                <div className="p-2.5 rounded-lg bg-indigo-950/70 border border-indigo-500/50">
                  <span className="text-indigo-300 font-bold block">Variable Thermal Switch (VTS)</span>
                  <span className="text-[10px] text-slate-400">Controls conductance between process zone and external radiator loop</span>
                </div>

                <div className="text-slate-600 text-[10px]">▼ Thermal Isolation Mounts ▼</div>

                {/* Layer 5: Mounts to HAP-NRIP */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                  <span className="text-slate-300 font-bold block">Thermal Isolation Mounts</span>
                  <span className="text-[10px] text-slate-400">Titanium/ceramic standoffs to HAP-NRIP platform</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: OPERATIONAL WORKFLOW (STEP BY STEP 1 - 7)             */}
      {/* ============================================================= */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          
          {/* Header Controls */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                  10. AATM-X Operational Workflow (Step by Step)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Continuous closed-loop orbital cycle adaptation, predictive feedforward thermal control, and transient heat rejection.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWorkflowAutoPlaying(!isWorkflowAutoPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isWorkflowAutoPlaying
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {isWorkflowAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isWorkflowAutoPlaying ? 'Pause Stepper' : 'Auto Play Steps'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Buttons (1 - 7) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: 1, title: 'Sense Thermal State', sub: 'Internal & External' },
              { id: 2, title: 'Predict Conditions', sub: 'Orbit Hot/Cold Phase' },
              { id: 3, title: 'Control Path', sub: 'VTS & Radiator Emissivity' },
              { id: 4, title: 'Manage Transients', sub: 'PCM Peak Buffer' },
              { id: 5, title: 'Reject to Space', sub: 'Variable Radiator' },
              { id: 6, title: 'Maintain Process', sub: 'Wafer Protection' },
              { id: 7, title: 'Continuous Adapt', sub: 'Safe Mode & Faults' }
            ].map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveWorkflowStep(step.id);
                  setIsWorkflowAutoPlaying(false);
                }}
                className={`p-2.5 rounded-xl border text-left font-mono transition cursor-pointer flex flex-col justify-between ${
                  activeWorkflowStep === step.id
                    ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    activeWorkflowStep === step.id ? 'bg-rose-950 text-rose-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    STEP {step.id}
                  </span>
                  {activeWorkflowStep === step.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </div>
                <div>
                  <strong className="block text-xs leading-tight">{step.title}</strong>
                  <span className={`text-[9px] block ${
                    activeWorkflowStep === step.id ? 'text-rose-100' : 'text-slate-500'
                  }`}>{step.sub}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Detailed Display */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-4">
            
            {activeWorkflowStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                      STEP 1 • MULTI-SENSOR INGEST
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Sense External and Internal Thermal State</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-rose-950 text-rose-300 border border-rose-500/30">
                    SENSING RATE: 10 Hz
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">External Spacecraft State</strong>
                    <p className="text-[11px] text-slate-400">Radiometer measuring solar flux, Earth albedo, planetshine IR, and skin temperatures (-100°C to +100°C).</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-300 block mb-1">Process Core Sensors</strong>
                    <p className="text-[11px] text-slate-400">High-temp thermocouples and multi-zone IR pyrometers monitoring susceptor and GaN wafer at 800°C – 1100°C.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-rose-300 block mb-1">Heat Pipe / Radiator Heat Flux</strong>
                    <p className="text-[11px] text-slate-400">Thin-film heat flux gauges tracking thermal energy throughput entering loop heat pipe evaporators.</p>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                      STEP 2 • PREDICTIVE MODELING
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Predict Thermal Conditions Across Upcoming Orbit</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-amber-950 text-amber-300 border border-amber-500/30">
                    PREDICTION HORIZON: 45 MIN
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300 leading-relaxed">
                    Uses flight ephemeris and orbital phase clocks to estimate upcoming hot (sunlit) and cold (eclipse) phases. Pre-calculates reactor MOCVD heat dissipation peaks and plans VTS switch positions and PCM buffer pre-cooling ahead of thermal transients.
                  </p>
                </div>
              </div>
            )}

            {activeWorkflowStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                      STEP 3 • THERMAL PATH MODULATION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Control Thermal Path via VTS & Radiator Emissivity</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    CONDUCTANCE: ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-indigo-300 block mb-1">Variable Thermal Switch (VTS)</strong>
                    <p className="text-[11px] text-slate-400">Modulates interfacial thermal contact conductance between 10 W/K (open/cold) and 450 W/K (closed/hot).</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-amber-300 block mb-1">Electrochromic / Louver Emissivity</strong>
                    <p className="text-[11px] text-slate-400">Alters radiator panel surface emissivity from ε = 0.15 (during eclipse freeze protection) to ε = 0.88 (during high heat rejection).</p>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                      STEP 4 • TRANSIENT BUFFERING
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Manage Thermal Transients via PCM Peak Absorption</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-rose-950 text-rose-300 border border-rose-500/30">
                    BUFFER CAPACITY: 320 kJ
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300 leading-relaxed">
                    Phase Change Material (PCM) thermal buffer utilizes high-latent-heat paraffin/metallic alloy capsules. During RF susceptor power bursts or sunlit orbital peaks, the PCM melts isothermally at ~54°C, absorbing high heat spikes without raising reactor platform temperature.
                  </p>
                </div>
              </div>
            )}

            {activeWorkflowStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                      STEP 5 • DEEP SPACE REJECTION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Reject Heat to Deep Space via Loop Heat Pipes & Radiator</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    REJECTION SINK: 3 K DEEP SPACE
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300 leading-relaxed">
                    Loop heat pipes passively circulate two-phase working fluid (anhydrous ammonia) from the evaporator plate to the deployable radiator panel. Radiator radiates waste heat into cold deep space with zero moving parts and zero pump vibration.
                  </p>
                </div>
              </div>
            )}

            {activeWorkflowStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                      STEP 6 • PROCESS TEMPERATURE STABILITY
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Maintain Strict Process Temperature for GaN Crystal Quality</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    STABILITY: ± 0.5°C
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300 leading-relaxed">
                    Keeps wafer susceptor locked within the specified pyrolytic deposition tolerance (800°C – 1100°C ± 0.5°C), preventing lattice defects, dislocation clustering, and wafer bowing during orbital day/night transitions.
                  </p>
                </div>
              </div>
            )}

            {activeWorkflowStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                      STEP 7 • CONTINUOUS MONITORING & ADAPTATION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Continuous Monitoring, Adaptation, and Autonomous Safe Mode</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    TMR FAULT-TOLERANT
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300 leading-relaxed">
                    Continuously updates control parameters based on aging and surface degradation. If thermal excursions or sensor anomalies occur, AATM-X automatically executes safe mode protocols, closing VTS switches and activating trim heaters to protect the semiconductor charge.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: ORBITAL THERMAL CYCLE CHART & SIMULATION (BLOCK 6)     */}
      {/* ============================================================= */}
      {activeTab === 'orbit-cycle' && (
        <div className="space-y-6">
          
          {/* Orbital Thermal Cycle Interactive Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                  6. Orbital Thermal Cycle (Illustrative Chart & Real-Time Sine Wave)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Low Earth Orbit (LEO) thermal environment: 45 min half-cycle from +100°C (Sunlit) to -100°C (Eclipse).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOrbitSimRunning(!isOrbitSimRunning)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isOrbitSimRunning ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                }`}
              >
                {isOrbitSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isOrbitSimRunning ? 'Pause Orbital Clock' : 'Resume Clock'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Chart Graphic */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-b border-slate-800 pb-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Sun className="w-4 h-4" /> Sunlit phase (heating): 0 – 22 min (+100°C)
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  Transition: 22 – 28 min
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Moon className="w-4 h-4" /> Eclipse phase (cooling): 28 – 45 min (-100°C)
                </span>
              </div>

              <span className="text-rose-400 font-bold">
                Current Time: {orbitPhaseTimeMin} min / 45 min
              </span>
            </div>

            {/* SVG Visual Graph */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <svg viewBox="0 0 600 220" className="w-full h-56 overflow-visible font-mono">
                {/* Background Grid Lines */}
                <line x1="50" y1="30" x2="570" y2="30" stroke="#334155" strokeDasharray="3 3" />
                <line x1="50" y1="110" x2="570" y2="110" stroke="#475569" strokeWidth="1.5" />
                <line x1="50" y1="190" x2="570" y2="190" stroke="#334155" strokeDasharray="3 3" />

                {/* Y-Axis Labels */}
                <text x="15" y="34" fill="#f59e0b" fontSize="10">+100°C</text>
                <text x="25" y="114" fill="#94a3b8" fontSize="10">0°C</text>
                <text x="15" y="194" fill="#06b6d4" fontSize="10">-100°C</text>

                {/* X-Axis Divisions */}
                <line x1="50" y1="20" x2="50" y2="200" stroke="#475569" />
                <line x1="165" y1="20" x2="165" y2="200" stroke="#334155" strokeDasharray="2 2" />
                <line x1="280" y1="20" x2="280" y2="200" stroke="#334155" strokeDasharray="2 2" />
                <line x1="395" y1="20" x2="395" y2="200" stroke="#334155" strokeDasharray="2 2" />
                <line x1="510" y1="20" x2="510" y2="200" stroke="#334155" strokeDasharray="2 2" />

                <text x="46" y="215" fill="#64748b" fontSize="10">0</text>
                <text x="158" y="215" fill="#64748b" fontSize="10">10</text>
                <text x="273" y="215" fill="#64748b" fontSize="10">20</text>
                <text x="388" y="215" fill="#64748b" fontSize="10">30</text>
                <text x="503" y="215" fill="#64748b" fontSize="10">40</text>
                <text x="555" y="215" fill="#64748b" fontSize="10">45 (min)</text>

                {/* Orbital Zones Tinting */}
                <rect x="50" y="20" width="230" height="180" fill="rgba(245, 158, 11, 0.05)" />
                <rect x="280" y="20" width="80" height="180" fill="rgba(148, 163, 184, 0.04)" />
                <rect x="360" y="20" width="210" height="180" fill="rgba(6, 182, 212, 0.05)" />

                {/* Zone Headings */}
                <text x="110" y="45" fill="#f59e0b" fontSize="11" fontWeight="bold">Sunlit phase (heating)</text>
                <text x="290" y="45" fill="#94a3b8" fontSize="10">Transition</text>
                <text x="400" y="45" fill="#06b6d4" fontSize="11" fontWeight="bold">Eclipse phase (cooling)</text>

                {/* Theoretical Sine Wave: +100°C -> Transition -> -100°C */}
                <path
                  d="M 50 110 C 90 28, 180 28, 260 40 C 290 50, 320 150, 360 170 C 420 195, 520 195, 570 120"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />

                {/* Current Simulation Time Marker */}
                {(() => {
                  const markerX = 50 + (orbitPhaseTimeMin / 45) * 520;
                  const markerY = externalSkinTempC > 0 
                    ? 110 - (externalSkinTempC / 100) * 80 
                    : 110 + (Math.abs(externalSkinTempC) / 100) * 80;
                  return (
                    <g>
                      <line x1={markerX} y1="20" x2={markerX} y2="200" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx={markerX} cy={markerY} r="5" fill="#f43f5e" className="animate-ping" />
                      <circle cx={markerX} cy={markerY} r="4" fill="#ffffff" stroke="#f43f5e" strokeWidth="2" />
                      <text x={Math.min(500, markerX + 8)} y={Math.max(40, markerY - 8)} fill="#ffffff" fontSize="11" fontWeight="bold">
                        {externalSkinTempC}°C
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Readout Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30">
                <span className="text-amber-400 block font-bold mb-1">Sunlit Heating Absorption</span>
                <p className="text-[11px] text-slate-300">
                  MLI attenuates 99.2% of solar flux; high-k spreader routes internal MOCVD waste heat directly to LHP loops.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-700">
                <span className="text-slate-300 block font-bold mb-1">Eclipse Cooling Defense</span>
                <p className="text-[11px] text-slate-300">
                  PCM releases latent heat at 54°C to prevent freeze-out; VTS throttles back conductance to preserve internal energy.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30">
                <span className="text-emerald-400 block font-bold mb-1">Process Invariance Guarantee</span>
                <p className="text-[11px] text-slate-300">
                  MOCVD wafer growth chamber holds continuous 1048°C ± 0.5°C irrespective of external orbital conditions.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 5: HOW AATM-X MEETS REQUIREMENTS (BLOCK 7 & SIMULATOR)    */}
      {/* ============================================================= */}
      {activeTab === 'requirements' && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>7. How AATM-X Meets the Requirements (4 Core Pillars)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Architectural compliance matrix designed specifically for space-based GaN semiconductor manufacturing
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pillar 1 */}
            <div className="p-5 rounded-xl bg-slate-900 border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center justify-center font-bold font-mono text-sm">
                    1
                  </div>
                  <h4 className="text-sm font-mono font-bold text-white">
                    Withstand ±100°C Orbital Cycles
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  COMPLIANT ✓
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>MLI + sunshield</strong> reduce external heat input by over 99%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Thermal isolation</strong> mounts decouple process zone from external orbital swings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>PCM buffers transients</strong>; adaptive control maintains internal temperatures.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold font-mono text-sm">
                    2
                  </div>
                  <h4 className="text-sm font-mono font-bold text-white">
                    Protect Product Quality
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  COMPLIANT ✓
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Precise closed-loop</strong> temperature control of wafer / susceptor (±0.5°C).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Redundant sensors</strong> and real-time multi-wavelength pyrometry monitoring.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Thermal excursions</strong> trigger autonomous corrective action and safe mode.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold font-mono text-sm">
                    3
                  </div>
                  <h4 className="text-sm font-mono font-bold text-white">
                    Efficient Heat Rejection
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  COMPLIANT ✓
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>High-k spreader + heat pipes/LHP</strong> transport heat rapidly to radiator.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>High-emissivity / variable-emittance</strong> radiator rejects heat into cold 3 K space.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Passive-first design</strong> minimizes power usage to keep baseline draw negligible.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-xl bg-slate-900 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold font-mono text-sm">
                    4
                  </div>
                  <h4 className="text-sm font-mono font-bold text-white">
                    Lightweight System
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  COMPLIANT ✓
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Use of passive components</strong> (MLI, heat pipes, PCM, radiators).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Compact, high-conductivity</strong> materials (pyrolytic graphite, Al-Cu composite).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Deployable radiator</strong> used only when needed; small low-power electronics.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Real-Time Live Power & Conductance Diagnostics */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                AATM-X Power & Thermal Conductance Diagnostics
              </span>
              <span className="text-emerald-400">
                ACTIVE THERMAL POWER: {activeThermalPowerW} W (≤ 150 W BUDGET)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">VTS Switch Mode</span>
                <span className="text-sm font-bold text-cyan-300 uppercase">{vtsConductanceState}</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">380 W/K Conductance</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">PCM Buffer Core</span>
                <span className="text-sm font-bold text-rose-300">{pcmBufferTempC}°C</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">{pcmLatentChargePct}% Latent Reserve</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Radiator Skin</span>
                <span className="text-sm font-bold text-amber-300">{radiatorTempC}°C</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">ε = 0.85 (High Emittance)</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Power Utilization</span>
                <span className="text-sm font-bold text-emerald-400">{Math.round((activeThermalPowerW / 150) * 100)}%</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">{activeThermalPowerW} W / 150 W Max</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
