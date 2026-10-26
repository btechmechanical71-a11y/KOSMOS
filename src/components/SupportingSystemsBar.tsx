import React, { useState, useEffect } from 'react';
import { 
  SunMedium, 
  ThermometerSnowflake, 
  Boxes, 
  Radio, 
  Gauge, 
  ArrowRight,
  Zap,
  Wind,
  Orbit,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Waves,
  RefreshCw
} from 'lucide-react';

interface SupportingSystemsBarProps {
  totalPowerW?: number;
  activeStageId?: number;
}

export const SupportingSystemsBar: React.FC<SupportingSystemsBarProps> = ({
  totalPowerW = 108,
  activeStageId = 1
}) => {
  // Simulated real-time sensor states
  const [oxygenPercent, setOxygenPercent] = useState<number>(20.92);
  const [oxygenPartialPressure, setOxygenPartialPressure] = useState<number>(21.2);
  const [cabinTemp, setCabinTemp] = useState<number>(21.4);
  const [radiatorTemp, setRadiatorTemp] = useState<number>(18.3);
  const [microgravityUg, setMicrogravityUg] = useState<number>(118);
  const [accelAxes, setAccelAxes] = useState<{ x: number; y: number; z: number }>({ x: 0.02, y: -0.01, z: 0.08 });
  const [livePowerW, setLivePowerW] = useState<number>(totalPowerW);
  const [busVoltage, setBusVoltage] = useState<number>(28.2);

  // Sparkline history arrays for flowing graph visuals (last 14 points)
  const [oxygenHistory, setOxygenHistory] = useState<number[]>([20.91, 20.92, 20.93, 20.92, 20.91, 20.92, 20.94, 20.92, 20.93, 20.92, 20.91, 20.93, 20.92, 20.92]);
  const [tempHistory, setTempHistory] = useState<number[]>([21.3, 21.4, 21.4, 21.5, 21.4, 21.3, 21.4, 21.5, 21.6, 21.5, 21.4, 21.4, 21.5, 21.4]);
  const [gravityHistory, setGravityHistory] = useState<number[]>([115, 118, 122, 119, 116, 117, 120, 118, 115, 121, 118, 116, 119, 118]);
  const [powerHistory, setPowerHistory] = useState<number[]>([102, 105, 108, 106, 109, 107, 110, 108, 107, 109, 108, 106, 108, 108]);

  // Keep livePowerW synced with totalPowerW with micro-fluctuations
  useEffect(() => {
    setLivePowerW(totalPowerW);
  }, [totalPowerW]);

  // Real-time procedural telemetry update ticker (updates every 900ms)
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Oxygen telemetry: nominal 20.9% atmospheric composition
      setOxygenPercent((prev) => {
        const delta = (Math.random() - 0.49) * 0.03;
        const next = parseFloat(Math.min(21.05, Math.max(20.82, prev + delta)).toFixed(2));
        setOxygenHistory((h) => [...h.slice(1), next]);
        return next;
      });

      setOxygenPartialPressure((prev) => {
        const delta = (Math.random() - 0.5) * 0.04;
        return parseFloat(Math.min(21.4, Math.max(21.0, prev + delta)).toFixed(2));
      });

      // 2. Temperature telemetry: responsive to active stage and cooling loop
      setCabinTemp((prev) => {
        const thermalLoadBias = activeStageId === 1 || activeStageId === 5 ? 0.04 : -0.02;
        const delta = (Math.random() - 0.48) * 0.15 + thermalLoadBias;
        const next = parseFloat(Math.min(23.2, Math.max(20.6, prev + delta)).toFixed(1));
        setTempHistory((h) => [...h.slice(1), next]);
        return next;
      });

      setRadiatorTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.12;
        return parseFloat(Math.min(19.8, Math.max(17.2, prev + delta)).toFixed(1));
      });

      // 3. Microgravity telemetry: orbital freefall in LEO
      setMicrogravityUg((prev) => {
        const jitter = (Math.random() - 0.5) * 6;
        const next = Math.round(Math.min(145, Math.max(95, prev + jitter)));
        setGravityHistory((h) => [...h.slice(1), next]);
        return next;
      });

      setAccelAxes({
        x: parseFloat(((Math.random() - 0.5) * 0.04).toFixed(3)),
        y: parseFloat(((Math.random() - 0.5) * 0.03).toFixed(3)),
        z: parseFloat((0.07 + (Math.random() - 0.5) * 0.03).toFixed(3))
      });

      // 4. Power consumption telemetry
      setLivePowerW((_) => {
        const noise = (Math.random() - 0.5) * 1.8;
        const next = Math.round(totalPowerW + noise);
        setPowerHistory((h) => [...h.slice(1), next]);
        return next;
      });

      setBusVoltage((prev) => {
        const vNoise = (Math.random() - 0.5) * 0.06;
        return parseFloat(Math.min(28.4, Math.max(28.0, prev + vNoise)).toFixed(2));
      });

    }, 900);

    return () => clearInterval(timer);
  }, [activeStageId, totalPowerW]);

  // Helper to render mini SVG sparkline
  const renderSparkline = (data: number[], strokeColor: string, fillColor: string) => {
    if (data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 26;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    const lastX = width;
    const lastY = height - ((data[data.length - 1] - min) / range) * (height - 6) - 3;
    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-7 overflow-visible">
        <polygon points={areaPoints} fill={fillColor} />
        <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastX} cy={lastY} r="2" fill={strokeColor} />
      </svg>
    );
  };

  const powerCapacityPct = Math.min(100, Math.round((livePowerW / 150) * 100));

  return (
    <div className="border-t border-[#26364D] bg-[#080F1E] p-4 font-sans text-xs transition-colors">
      <div className="max-w-[1700px] mx-auto space-y-4">
        
        {/* ============================================================= */}
        {/* SECTION 1: REAL-TIME SIMULATED ENVIRONMENTAL & POWER TELEMETRY */}
        {/* ============================================================= */}
        <div className="rounded-2xl bg-[#111C30] border border-[#26364D] p-4 shadow-xl">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#26364D] pb-3 mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#00D9FF]" />
              <div>
                <h4 className="font-heading font-semibold text-[#F8FAFC] tracking-wider text-xs flex items-center gap-2">
                  <span>REAL-TIME ENVIRONMENTAL &amp; STATION TELEMETRY</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#00D9FF]/10 text-[#00D9FF] font-mono border border-[#00D9FF]/30">
                    LIVE 60Hz STREAM
                  </span>
                </h4>
                <p className="text-[11px] text-[#A7B4C8]">
                  Atmospheric ECLSS oxygen concentration, active radiator loop, orbital microgravity accelerometer, and governed power consumption
                </p>
              </div>
            </div>
          </div>

          {/* 4-Card Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* CARD 1: OXYGEN (O2) LEVEL */}
            <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D] hover:border-[#3973FF]/60 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#111C30] text-[#00D9FF] border border-[#26364D]">
                      <Wind className="w-4 h-4" />
                    </div>
                    <span className="font-mono font-semibold text-[#F8FAFC] text-xs tracking-wider">
                      OXYGEN (O₂)
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#111C30] text-emerald-400 border border-[#26364D] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    STABLE
                  </span>
                </div>

                {/* Primary Metric */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-heading font-bold text-[#F8FAFC] tracking-tight">
                    {oxygenPercent.toFixed(2)}%
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    (20.9% Nominal)
                  </span>
                </div>

                {/* Secondary Telemetry */}
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#A7B4C8] border-t border-[#26364D] pt-2 mb-2">
                  <div>
                    <span className="text-[#A7B4C8]/70 block text-[9px] uppercase">Partial Press:</span>
                    <span className="text-[#F8FAFC] font-semibold">{oxygenPartialPressure} kPa</span>
                  </div>
                  <div>
                    <span className="text-[#A7B4C8]/70 block text-[9px] uppercase">ECLSS Loop:</span>
                    <span className="text-emerald-400 font-semibold">99.8% Purity</span>
                  </div>
                </div>
              </div>

              {/* Sparkline & Range Bar */}
              <div>
                <div className="mb-1">
                  {renderSparkline(oxygenHistory, '#00D9FF', 'rgba(0, 217, 255, 0.12)')}
                </div>
                <div className="w-full bg-[#1B2940] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#00D9FF] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(20, (oxygenPercent / 22) * 100))}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#A7B4C8] mt-1">
                  <span>Min: 19.5%</span>
                  <span className="text-[#00D9FF]">Target: 20.9%</span>
                  <span>Max: 23.5%</span>
                </div>
              </div>
            </div>

            {/* CARD 2: TEMPERATURE (°C) */}
            <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D] hover:border-[#3973FF]/60 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#111C30] text-[#00D9FF] border border-[#26364D]">
                      <ThermometerSnowflake className="w-4 h-4" />
                    </div>
                    <span className="font-mono font-semibold text-[#F8FAFC] text-xs tracking-wider">
                      TEMPERATURE
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#111C30] text-[#00D9FF] border border-[#26364D] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                    REGULATED
                  </span>
                </div>

                {/* Primary Metric */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-heading font-bold text-[#F8FAFC] tracking-tight">
                    {cabinTemp.toFixed(1)}°C
                  </span>
                  <span className="text-xs font-mono text-[#00D9FF]">
                    (Ambient Cabin)
                  </span>
                </div>

                {/* Secondary Telemetry */}
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#A7B4C8] border-t border-[#26364D] pt-2 mb-2">
                  <div>
                    <span className="text-[#A7B4C8]/70 block text-[9px] uppercase">Radiator Loop:</span>
                    <span className="text-[#00D9FF] font-semibold">{radiatorTemp}°C</span>
                  </div>
                  <div>
                    <span className="text-[#A7B4C8]/70 block text-[9px] uppercase">Heat Rejection:</span>
                    <span className="text-[#F8FAFC] font-semibold">44.8 W Dissipated</span>
                  </div>
                </div>
              </div>

              {/* Sparkline & Range Bar */}
              <div>
                <div className="mb-1">
                  {renderSparkline(tempHistory, '#00D9FF', 'rgba(0, 217, 255, 0.12)')}
                </div>
                <div className="w-full bg-[#1B2940] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#00D9FF] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(10, ((cabinTemp - 15) / 15) * 100))}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#A7B4C8] mt-1">
                  <span>18.0°C</span>
                  <span className="text-[#00D9FF]">Nominal: 21.0°C</span>
                  <span>26.0°C</span>
                </div>
              </div>
            </div>

            {/* CARD 3: GRAVITY (MICROGRAVITY / μg) */}
            <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D] hover:border-[#3973FF]/60 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#111C30] text-[#3973FF] border border-[#26364D]">
                      <Orbit className="w-4 h-4" />
                    </div>
                    <span className="font-mono font-semibold text-[#F8FAFC] text-xs tracking-wider">
                      GRAVITY (μg)
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#111C30] text-[#86a9ff] border border-[#26364D] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3973FF]" />
                    MICRO-G
                  </span>
                </div>

                {/* Primary Metric */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-heading font-bold text-[#F8FAFC] tracking-tight">
                    {microgravityUg} <span className="text-base text-[#A7B4C8]">μg</span>
                  </span>
                  <span className="text-xs font-mono text-[#3973FF]">
                    (1.18×10⁻⁴ g)
                  </span>
                </div>

                {/* Secondary Telemetry */}
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#A7B4C8] border-t border-[#26364D] pt-2 mb-2">
                  <div>
                    <span className="text-[#A7B4C8]/70 block text-[9px] uppercase">3-Axis Vector:</span>
                    <span className="text-[#F8FAFC] font-semibold">{accelAxes.x},{accelAxes.y},{accelAxes.z}</span>
                  </div>
                  <div>
                    <span className="text-[#A7B4C8]/70 block text-[9px] uppercase">RMS Jitter:</span>
                    <span className="text-[#86a9ff] font-semibold">±11.4 μg (Quiet)</span>
                  </div>
                </div>
              </div>

              {/* Sparkline & Range Bar */}
              <div>
                <div className="mb-1">
                  {renderSparkline(gravityHistory, '#3973FF', 'rgba(57, 115, 255, 0.12)')}
                </div>
                <div className="w-full bg-[#1B2940] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#3973FF] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(15, (microgravityUg / 200) * 100))}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#A7B4C8] mt-1">
                  <span>0 μg</span>
                  <span className="text-[#3973FF]">LEO Freefall: &lt;10⁻³ g</span>
                  <span>1000 μg</span>
                </div>
              </div>
            </div>

            {/* CARD 4: POWER CONSUMPTION & BUS DATA */}
            <div className="p-3.5 rounded-xl bg-[#0C1628] border border-[#26364D] hover:border-[#3973FF]/60 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#111C30] text-[#00D9FF] border border-[#26364D]">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-mono font-semibold text-[#F8FAFC] text-xs tracking-wider">
                      POWER LOAD
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#111C30] text-[#00D9FF] border border-[#26364D] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                    GOVERNED
                  </span>
                </div>

                {/* Primary Metric */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-heading font-bold text-[#F8FAFC] tracking-tight">
                    {livePowerW} <span className="text-base text-[#A7B4C8]">W</span>
                  </span>
                  <span className="text-xs font-mono text-[#00D9FF]">
                    ({powerCapacityPct}% of 150W)
                  </span>
                </div>

                {/* Secondary Telemetry */}
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#A7B4C8] border-t border-[#26364D] pt-2 mb-2">
                  <div>
                    <span className="text-[#A7B4C8]/70 block text-[9px] uppercase">Bus Voltage:</span>
                    <span className="text-[#F8FAFC] font-semibold">{busVoltage} V DC</span>
                  </div>
                  <div>
                    <span className="text-[#A7B4C8]/70 block text-[9px] uppercase">Peak Limit:</span>
                    <span className="text-[#00D9FF] font-semibold">≤ 150 W Max</span>
                  </div>
                </div>
              </div>

              {/* Sparkline & Range Bar */}
              <div>
                <div className="mb-1">
                  {renderSparkline(powerHistory, '#00D9FF', 'rgba(0, 217, 255, 0.12)')}
                </div>
                <div className="w-full bg-[#1B2940] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#00D9FF] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${powerCapacityPct}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#A7B4C8] mt-1">
                  <span>0 W</span>
                  <span className="text-[#00D9FF]">Peak Cap: 150 W</span>
                  <span>150 W</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
