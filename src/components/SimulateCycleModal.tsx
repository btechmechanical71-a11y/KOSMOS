import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Layers,
  Terminal,
  Zap,
  Activity,
  ShieldCheck,
  RotateCw,
  AlertTriangle,
  Flame,
  Wind,
  Volume2,
  VolumeX,
  ShieldAlert,
  Wrench,
  BellRing
} from 'lucide-react';
import { WORKFLOW_STAGES } from '../data/workflowStages';
import { CycleEventLog } from '../types';
import { soundEffects } from '../utils/audio';
import { IsroLogo } from './IsroLogo';

type SimulationMode = 'nominal' | 'case1' | 'case2';

interface MalfunctionState {
  caseId: 'case1' | 'case2';
  title: string;
  stageId: number;
  stageName: string;
  symptom: string;
  mitigationSteps: string[];
  alarmActive: boolean;
  resolved: boolean;
  purgeActive?: boolean;
  telemetryAlert: string;
}

interface SimulateCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStageChange: (stageId: number) => void;
}

export const SimulateCycleModal: React.FC<SimulateCycleModalProps> = ({
  isOpen,
  onClose,
  onStageChange
}) => {
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('case1');
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: ready, 1..8: active steps, 9: finished
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [logs, setLogs] = useState<CycleEventLog[]>([]);
  const [malfunction, setMalfunction] = useState<MalfunctionState | null>(null);
  const [buzzerMuted, setBuzzerMuted] = useState<boolean>(false);
  const [autoPurgeCountdown, setAutoPurgeCountdown] = useState<number | null>(null);
  const buzzerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Periodic alarm buzzer loop when malfunction alarm is active
  useEffect(() => {
    if (buzzerIntervalRef.current) {
      clearInterval(buzzerIntervalRef.current);
      buzzerIntervalRef.current = null;
    }

    if (malfunction && malfunction.alarmActive && !buzzerMuted && !malfunction.purgeActive && !malfunction.resolved) {
      soundEffects.playAlarmBuzzer();
      buzzerIntervalRef.current = setInterval(() => {
        soundEffects.playAlarmBuzzer();
      }, 1600);
    } else {
      soundEffects.stopAlarmBuzzer();
    }

    return () => {
      if (buzzerIntervalRef.current) {
        clearInterval(buzzerIntervalRef.current);
        buzzerIntervalRef.current = null;
      }
      soundEffects.stopAlarmBuzzer();
    };
  }, [malfunction?.alarmActive, malfunction?.purgeActive, malfunction?.resolved, buzzerMuted]);

  // Main simulation lifecycle
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && currentStep >= 1 && currentStep <= 8) {
      onStageChange(currentStep);
      soundEffects.playStepPulse();

      // Log start of current stage
      const stageObj = WORKFLOW_STAGES.find(s => s.id === currentStep);
      const stageName = stageObj ? stageObj.name : `Module ${currentStep}`;
      
      const newLog: CycleEventLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString().substring(11, 23),
        stageId: currentStep,
        stageName,
        message: getStageActionMessage(currentStep),
        type: currentStep === 8 ? 'success' : 'process'
      };
      setLogs(prev => [newLog, ...prev]);

      // Progress animation timer
      const intervalMs = 35;
      const stepDuration = 2400; // ms per step
      const increment = 100 / (stepDuration / intervalMs);

      timer = setInterval(() => {
        setStepProgress(prev => {
          // Check for simulated malfunctions
          if (simulationMode === 'case1' && currentStep === 1 && prev >= 40 && !malfunction) {
            clearInterval(timer);
            triggerMalfunction('case1');
            return prev;
          }

          if (simulationMode === 'case2' && currentStep === 3 && prev >= 45 && !malfunction) {
            clearInterval(timer);
            triggerMalfunction('case2');
            return prev;
          }

          if (prev >= 100) {
            clearInterval(timer);
            if (currentStep < 8) {
              setCurrentStep(c => c + 1);
              return 0;
            } else {
              // Completed all 8 steps
              setIsRunning(false);
              setCurrentStep(9);
              soundEffects.playSuccessChime();
              return 100;
            }
          }
          return prev + increment;
        });
      }, intervalMs);
    }

    return () => clearInterval(timer);
  }, [isRunning, currentStep, simulationMode, malfunction, onStageChange]);

  // Autonomous countdown to auto-purge if operator doesn't click immediately
  useEffect(() => {
    if (autoPurgeCountdown === null) return;
    if (autoPurgeCountdown <= 0) {
      setAutoPurgeCountdown(null);
      handleExecuteRecovery();
      return;
    }
    const timer = setTimeout(() => {
      setAutoPurgeCountdown(prev => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoPurgeCountdown]);

  const triggerMalfunction = (caseId: 'case1' | 'case2') => {
    setIsRunning(false);
    setBuzzerMuted(false);
    setAutoPurgeCountdown(7);
    
    if (caseId === 'case1') {
      setCurrentStep(1);
      setStepProgress(45);
      onStageChange(1);
      setMalfunction({
        caseId: 'case1',
        title: 'CASE-1: Containment Seal Breach & Thermal Spike',
        stageId: 1,
        stageName: 'Enclosed Manufacturing Zone',
        symptom: 'Chamber seal pressure dropped to 38.2 kPa. Sintering junction exceeded safe threshold at 324°C (Thermal Runaway Risk).',
        mitigationSteps: [
          'Emergency isolation seals engaged (<50ms lockout)',
          'High-flow inert Nitrogen (N2) purge initiated at 150 kPa',
          '3D thermal heating elements auto-cut to safe baseline',
          'Chamber containment verified & pressure restored'
        ],
        alarmActive: true,
        resolved: false,
        telemetryAlert: 'TEMP: 324°C (OVERHEAT) • PRESSURE: 38.2 kPa (LEAK)'
      });

      setLogs(prev => [
        {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString().substring(11, 23),
          stageId: 1,
          stageName: 'EMERGENCY MONITOR',
          message: '🚨 [CRITICAL ALARM BUZZING]: Case-1 Anomaly! Enclosed chamber pressure loss & thermal spike. Sounding emergency buzzer at 820Hz!',
          type: 'warning'
        },
        ...prev
      ]);
    } else {
      setCurrentStep(3);
      setStepProgress(50);
      onStageChange(3);
      setMalfunction({
        caseId: 'case2',
        title: 'CASE-2: Vacuum Filtration Jam & Micro-Debris Scatter',
        stageId: 3,
        stageName: 'Airborne Capture & Vacuum Filtration',
        symptom: 'Primary capture nozzle airflow stalled from 12.4 m/s to 1.7 m/s. 4.8g micro-debris floating beyond primary shroud.',
        mitigationSteps: [
          'Secondary electrostatic particulate capture polarized to 5 kV',
          'Auxiliary cyclone booster engaged at 19.2 m/s suction',
          'AI optical LiDAR confirms 100% micro-particles drawn into scrap divert valve',
          'Filter pressure normalized & zero particulate escape verified'
        ],
        alarmActive: true,
        resolved: false,
        telemetryAlert: 'FLOW: 1.7 m/s (STALL) • ESCAPE RISK: 4.8g MICRO-DEBRIS'
      });

      setLogs(prev => [
        {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString().substring(11, 23),
          stageId: 3,
          stageName: 'EMERGENCY MONITOR',
          message: '🚨 [CRITICAL ALARM BUZZING]: Case-2 Anomaly! Vacuum airflow drop & debris scatter. Emergency buzzer sounding at 820Hz!',
          type: 'warning'
        },
        ...prev
      ]);
    }
  };

  const handleSilenceAlarm = () => {
    if (buzzerIntervalRef.current) {
      clearInterval(buzzerIntervalRef.current);
      buzzerIntervalRef.current = null;
    }
    soundEffects.stopAlarmBuzzer();
    setBuzzerMuted(true);
    if (malfunction) {
      setMalfunction({ ...malfunction, alarmActive: false });
    }
    setLogs(prev => [
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString().substring(11, 23),
        stageId: malfunction?.stageId || 1,
        stageName: 'OPERATOR ACK',
        message: '🔕 Auditory buzzer silenced by command. Autonomous containment & mitigation subroutines running.',
        type: 'info'
      },
      ...prev
    ]);
  };

  const handleExecuteRecovery = () => {
    if (!malfunction) return;
    
    // Stop alarm buzzer immediately and kill any active/queued audio nodes
    if (buzzerIntervalRef.current) {
      clearInterval(buzzerIntervalRef.current);
      buzzerIntervalRef.current = null;
    }
    soundEffects.stopAlarmBuzzer();
    setBuzzerMuted(true);
    setAutoPurgeCountdown(null);

    // Play high-tech containment & purge confirmation chime
    soundEffects.playPurgeConfirmationChime();

    setMalfunction(prev => prev ? { 
      ...prev, 
      alarmActive: false, 
      resolved: true, 
      purgeActive: true 
    } : null);

    setLogs(prev => [
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString().substring(11, 23),
        stageId: malfunction.stageId,
        stageName: 'AUTONOMOUS FAIL-SAFE',
        message: `🔕 [ALARM STOPPED]: Autonomous containment & purge engaged. ${malfunction.mitigationSteps.join(' → ')}. Chamber telemetry and hermetic seal 100% verified.`,
        type: 'success'
      },
      ...prev
    ]);

    // Resume workflow
    setTimeout(() => {
      setIsRunning(true);
      setMalfunction(null);
    }, 1800);
  };

  const handleStartCycle = () => {
    setMalfunction(null);
    setBuzzerMuted(false);
    setCurrentStep(1);
    setStepProgress(0);
    setIsRunning(true);
    setLogs([
      {
        id: 'init',
        timestamp: new Date().toISOString().substring(11, 23),
        stageId: 1,
        stageName: 'Mission Executive',
        message: `Initiating ${
          simulationMode === 'nominal' 
            ? 'Nominal Flawless' 
            : simulationMode === 'case1' 
            ? 'Case-1 Malfunction Test (Chamber Seal)' 
            : 'Case-2 Malfunction Test (Debris Scatter)'
        } circular lifecycle run (Autonomous In-Orbit Closed Loop)`,
        type: 'info'
      }
    ]);
  };

  const handleReset = () => {
    if (buzzerIntervalRef.current) {
      clearInterval(buzzerIntervalRef.current);
      buzzerIntervalRef.current = null;
    }
    soundEffects.stopAlarmBuzzer();
    setIsRunning(false);
    setCurrentStep(0);
    setStepProgress(0);
    setMalfunction(null);
    setBuzzerMuted(false);
    setAutoPurgeCountdown(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#080F1E]/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#111C30] border border-[#26364D] shadow-2xl flex flex-col font-sans scrollbar-thin">
        
        {/* Header */}
        <div className="p-4 border-b border-[#26364D] flex items-center justify-between sticky top-0 bg-[#111C30]/95 backdrop-blur z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#080F1E] border border-[#26364D] p-0.5 flex items-center justify-center shadow-md">
              <IsroLogo className="w-8 h-8" size={32} />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <span>Autonomous Lifecycle Simulation &amp; Malfunction Test</span>
                {malfunction && malfunction.alarmActive && !malfunction.purgeActive && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-600 text-white font-mono animate-pulse flex items-center gap-1 font-bold">
                    <BellRing className="w-3 h-3" />
                    ALARM ACTIVE
                  </span>
                )}
                {malfunction && (malfunction.purgeActive || malfunction.resolved) && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-mono flex items-center gap-1 shadow-sm font-semibold">
                    <VolumeX className="w-3 h-3" />
                    ALARM STOPPED (PURGE ENGAGED)
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#A7B4C8]">
                Simulate nominal closed-loop manufacturing or trigger Case-1 / Case-2 in-orbit anomalies with live alarm buzzer
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (buzzerIntervalRef.current) {
                clearInterval(buzzerIntervalRef.current);
                buzzerIntervalRef.current = null;
              }
              soundEffects.stopAlarmBuzzer();
              setAutoPurgeCountdown(null);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#080F1E] hover:bg-[#16243D] border border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          
          {/* Active Stepper Timeline & Anomaly Case Scenarios */}
          <div className="p-4 rounded-xl bg-[#080F1E] border border-[#26364D] space-y-4">
            
            {/* Simulation Mode & Malfunction Case Selectors */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <span className="font-heading text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#00D9FF]" />
                  Select Simulation Scenario &amp; Malfunction Modes:
                </span>
                <span className="text-[11px] font-mono text-[#A7B4C8]">
                  Select a case to view containment failure &amp; alarm buzzer response
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                
                {/* Case 1: Chamber Seal & Thermal Runaway */}
                <button
                  type="button"
                  onClick={() => {
                    setSimulationMode('case1');
                    triggerMalfunction('case1');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                    simulationMode === 'case1'
                      ? 'bg-[#1D111A] border-rose-500 ring-1 ring-rose-400 text-white shadow-lg'
                      : 'bg-[#111C30] border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#16243D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-rose-400 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      CASE-1: MALFUNCTION
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                      Module 1
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#F8FAFC] mb-1">
                    Chamber Leak &amp; Thermal Runaway
                  </div>
                  <div className="text-[11px] text-[#A7B4C8] leading-tight">
                    Simulates seal pressure drop, 324°C thermal spike, buzzer alarm, and automated N2 purge.
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-rose-300 font-bold">
                    <BellRing className="w-3 h-3 text-rose-400 animate-pulse" />
                    <span>Click to Trigger Case-1 Alarm</span>
                  </div>
                </button>

                {/* Case 2: Debris Scatter & Vacuum Stall */}
                <button
                  type="button"
                  onClick={() => {
                    setSimulationMode('case2');
                    triggerMalfunction('case2');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                    simulationMode === 'case2'
                      ? 'bg-[#1D1711] border-amber-500 ring-1 ring-amber-400 text-white shadow-lg'
                      : 'bg-[#111C30] border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#16243D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5" />
                      CASE-2: MALFUNCTION
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                      Module 3
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#F8FAFC] mb-1">
                    Vacuum Filter Jam &amp; Debris Scatter
                  </div>
                  <div className="text-[11px] text-[#A7B4C8] leading-tight">
                    Simulates airflow stall, micro-debris dispersion, buzzer siren, and 5 kV electrostatic trap.
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-amber-300 font-bold">
                    <BellRing className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>Click to Trigger Case-2 Alarm</span>
                  </div>
                </button>

                {/* Nominal Mode */}
                <button
                  type="button"
                  onClick={() => {
                    setSimulationMode('nominal');
                    setMalfunction(null);
                    setBuzzerMuted(true);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    simulationMode === 'nominal' && !malfunction
                      ? 'bg-[#112038] border-[#3973FF] ring-1 ring-[#00D9FF] text-white shadow-lg'
                      : 'bg-[#111C30] border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#16243D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-[#00D9FF] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      NOMINAL RUN
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] font-mono">
                      All 8 Stages
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#F8FAFC] mb-1">
                    100% Autonomous Closed Loop
                  </div>
                  <div className="text-[11px] text-[#A7B4C8] leading-tight">
                    Standard circular operation with zero faults, continuous power balancing, and clean reuse.
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-semibold">
                    <span>Flawless Lifecycle Validation</span>
                  </div>
                </button>

              </div>
            </div>

            {/* LIVE MALFUNCTION ALARM BANNER (ACTIVE BUZZER) */}
            {malfunction && (
              <div className={`p-4 rounded-xl border transition-all animate-in fade-in duration-200 ${
                malfunction.resolved || malfunction.purgeActive
                  ? 'bg-[#0E2018] border-emerald-500/60 text-emerald-200 shadow-lg'
                  : malfunction.caseId === 'case1'
                  ? 'bg-[#1D111A] border-rose-500 ring-1 ring-rose-500/50 shadow-xl'
                  : 'bg-[#1D1711] border-amber-500 ring-1 ring-amber-500/50 shadow-xl'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#26364D]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                      malfunction.resolved || malfunction.purgeActive
                        ? 'bg-emerald-600'
                        : 'bg-rose-600 animate-pulse'
                    }`}>
                      {malfunction.resolved || malfunction.purgeActive ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 animate-bounce" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold font-mono text-[#F8FAFC]">
                          {malfunction.title}
                        </span>
                        {!malfunction.resolved && !malfunction.purgeActive ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold animate-pulse flex items-center gap-1">
                              <BellRing className="w-3 h-3" />
                              ALARM BUZZING (820Hz)
                            </span>
                            {autoPurgeCountdown !== null && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                                Auto-Purge in {autoPurgeCountdown}s
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-400/40 shadow-sm">
                            <VolumeX className="w-3 h-3 text-emerald-200" />
                            ALARM STOPPED • PURGE ENGAGED
                          </span>
                        )}
                      </div>
                      <div className={`text-xs font-mono font-semibold mt-0.5 ${
                        malfunction.resolved || malfunction.purgeActive ? 'text-emerald-300' : 'text-rose-300'
                      }`}>
                        {malfunction.resolved || malfunction.purgeActive
                          ? 'Chamber pressure normalized (101.3 kPa) • N2 inert atmosphere locked'
                          : malfunction.telemetryAlert}
                      </div>
                    </div>
                  </div>

                  {/* Alarm Controls */}
                  <div className="flex items-center gap-2">
                    {!malfunction.resolved && !malfunction.purgeActive ? (
                      <>
                        <button
                          type="button"
                          onClick={handleSilenceAlarm}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition cursor-pointer ${
                            buzzerMuted
                              ? 'bg-[#111C30] border-[#26364D] text-[#A7B4C8]'
                              : 'bg-rose-950/70 border-rose-500 text-rose-200 hover:bg-rose-900'
                          }`}
                        >
                          {buzzerMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rose-400" />}
                          <span>{buzzerMuted ? 'Buzzer Silenced' : 'Silence Buzzer'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleExecuteRecovery}
                          className="px-3.5 py-1.5 rounded-lg bg-[#00D9FF] hover:bg-[#25e0ff] text-[#080F1E] text-xs font-bold font-mono shadow-md shadow-[#00D9FF]/25 flex items-center gap-2 transition cursor-pointer active:scale-95"
                        >
                          <Wrench className="w-3.5 h-3.5 text-[#080F1E]" />
                          <span>Autonomous Containment &amp; Purge</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#080F1E] text-[#00D9FF] font-semibold">
                            Stops Alarm
                          </span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0E2018] border border-emerald-500/80 text-emerald-200 text-xs font-mono font-bold shadow-md animate-in fade-in">
                        <VolumeX className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">Alarm Stopped</span>
                        <span className="text-slate-600">•</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Autonomous Containment &amp; Purge Active</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Symptom & Fail-safe response detail */}
                <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#080F1E] border border-[#26364D]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#A7B4C8] block mb-1 font-semibold">
                      Anomaly Root Cause:
                    </span>
                    <p className="text-[#CBD5E1] leading-relaxed">
                      {malfunction.symptom}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#080F1E] border border-[#26364D]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#A7B4C8] block mb-1 font-semibold">
                      Autonomous Countermeasures Deployed:
                    </span>
                    <ul className="space-y-1 text-[#CBD5E1]">
                      {malfunction.mitigationSteps.map((step, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${malfunction.resolved ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Timeline Header */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-heading text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
                Active Cycle Stage Tracker
              </span>
              <span className="text-xs font-mono text-[#00D9FF]">
                {currentStep === 0 && 'Status: Standby / Ready'}
                {currentStep >= 1 && currentStep <= 8 && `Stage ${currentStep} of 8 (${Math.round(stepProgress)}%)`}
                {currentStep === 9 && 'Cycle Successfully Finished ✓'}
              </span>
            </div>

            {/* Stepper nodes */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {WORKFLOW_STAGES.map((stg) => {
                const isPast = currentStep > stg.id;
                const isCurrent = currentStep === stg.id;
                const isFaultStage = malfunction && malfunction.stageId === stg.id && !malfunction.resolved;
                return (
                  <div 
                    key={stg.id}
                    className={`flex flex-col items-center p-2 rounded-lg border text-center transition-all ${
                      isFaultStage
                        ? 'bg-[#1D111A] border-rose-500 text-white ring-2 ring-rose-500 animate-pulse'
                        : isCurrent
                        ? 'bg-[#3973FF] border-[#00D9FF] text-[#F8FAFC] ring-1 ring-[#00D9FF] shadow-md shadow-[#3973FF]/30'
                        : isPast
                        ? 'bg-[#111C30] border-[#26364D] text-emerald-400'
                        : 'bg-[#111C30] border-[#26364D] text-[#A7B4C8]'
                    }`}
                  >
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                        isFaultStage
                          ? 'bg-rose-600 text-white'
                          : isCurrent 
                          ? 'bg-[#00D9FF] text-[#080F1E]'
                          : isPast
                          ? 'bg-emerald-500 text-[#080F1E]'
                          : 'bg-[#1C2C42] text-[#CBD5E1]'
                      }`}
                    >
                      {isFaultStage ? '!' : isPast ? '✓' : stg.id}
                    </div>
                    <span className="text-[9px] font-mono leading-tight line-clamp-2">
                      {stg.shortName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stage Progress Bar */}
            <div className="w-full h-2 bg-[#111C30] rounded-full overflow-hidden border border-[#26364D]">
              <div 
                className={`h-full transition-all duration-100 ease-out ${
                  malfunction && !malfunction.resolved
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-[#3973FF] to-[#00D9FF]'
                }`}
                style={{ 
                  width: currentStep === 9 
                    ? '100%' 
                    : currentStep === 0 
                    ? '0%' 
                    : `${((currentStep - 1) / 8) * 100 + (stepProgress / 8)}%` 
                }}
              />
            </div>
          </div>

          {/* 3. Live Telemetry & Event Terminal Log */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Left: Summary Metrics */}
            <div className="md:col-span-5 space-y-2.5">
              <div className="p-3 rounded-lg bg-[#080F1E] border border-[#26364D] space-y-2 text-xs font-mono">
                <div className="text-[#A7B4C8] uppercase text-[10px] tracking-wider border-b border-[#26364D] pb-1 flex items-center justify-between font-semibold">
                  <span>Cycle Telemetry</span>
                  <Activity className="w-3.5 h-3.5 text-[#00D9FF]" />
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B4C8]">Mission Profile:</span>
                  <span className="text-[#F8FAFC] font-bold">Autonomous Circular Closed-Loop</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B4C8]">Chamber Pressure:</span>
                  <span className="text-[#00D9FF]">101.3 kPa (Hermetic Seal)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B4C8]">Containment Purge:</span>
                  <span className="text-[#F8FAFC]">150 kPa N₂ Inert Gas Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B4C8]">Circular Recovery:</span>
                  <span className="text-emerald-400 font-bold">100% Zero-Debris</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B4C8]">Peak Power Limit:</span>
                  <span className="text-[#00D9FF]">≤ 150 W Allocated</span>
                </div>
              </div>

              {/* Execution Controls */}
              <div className="flex items-center gap-2">
                {!isRunning ? (
                  <button
                    onClick={handleStartCycle}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#00D9FF] hover:bg-[#25e0ff] text-[#080F1E] text-xs font-bold font-mono uppercase tracking-wider shadow-md shadow-[#00D9FF]/20 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{currentStep === 9 ? 'Run Again' : 'Launch Cycle'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRunning(false)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#16243D] border border-[#26364D] hover:bg-[#1E304E] text-[#00D9FF] text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Run</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-[#111C30] hover:bg-[#16243D] border border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] transition cursor-pointer"
                  title="Reset Cycle"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Live Terminal Log */}
            <div className="md:col-span-7 flex flex-col h-56 rounded-lg bg-[#050A14] border border-[#26364D] p-2.5 font-mono text-[11px]">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#26364D] text-[#A7B4C8] text-[10px]">
                <span className="flex items-center gap-1.5 text-[#00D9FF] font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  ICMC-CRS MISSION EVENT LOG
                </span>
                <span>{logs.length} EVENTS</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1 scrollbar-thin">
                {logs.map((log) => (
                  <div key={log.id} className="leading-snug">
                    <span className="text-[#A7B4C8]/60 mr-1.5">[{log.timestamp}]</span>
                    <span 
                      className={`font-semibold mr-1.5 ${
                        log.type === 'success' ? 'text-emerald-400' :
                        log.type === 'warning' ? 'text-amber-400' :
                        log.type === 'process' ? 'text-[#00D9FF]' : 'text-[#3973FF]'
                      }`}
                    >
                      [{log.stageName}]:
                    </span>
                    <span className="text-[#CBD5E1]">{log.message}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-[#A7B4C8]/60 italic py-4 text-center">
                    Ready to begin. Click "Launch Cycle" to start autonomous space workflow.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

function getStageActionMessage(stageId: number): string {
  switch (stageId) {
    case 1:
      return `Chamber hermetically locked. Sintering 3D toolpath at 245°C. In-chamber aerosol sensors nominal.`;
    case 2:
      return `Visual camera alignment verified. Robotic compliant gripper latched on finished flight component, transferring to storage vault.`;
    case 3:
      return `Localized capture nozzle engaged at 12.4 m/s. Cyclone vacuum extracted 2.4g of micro-airborne debris chips.`;
    case 4:
      return `AI NIR spectrometer classified scrap particles as 99.4% aerospace-grade feedstock. Automated diverter gate engaged.`;
    case 5:
      return `Recycling line operational: Induction melting furnace at 660°C & twin-screw extruder produce 1.75mm continuous feedstock.`;
    case 6:
      return `Finished flight component placed into sealed vault compartment with RFID tag. Recycled feedstock stock updated.`;
    case 7:
      return `Contaminant trace (<0.1%) routed through isolation valve into hermetically sealed Earth-return waste canister.`;
    case 8:
      return `Supervisory Control verified: 0 faults, power at 82W (nominal), telemetry transmitted to flight computer. Ready for next cycle!`;
    default:
      return `Processing in Module ${stageId}.`;
  }
}
