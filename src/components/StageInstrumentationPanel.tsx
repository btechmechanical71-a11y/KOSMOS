import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Gauge, 
  Zap, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  Crosshair,
  Layers,
  Thermometer,
  Compass
} from 'lucide-react';
import { WorkflowStageData } from '../types';
import { REAL_STAGE_INSTRUMENTATION, RealSensorSpec, RealControllerSpec } from '../data/realInstrumentation';

interface StageInstrumentationPanelProps {
  stage: WorkflowStageData;
}

export const StageInstrumentationPanel: React.FC<StageInstrumentationPanelProps> = ({ stage }) => {
  const [activeTab, setActiveTab] = useState<'sensors' | 'controllers' | 'bus'>('sensors');
  const [jitter, setJitter] = useState<number>(0);

  // Retrieve real instrumentation data for this stage, with fallback
  const instrumentation = REAL_STAGE_INSTRUMENTATION[stage.id] || REAL_STAGE_INSTRUMENTATION[1];

  // Subtle live fluctuation effect for real-time telemetry realism
  useEffect(() => {
    const timer = setInterval(() => {
      setJitter((Math.random() - 0.5) * 0.04);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-2.5 font-sans">
      
      {/* Top Header Bar with Tab Navigation */}
      <div className="flex items-center justify-between border-b border-[#26364D] pb-2">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-[#080F1E] border border-[#26364D] rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('sensors')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'sensors'
                  ? 'bg-[#3973FF] text-[#F8FAFC] font-semibold shadow-sm'
                  : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Sensors</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-[#111C30] text-[#A7B4C8] font-mono border border-[#26364D]">
                {instrumentation.sensors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('controllers')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'controllers'
                  ? 'bg-[#3973FF] text-[#F8FAFC] font-semibold shadow-sm'
                  : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Controllers</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-[#111C30] text-[#A7B4C8] font-mono border border-[#26364D]">
                {instrumentation.controllers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bus')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'bus'
                  ? 'bg-[#3973FF] text-[#F8FAFC] font-semibold shadow-sm'
                  : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Bus</span>
            </button>
          </div>
        </div>

        {/* Operational Status Pill */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-tight">
            {stage.operationalStatus}
          </span>
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="flex-1 min-h-[220px] max-h-[280px] overflow-y-auto pr-1 space-y-2 scrollbar-thin">
        
        {/* TAB 1: MAJOR SENSORS (REAL INSTRUMENTATION VALUES) */}
        {activeTab === 'sensors' && (
          <div className="space-y-2">
            {instrumentation.sensors.map((sensor: RealSensorSpec) => {
              // Apply slight realistic telemetry jitter if numerical
              let displayedVal = sensor.currentValue;
              const numericVal = parseFloat(sensor.currentValue);
              if (!isNaN(numericVal) && !sensor.currentValue.includes('%') && !sensor.currentValue.includes('match') && !sensor.currentValue.includes(':')) {
                const updated = numericVal + jitter;
                displayedVal = updated.toFixed(numericVal < 1 ? 3 : 2);
              }

              return (
                <div 
                  key={sensor.id}
                  className="bg-[#0C1628] border border-[#26364D] hover:border-[#3973FF]/60 rounded-lg p-2.5 transition flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#111C30] border border-[#26364D] text-[#00D9FF]">
                          {sensor.id}
                        </span>
                        <span className="text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-white transition">
                          {sensor.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#A7B4C8] font-mono mt-0.5 flex items-center gap-2">
                        <span className="truncate">{sensor.technology}</span>
                        <span className="text-[#26364D]">•</span>
                        <span className="text-[#A7B4C8] truncate">{sensor.model}</span>
                      </div>
                    </div>

                    {/* Sensor Value Pill */}
                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-bold text-[#F8FAFC] tracking-tight">
                        {displayedVal} <span className="text-[11px] font-normal text-[#00D9FF]">{sensor.unit}</span>
                      </div>
                      <div className="text-[9px] font-mono text-[#A7B4C8]">
                        Tol: {sensor.tolerance}
                      </div>
                    </div>
                  </div>

                  {/* Sensor Status & Sampling Rate Footer */}
                  <div className="flex items-center justify-between border-t border-[#26364D]/60 pt-1.5 mt-1.5 text-[9px] font-mono text-[#A7B4C8]">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sensor.statusColor }} />
                      <span style={{ color: sensor.statusColor }}>{sensor.status}</span>
                      <span className="text-[#26364D]">|</span>
                      <span>Range: {sensor.nominalRange}</span>
                    </span>
                    <span className="text-[#A7B4C8] font-mono">
                      Rate: {sensor.updateRate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MAJOR CLOSED-LOOP CONTROLLERS */}
        {activeTab === 'controllers' && (
          <div className="space-y-2">
            {instrumentation.controllers.map((ctrl: RealControllerSpec) => (
              <div 
                key={ctrl.id}
                className="bg-[#0C1628] border border-[#26364D] hover:border-[#3973FF]/60 rounded-lg p-2.5 transition flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#111C30] border border-[#26364D] text-[#3973FF]">
                        {ctrl.id}
                      </span>
                      <span className="text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-white transition">
                        {ctrl.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#A7B4C8] font-mono mt-0.5">
                      {ctrl.architecture}
                    </div>
                  </div>

                  {/* Controller Status Badge */}
                  <span 
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 flex items-center gap-1"
                    style={{ 
                      borderColor: `${ctrl.statusColor}50`, 
                      color: ctrl.statusColor,
                      backgroundColor: `${ctrl.statusColor}15`
                    }}
                  >
                    <Sliders className="w-2.5 h-2.5" />
                    {ctrl.status}
                  </span>
                </div>

                {/* Closed-Loop Signals (Setpoint, Feedback, Control Output) */}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-[#26364D]/60 text-[10px] font-mono">
                  <div className="bg-[#111C30] rounded p-1.5 border border-[#26364D]">
                    <div className="text-[9px] text-[#A7B4C8] flex items-center gap-1">
                      <Crosshair className="w-2.5 h-2.5 text-[#00D9FF]" />
                      Setpoint:
                    </div>
                    <div className="text-[#F8FAFC] font-medium truncate mt-0.5">
                      {ctrl.setpoint}
                    </div>
                  </div>

                  <div className="bg-[#111C30] rounded p-1.5 border border-[#26364D]">
                    <div className="text-[9px] text-[#A7B4C8] flex items-center gap-1">
                      <Activity className="w-2.5 h-2.5 text-emerald-400" />
                      Feedback:
                    </div>
                    <div className="text-emerald-300 font-medium truncate mt-0.5">
                      {ctrl.feedback}
                    </div>
                  </div>
                </div>

                {/* Output & Error Margin */}
                <div className="flex items-center justify-between text-[9px] font-mono mt-1.5 px-0.5 text-[#A7B4C8]">
                  <span className="truncate">
                    <span className="text-[#A7B4C8]/70">Drive:</span> <span className="text-[#F8FAFC]">{ctrl.outputSignal}</span>
                  </span>
                  <span className="text-[#00D9FF] shrink-0 font-semibold">
                    {ctrl.errorMargin}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SYSTEM BUS & POWER TELEMETRY */}
        {activeTab === 'bus' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-[#0C1628] border border-[#26364D] rounded-lg p-3 space-y-2.5">
              <div className="text-[#00D9FF] font-semibold flex items-center gap-1.5 text-xs pb-1 border-b border-[#26364D]">
                <Radio className="w-3.5 h-3.5 text-[#00D9FF]" />
                Spacecraft Primary Bus Telemetry
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#111C30] p-2 rounded border border-[#26364D]">
                  <div className="text-[10px] text-[#A7B4C8]">Bus Voltage</div>
                  <div className="text-sm font-bold text-[#F8FAFC] mt-0.5">{instrumentation.busTelemetry.voltage}</div>
                </div>
                <div className="bg-[#111C30] p-2 rounded border border-[#26364D]">
                  <div className="text-[10px] text-[#A7B4C8]">Current Shunt</div>
                  <div className="text-sm font-bold text-[#F8FAFC] mt-0.5">{instrumentation.busTelemetry.current}</div>
                </div>
              </div>

              <div className="bg-[#111C30] p-2 rounded border border-[#26364D] space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#A7B4C8]">Communication Protocol:</span>
                  <span className="text-[#F8FAFC] font-medium">{instrumentation.busTelemetry.protocol}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#A7B4C8]">Hardware Interlock:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {instrumentation.busTelemetry.interlockState}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0C1628] border border-[#26364D] rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-[#A7B4C8] text-[11px] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
                Power Budget Allocation:
              </span>
              <span className="font-bold text-[#00D9FF] text-xs">
                {instrumentation.busTelemetry.powerAllocated}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Footer Power & Interlock Summary Bar */}
      <div className="p-2 rounded-lg bg-[#080F1E] border border-[#26364D] flex items-center justify-between text-xs font-mono">
        <span className="text-[#A7B4C8] flex items-center gap-1.5 text-[11px]">
          <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
          Active Draw: <span className="text-[#F8FAFC] font-bold">{stage.powerConsumptionW} W</span>
        </span>
        <span className="text-[10px] text-[#00D9FF] font-mono flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {instrumentation.sensors.length} Sensors • {instrumentation.controllers.length} Controllers
        </span>
      </div>

    </div>
  );
};
