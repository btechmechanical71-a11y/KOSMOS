import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Activity, RefreshCw, Gauge, Zap } from 'lucide-react';
import { WorkflowStageData } from '../types';

interface FlowingTelemetryGraphProps {
  stage: WorkflowStageData;
}

interface DataPoint {
  time: number;
  val1: number; // primary channel (0 - 100)
  val2: number; // secondary channel (0 - 100)
}

export const FlowingTelemetryGraph: React.FC<FlowingTelemetryGraphProps> = ({ stage }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeChannel, setActiveChannel] = useState<'both' | 'ch1' | 'ch2'>('both');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(() => {
    // Initialize with 40 points
    const init: DataPoint[] = [];
    const now = Date.now();
    for (let i = 40; i >= 0; i--) {
      const t = (40 - i) * 0.15;
      const v1 = 50 + Math.sin(t * 1.8) * 22 + Math.cos(t * 0.7) * 12;
      const v2 = 45 + Math.cos(t * 1.2) * 18 + Math.sin(t * 2.5) * 8;
      init.push({
        time: now - i * 150,
        val1: Math.max(10, Math.min(95, v1)),
        val2: Math.max(10, Math.min(95, v2))
      });
    }
    return init;
  });

  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const phaseRef = useRef<number>(dataPoints.length * 0.15);

  // Determine stage-specific channel names & units from liveSensors
  const sensor1 = stage.liveSensors[0] || { name: 'Sensor Alpha', unit: 'Hz', currentValue: '54.2' };
  const sensor2 = stage.liveSensors[1] || { name: 'Sensor Beta', unit: 'kPa', currentValue: '101.3' };

  // Color mapping
  const ch1Color = stage.accentHex || '#00D9FF';
  const ch2Color = '#3973FF'; // Royal blue secondary accent

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.round(100 / speedMultiplier);
    const interval = setInterval(() => {
      phaseRef.current += 0.12 * speedMultiplier;
      const p = phaseRef.current;

      // Organic oscillating signal with stage-correlated frequency & noise
      const noise1 = (Math.random() - 0.5) * 6;
      const noise2 = (Math.random() - 0.5) * 5;

      const baseWave1 = 52 + Math.sin(p * 1.6 + stage.id) * 24 + Math.sin(p * 0.4) * 10;
      const baseWave2 = 48 + Math.cos(p * 1.1 + stage.id * 0.5) * 20 + Math.sin(p * 2.1) * 7;

      const newV1 = Math.max(8, Math.min(94, baseWave1 + noise1));
      const newV2 = Math.max(8, Math.min(94, baseWave2 + noise2));

      setDataPoints((prev) => {
        const next = [...prev.slice(1), {
          time: Date.now(),
          val1: Number(newV1.toFixed(1)),
          val2: Number(newV2.toFixed(1))
        }];
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, stage.id]);

  // SVG dimensions
  const svgWidth = 460;
  const svgHeight = 210;
  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 22;
  const paddingBottom = 26;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  // Convert points to SVG smooth path
  const getPathD = (channel: 'val1' | 'val2') => {
    if (dataPoints.length === 0) return '';
    const n = dataPoints.length;
    const coords = dataPoints.map((d, i) => {
      const x = paddingLeft + (i / (n - 1)) * chartW;
      const y = paddingTop + chartH - (d[channel] / 100) * chartH;
      return { x, y };
    });

    // Generate smooth bezier curve
    let d = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const getAreaD = (lineD: string) => {
    if (!lineD) return '';
    const lastX = paddingLeft + chartW;
    const bottomY = paddingTop + chartH;
    const firstX = paddingLeft;
    return `${lineD} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  const path1 = getPathD('val1');
  const area1 = getAreaD(path1);
  const path2 = getPathD('val2');
  const area2 = getAreaD(path2);

  // Latest values & statistics
  const latest = dataPoints[dataPoints.length - 1] || { val1: 50, val2: 50 };
  const avgVal1 = (dataPoints.reduce((acc, p) => acc + p.val1, 0) / dataPoints.length).toFixed(1);
  const maxVal1 = Math.max(...dataPoints.map((p) => p.val1)).toFixed(1);
  const minVal1 = Math.min(...dataPoints.map((p) => p.val1)).toFixed(1);

  return (
    <div className="w-full h-full rounded-xl bg-[#0C1628] border border-[#26364D] p-3.5 flex flex-col justify-between shadow-inner relative overflow-hidden font-sans select-none">
      
      {/* Background HUD Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00D9FF 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-[#26364D] pb-2 mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span 
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isPlaying ? 'bg-[#00D9FF]' : 'bg-amber-400'
              }`} 
            />
            <span 
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isPlaying ? 'bg-[#00D9FF]' : 'bg-amber-500'
              }`} 
            />
          </span>
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00D9FF]" />
            Flowing Telemetry Waveform
          </span>
        </div>

        {/* Action / Channel filter toggles */}
        <div className="flex items-center gap-1.5">
          <div className="bg-[#111C30] border border-[#26364D] rounded-lg p-0.5 flex text-[10px] font-mono">
            <button
              onClick={() => setActiveChannel('both')}
              className={`px-2 py-0.5 rounded transition ${
                activeChannel === 'both' ? 'bg-[#3973FF] text-[#F8FAFC] font-semibold' : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
              }`}
            >
              Dual
            </button>
            <button
              onClick={() => setActiveChannel('ch1')}
              className={`px-2 py-0.5 rounded transition ${
                activeChannel === 'ch1' ? 'bg-[#00D9FF]/20 text-[#00D9FF] font-semibold' : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
              }`}
            >
              CH-1
            </button>
            <button
              onClick={() => setActiveChannel('ch2')}
              className={`px-2 py-0.5 rounded transition ${
                activeChannel === 'ch2' ? 'bg-[#3973FF]/30 text-[#00D9FF] font-semibold' : 'text-[#A7B4C8] hover:text-[#F8FAFC]'
              }`}
            >
              CH-2
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded-lg bg-[#111C30] hover:bg-[#1E2D48] border border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] transition cursor-pointer"
            title={isPlaying ? 'Pause telemetry flow' : 'Resume telemetry flow'}
          >
            {isPlaying ? <Pause className="w-3 h-3 text-[#00D9FF]" /> : <Play className="w-3 h-3 text-emerald-400" />}
          </button>

          <button
            onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
            className="px-2 py-0.5 rounded-lg bg-[#111C30] hover:bg-[#1E2D48] border border-[#26364D] text-[10px] font-mono text-[#00D9FF] hover:text-[#F8FAFC] transition cursor-pointer"
            title="Toggle flow rate"
          >
            {speedMultiplier}x
          </button>
        </div>
      </div>

      {/* Primary SVG Flowing Waveform Graph */}
      {/* Primary SVG Flowing Waveform Graph */}
      <div className="relative w-full aspect-[23/11] min-h-[160px] bg-[#080F1E] border border-[#26364D] rounded-lg overflow-hidden flex items-center justify-center">
        
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-full"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            {/* Primary Gradient Fill */}
            <linearGradient id="ch1Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ch1Color} stopOpacity="0.32" />
              <stop offset="90%" stopColor={ch1Color} stopOpacity="0.01" />
            </linearGradient>

            {/* Secondary Gradient Fill */}
            <linearGradient id="ch2Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ch2Color} stopOpacity="0.25" />
              <stop offset="90%" stopColor={ch2Color} stopOpacity="0.01" />
            </linearGradient>

            {/* Scanline pattern */}
            <pattern id="gridLines" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#26364D" strokeWidth="0.75" strokeDasharray="2,2" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect 
            x={paddingLeft} 
            y={paddingTop} 
            width={chartW} 
            height={chartH} 
            fill="url(#gridLines)" 
            opacity="0.8"
          />

          {/* Horizontal Level Guides */}
          {[0, 25, 50, 75, 100].map((level) => {
            const y = paddingTop + chartH - (level / 100) * chartH;
            return (
              <g key={level}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={paddingLeft + chartW} 
                  y2={y} 
                  stroke={level === 50 ? '#3973FF' : '#26364D'} 
                  strokeWidth={level === 50 ? '1' : '0.5'}
                  opacity={level === 50 ? 0.4 : 0.8}
                />
                <text 
                  x={paddingLeft - 6} 
                  y={y + 3} 
                  fill="#A7B4C8" 
                  fontSize="8" 
                  textAnchor="end" 
                  fontFamily="monospace"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Time axis markers */}
          <g transform={`translate(0, ${paddingTop + chartH + 14})`}>
            <text x={paddingLeft} y="0" fill="#A7B4C8" fontSize="8" fontFamily="monospace" textAnchor="start">-6.0s</text>
            <text x={paddingLeft + chartW * 0.33} y="0" fill="#A7B4C8" fontSize="8" fontFamily="monospace" textAnchor="middle">-4.0s</text>
            <text x={paddingLeft + chartW * 0.66} y="0" fill="#A7B4C8" fontSize="8" fontFamily="monospace" textAnchor="middle">-2.0s</text>
            <text x={paddingLeft + chartW} y="0" fill="#00D9FF" fontSize="8" fontFamily="monospace" textAnchor="end">NOW ●</text>
          </g>

          {/* Flow Area 2 */}
          {(activeChannel === 'both' || activeChannel === 'ch2') && (
            <>
              <path d={area2} fill="url(#ch2Grad)" />
              <path 
                d={path2} 
                fill="none" 
                stroke={ch2Color} 
                strokeWidth="1.75" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </>
          )}

          {/* Flow Area 1 */}
          {(activeChannel === 'both' || activeChannel === 'ch1') && (
            <>
              <path d={area1} fill="url(#ch1Grad)" />
              <path 
                d={path1} 
                fill="none" 
                stroke={ch1Color} 
                strokeWidth="2.25" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </>
          )}

          {/* Leading Edge Scanner Dot & Beacon */}
          {activeChannel !== 'ch2' && (
            <g transform={`translate(${paddingLeft + chartW}, ${paddingTop + chartH - (latest.val1 / 100) * chartH})`}>
              <circle r="6" fill={ch1Color} opacity="0.3" className="animate-ping" />
              <circle r="3.5" fill={ch1Color} stroke="#ffffff" strokeWidth="1" />
            </g>
          )}
          {activeChannel !== 'ch1' && (
            <g transform={`translate(${paddingLeft + chartW}, ${paddingTop + chartH - (latest.val2 / 100) * chartH})`}>
              <circle r="3" fill={ch2Color} stroke="#ffffff" strokeWidth="1" />
            </g>
          )}

          {/* Transparent interaction rects for hover detection */}
          {dataPoints.map((d, i) => {
            const n = dataPoints.length;
            const x = paddingLeft + (i / (n - 1)) * chartW;
            const stepW = chartW / n;
            return (
              <rect
                key={i}
                x={x - stepW / 2}
                y={paddingTop}
                width={stepW}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(d)}
                className="cursor-crosshair"
              />
            );
          })}
        </svg>

        {/* Hovered Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 left-10 bg-[#111C30]/95 border border-[#00D9FF]/50 rounded-lg px-2.5 py-1 text-[10px] font-mono text-[#00D9FF] pointer-events-none shadow-lg backdrop-blur">
            <div>CH1: <span className="text-[#F8FAFC] font-bold">{hoveredPoint.val1}%</span></div>
            <div>CH2: <span className="text-[#00D9FF] font-bold">{hoveredPoint.val2}%</span></div>
          </div>
        )}
      </div>

      {/* Real-time telemetry legend & channel metrics */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#26364D]">
        
        {/* Channel 1 Info */}
        <div className="bg-[#111C30] border border-[#26364D] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#F8FAFC] truncate">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ch1Color }} />
              {sensor1.name}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              CH-1
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-sm font-bold text-[#F8FAFC]">
              {latest.val1} <span className="text-[10px] font-normal text-[#A7B4C8]">{sensor1.unit}</span>
            </span>
            <span className="text-[9px] font-mono text-[#A7B4C8]">
              Avg: {avgVal1} | Peak: {maxVal1}
            </span>
          </div>
        </div>

        {/* Channel 2 Info */}
        <div className="bg-[#111C30] border border-[#26364D] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#F8FAFC] truncate">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ch2Color }} />
              {sensor2.name}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#3973FF]/15 text-[#00D9FF] border border-[#3973FF]/40">
              CH-2
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-sm font-bold text-[#F8FAFC]">
              {latest.val2} <span className="text-[10px] font-normal text-[#A7B4C8]">{sensor2.unit}</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> Stable
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
