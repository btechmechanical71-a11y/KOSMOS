import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Cpu, 
  Layers, 
  Radio, 
  Gauge, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Flame, 
  Wind, 
  Sliders, 
  Wrench, 
  Play, 
  Pause, 
  ChevronRight, 
  Compass, 
  Boxes, 
  CircleDot, 
  Sparkles, 
  Maximize2,
  Atom,
  RefreshCw,
  Clock,
  BatteryCharging
} from 'lucide-react';

type HapNripTab = 'architecture' | 'hardware' | 'workflow' | 'mocvd' | 'verification';

export const HapNripSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HapNripTab>('architecture');
  
  // Interactive Workflow Step State (1 - 8)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);
  const [isWorkflowAutoPlaying, setIsWorkflowAutoPlaying] = useState<boolean>(false);

  // Interactive MOCVD Process Step State (1 - 5)
  const [activeMocvdStep, setActiveMocvdStep] = useState<number>(1);
  const [isMocvdAutoPlaying, setIsMocvdAutoPlaying] = useState<boolean>(false);

  // Interactive Disturbance Test Trigger
  const [isDisturbanceActive, setIsDisturbanceActive] = useState<boolean>(false);
  const [reactionCancelled, setReactionCancelled] = useState<boolean>(true);

  // Live Oscilloscope Data Points
  const [baseVibrationPoints, setBaseVibrationPoints] = useState<number[]>([12, 18, 14, 25, 22, 19, 28, 30, 24, 16, 22, 19, 26, 21]);
  const [isolatedVibrationPoints, setIsolatedVibrationPoints] = useState<number[]>([0.4, 0.6, 0.3, 0.8, 0.5, 0.4, 0.7, 0.6, 0.4, 0.3, 0.5, 0.4, 0.6, 0.5]);

  // Live telemetry parameters
  const [liveIsolationPowerW, setLiveIsolationPowerW] = useState<number>(112);
  const [supercapBufferCharge, setSupercapBufferCharge] = useState<number>(98.4);
  const [qzsTunedFreq, setQzsTunedFreq] = useState<number>(1.8);
  const [mfdFlowRate, setMfdFlowRate] = useState<number>(45.2);
  const [chamberTempC, setChamberTempC] = useState<number>(1045);
  const [chamberPressureTorr, setChamberPressureTorr] = useState<number>(120);

  // Signal Flow Filter toggles for block diagram
  const [signalFilters, setSignalFilters] = useState({
    motionData: true,
    estimatedReaction: true,
    actuatorCommand: true,
    qzsSignal: true,
    sensorFeedback: true,
    powerLine: true
  });

  // Auto-run 8-step operational workflow
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWorkflowAutoPlaying) {
      timer = setInterval(() => {
        setActiveWorkflowStep((prev) => (prev >= 8 ? 1 : prev + 1));
      }, 2600);
    }
    return () => clearInterval(timer);
  }, [isWorkflowAutoPlaying]);

  // Auto-run 5-step MOCVD synthesis process
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMocvdAutoPlaying) {
      timer = setInterval(() => {
        setActiveMocvdStep((prev) => (prev >= 5 ? 1 : prev + 1));
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isMocvdAutoPlaying]);

  // Real-time procedural oscilloscope fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setBaseVibrationPoints((prev) => {
        const noise = (Math.random() - 0.5) * 6;
        const base = isDisturbanceActive ? 42 : 20;
        const next = Math.max(8, Math.min(65, Math.round(base + noise)));
        return [...prev.slice(1), next];
      });

      setIsolatedVibrationPoints((prev) => {
        const factor = reactionCancelled ? 0.02 : 0.65;
        const noise = (Math.random() - 0.5) * 0.2;
        const next = parseFloat((Math.max(0.1, (isDisturbanceActive ? 1.8 : 0.4) * factor + noise)).toFixed(2));
        return [...prev.slice(1), next];
      });

      setLiveIsolationPowerW((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(95, Math.min(138, Math.round(prev + delta)));
      });

      setSupercapBufferCharge((prev) => {
        const delta = (Math.random() - 0.48) * 0.1;
        return parseFloat(Math.min(100, Math.max(94, prev + delta)).toFixed(1));
      });
    }, 600);

    return () => clearInterval(timer);
  }, [isDisturbanceActive, reactionCancelled]);

  const toggleSignal = (key: keyof typeof signalFilters) => {
    setSignalFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerMachineDisturbance = () => {
    setIsDisturbanceActive(true);
    setTimeout(() => {
      setIsDisturbanceActive(false);
    }, 3500);
  };

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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#3973FF]/15 text-[#00D9FF] border border-[#3973FF]/30 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-[#00D9FF] animate-spin" style={{ animationDuration: '8s' }} />
                ORBITAL GaN SEMICONDUCTOR MANUFACTURING
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                NEAR-ZERO-REACTION PLATFORM
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-heading">
                HAP-NRIP Platform
              </h1>
              <p className="text-sm font-semibold text-[#00D9FF] font-mono mt-0.5">
                Hybrid Adaptive Predictive Near-Zero-Reaction Isolation Platform
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#A7B4C8] max-w-3xl leading-relaxed">
              Integrates high-temperature Gallium Nitride (GaN) MOCVD epitaxial manufacturing with a two-stage 
              isolation platform: <strong className="text-[#F8FAFC]">Reprogrammable Magnetic QZS Stage (0.1–10 Hz)</strong> and <strong className="text-[#F8FAFC]">Active 6-DOF Electromagnetic Stage (1–100 Hz)</strong>. Prevents momentum transfer to host spacecraft and suppresses micro-vibrations for crystalline-grade semiconductor wafer growth in microgravity.
            </p>
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
            <Layers className="w-4 h-4 text-[#00D9FF]" />
            <span>Block Diagram & Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'hardware'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#00D9FF]" />
            <span>Hardware Configuration & Layout</span>
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
            <span>Operational Workflow (8 Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab('mocvd')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'mocvd'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>GaN MOCVD Synthesis (5 Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />
            <span>Requirements & Oscilloscope</span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: BLOCK DIAGRAM & ARCHITECTURE                          */}
      {/* ============================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          
          {/* Signal Flow Filter Legend */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Signal Flow Legend (Interactive Filter):
            </span>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <button
                onClick={() => toggleSignal('motionData')}
                className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition cursor-pointer ${
                  signalFilters.motionData 
                    ? 'bg-red-950/60 border-red-500 text-red-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="w-2 h-0.5 bg-red-500" />
                <span>Sensor Data (Motion State)</span>
              </button>

              <button
                onClick={() => toggleSignal('estimatedReaction')}
                className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition cursor-pointer ${
                  signalFilters.estimatedReaction 
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="w-2 h-0.5 bg-purple-500" />
                <span>Estimated Reaction Force/Torque</span>
              </button>

              <button
                onClick={() => toggleSignal('actuatorCommand')}
                className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition cursor-pointer ${
                  signalFilters.actuatorCommand 
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="w-2 h-0.5 bg-cyan-400" />
                <span>Control Command (Actuators)</span>
              </button>

              <button
                onClick={() => toggleSignal('qzsSignal')}
                className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition cursor-pointer ${
                  signalFilters.qzsSignal 
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="w-2 h-0.5 bg-emerald-500" />
                <span>QZS Reconfiguration Signal</span>
              </button>

              <button
                onClick={() => toggleSignal('sensorFeedback')}
                className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition cursor-pointer ${
                  signalFilters.sensorFeedback 
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="w-2 h-0.5 bg-amber-400" />
                <span>Isolation Sensor Feedback</span>
              </button>

              <button
                onClick={() => toggleSignal('powerLine')}
                className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition cursor-pointer ${
                  signalFilters.powerLine 
                    ? 'bg-orange-950/60 border-orange-500 text-orange-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="w-2 h-0.5 bg-orange-400 border-dashed" />
                <span>Power Supply Line (≤150 W)</span>
              </button>
            </div>
          </div>

          {/* Interactive Mechanical & Control Architecture Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column: Machine Motion Sensing & Feedforward Model (Col 1-4) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Sensors (Machine Motion) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-red-500/50 relative overflow-hidden shadow-lg shadow-red-950/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Sensors (Machine Motion)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                    Source
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  High-bandwidth instrumentation tracking internal moving components:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-200 font-mono">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                    <span>Accelerometers (IMU 3-Axis)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                    <span>Force/Torque Multi-Axis Sensors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                    <span>Precision Optical Position Encoders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                    <span>High-Speed Displacement Sensors</span>
                  </li>
                </ul>
              </div>

              {/* Predictive Dynamic Model */}
              <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/50 relative shadow-lg shadow-purple-950/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Predictive Dynamic Model
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    Feedforward
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  Real-time inverse dynamics running on radiation-tolerant FPGA:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-200 font-mono">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                    <span>Estimate reaction force/torque ahead of pulse</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                    <span>Adaptive learning (recursive least squares)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                    <span>Dynamic payload change detection</span>
                  </li>
                </ul>
              </div>

              {/* Adaptive Controller */}
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-lg shadow-cyan-950/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Adaptive Controller
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Feedforward + Feedback
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200 font-mono">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Generate real-time cancellation commands</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Control active 6-DOF electromagnetic coils</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Update controller coefficients &lt; 1 ms loop</span>
                  </li>
                </ul>
              </div>

              {/* Power Supply & Management */}
              <div className="p-4 rounded-xl bg-slate-900 border border-orange-500/50 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-orange-400" />
                    Power Supply & Management
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-500/30">
                    ≤ 150 W Limit
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center font-mono text-[11px] mt-2">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Spacecraft Bus</span>
                    <span className="font-bold text-white">28 V / 120 V DC</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Energy Buffer</span>
                    <span className="font-bold text-amber-400">Supercapacitor</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Physical Mechanical Stack & Isolation Stages (Col 5-12) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* TOP LAYER: GaN Manufacturing Module on Isolated Platform */}
              <div className="p-4 rounded-xl bg-slate-900/90 border-2 border-emerald-500/70 shadow-xl shadow-emerald-950/20">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      GaN Manufacturing Module (on Isolated Platform)
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Vibration Sensitive Zone
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Subsystem 1: Material Delivery & Process */}
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 block mb-1.5">
                      Material Delivery & Subsystems
                    </span>
                    <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                      <li>• TMGa bubbler & NH3 supply</li>
                      <li>• Substrate load-lock chamber</li>
                      <li>• Pyrolytic MOCVD process reactor</li>
                      <li>• Turbomolecular vacuum pumps</li>
                    </ul>
                  </div>

                  {/* Subsystem 2: Process Tools */}
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 block mb-1.5">
                      Process Tools & Thermal
                    </span>
                    <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                      <li>• RF induction heater (800–1100°C)</li>
                      <li>• Precision wafer rotation stage</li>
                      <li>• Sub-micron gas showerhead</li>
                      <li>• MFC precision gas regulators</li>
                    </ul>
                  </div>

                  {/* Subsystem 3: Monitoring */}
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] font-mono font-bold text-amber-400 block mb-1.5">
                      In-Situ Monitoring Array
                    </span>
                    <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                      <li>• Multi-wavelength pyrometer</li>
                      <li>• High-accuracy pressure gauge</li>
                      <li>• Optical reflectance growth rate</li>
                      <li>• Epitaxial layer thickness sensor</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* MIDDLE LAYER 1: Isolated Payload Platform & Platform Response Sensors */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/50 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Isolated Payload Platform Plate
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Rigid lightweight carbon-composite base with embedded kinematic mounts
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-indigo-400 font-bold">Platform Response Sensors:</span>
                  <span>6-DOF Accelerometers • Laser Gap Sensors • Load Cells</span>
                </div>
              </div>

              {/* MIDDLE LAYER 2: Active 6-DOF Electromagnetic Stage */}
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/60 shadow-lg shadow-cyan-950/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-cyan-400 animate-pulse" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Active 6-DOF Electromagnetic Isolation Stage
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Bandwidth: 1 – 100 Hz
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono text-slate-300 mt-2">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-white block mb-0.5">X, Y, Z Translation:</strong>
                    <span>Non-contact Lorentz voice coils eliminate friction</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-white block mb-0.5">Roll, Pitch, Yaw:</strong>
                    <span>Tilt-control magnetic actuators neutralize rotational jitter</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-white block mb-0.5">Reaction Cancellation:</strong>
                    <span>Feedforward momentum neutralization against machine motion</span>
                  </div>
                </div>
              </div>

              {/* MIDDLE LAYER 3: Reprogrammable Magnetic QZS Stage (Passive / Semi-passive) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/60 shadow-lg shadow-emerald-950/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-400" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Reprogrammable Magnetic QZS Stage (Passive / Semi-Passive)
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Bandwidth: 0.1 – 10 Hz
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono text-slate-300 mt-2">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-white block mb-0.5">Zero Dynamic Stiffness:</strong>
                    <span>Near-zero stiffness at equilibrium without load sagging</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-white block mb-0.5">Magnetically Tunable:</strong>
                    <span>Reprogrammable flux gap adjusts to changing payload mass</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-white block mb-0.5">Static Payload Support:</strong>
                    <span>Carries full mechanical weight of MOCVD reactor with zero power</span>
                  </div>
                </div>
              </div>

              {/* BASE LAYER: Spacecraft Interface (Base) / Spacecraft Structure */}
              <div className="p-4 rounded-xl bg-slate-950 border-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Boxes className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Spacecraft Interface (Base) / Spacecraft Structure
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Host satellite bus mounting plate • Base vibration source: 0.1 – 100 Hz
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={triggerMachineDisturbance}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Simulate Motion Impulse</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: HARDWARE CONFIGURATION & PHYSICAL LAYOUT               */}
      {/* ============================================================= */}
      {activeTab === 'hardware' && (
        <div className="space-y-6">
          
          {/* Top 4 Subsystem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* 1. Raw Material Supply & Feed System */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  <Wind className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-mono font-bold text-white uppercase">
                  1. Raw Material Supply & Feed
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>TMGa source cabinet:</strong> Temperature-controlled bubbler in inert container</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>NH₃ cylinder cabinet:</strong> High-purity cylinders with 2-stage pressure regulator</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Carrier gas (H₂/N₂):</strong> Ultra-high purity with active regulators</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>MFCs:</strong> Precise flow control (ml/min to slm range)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Heated delivery lines:</strong> Stainless steel lines prevent precursor condensation</span>
                </li>
              </ul>
            </div>

            {/* 2. GaN Growth Chamber (MOCVD) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-mono font-bold text-white uppercase">
                  2. GaN Growth Chamber (MOCVD)
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>Pyrolytic reactor:</strong> High-vacuum hermetic chamber for metalorganic vapor deposition</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>Substrate susceptor:</strong> Induction-heated up to 1100°C for precursor cracking</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>Gas distributor showerhead:</strong> Uniform flow of TMGa + NH3 across wafer surface</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span><strong>Exhaust bypass:</strong> Rapid purge line for N2/H2 with particulate traps</span>
                </li>
              </ul>
            </div>

            {/* 3. Process Control & Monitoring */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30">
                  <Gauge className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-mono font-bold text-white uppercase">
                  3. Process Control & Monitoring
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Temperature control:</strong> Multi-zone PID loops (800 – 1100°C)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Pressure control:</strong> Throttle butterfly valve (50 – 300 Torr)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Gas flow control:</strong> Digital mass flow controller bus</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400">•</span>
                  <span><strong>In-situ optical pyrometry:</strong> Real-time thickness and growth rate control</span>
                </li>
              </ul>
            </div>

            {/* 4. Product Handling & Transfer */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/30">
                  <Boxes className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-mono font-bold text-white uppercase">
                  4. Product Handling & Transfer
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span><strong>Load-lock chamber:</strong> Rapid vacuum pump down & degassing without venting reactor</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span><strong>Wafer transfer arm:</strong> Non-magnetic compliant robotic gripper</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span><strong>Wafer cassette:</strong> Multi-slot magazine for raw & finished GaN wafers</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span><strong>Cooling & storage:</strong> Inert cooling bay prevents thermal shock</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Physical Layout and Integration (Side View and Top View) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Side View Schematic */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Physical Integration: Side View Schematic
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Vertical Axis (Z-Gravity Vector)</span>
              </div>

              {/* Side view diagram box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-center font-mono">
                
                {/* 1. GaN Manufacturing Module */}
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50">
                  <span className="text-xs font-bold text-white block">GaN Manufacturing Module (MOCVD Reactor)</span>
                  <span className="text-[10px] text-emerald-300">Pyrolytic Substrate Susceptor + In-situ Optical Diagnostic Port</span>
                </div>

                <div className="flex justify-center text-slate-600 text-xs">▼ Kinematic Mounts ▼</div>

                {/* 2. Isolated Payload Platform */}
                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/50">
                  <span className="text-xs font-bold text-white block">Isolated Payload Platform (Carbon-Composite)</span>
                  <span className="text-[10px] text-indigo-300">Carries 6-DOF Accelerometer Array & Gap Sensors</span>
                </div>

                <div className="flex justify-center text-slate-600 text-xs">▼ Non-Contact Lorentz Actuators ▼</div>

                {/* 3. Active 6-DOF Electromagnetic Stage */}
                <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/50">
                  <span className="text-xs font-bold text-white block">Active 6-DOF Electromagnetic Stage</span>
                  <span className="text-[10px] text-cyan-300">X, Y, Z Voice Coils + Roll, Pitch, Yaw Tilt Motors (1 – 100 Hz)</span>
                </div>

                <div className="flex justify-center text-slate-600 text-xs">▼ Quasi-Zero Stiffness Magnetic Springs ▼</div>

                {/* 4. Reprogrammable Magnetic QZS Stage */}
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50">
                  <span className="text-xs font-bold text-white block">Reprogrammable Magnetic QZS Stage (0.1 – 10 Hz)</span>
                  <span className="text-[10px] text-emerald-300">Adjustable Magnetic Elements + Static Load Support Frame</span>
                </div>

                <div className="flex justify-center text-slate-600 text-xs">▼ Structural Bolted Interface ▼</div>

                {/* 5. Spacecraft Interface */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                  <span className="text-xs font-bold text-slate-300 block">Spacecraft Interface (Base Structure)</span>
                  <span className="text-[10px] text-slate-400">Host Spacecraft Satellite Bus Mounting Plate</span>
                </div>

              </div>
            </div>

            {/* Top View Schematic */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Physical Integration: Top View Layout
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">XY Plane Footprint</span>
              </div>

              {/* Top view grid */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30">
                  <span className="text-cyan-400 font-bold block mb-1">Gas Supply Cabinets</span>
                  <p className="text-[11px] text-slate-300">
                    TMGa bubbler chamber, NH₃ cylinder rack, and ultra-high purity H₂/N₂ carrier supplies with automated emergency shut-off valves.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30">
                  <span className="text-indigo-400 font-bold block mb-1">Process Control Rack</span>
                  <p className="text-[11px] text-slate-300">
                    Real-time PLC/FPGA rack, RF heating power amplifier, gas distribution manifold, and 6-DOF electromagnetic actuator drivers.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold block mb-1">Load-Lock & Transfer</span>
                  <p className="text-[11px] text-slate-300">
                    Hermetic load-lock chamber with magnetic transfer arm, wafer input/output cassette magazine, and degassing station.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <span className="text-amber-400 font-bold block mb-1">HAP-NRIP Base Perimeter</span>
                  <p className="text-[11px] text-slate-300">
                    Symmetrical peripheral layout of 6 non-contact electromagnetic actuators and magnetic QZS modules around center of gravity.
                  </p>
                </div>

              </div>

              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 flex items-center justify-between">
                <span>Center of Gravity (CG) Aligned: Zero Moment Offset</span>
                <span className="text-white font-bold">X: 0.0 mm • Y: 0.0 mm</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: OPERATIONAL WORKFLOW (STEP BY STEP 1 - 8)             */}
      {/* ============================================================= */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>HAP-NRIP Operational Workflow</span>
                <span className="text-cyan-400 font-semibold">(8 Step Sequence)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Continuous closed-loop feedforward prediction and multi-stage vibration suppression
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWorkflowAutoPlaying(!isWorkflowAutoPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isWorkflowAutoPlaying
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isWorkflowAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isWorkflowAutoPlaying ? 'Pause Stepper' : 'Auto Play Steps'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Node Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {[
              { id: 1, title: 'Sense Motion', sub: 'IMU & Encoders' },
              { id: 2, title: 'Predict Force', sub: 'Dynamic Model' },
              { id: 3, title: 'Cancel Force', sub: 'Feedforward 6-DOF' },
              { id: 4, title: 'Passive QZS', sub: '0.1 – 10 Hz' },
              { id: 5, title: 'Active Control', sub: '1 – 100 Hz' },
              { id: 6, title: 'Continuous Adapt', sub: 'Real-time Tuning' },
              { id: 7, title: 'Power Mgmt', sub: '≤ 150 W Budget' },
              { id: 8, title: 'Stable Operation', sub: '≥ 4 Hours Run' },
            ].map((step) => {
              const isActive = activeWorkflowStep === step.id;
              const isPast = activeWorkflowStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveWorkflowStep(step.id)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-white ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20'
                      : isPast
                      ? 'bg-slate-900/90 border-slate-700 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs mb-1.5 ${
                    isActive ? 'bg-cyan-400 text-slate-950' : isPast ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.id}
                  </div>
                  <span className="font-mono text-xs font-bold leading-tight">{step.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">{step.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4">
            
            {activeWorkflowStep === 1 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">Step 1</span>
                  <span>Sense Machine Motion</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  Measurement of Motion, Force & Torque from Manufacturing Equipment
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  High-bandwidth 3-axis accelerometers, multi-axis force/torque load cells, and precision optical encoders capture the onset of internal robot motion, precursor valve switching, and wafer stage translation before vibrations reach the mounting platform.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Sensor Sampling Rate:</span>
                    <strong className="text-white text-sm">10.0 kHz</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Measured Parameters:</span>
                    <strong className="text-cyan-400 text-sm">Fx, Fy, Fz, Tx, Ty, Tz</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Noise Floor:</span>
                    <strong className="text-emerald-400 text-sm">&lt; 0.05 μg / √Hz</strong>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 2 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-sm">
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40">Step 2</span>
                  <span>Predict Reaction Force</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  Dynamic Model + Adaptive Learning for Reaction Estimation
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The on-board FPGA uses a predictive inverse-dynamics model coupled with adaptive learning (recursive parameter estimation) to forecast the exact magnitude and phase of reaction forces and moments generated by internal machine motion.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Prediction Latency:</span>
                    <strong className="text-white text-sm">&lt; 0.4 ms (Ahead of Pulse)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Adaptive Algorithm:</span>
                    <strong className="text-purple-400 text-sm">Recursive Least Squares</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Payload Tracking:</span>
                    <strong className="text-emerald-400 text-sm">Real-time Mass Auto-ID</strong>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 3 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
                  <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500/40">Step 3</span>
                  <span>Cancel Reaction Force</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  6-DOF Actuators Generate Counter Forces/Torques in Feedforward Mode
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Before the reaction force transmits into the spacecraft structure, the 6-DOF electromagnetic actuators fire synchronous counter-pulses in feedforward mode, guaranteeing that the net dynamic reaction at the spacecraft boundary remains virtually zero.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Counter Force Delivery:</span>
                    <strong className="text-white text-sm">Synchronous Feedforward</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Momentum Transfer:</span>
                    <strong className="text-red-400 text-sm">0.00 N·s Net Cancelled</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Interface Reaction:</span>
                    <strong className="text-emerald-400 text-sm">&lt; 0.02 N Peak Residual</strong>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 4 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">Step 4</span>
                  <span>Passive Isolation (QZS)</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  Reprogrammable Magnetic QZS Isolates Low-Frequency Vibrations (0.1 – 10 Hz)
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The Quasi-Zero Stiffness (QZS) magnetic stage provides virtually zero dynamic stiffness around the operating point. Low-frequency vibrations from solar array flutter, reaction wheel unbalance, and spacecraft thruster firings are passively isolated without drawing electrical power.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Isolation Bandwidth:</span>
                    <strong className="text-white text-sm">0.1 – 10.0 Hz</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Power Consumption:</span>
                    <strong className="text-emerald-400 text-sm">0.0 W (Passive Mechanism)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Resonance Attenuation:</span>
                    <strong className="text-cyan-400 text-sm">-32 dB at 2.0 Hz</strong>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 5 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">Step 5</span>
                  <span>Active Vibration Control</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  6-DOF Electromagnetic Actuators Suppress Residual Vibrations (1 – 100 Hz)
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Non-contact electromagnetic voice coil actuators generate micro-Newton counter-thrusts in all 6 spatial degrees of freedom, actively eliminating high-frequency residual vibration and acoustic disturbances between 1 and 100 Hz.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Suppression Bandwidth:</span>
                    <strong className="text-white text-sm">1.0 – 100.0 Hz</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Actuator Principle:</span>
                    <strong className="text-cyan-400 text-sm">Non-contact Lorentz Coils</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Residual Acceleration:</span>
                    <strong className="text-emerald-400 text-sm">&lt; 1 μm/s² RMS</strong>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 6 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/40">Step 6</span>
                  <span>Continuous Monitoring & Adaptation</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  Residual Vibration Measurement, Model Update & Parameter Tuning
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Laser gap sensors and platform accelerometers measure residual motion in real time. The digital controller continually tunes gain matrices and QZS magnetic bias points to compensate for wafer mass accumulation and thermal expansion.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Feedback Cycle Time:</span>
                    <strong className="text-white text-sm">100 μs Control Loop</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Parameter Convergence:</span>
                    <strong className="text-indigo-400 text-sm">&lt; 50 ms Fast Adapting</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Tracking Accuracy:</span>
                    <strong className="text-emerald-400 text-sm">99.8% Sub-Micron Hold</strong>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 7 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40">Step 7</span>
                  <span>Power Management (≤ 150 W)</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  Passive-First Architecture & Supercapacitor Energy Buffer
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Because low-frequency static loads are borne entirely by the zero-power magnetic QZS stage, active electromagnetic coils only fire during transient dynamic spikes. A supercapacitor buffer handles transient current surges while keeping steady bus draw under 150 W.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Active Power Limit:</span>
                    <strong className="text-amber-400 text-sm">≤ 150 W Governed Peak</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Nominal Active Draw:</span>
                    <strong className="text-emerald-400 text-sm">{liveIsolationPowerW} W Steady</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Supercapacitor State:</span>
                    <strong className="text-cyan-400 text-sm">{supercapBufferCharge}% Charged</strong>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 8 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">Step 8</span>
                  <span>Stable Long-Duration Operation (≥ 4 Hours)</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  Adaptive Control, Health Monitoring & Fault Handling
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Autonomous health monitoring algorithms check coil temperatures, flux sensors, and actuator currents. Redundant sensor voting and fail-safe soft-landing safeguards ensure continuous, undisturbed wafer growth for over 4 continuous hours per batch.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Required Stability:</span>
                    <strong className="text-white text-sm">≥ 4.0 Hours Continuous</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Current Batch Runtime:</span>
                    <strong className="text-emerald-400 text-sm">04h 28m 14s (Active)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Fault Recovery:</span>
                    <strong className="text-cyan-400 text-sm">Triple-Modular Redundant</strong>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: GaN SYNTHESIS PROCESS INSIDE MOCVD CHAMBER (1 - 5)     */}
      {/* ============================================================= */}
      {activeTab === 'mocvd' && (
        <div className="space-y-6">
          
          {/* Header Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>GaN Synthesis Process inside MOCVD Chamber</span>
                <span className="text-amber-400 font-semibold">(5 Step Lifecycle)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Pyrolytic Metalorganic Chemical Vapor Deposition on heated substrate in microgravity
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                Formula: <strong className="text-amber-300">Ga(CH₃)₃ + NH₃ → GaN + 3CH₄</strong>
              </span>
              <button
                onClick={() => setIsMocvdAutoPlaying(!isMocvdAutoPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isMocvdAutoPlaying
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isMocvdAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isMocvdAutoPlaying ? 'Pause Process' : 'Auto Play Steps'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Buttons (5 Steps) */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { id: 1, title: '1. Substrate Loading', desc: 'Wafer Load-Lock & Degas' },
              { id: 2, title: '2. Conditioning', desc: '800–1100°C, 50–300 Torr' },
              { id: 3, title: '3. GaN Growth', desc: 'TMGa + NH₃ Pyrolysis' },
              { id: 4, title: '4. Growth Monitoring', desc: 'In-Situ Pyrometer' },
              { id: 5, title: '5. Cool Down & Unload', desc: 'Purge & Wafer Cassette' },
            ].map((stg) => {
              const isActive = activeMocvdStep === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => setActiveMocvdStep(stg.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/50 text-white shadow-lg shadow-amber-950/40'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400 font-bold">
                      Stage {stg.id}
                    </span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                  </div>
                  <h4 className="text-xs font-mono font-bold text-white mb-0.5">{stg.title}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{stg.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Detailed View of Active MOCVD Step */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-4 font-mono">
            {activeMocvdStep === 1 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span>Step 1: Substrate Loading & Load-Lock Transfer</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  GaN / SiC / Sapphire Wafer Loaded into Vacuum Load-Lock
                </h3>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  A high-purity single-crystal substrate (GaN, Silicon Carbide, or Sapphire) is retrieved from the cassette and loaded into the separate load-lock chamber. The chamber is pumped down to high vacuum and heated to 200°C for surface degassing before the magnetic transfer arm delivers the substrate into the main MOCVD growth chamber.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Target Substrate:</span>
                    <strong className="text-white">GaN-on-Sapphire (2-inch)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Load-Lock Pressure:</span>
                    <strong className="text-cyan-400">1.2 × 10⁻⁶ Torr</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Degassing Temp:</span>
                    <strong className="text-amber-400">220°C (Inert Desorption)</strong>
                  </div>
                </div>
              </div>
            )}

            {activeMocvdStep === 2 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span>Step 2: Chamber Thermal Conditioning</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Chamber Heated to Growth Temperature (800 – 1100°C) at 50 – 300 Torr
                </h3>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  Induction heating elements ramp the susceptor to the target GaN deposition temperature (typically 1045°C). The throttle butterfly valve stabilizes reactor pressure between 50 and 300 Torr, while ultra-high purity H₂/N₂ carrier gases initiate smooth laminar flow through the distributor showerhead.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Chamber Setpoint:</span>
                    <strong className="text-rose-400">{chamberTempC}°C (RF Heated)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Reactor Pressure:</span>
                    <strong className="text-cyan-400">{chamberPressureTorr} Torr Regulated</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Carrier Gas Flow:</span>
                    <strong className="text-emerald-400">H₂ @ 12.0 slm / N₂ @ 4.0 slm</strong>
                  </div>
                </div>
              </div>
            )}

            {activeMocvdStep === 3 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span>Step 3: GaN Epitaxial Growth (MOCVD Reaction)</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Pyrolysis on Heated Substrate: TMGa + NH₃ → GaN + Byproducts
                </h3>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  Trimethylgallium (TMGa) vapor from the thermal bubbler canister is mixed with ammonia (NH₃) gas above the heated wafer. High thermal energy cracks the precursor bonds, depositing a pristine single-crystal epitaxial Gallium Nitride layer suitable for space-grade RF power amplifiers and high-efficiency power electronics.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">TMGa Precursor Flow:</span>
                    <strong className="text-amber-400">{mfdFlowRate} sccm (via bubbler)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">NH₃ Ammonia Flow:</span>
                    <strong className="text-cyan-400">3.5 slm (V/III ratio: 1200)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Growth Rate:</span>
                    <strong className="text-emerald-400">2.4 μm / hour</strong>
                  </div>
                </div>
              </div>
            )}

            {activeMocvdStep === 4 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span>Step 4: In-Situ Growth Monitoring</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Multi-Wavelength Optical Pyrometer & Real-Time Thickness Control
                </h3>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  In-situ laser reflectometry shines through the viewport, measuring interference fringes from the growing GaN layer. This enables real-time sub-nanometer thickness measurement, surface roughness validation, and instant feedback into the Mass Flow Controllers without touching or perturbing the wafer.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Laser Reflectometry:</span>
                    <strong className="text-white">λ = 633 nm Interferometer</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Current Film Thickness:</span>
                    <strong className="text-cyan-400">1.84 μm (Target: 2.00 μm)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Surface Crystalline:</span>
                    <strong className="text-emerald-400">Epitaxial Grade A (Zero Defects)</strong>
                  </div>
                </div>
              </div>
            )}

            {activeMocvdStep === 5 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span>Step 5: Cool Down, Purge & Output Cassette Transfer</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Precursor Shut-off, N₂/H₂ Purge & Automated Transfer to Wafer Vault
                </h3>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  Precursor valves shut off instantly. High-flow Nitrogen purges residual hydrocarbons and reaction byproducts out through the scrubbed exhaust. The wafer is cooled in a controlled thermal ramp (-35°C/min) down to ambient temperature, and the robotic arm places the finished GaN wafer into the sealed output cassette.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Cooling Rate:</span>
                    <strong className="text-white">-35°C / min (Controlled)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Purge Atmosphere:</span>
                    <strong className="text-cyan-400">High-Purity N₂ at 150 kPa</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Output Destination:</span>
                    <strong className="text-emerald-400">Sealed Product Vault #3</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 5: REQUIREMENTS VERIFICATION & LIVE OSCILLOSCOPE         */}
      {/* ============================================================= */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          
          {/* Dual-Trace Oscilloscope Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Dual-Trace Vibration Isolation Oscilloscope (0.1 – 100 Hz)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Compares base spacecraft disturbance vs isolated payload platform residual acceleration
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-rose-500 rounded" />
                  <span className="text-rose-300">Spacecraft Base Vibration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-400 rounded" />
                  <span className="text-emerald-300">Isolated Payload Platform</span>
                </div>
                <button
                  onClick={triggerMachineDisturbance}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-[11px] font-bold shadow transition cursor-pointer"
                >
                  Trigger Impulse
                </button>
              </div>
            </div>

            {/* Simulated Live SVG Scope */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
              <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-slate-500 border-b border-slate-800/60 pb-1">
                <span>CHANNEL A: Spacecraft Interface (0.1–100 Hz)</span>
                <span className="text-rose-400 font-bold">Base Amp: {baseVibrationPoints[baseVibrationPoints.length - 1]} mm/s²</span>
                <span>CHANNEL B: GaN MOCVD Platform</span>
                <span className="text-emerald-400 font-bold">Residual Amp: {isolatedVibrationPoints[isolatedVibrationPoints.length - 1]} μm/s²</span>
                <span>ISOLATION RATIO: <strong className="text-cyan-400 font-bold">99.6% REDUCTION</strong></span>
              </div>

              <svg viewBox="0 0 700 130" className="w-full h-32 overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1="20" x2="700" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="0" y1="65" x2="700" y2="65" stroke="#334155" strokeWidth="0.8" />
                <line x1="0" y1="110" x2="700" y2="110" stroke="#1e293b" strokeDasharray="3,3" />

                {/* Base Vibration Trace (Red Wave) */}
                <polyline
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  points={baseVibrationPoints.map((v, i) => `${(i / (baseVibrationPoints.length - 1)) * 700},${65 - (v * 1.3)}`).join(' ')}
                />

                {/* Isolated Platform Trace (Green Serene Wave) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  points={isolatedVibrationPoints.map((v, i) => `${(i / (isolatedVibrationPoints.length - 1)) * 700},${65 - (v * 10)}`).join(' ')}
                />
              </svg>

              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2">
                <span>0.0s (Time Domain)</span>
                <span>1.0s</span>
                <span>2.0s</span>
                <span>3.0s</span>
                <span>Real-Time Feedforward Response: Active</span>
              </div>
            </div>
          </div>

          {/* How Requirements Are Met (From Image 1) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>How Engineering Requirements are Met (HAP-NRIP Specifications)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Requirement 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Prevents Unwanted Momentum Transfer to Spacecraft
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  → <strong>Predictive Reaction-Force Cancellation (6-DOF):</strong> Feedforward inverse dynamics estimate internal machine force/torque and command synchronous counter-forces ahead of pulse arrival, neutralizing momentum transfer at the satellite interface.
                </p>
              </div>

              {/* Requirement 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Isolates 0.1 – 100 Hz Vibrations
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  → <strong>Magnetic QZS (0.1 – 10 Hz) + Active 6-DOF (1 – 100 Hz):</strong> Multi-stage hybrid isolation leverages passive zero-stiffness magnetic levitation for ultralow frequencies and active electromagnetic Lorentz coils for wideband micro-vibrations.
                </p>
              </div>

              {/* Requirement 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    Active Isolation Power ≤ 150 W
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  → <strong>Passive-First Design, Adaptive Control, Energy Buffer:</strong> The passive magnetic QZS stage sustains static mass with 0 W. Active coils only fire during dynamic disturbances with supercapacitor buffer absorbing current spikes, holding steady consumption to ~112 W.
                </p>
              </div>

              {/* Requirement 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    Stable Operation for ≥ 4 Hours
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 font-bold border border-indigo-500/30">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  → <strong>Continuous Monitoring, Adaptation and Fault Handling:</strong> Closed-loop parameter identification automatically compensates for wafer mass deposition, thermal coil drift, and satellite station-keeping disturbances, guaranteeing over 4 continuous hours of wafer growth.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
