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
  Atom,
  RefreshCw,
  Clock,
  BatteryCharging,
  Eye,
  Check,
  Filter,
  PackageCheck,
  Disc,
  ArrowDownCircle,
  TrendingUp,
  SlidersHorizontal,
  Workflow
} from 'lucide-react';
import { IsroLogo } from './IsroLogo';

type AercsTab = 'workflow' | 'clean-path' | 'debris-path' | 'control-logic' | 'simulator';

export const AercsGanSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AercsTab>('workflow');

  // Path A: Product Handling Workflow (Steps 1 - 8)
  const [activeCleanStep, setActiveCleanStep] = useState<number>(1);
  const [isCleanAutoPlaying, setIsCleanAutoPlaying] = useState<boolean>(false);

  // Path B: Debris Containment & Recovery Workflow (Steps 1 - 8)
  const [activeDebrisStep, setActiveDebrisStep] = useState<number>(1);
  const [isDebrisAutoPlaying, setIsDebrisAutoPlaying] = useState<boolean>(false);

  // Path C: Control & Power Operational State (1 - 5)
  const [controlState, setControlState] = useState<number>(1); // 1: Low Power, 2: Event Detect, 3: Active Capture, 4: Event Clearance, 5: Supercapacitor Power

  // Live Interactive Simulator States
  const [particleConcentration, setParticleConcentration] = useState<number>(2.4); // pcs / m³
  const [isBlowerActive, setIsBlowerActive] = useState<boolean>(false);
  const [isEdsPulsing, setIsEdsPulsing] = useState<boolean>(false);
  const [deltaPressurePa, setDeltaPressurePa] = useState<number>(18.4);
  const [supercapBufferCharge, setSupercapBufferCharge] = useState<number>(98.6);
  const [simulatedPowerDrawW, setSimulatedPowerDrawW] = useState<number>(42);
  const [robotArmState, setRobotArmState] = useState<'standby' | 'picking' | 'transferring' | 'docked'>('standby');
  const [podStatus, setPodStatus] = useState<'open' | 'purging' | 'sealed'>('sealed');

  // Three material classification counts (grams captured)
  const [ganScrapGrams, setGanScrapGrams] = useState<number>(14.2);
  const [gaRichResidueGrams, setGaRichResidueGrams] = useState<number>(8.7);
  const [mixedWasteGrams, setMixedWasteGrams] = useState<number>(3.1);

  // Step 2 Environment checks state
  const [envChecks, setEnvChecks] = useState({
    particleLevel: 'LOW',
    pressure: 'OK',
    temperature: 'OK',
    systemStatus: 'OK'
  });

  // Auto-play for Path A (Clean Path)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCleanAutoPlaying) {
      timer = setInterval(() => {
        setActiveCleanStep((prev) => (prev >= 8 ? 1 : prev + 1));
      }, 2600);
    }
    return () => clearInterval(timer);
  }, [isCleanAutoPlaying]);

  // Auto-play for Path B (Debris Path)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDebrisAutoPlaying) {
      timer = setInterval(() => {
        setActiveDebrisStep((prev) => (prev >= 8 ? 1 : prev + 1));
      }, 2800);
    }
    return () => clearInterval(timer);
  }, [isDebrisAutoPlaying]);

  // Telemetry fluctuation loop
  useEffect(() => {
    const timer = setInterval(() => {
      // Natural micro-particle fluctuation or decay if blower is on
      setParticleConcentration((prev) => {
        if (isBlowerActive || isEdsPulsing) {
          return parseFloat(Math.max(1.8, prev - 1.2).toFixed(1));
        }
        const noise = (Math.random() - 0.48) * 0.3;
        return parseFloat(Math.max(1.5, Math.min(12.0, prev + noise)).toFixed(1));
      });

      // Filter delta P
      setDeltaPressurePa((prev) => {
        const target = isBlowerActive ? 34.2 : 18.2;
        const delta = (target - prev) * 0.2 + (Math.random() - 0.5) * 0.4;
        return parseFloat((prev + delta).toFixed(1));
      });

      // Power draw calculation
      setSimulatedPowerDrawW(() => {
        let base = 28; // low power standby
        if (isBlowerActive) base += 35;
        if (isEdsPulsing) base += 14;
        if (robotArmState !== 'standby') base += 22;
        const noise = (Math.random() - 0.5) * 2;
        return Math.round(base + noise);
      });

      // Supercapacitor buffer micro-level
      setSupercapBufferCharge((prev) => {
        const delta = isBlowerActive ? -0.1 : 0.05;
        return parseFloat(Math.min(100, Math.max(92, prev + delta)).toFixed(1));
      });
    }, 700);

    return () => clearInterval(timer);
  }, [isBlowerActive, isEdsPulsing, robotArmState]);

  // Trigger Debris Event in Simulator
  const triggerDebrisSpill = () => {
    setParticleConcentration(48.5);
    setControlState(2); // Event Detected
    setTimeout(() => {
      setControlState(3); // Active Capture
      setIsBlowerActive(true);
      setIsEdsPulsing(true);
      setGanScrapGrams((g) => parseFloat((g + 1.8).toFixed(1)));
      setGaRichResidueGrams((g) => parseFloat((g + 0.9).toFixed(1)));
      setMixedWasteGrams((g) => parseFloat((g + 0.4).toFixed(1)));
    }, 1200);

    setTimeout(() => {
      setControlState(4); // Event Clearance
      setIsEdsPulsing(false);
    }, 5000);

    setTimeout(() => {
      setIsBlowerActive(false);
      setControlState(1); // Return to Low Power
    }, 7000);
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
              <div className="w-10 h-10 rounded-xl bg-[#080F1E] border border-[#26364D] p-1 flex items-center justify-center shadow-lg">
                <IsroLogo size={36} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#3973FF]/15 text-[#00D9FF] border border-[#3973FF]/30 flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5 text-[#00D9FF] animate-spin" style={{ animationDuration: '10s' }} />
                AUTONOMOUS ELECTROSTATIC ROBOTIC SYSTEM
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                DUAL-PATH ZERO-DEBRIS ARCHITECTURE
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-heading">
                AERCS-GaN : Workflow
              </h1>
              <p className="text-sm font-semibold text-[#00D9FF] font-mono mt-0.5">
                Autonomous Electrostatic Robotic Containment & Recovery System for Space-Based GaN Manufacturing
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#A7B4C8] max-w-3xl leading-relaxed">
              Provides dual autonomous containment streams: <strong className="text-emerald-300">Clean Path A (Catching the Product)</strong> with low-jerk conductive ceramic robotic pickup and hermetic N₂-purged storage pods; and <strong className="text-amber-300">Debris Path B (Containing the Mess)</strong> utilizing Electrodynamic Dust Shields (EDS), 3-stage filtration (ΔP), and 3-stream material classification into sealed return cartridges.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#26364D]">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'workflow'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Workflow className="w-4 h-4 text-[#00D9FF]" />
            <span>Complete Architecture & Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('clean-path')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'clean-path'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>A. Product Handling (Clean Path 1–8)</span>
          </button>

          <button
            onClick={() => setActiveTab('debris-path')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'debris-path'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Wind className="w-4 h-4 text-amber-400" />
            <span>B. Debris Containment & Recovery (1–8)</span>
          </button>

          <button
            onClick={() => setActiveTab('control-logic')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'control-logic'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#00D9FF]" />
            <span>C. Control, Power & System Logic</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-[#3973FF] text-[#F8FAFC] shadow-lg shadow-[#3973FF]/20 border border-[#00D9FF]/40'
                : 'bg-[#0C1628] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#111C30] border border-[#26364D]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#00D9FF]" />
            <span>Live Interactive Containment Sim</span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: COMPLETE ARCHITECTURE & DUAL-PATH WORKFLOW VIEW       */}
      {/* ============================================================= */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          
          {/* Dual Flow Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Stream A Summary Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    PATH A: CLEAN PRODUCT FLOW
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">8 Steps</span>
                </div>
                <h3 className="text-sm font-mono font-bold text-white mb-1">
                  Product Handling Workflow – Catching the Product
                </h3>
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Goal:</strong> Securely contain finished GaN wafer products from growth completion to N₂-purged hermetic storage pods without particle contamination or contact abrasion.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Key Mechanism:</span>
                <span className="text-emerald-300 font-semibold">Conductive Ceramic Gripper & Kinematic Docking</span>
              </div>
            </div>

            {/* Stream B Summary Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                    PATH B: DEBRIS CONTAINMENT FLOW
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">8 Steps</span>
                </div>
                <h3 className="text-sm font-mono font-bold text-white mb-1">
                  Debris Containment & Recovery – Containing the Mess
                </h3>
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Goal:</strong> Prevent floating particulates in microgravity, electrostatically sweep surfaces with pulsed EDS, trap aerosols via 3-stage filtration, and sort scrap into 3 recovery canisters.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Key Mechanism:</span>
                <span className="text-amber-300 font-semibold">Pulsed EDS + Multi-Stage Ga-Trap + 3-Stream Sort</span>
              </div>
            </div>

          </div>

          {/* Detailed Dual-Path Flow Chart Grid */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            
            {/* PATH A SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                    A. Product Handling Workflow – Catching the Product (Clean Path)
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 hidden sm:inline-block">
                  Goal: Securely contain finished GaN products
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Step A1 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      1
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">GaN Manufacturing Completed</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• GaN wafer grown/processed</li>
                    <li>• Process parameters stable</li>
                    <li>• Ready for transfer</li>
                  </ul>
                </div>

                {/* Step A2 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      2
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Environment Check</h4>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono grid grid-cols-2 gap-1 mb-1.5 text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-400">Particle: LOW ✓</span>
                    <span className="flex items-center gap-1 text-emerald-400">Pressure: OK ✓</span>
                    <span className="flex items-center gap-1 text-emerald-400">Temp: OK ✓</span>
                    <span className="flex items-center gap-1 text-emerald-400">System: OK ✓</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Confirm safe transfer condition</p>
                </div>

                {/* Step A3 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      3
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Vision Detection & Inspection</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Locate wafer $(x, y, z, \theta)$</li>
                    <li>• Inspect surface & edges</li>
                    <li>• Generate pick coordinates</li>
                  </ul>
                </div>

                {/* Step A4 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      4
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Robotic Pick-up</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Conductive ceramic gripper</li>
                    <li>• Low-jerk motion profile</li>
                    <li>• Force-controlled pickup</li>
                    <li>• Minimal particle generation</li>
                  </ul>
                </div>

                {/* Step A5 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      5
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Transfer through Clean Tunnel</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Enclosed transfer path</li>
                    <li>• Isolates product from process</li>
                    <li>• Laminar micro-purge zone</li>
                  </ul>
                </div>

                {/* Step A6 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      6
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Kinematic Docking</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Align, verify, dock</li>
                    <li>• Mechanical positive retention</li>
                    <li>• Zero sliding contact/friction</li>
                  </ul>
                </div>

                {/* Step A7 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      7
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Hermetic Product Pod</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Wafer insertion</li>
                    <li>• Inert N₂ purge (150 kPa)</li>
                    <li>• Seal & mechanical lock</li>
                    <li>• In-situ leak verification</li>
                  </ul>
                </div>

                {/* Step A8 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      8
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Secure Product Storage</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Wafers stored in sealed pods</li>
                    <li>• RFID & batch ID tracking</li>
                    <li>• Ready for in-space use / Earth return</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* PATH B SECTION */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                    B. Debris Containment & Recovery Workflow – Containing the Mess (Debris Path)
                  </h3>
                </div>
                <span className="text-xs font-mono text-amber-400 hidden sm:inline-block">
                  Goal: Prevent floating debris, capture and recycle leftover materials
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Step B1 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      1
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Debris Generation</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Process residues & flaking</li>
                    <li>• Wafer edge fragments</li>
                    <li>• Coating particulates</li>
                    <li>• In microgravity: do not settle!</li>
                  </ul>
                </div>

                {/* Step B2 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      2
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Particle Detection & Localization</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Optical scattering sensors</li>
                    <li>• AI-based source triangulation</li>
                    <li>• Real-time concentration log</li>
                    <li>• Trigger capture system</li>
                  </ul>
                </div>

                {/* Step B3 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      3
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Local Capture Activation</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Directional airflow (local plenum)</li>
                    <li>• Variable-speed micro-blower</li>
                    <li>• Captures debris at source</li>
                    <li>• Prevents cabin dispersion</li>
                  </ul>
                </div>

                {/* Step B4 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      4
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Electrodynamic Dust Shield (EDS)</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Pulsed low-voltage traveling wave</li>
                    <li>• Moves surface dust to ports</li>
                    <li>• Operates concurrently with airflow</li>
                    <li>• Zero mechanical contact</li>
                  </ul>
                </div>

                {/* Step B5 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      5
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Multi-Stage Filtration</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center mb-1">
                    <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <strong>Stage 1</strong><br />Coarse
                    </div>
                    <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <strong>Stage 2</strong><br />Fine/ULPA
                    </div>
                    <div className="p-1 rounded bg-slate-900 border border-slate-800 text-amber-300">
                      <strong>Stage 3</strong><br />Ga-Trap
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Differential ΔP monitored</p>
                </div>

                {/* Step B6 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      6
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Material Classification</h4>
                  </div>
                  <div className="space-y-1 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-cyan-300">
                      <span>• GaN Scrap:</span>
                      <span className="font-bold">{ganScrapGrams} g</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-300">
                      <span>• Ga-rich Residue:</span>
                      <span className="font-bold">{gaRichResidueGrams} g</span>
                    </div>
                    <div className="flex items-center justify-between text-rose-300">
                      <span>• Mixed Waste:</span>
                      <span className="font-bold">{mixedWasteGrams} g</span>
                    </div>
                  </div>
                </div>

                {/* Step B7 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      7
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Recovery Cartridges</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• 3 sealed modular canisters</li>
                    <li>• Hermetically locked when full</li>
                    <li>• Safe storage for Earth return</li>
                    <li>• Ready for in-situ recycling</li>
                  </ul>
                </div>

                {/* Step B8 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold">
                      8
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">Cartridge Handling by Robot</h4>
                  </div>
                  <ul className="text-[11px] text-slate-300 font-mono space-y-0.5">
                    <li>• Remove full canister</li>
                    <li>• Install fresh cartridge</li>
                    <li>• Autonomous indexing carousel</li>
                    <li>• Zero astronaut EVA intervention</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* SECTION C SUMMARY */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  C. Central Controller (AI/MCU) & Supercapacitor Power Bus
                </span>
                <p className="text-xs text-slate-300">
                  Operates on an event-driven 5-state logic loop. Energy demands are governed by an isolated supercapacitor buffer drawing ≤ 150 W peak from the spacecraft bus.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('control-logic')}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  <span>Explore Control Logic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: PATH A - CLEAN PRODUCT WORKFLOW (STEP 1 - 8)          */}
      {/* ============================================================= */}
      {activeTab === 'clean-path' && (
        <div className="space-y-6">
          
          {/* Header & Controls */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Path A: Product Handling Workflow (Clean Path)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Step-by-step wafer extraction, vision verification, low-jerk robotic transfer, and hermetic N₂ pod sealing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCleanAutoPlaying(!isCleanAutoPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isCleanAutoPlaying
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isCleanAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isCleanAutoPlaying ? 'Pause Stepper' : 'Auto Play Steps'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Buttons (1 - 8) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { id: 1, title: 'Growth Complete', sub: 'Reactor Ready' },
              { id: 2, title: 'Env Check', sub: 'Particles & P/T' },
              { id: 3, title: 'Vision Inspect', sub: 'Coordinate Map' },
              { id: 4, title: 'Robotic Pick', sub: 'Ceramic Gripper' },
              { id: 5, title: 'Clean Tunnel', sub: 'Enclosed Path' },
              { id: 6, title: 'Kinematic Dock', sub: 'Zero Contact' },
              { id: 7, title: 'Hermetic Pod', sub: 'N₂ Purge & Seal' },
              { id: 8, title: 'Secure Vault', sub: 'RFID Tracking' }
            ].map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveCleanStep(step.id);
                  setIsCleanAutoPlaying(false);
                }}
                className={`p-2.5 rounded-xl border text-left font-mono transition cursor-pointer flex flex-col justify-between ${
                  activeCleanStep === step.id
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    activeCleanStep === step.id ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    A{step.id}
                  </span>
                  {activeCleanStep === step.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </div>
                <div>
                  <strong className="block text-xs leading-tight">{step.title}</strong>
                  <span className={`text-[9px] block ${
                    activeCleanStep === step.id ? 'text-emerald-100' : 'text-slate-500'
                  }`}>{step.sub}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Detailed Showcase */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4">
            
            {activeCleanStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      STEP A1 • PROCESS FINALIZATION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">GaN Manufacturing Completed in MOCVD Chamber</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    STATUS: READY FOR TRANSFER
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-mono text-slate-400 block">Growth Layer:</span>
                    <strong className="text-sm font-mono text-white">2.4 μm Single-Crystal GaN Epilayer</strong>
                    <p className="text-[11px] text-slate-400">Grown on 4-inch Sapphire substrate with zero dislocation clustering.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-mono text-slate-400 block">Thermal Ramp Down:</span>
                    <strong className="text-sm font-mono text-cyan-400">1050°C → 45°C (Controlled 35°C/min)</strong>
                    <p className="text-[11px] text-slate-400">Inert N₂ atmosphere prevents lattice micro-cracking during cool-down.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-mono text-slate-400 block">Chamber Pressure:</span>
                    <strong className="text-sm font-mono text-emerald-400">101.3 kPa (Equalized to Transfer Tunnel)</strong>
                    <p className="text-[11px] text-slate-400">Vacuum differential balanced to eliminate convective blast wave.</p>
                  </div>
                </div>
              </div>
            )}

            {activeCleanStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      STEP A2 • SAFETY INTERLOCK VERIFICATION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Environmental Safety Gates Verification</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    INTERLOCKS: 4/4 PASS
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/50 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Particle Level</span>
                    <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> LOW
                    </div>
                    <span className="text-[9px] text-slate-500">2.1 pcs/m³ (ISO 1)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/50 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Pressure</span>
                    <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> OK
                    </div>
                    <span className="text-[9px] text-slate-500">101.3 kPa ± 0.2</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/50 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Temperature</span>
                    <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> OK
                    </div>
                    <span className="text-[9px] text-slate-500">42.8°C Safe Touch</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/50 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">System Status</span>
                    <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> OK
                    </div>
                    <span className="text-[9px] text-slate-500">All Valves Nominal</span>
                  </div>
                </div>
              </div>
            )}

            {activeCleanStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      STEP A3 • MACHINE VISION INSPECTION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Vision Detection & Surface Micro-Inspection</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    COORDINATES GENERATED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                    <span className="text-cyan-400 font-bold block mb-1">Wafer Center & Orientation Vector</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="p-2 rounded bg-slate-900">X: <strong>+142.38 mm</strong></div>
                      <div className="p-2 rounded bg-slate-900">Y: <strong>-58.12 mm</strong></div>
                      <div className="p-2 rounded bg-slate-900">Z: <strong>+84.05 mm</strong></div>
                      <div className="p-2 rounded bg-slate-900">θ (Theta): <strong>14.28°</strong></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                    <span className="text-emerald-400 font-bold block mb-1">Surface Quality & Edge Integrity</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      <li>• Edge bevel runout: &lt; 2.5 μm (Clean)</li>
                      <li>• Surface particulate count: 0 micro-scratches</li>
                      <li>• Crystalline bow / warp: &lt; 8.0 μm (Flight Grade)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeCleanStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      STEP A4 • NON-ABRASIVE EXTRACTION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Robotic Pick-up via Conductive Ceramic End-Effector</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    LATCHED: 1.4 N
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">Conductive Ceramic Gripper</span>
                    <p className="text-[11px] text-slate-400">Electrostatic dissipative ceramic (ESD-safe 10⁷ Ω) prevents static discharge.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">Low-Jerk S-Curve Motion</span>
                    <p className="text-[11px] text-slate-400">Quintic polynomial trajectory limits acceleration jerk to &lt; 0.05 m/s³.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-indigo-400 font-bold block mb-1">Force-Controlled Grip</span>
                    <p className="text-[11px] text-slate-400">Closed-loop load cells maintain a gentle 1.4 N edge clamp force.</p>
                  </div>
                </div>
              </div>
            )}

            {activeCleanStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      STEP A5 • ISOLATED TRANSIT
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Transfer Through Hermetically Enclosed Clean Tunnel</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    ISO-1 CLEAN ENCLOSURE
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300">
                    The enclosed transfer tunnel physically separates the wafer from the reactor process environment, using a constant micro-laminar N₂ purge (0.2 m/s) to guarantee zero particle deposition during the 450 mm transit path.
                  </p>
                </div>
              </div>
            )}

            {activeCleanStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      STEP A6 • KINEMATIC DOCKING
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Kinematic Alignment & Mechanical Retention</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    REPEATABILITY: &lt; 1 μm
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-indigo-400 font-bold block mb-1">Maxwell 3-Ball Kinematic Seat</span>
                    <p className="text-[11px] text-slate-300">
                      Exact-constraint mechanical docking without sliding contact eliminates friction-generated particulate shedding.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">Optical Verification Confirmation</span>
                    <p className="text-[11px] text-slate-300">
                      Dual optical micro-switches verify 100% seating before the transfer arm disengages from the wafer carrier.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeCleanStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      STEP A7 • POD SEALING & PURGE
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Hermetic Product Pod Insertion & Inert Gas Purge</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    LEAK RATE: &lt; 10⁻⁹ mbar·L/s
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">Wafer Insertion</span>
                    <p className="text-[11px] text-slate-400">Positioned gently on elastomer-damped internal support rings.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">Ultra-Pure N₂ Purge</span>
                    <p className="text-[11px] text-slate-400">150 kPa nitrogen flush removes oxygen trace to &lt; 0.1 ppm.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-1">Bistable Latching Seal</span>
                    <p className="text-[11px] text-slate-400">Hermetic knife-edge seal locked with zero ongoing electrical power.</p>
                  </div>
                </div>
              </div>
            )}

            {activeCleanStep === 8 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      STEP A8 • FLIGHT VAULT STORAGE
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Secure Product Storage in Pod Carousel Vault</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    TRACKED: LOT #GaN-2026-09
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300">
                    Finished GaN wafers are safely locked inside sealed return-grade pods with permanent RFID tags containing complete in-situ growth pyrometer logs, lattice metrics, and batch timestamps. Ready for payload return or direct in-orbit payload assembly.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: PATH B - DEBRIS CONTAINMENT WORKFLOW (STEP 1 - 8)     */}
      {/* ============================================================= */}
      {activeTab === 'debris-path' && (
        <div className="space-y-6">
          
          {/* Header & Controls */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Path B: Debris Containment & Recovery Workflow (Debris Path)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Pulsed Electrodynamic Dust Shield (EDS), 3-stage filtration with $\Delta P$, and 3-stream material classification.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDebrisAutoPlaying(!isDebrisAutoPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isDebrisAutoPlaying
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {isDebrisAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isDebrisAutoPlaying ? 'Pause Stepper' : 'Auto Play Steps'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Buttons (1 - 8) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { id: 1, title: 'Debris Gen', sub: 'Micro-G Float' },
              { id: 2, title: 'Optical Detect', sub: 'AI Localization' },
              { id: 3, title: 'Plenum Capture', sub: 'Micro-Blower' },
              { id: 4, title: 'Pulsed EDS', sub: 'Surface Wave' },
              { id: 5, title: '3-Stage Filter', sub: 'Ga-Trap & ΔP' },
              { id: 6, title: 'Classification', sub: '3-Stream Sort' },
              { id: 7, title: 'Cartridges', sub: 'Sealed Canisters' },
              { id: 8, title: 'Robot Swap', sub: 'Index Fresh Pod' }
            ].map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveDebrisStep(step.id);
                  setIsDebrisAutoPlaying(false);
                }}
                className={`p-2.5 rounded-xl border text-left font-mono transition cursor-pointer flex flex-col justify-between ${
                  activeDebrisStep === step.id
                    ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    activeDebrisStep === step.id ? 'bg-amber-950 text-amber-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    B{step.id}
                  </span>
                  {activeDebrisStep === step.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </div>
                <div>
                  <strong className="block text-xs leading-tight">{step.title}</strong>
                  <span className={`text-[9px] block ${
                    activeDebrisStep === step.id ? 'text-amber-100' : 'text-slate-500'
                  }`}>{step.sub}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Debris Step Content */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4">
            
            {activeDebrisStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      STEP B1 • ZERO-G PARTICLE DYNAMICS
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Debris Generation in Microgravity Environment</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-red-950 text-red-300 border border-red-500/30">
                    CRITICAL HAZARD
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                  <p className="text-slate-300 leading-relaxed">
                    Unlike terrestrial semiconductor cleanrooms where gravitational settling pulls micro-particles downward onto sticky mats, <strong className="text-amber-300">particulates in microgravity remain indefinitely airborne</strong>. Process residues, wafer edge chips, and coating flakes threaten optical pyrometers and future epitaxy runs if not actively extracted at the source.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <strong>Residues:</strong> TMGa pyrolytic soot
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <strong>Fragments:</strong> GaN substrate micro-chips
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <strong>Aerosols:</strong> Gallium condensate droplets
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDebrisStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      STEP B2 • MULTI-SENSOR FUSION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Optical Particle Detection & AI Source Localization</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-amber-950 text-amber-300 border border-amber-500/30">
                    SCAN INTERVAL: 50 ms
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-bold block mb-1">Dual Laser Scattering Sensors</span>
                    <p className="text-[11px] text-slate-300">
                      Forward and side-scatter laser diodes (λ = 650 nm) measure single-particle concentrations down to 0.1 μm.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-cyan-400 font-bold block mb-1">AI Triangulation Algorithm</span>
                    <p className="text-[11px] text-slate-300">
                      Neural spatial estimator maps particle velocity vectors back to specific origin valves or susceptor edges.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeDebrisStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      STEP B3 • SOURCE SUCTION PLENUM
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Local Capture Activation via Micro-Blower</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    AIRFLOW: 12.4 m/s
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">Directional Airflow</span>
                    <p className="text-[11px] text-slate-400">Ring-shaped local plenum draws particles inward before they drift.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-1">Variable-Speed Micro-Blower</span>
                    <p className="text-[11px] text-slate-400">Brushless DC motor ramps from 0 to 18 m/s within 200 ms.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">Low-Disturbance Exhaust</span>
                    <p className="text-[11px] text-slate-400">Counter-balanced airflow manifold prevents torque onto HAP-NRIP platform.</p>
                  </div>
                </div>
              </div>
            )}

            {activeDebrisStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      STEP B4 • ELECTRODYNAMIC DUST SHIELD
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Electrodynamic Dust Shield (EDS) for Chamber Surfaces</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    TRAVELING WAVE: 4-PHASE 42 V
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300">
                    Embedded copper micro-electrodes produce a 4-phase traveling electrostatic wave (42 V AC) across reactor walls and transfer ports. This electrostatically lifts and moves adhering particles into the airflow suction nozzles without mechanical wipers.
                  </p>
                </div>
              </div>
            )}

            {activeDebrisStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      STEP B5 • CASCADE FILTRATION
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Multi-Stage Filtration & Differential Pressure (ΔP) Monitoring</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    ΔP: {deltaPressurePa} Pa (NOMINAL)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-300 font-bold block mb-1">Stage 1: Coarse Pre-Filter</span>
                    <p className="text-[11px] text-slate-400">Traps large wafer fragments (&gt; 50 μm) with sintered metal mesh.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-cyan-300 font-bold block mb-1">Stage 2: Fine / ULPA</span>
                    <p className="text-[11px] text-slate-400">99.999% retention of sub-micron aerosols (0.1 – 50 μm).</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-amber-300 font-bold block mb-1">Stage 3: Ga-Containing Trap</span>
                    <p className="text-[11px] text-slate-400">Specialized chemical adsorbent capturing volatile organometallic traces.</p>
                  </div>
                </div>
              </div>
            )}

            {activeDebrisStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      STEP B6 • IN-SITU SORTING
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Material Classification into 3 Discrete Streams</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    PURITY: 99.4%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                    <strong className="text-cyan-300 block mb-1 text-sm">1. GaN Scrap ({ganScrapGrams} g)</strong>
                    <p className="text-[11px] text-slate-300">
                      High-purity crystalline GaN wafer shards. Suitable for direct re-evaporation and crystal re-synthesis in orbit.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40">
                    <strong className="text-amber-300 block mb-1 text-sm">2. Ga-Rich Residue ({gaRichResidueGrams} g)</strong>
                    <p className="text-[11px] text-slate-300">
                      Condensed metallic Gallium deposits scraped from showerhead and exhaust lines. High intrinsic recycling value.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40">
                    <strong className="text-rose-300 block mb-1 text-sm">3. Mixed Waste ({mixedWasteGrams} g)</strong>
                    <p className="text-[11px] text-slate-300">
                      Non-recoverable polymeric residues, carbonaceous soot, and particulate trace isolated in Earth-return canister.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeDebrisStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      STEP B7 • RECOVERY CONTAINMENT
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Collection into 3 Hermetic Recovery Cartridges</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    HERMETIC CARTRIDGES READY
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300">
                    Each classified stream is directed via diverter valves into individual stainless-steel collection canisters with automatic mechanical latching caps, preventing any cross-contamination.
                  </p>
                </div>
              </div>
            )}

            {activeDebrisStep === 8 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      STEP B8 • ROBOTIC CARTRIDGE SWAP
                    </span>
                    <h4 className="text-base font-mono font-bold text-white">Cartridge Handling by Robot & Fresh Module Loading</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    AUTONOMOUS SWAP: 18.4 s
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                  <p className="text-slate-300">
                    When differential pressure or fill sensors detect cartridge saturation, the internal transfer robot unlocks the full canister, moves it into the recovery carousel bay, and indexes a fresh sterile cartridge in place.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: PATH C - CONTROL, POWER & SYSTEM LOGIC                */}
      {/* ============================================================= */}
      {activeTab === 'control-logic' && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                  C. Control, Power & System Logic – When and How It Operates
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Central Controller (AI/MCU) event-driven loop and supercapacitor peak power governance (≤ 150 W).
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Current Operating State:</span>
              <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-bold">
                {controlState === 1 ? '1. Continuous Monitoring' : controlState === 2 ? '2. Event Detection' : controlState === 3 ? '3. Active Capture Mode' : controlState === 4 ? '4. Event Clearance' : '5. Power Management'}
              </span>
            </div>
          </div>

          {/* 5-State Sequential Operational Map */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            
            {/* State 1 */}
            <button
              onClick={() => setControlState(1)}
              className={`p-3.5 rounded-xl border text-left font-mono transition cursor-pointer flex flex-col justify-between ${
                controlState === 1
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300">
                    STATE 1
                  </span>
                  {controlState === 1 && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                </div>
                <h4 className="text-xs font-bold mb-1">Continuous Monitoring</h4>
                <p className={`text-[10px] mb-2 ${controlState === 1 ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Low-Power Standby Mode
                </p>
              </div>
              <ul className={`text-[10px] space-y-0.5 ${controlState === 1 ? 'text-indigo-100' : 'text-slate-400'}`}>
                <li>• Particle sensors ON</li>
                <li>• System health ON</li>
                <li>• Robot standby</li>
                <li>• Blower low/standby</li>
                <li>• EDS OFF</li>
              </ul>
            </button>

            {/* State 2 */}
            <button
              onClick={() => setControlState(2)}
              className={`p-3.5 rounded-xl border text-left font-mono transition cursor-pointer flex flex-col justify-between ${
                controlState === 2
                  ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-amber-300">
                    STATE 2
                  </span>
                  {controlState === 2 && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                </div>
                <h4 className="text-xs font-bold mb-1">Event Detection</h4>
                <p className={`text-[10px] mb-2 ${controlState === 2 ? 'text-amber-100' : 'text-slate-400'}`}>
                  Threshold Comparison
                </p>
              </div>
              <ul className={`text-[10px] space-y-0.5 ${controlState === 2 ? 'text-amber-100' : 'text-slate-400'}`}>
                <li>• Particle &gt; threshold?</li>
                <li>• Sensor fusion analysis</li>
                <li>• Pressure/image check</li>
                <li>• Machine motion state</li>
                <li>• Debris trigger event</li>
              </ul>
            </button>

            {/* State 3 */}
            <button
              onClick={() => setControlState(3)}
              className={`p-3.5 rounded-xl border text-left font-mono transition cursor-pointer flex flex-col justify-between ${
                controlState === 3
                  ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-red-300">
                    STATE 3
                  </span>
                  {controlState === 3 && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                </div>
                <h4 className="text-xs font-bold mb-1">Active Capture Mode</h4>
                <p className={`text-[10px] mb-2 ${controlState === 3 ? 'text-red-100' : 'text-slate-400'}`}>
                  Triggered Operation
                </p>
              </div>
              <ul className={`text-[10px] space-y-0.5 ${controlState === 3 ? 'text-red-100' : 'text-slate-400'}`}>
                <li>• Variable blower ON</li>
                <li>• Pulsed EDS ON</li>
                <li>• Required valves ON</li>
                <li>• Robot active if needed</li>
                <li>• Capture at source</li>
              </ul>
            </button>

            {/* State 4 */}
            <button
              onClick={() => setControlState(4)}
              className={`p-3.5 rounded-xl border text-left font-mono transition cursor-pointer flex flex-col justify-between ${
                controlState === 4
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-emerald-300">
                    STATE 4
                  </span>
                  {controlState === 4 && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                </div>
                <h4 className="text-xs font-bold mb-1">Event Clearance</h4>
                <p className={`text-[10px] mb-2 ${controlState === 4 ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Verification & Reset
                </p>
              </div>
              <ul className={`text-[10px] space-y-0.5 ${controlState === 4 ? 'text-emerald-100' : 'text-slate-400'}`}>
                <li>• Particle level back OK</li>
                <li>• Capture confirmed</li>
                <li>• Verify clean state</li>
                <li>• EDS powered down</li>
                <li>• Return to low-power</li>
              </ul>
            </button>

            {/* State 5 */}
            <button
              onClick={() => setControlState(5)}
              className={`p-3.5 rounded-xl border text-left font-mono transition cursor-pointer flex flex-col justify-between ${
                controlState === 5
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300">
                    STATE 5
                  </span>
                  {controlState === 5 && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                </div>
                <h4 className="text-xs font-bold mb-1">Supercapacitor Power</h4>
                <p className={`text-[10px] mb-2 ${controlState === 5 ? 'text-cyan-100' : 'text-slate-400'}`}>
                  Energy Buffer
                </p>
              </div>
              <ul className={`text-[10px] space-y-0.5 ${controlState === 5 ? 'text-cyan-100' : 'text-slate-400'}`}>
                <li>• Spacecraft Bus ≤ 150W</li>
                <li>• DC/DC Converter</li>
                <li>• Robot short bursts</li>
                <li>• Variable micro-blower</li>
                <li>• Latching valves (0W)</li>
              </ul>
            </button>

          </div>

          {/* Central Controller (AI/MCU) Data Bus Schematic */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Central Controller (AI/MCU) Signal Bus Architecture
                </h4>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                Sampling Rate: 2.0 kHz • Hard Real-Time
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
              
              {/* Sensor Feedback Ingest */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
                <span className="text-indigo-400 font-bold block mb-1">
                  1. Sensor Feedback Ingest
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Optical particle sensors (concentration & size)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Differential pressure sensors (ΔP)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Susceptor and tunnel thermal probes</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Robot end-effector 6-axis load cells</span>
                  </li>
                </ul>
              </div>

              {/* Central Controller Logic */}
              <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/60 space-y-2">
                <span className="text-white font-bold block mb-1 flex items-center justify-between">
                  <span>2. Autonomous Decision Matrix</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900 text-indigo-200">AI / FPGA</span>
                </span>
                <ul className="space-y-1.5 text-indigo-200 text-[11px]">
                  <li>• Sensor data fusion across laser & camera</li>
                  <li>• Event-driven state transition triggers</li>
                  <li>• Safety interlocks prevent pod venting</li>
                  <li>• Energy optimization limits peak to 150 W</li>
                </ul>
              </div>

              {/* Control Commands Out */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <span className="text-cyan-400 font-bold block mb-1">
                  3. Actuator Control Commands
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Robot motion coordinates (Pick / Transfer)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Micro-blower speed modulation (0–18 m/s)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Electrodynamic Dust Shield (EDS) pulses</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Latching purge valves & pod lock actuators</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Power Management Diagram */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 font-mono text-xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Supercapacitor Power Buffer Architecture (≤ 150 W Spacecraft Bus Limit)
                </span>
                <span className="text-[11px] text-emerald-400">
                  Buffer Reserve: {supercapBufferCharge}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">Robot Arm:</span>
                  <span className="text-white font-bold">Short Bursts (65W, 1.2s)</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">Micro-Blower:</span>
                  <span className="text-cyan-300 font-bold">Variable (25W – 70W)</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">EDS Shield:</span>
                  <span className="text-indigo-300 font-bold">Pulsed (15W Peak)</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">Valves:</span>
                  <span className="text-emerald-300 font-bold">Latching Solenoid (0W Idle)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 5: LIVE INTERACTIVE CONTAINMENT & RECOVERY SIMULATOR      */}
      {/* ============================================================= */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          
          {/* Simulator Console Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Interactive AERCS-GaN Autonomous Containment Simulator</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  LIVE TESTBENCH
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Trigger simulated debris flaking or test autonomous robotic wafer pick-and-pod sequence
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerDebrisSpill}
                className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold shadow-lg shadow-red-600/30 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Simulate Debris Burst</span>
              </button>
            </div>
          </div>

          {/* Real-time Instruments Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
            
            {/* Instrument 1: Particle Concentration */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">PARTICLE CONCENTRATION</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  particleConcentration < 5 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-red-950 text-red-300 border border-red-500/30 animate-pulse'
                }`}>
                  {particleConcentration < 5 ? 'LOW • NOMINAL' : 'ELEVATED HAZARD'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{particleConcentration}</span>
                <span className="text-xs text-slate-400">pcs / m³</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    particleConcentration < 5 ? 'bg-emerald-400' : 'bg-red-500'
                  }`} 
                  style={{ width: `${Math.min(100, (particleConcentration / 50) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Instrument 2: Filter Differential Pressure */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">FILTER PRESSURE (ΔP)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                  {deltaPressurePa > 30 ? 'ACTIVE SUCTION' : 'STANDBY'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-cyan-300 tracking-tight">{deltaPressurePa}</span>
                <span className="text-xs text-slate-400">Pa (Gauge)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (deltaPressurePa / 50) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Instrument 3: Supercapacitor Reserve */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">SUPERCAPACITOR BUFFER</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                  READY
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-400 tracking-tight">{supercapBufferCharge}%</span>
                <span className="text-xs text-slate-400">120 V Bus</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${supercapBufferCharge}%` }} 
                />
              </div>
            </div>

            {/* Instrument 4: Power Draw */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">AERCS POWER DRAW</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-500/30 font-bold">
                  ≤ 150 W LIMIT
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-400 tracking-tight">{simulatedPowerDrawW}</span>
                <span className="text-xs text-slate-400">W (Active)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (simulatedPowerDrawW / 150) * 100)}%` }} 
                />
              </div>
            </div>

          </div>

          {/* Interactive Hardware Action Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            
            {/* Actuator 1: Micro-Blower Plenum */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  Variable Micro-Blower
                </span>
                <button
                  onClick={() => setIsBlowerActive(!isBlowerActive)}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition ${
                    isBlowerActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isBlowerActive ? 'BLOWER ON' : 'STANDBY'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Directional plenum airflow creates a localized vortex drawing suspended floating debris into the filtration manifold.
              </p>
            </div>

            {/* Actuator 2: Electrodynamic Dust Shield */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Pulsed EDS Traveling Wave
                </span>
                <button
                  onClick={() => setIsEdsPulsing(!isEdsPulsing)}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition ${
                    isEdsPulsing ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isEdsPulsing ? 'EDS ACTIVE' : 'OFF'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                4-phase electrodynamic wave pulses 42 V traveling electric fields to repulse adhering micro-particles off surfaces.
              </p>
            </div>

            {/* Actuator 3: Robot Arm & Hermetic Pod */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  Robotic Arm & Pod
                </span>
                <button
                  onClick={() => {
                    setRobotArmState('picking');
                    setTimeout(() => setRobotArmState('transferring'), 1500);
                    setTimeout(() => {
                      setRobotArmState('docked');
                      setPodStatus('purging');
                    }, 3000);
                    setTimeout(() => {
                      setRobotArmState('standby');
                      setPodStatus('sealed');
                    }, 4500);
                  }}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition"
                >
                  Run Pick & Pod
                </button>
              </div>
              <div className="text-[11px] text-slate-300 flex justify-between">
                <span>Robot: <strong className="text-emerald-300 uppercase">{robotArmState}</strong></span>
                <span>Pod: <strong className="text-cyan-300 uppercase">{podStatus}</strong></span>
              </div>
            </div>

          </div>

          {/* 3 Material Recovery Canisters Output Gauge */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
            <span className="font-bold text-white flex items-center gap-1.5 uppercase tracking-wider text-xs">
              <Disc className="w-4 h-4 text-cyan-400" />
              Real-Time Recovery Cartridge Canisters Status
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold block">GaN Recovery Cartridge</span>
                  <span className="text-[10px] text-slate-400">Crystalline shards for re-synthesis</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">{ganScrapGrams}</span>
                  <span className="text-[10px] text-slate-400 block">/ 50.0 g (Max)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold block">Ga-Rich Recovery Cartridge</span>
                  <span className="text-[10px] text-slate-400">Metallic gallium condensate</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">{gaRichResidueGrams}</span>
                  <span className="text-[10px] text-slate-400 block">/ 50.0 g (Max)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <span className="text-rose-400 font-bold block">Mixed Waste Canister</span>
                  <span className="text-[10px] text-slate-400">Carbonaceous soot & contaminants</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">{mixedWasteGrams}</span>
                  <span className="text-[10px] text-slate-400 block">/ 50.0 g (Max)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
