import React, { useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Cpu, 
  Zap, 
  Gauge, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  RefreshCw, 
  Layers, 
  Wrench, 
  Wifi
} from 'lucide-react';
import { WorkflowStageData, SensorInfo } from '../types';

interface StageDetailModalProps {
  stage: WorkflowStageData | null;
  onClose: () => void;
  onTriggerAction?: (actionName: string) => void;
}

export const StageDetailModal: React.FC<StageDetailModalProps> = ({
  stage,
  onClose,
  onTriggerAction
}) => {
  const [activeGraphTab, setActiveGraphTab] = useState<'telemetry' | 'stability' | 'power'>('telemetry');
  const [graphPoints, setGraphPoints] = useState<number[]>([45, 52, 48, 62, 58, 65, 72, 68, 75, 70, 78, 82, 79, 85, 83, 89, 86, 92, 88, 91, 95, 93, 97, 94]);
  const [liveSensorsState, setLiveSensorsState] = useState<SensorInfo[]>([]);
  const [calibrating, setCalibrating] = useState<boolean>(false);

  // Sync sensors on stage change
  useEffect(() => {
    if (stage) {
      setLiveSensorsState(stage.liveSensors);
    }
  }, [stage]);

  // Real-time data flowing graph animation loop
  useEffect(() => {
    if (!stage) return;

    const interval = setInterval(() => {
      setGraphPoints((prev) => {
        const last = prev[prev.length - 1];
        // Calculate realistic procedural oscillation
        const baseVariance = (Math.random() - 0.48) * 12;
        let nextVal = Math.round(last + baseVariance);
        if (nextVal > 98) nextVal = 92;
        if (nextVal < 35) nextVal = 45;
        return [...prev.slice(1), nextVal];
      });

      // Subtle live sensor fluctuation for realism
      setLiveSensorsState((prev) => 
        prev.map((s) => {
          const num = parseFloat(s.currentValue);
          if (isNaN(num)) return s;
          const delta = (Math.random() - 0.5) * (num > 100 ? 0.8 : num > 10 ? 0.3 : 0.05);
          const updated = (num + delta).toFixed(num % 1 !== 0 ? 1 : 0);
          return { ...s, currentValue: updated };
        })
      );
    }, 600);

    return () => clearInterval(interval);
  }, [stage]);

  if (!stage) return null;

  // Build SVG path for smooth flowing waveform
  const width = 640;
  const height = 140;
  const padding = 12;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const stepX = usableWidth / (graphPoints.length - 1);

  const points = graphPoints.map((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (val / 100) * usableHeight;
    return { x, y, val };
  });

  const lineD = points.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${lineD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const latestPoint = points[points.length - 1];

  const handleCalibrate = () => {
    setCalibrating(true);
    onTriggerAction?.(`Calibrate Module ${stage.id} Sensor Array`);
    setTimeout(() => {
      setCalibrating(false);
    }, 1200);
  };

  const handleDiagnosticPulse = () => {
    onTriggerAction?.(`Run Diagnostic Pulse on Module ${stage.id} (${stage.shortName})`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#080F1E]/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl my-auto max-h-[92vh] overflow-y-auto rounded-2xl bg-[#111C30] border border-[#26364D] shadow-2xl shadow-black/80 flex flex-col font-sans scrollbar-thin"
      >
        
        {/* Modal Header */}
        <div 
          className="p-4 sm:p-5 border-b border-[#26364D] flex items-center justify-between sticky top-0 bg-[#111C30]/95 backdrop-blur z-20"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-[#3973FF] text-[#F8FAFC] shadow-md shrink-0 ring-1 ring-[#00D9FF]/40"
            >
              {stage.id}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C8] font-medium">
                  Module 0{stage.id} • Telemetry &amp; Diagnostics
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#080F1E] border border-[#26364D] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {stage.operationalStatus}
                </span>
              </div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-[#F8FAFC] leading-tight">
                {stage.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#00D9FF] bg-[#080F1E] px-2.5 py-1 rounded-lg border border-[#26364D]">
              <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>{stage.powerConsumptionW}W Active Load</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#080F1E] hover:bg-[#16243D] border border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] transition cursor-pointer"
              title="Close telemetry window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5">

          {/* 1. REAL-TIME DATA FLOWING TELEMETRY GRAPH */}
          <div className="p-4 rounded-xl bg-[#080F1E] border border-[#26364D]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00D9FF]" />
                <span className="font-heading text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#00D9FF]" />
                  Real-Time Telemetry Flow Waveform (Oscilloscope)
                </span>
              </div>

              {/* Graph Channel Tabs */}
              <div className="flex items-center gap-1 bg-[#111C30] p-0.5 rounded-lg border border-[#26364D] text-[11px] font-mono">
                <button
                  onClick={() => setActiveGraphTab('telemetry')}
                  className={`px-2.5 py-0.5 rounded transition cursor-pointer ${
                    activeGraphTab === 'telemetry' 
                      ? 'bg-[#3973FF] text-[#F8FAFC] font-semibold' 
                      : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Sensor Flux
                </button>
                <button
                  onClick={() => setActiveGraphTab('stability')}
                  className={`px-2.5 py-0.5 rounded transition cursor-pointer ${
                    activeGraphTab === 'stability' 
                      ? 'bg-[#3973FF] text-[#F8FAFC] font-semibold' 
                      : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Stability Index
                </button>
                <button
                  onClick={() => setActiveGraphTab('power')}
                  className={`px-2.5 py-0.5 rounded transition cursor-pointer ${
                    activeGraphTab === 'power' 
                      ? 'bg-[#3973FF] text-[#F8FAFC] font-semibold' 
                      : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Thermal / Pwr
                </button>
              </div>
            </div>

            {/* SVG Real-time Waveform Canvas */}
            <div className="relative w-full h-36 bg-[#050A14] rounded-lg border border-[#1C2C42] overflow-hidden flex items-center justify-center">
              
              {/* Background Oscilloscope Grid */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 pointer-events-none opacity-25">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-[#00D9FF]/20" />
                ))}
              </div>

              {/* Streaming Waveform SVG */}
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full preserve-3d"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={`grad-${stage.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area under Curve */}
                <path d={areaD} fill={`url(#grad-${stage.id})`} />

                {/* Animated Line Path */}
                <path 
                  d={lineD} 
                  fill="none" 
                  stroke="#00D9FF" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />

                {/* Scanhead dot at latest position */}
                <circle 
                  cx={latestPoint.x} 
                  cy={latestPoint.y} 
                  r="4" 
                  fill="#00D9FF" 
                  stroke="#F8FAFC" 
                  strokeWidth="1.5" 
                />
              </svg>

              {/* Live Metric Overlay Badges */}
              <div className="absolute top-2.5 left-3 flex items-center gap-2 pointer-events-none">
                <span className="text-[11px] font-mono text-[#00D9FF] bg-[#080F1E]/90 px-2 py-0.5 rounded border border-[#26364D]">
                  STREAM: {latestPoint.val}% NOMINAL
                </span>
                <span className="text-[10px] font-mono text-[#A7B4C8] bg-[#080F1E]/90 px-2 py-0.5 rounded border border-[#26364D]">
                  LATENCY: 1.1ms
                </span>
              </div>

              <div className="absolute bottom-2.5 right-3 flex items-center gap-2 pointer-events-none">
                <span className="text-[10px] font-mono text-emerald-400 bg-[#080F1E]/90 px-2 py-0.5 rounded border border-[#26364D] flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  TELEMETRY SYNCED
                </span>
              </div>
            </div>

            {/* Quick Oscilloscope Status Sub-bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 pt-2.5 border-t border-[#26364D] text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#A7B4C8] bg-[#111C30] p-1.5 rounded border border-[#26364D]">
                <span>Signal-to-Noise:</span>
                <span className="text-[#F8FAFC] font-bold">48.2 dB</span>
              </div>
              <div className="flex items-center justify-between text-[#A7B4C8] bg-[#111C30] p-1.5 rounded border border-[#26364D]">
                <span>Sampling Freq:</span>
                <span className="text-[#00D9FF] font-bold">1200 S/s</span>
              </div>
              <div className="flex items-center justify-between text-[#A7B4C8] bg-[#111C30] p-1.5 rounded border border-[#26364D]">
                <span>Dynamic Variance:</span>
                <span className="text-emerald-400 font-bold">±0.03%</span>
              </div>
              <div className="flex items-center justify-between text-[#A7B4C8] bg-[#111C30] p-1.5 rounded border border-[#26364D]">
                <span>Telemetry Jitter:</span>
                <span className="text-[#F8FAFC] font-bold">&lt; 0.04 ms</span>
              </div>
            </div>
          </div>

          {/* 2. MAJOR ACTIVE SENSORS TELEMETRY CARDS */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#00D9FF]" />
                <span className="font-heading text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
                  Major Active Sensors &amp; Telemetry Gauges ({liveSensorsState.length} Channels)
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#A7B4C8]">
                Self-calibrating micro-gravity sensors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {liveSensorsState.map((sensor, idx) => {
                const isNumeric = !isNaN(parseFloat(sensor.currentValue));
                return (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl bg-[#0C1628] border border-[#26364D] hover:border-[#3973FF]/60 transition flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[#A7B4C8] uppercase tracking-tight line-clamp-1">
                        {sensor.type}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-[#111C30] border border-[#26364D] text-[#00D9FF]">
                        {sensor.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[#F8FAFC] mb-1 line-clamp-1" title={sensor.name}>
                      {sensor.name}
                    </div>

                    <div className="flex items-baseline gap-1 mt-1 mb-2">
                      <span className="text-base font-bold font-mono text-[#F8FAFC] tracking-tight">
                        {sensor.currentValue}
                      </span>
                      {sensor.unit && (
                        <span className="text-[10px] font-mono text-[#00D9FF]">
                          {sensor.unit}
                        </span>
                      )}
                    </div>

                    {/* Sensor Dynamic Meter Bar */}
                    <div className="w-full bg-[#1B2940] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#3973FF] to-[#00D9FF] transition-all duration-300"
                        style={{ 
                          width: isNumeric 
                            ? `${Math.min(95, Math.max(15, (parseFloat(sensor.currentValue) % 100)))}%` 
                            : '80%' 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Integrated Sensors List */}
            {stage.sensorsUsed && stage.sensorsUsed.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-[#080F1E] border border-[#26364D]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C8] block mb-2 font-medium">
                  All Integrated Instrument Transducers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stage.sensorsUsed.map((sensorName, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="px-2 py-1 rounded-md bg-[#111C30] border border-[#26364D] text-[11px] font-mono text-[#CBD5E1] flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#00D9FF]" />
                      <span>{sensorName}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. MAJOR ACTIVE COMPONENTS & SUBASSEMBLIES */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Cpu className="w-4 h-4 text-[#00D9FF]" />
              <span className="font-heading text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
                Major Active Components &amp; Hardware Subsystems
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stage.keyComponents.map((comp, cIdx) => (
                <div 
                  key={cIdx} 
                  className="p-3 rounded-xl bg-[#0C1628] border border-[#26364D] flex items-start gap-3 hover:border-[#3973FF]/60 transition"
                >
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-[#F8FAFC] shrink-0 mt-0.5 bg-[#16243D] border border-[#26364D]"
                  >
                    0{cIdx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-[#F8FAFC] line-clamp-1">
                        {comp}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#111C30] text-[#00D9FF] border border-[#26364D] shrink-0">
                        ONLINE
                      </span>
                    </div>
                    <div className="text-[10px] text-[#A7B4C8] font-mono mt-0.5">
                      Subassembly Linked • Hardware Health: 100%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. PROCESS FLOW: INPUTS & OUTPUTS */}
          <div className="p-3.5 rounded-xl bg-[#080F1E] border border-[#26364D] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C8] block mb-1 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#3973FF]" />
                Inbound Inputs:
              </span>
              <ul className="space-y-1">
                {stage.flowRole.inputs.map((inp, iIdx) => (
                  <li key={iIdx} className="text-[#CBD5E1] font-mono text-[11px] flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-[#00D9FF] shrink-0" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C8] block mb-1 font-semibold flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-[#00D9FF]" />
                Outbound Process Outputs:
              </span>
              <ul className="space-y-1">
                {stage.flowRole.outputs.map((out, oIdx) => (
                  <li key={oIdx} className="text-[#CBD5E1] font-mono text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. INTERACTIVE DIAGNOSTIC & CALIBRATION ACTIONS */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#26364D]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCalibrate}
                disabled={calibrating}
                className="px-3.5 py-1.5 rounded-lg bg-[#111C30] hover:bg-[#16243D] text-[#F8FAFC] text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 border border-[#26364D] disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${calibrating ? 'animate-spin text-[#00D9FF]' : ''}`} />
                <span>{calibrating ? 'Calibrating Sensors...' : 'Calibrate Sensor Array'}</span>
              </button>

              <button
                type="button"
                onClick={handleDiagnosticPulse}
                className="px-4 py-1.5 rounded-lg bg-[#00D9FF] hover:bg-[#25e0ff] text-[#080F1E] text-xs font-mono font-bold shadow-md shadow-[#00D9FF]/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 text-[#080F1E]" />
                <span>Run Diagnostic Pulse</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
