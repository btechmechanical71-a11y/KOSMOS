import React from 'react';
import { motion } from 'motion/react';

interface StageGraphicProps {
  stageId: number;
  isActive: boolean;
  cycleProgress?: number; // 0 to 1
  isPrinting?: boolean;
}

export const StageGraphic: React.FC<StageGraphicProps> = ({
  stageId,
  isActive,
  cycleProgress = 0,
  isPrinting = true
}) => {
  switch (stageId) {
    // ----------------------------------------------------
    // STAGE 1: Enclosed Manufacturing Zone (3D Printer / CNC)
    // ----------------------------------------------------
    case 1:
      return (
        <div className="relative w-full h-44 rounded-xl bg-[#0C1628] border border-[#26364D] p-2 overflow-hidden flex flex-col justify-between">
          {/* Chamber Ambient Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#26364D20_1px,transparent_1px),linear-gradient(to_bottom,#26364D20_1px,transparent_1px)] bg-[size:12px_12px] opacity-60 pointer-events-none" />
          
          {/* Top gantry rail */}
          <div className="relative z-10 flex justify-between items-center px-2.5 py-1 bg-[#111C30] border-b border-[#26364D] rounded-lg text-[10px] font-mono text-[#00D9FF]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              CHAMBER SEALED
            </span>
            <span className="text-[#A7B4C8]">245°C / 101.3 kPa</span>
          </div>

          {/* 3D Print Stage Animation */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-1">
            <div className="relative w-36 h-28 border border-[#26364D] rounded-lg bg-[#080F1E] shadow-inner flex flex-col justify-end p-2 overflow-hidden">
              
              {/* Moving Printhead & Laser Beam */}
              <motion.div 
                className="absolute top-2 w-7 h-4 bg-[#111C30] border border-[#00D9FF] rounded-sm shadow-md flex flex-col items-center"
                animate={{
                  x: [4, 70, 20, 90, 4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              >
                {/* Laser / Extrusion tip */}
                <div className="w-1 h-2 bg-amber-400" />
                <motion.div 
                  className="w-0.5 h-10 bg-gradient-to-b from-[#00D9FF] via-amber-300 to-transparent"
                  animate={{ opacity: [0.6, 1, 0.4, 0.9] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
              </motion.div>

              {/* Debris particles flying towards suction nozzle */}
              <motion.div 
                className="absolute right-1 top-2 w-4 h-4 rounded-full bg-[#3973FF]/20 border border-[#3973FF] flex items-center justify-center text-[7px] text-[#00D9FF] font-mono"
                title="Debris suction nozzle"
              >
                VAC
              </motion.div>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-amber-300"
                  animate={{
                    x: [25 + i * 15, 110],
                    y: [60, 10],
                    opacity: [1, 0],
                    scale: [1, 0.4]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    delay: i * 0.3,
                    ease: "easeIn"
                  }}
                />
              ))}

              {/* Manufactured Part growing on bed */}
              <div className="relative mx-auto flex flex-col items-center">
                <motion.div 
                  className="w-12 h-6 bg-gradient-to-t from-[#3973FF] to-[#00D9FF] rounded-t border-t border-[#00D9FF] shadow-md shadow-[#00D9FF]/20 flex items-center justify-center text-[8px] font-mono font-bold text-[#080F1E]"
                  animate={{
                    scaleY: [0.7, 1, 0.85, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                >
                  PART
                </motion.div>
                {/* Build Plate */}
                <div className="w-24 h-2 bg-[#1E2D48] border-t border-[#26364D] rounded-sm" />
              </div>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 flex justify-between items-center text-[9px] text-[#A7B4C8] px-1 font-mono">
            <span>PRINTING: AL-6061</span>
            <span className="text-[#00D9FF] font-semibold">LAYER 342/480</span>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // STAGE 2: Product Collection & Handling (Robotic Arm)
    // ----------------------------------------------------
    case 2:
      return (
        <div className="relative w-full h-44 rounded-xl bg-[#0C1628] border border-[#26364D] p-2 overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-center px-2.5 py-1 bg-[#111C30] border-b border-[#26364D] rounded-lg text-[10px] font-mono text-[#00D9FF]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
              ROBOTIC GRIPPER
            </span>
            <span className="text-[#A7B4C8]">FORCE: 14.2 N</span>
          </div>

          {/* Animated Robotic Arm */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <svg viewBox="0 0 140 100" className="w-36 h-24">
              {/* Base Mount */}
              <rect x="15" y="75" width="26" height="15" rx="3" fill="#111C30" stroke="#26364D" strokeWidth="1.5" />
              <circle cx="28" cy="75" r="4" fill="#3973FF" />

              {/* Arm Segment 1 */}
              <motion.g
                animate={{
                  rotate: [-10, 15, -10],
                  originX: "28px",
                  originY: "75px"
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <line x1="28" y1="75" x2="65" y2="40" stroke="#26364D" strokeWidth="6" strokeLinecap="round" />
                <circle cx="65" cy="40" r="4" fill="#00D9FF" />

                {/* Arm Segment 2 */}
                <motion.g
                  animate={{
                    rotate: [20, -25, 20],
                    originX: "65px",
                    originY: "40px"
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <line x1="65" y1="40" x2="95" y2="55" stroke="#3973FF" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Compliant Gripper */}
                  <circle cx="95" cy="55" r="3" fill="#00D9FF" />
                  <path d="M 92 58 L 92 68 L 96 72" fill="none" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 98 58 L 98 68 L 94 72" fill="none" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" />

                  {/* Picked Part */}
                  <motion.rect 
                    x="90" y="66" width="10" height="10" rx="2" 
                    fill="#3973FF" stroke="#00D9FF" strokeWidth="1"
                    animate={{ opacity: [1, 0.9, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                  {/* Optical Target Laser */}
                  <line x1="95" y1="55" x2="95" y2="85" stroke="#00D9FF" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.7" />
                </motion.g>
              </motion.g>

              {/* Secure Transfer Cartridge */}
              <rect x="100" y="70" width="30" height="20" rx="2" fill="#080F1E" stroke="#26364D" strokeWidth="1" />
              <text x="104" y="83" fill="#00D9FF" fontSize="6" fontFamily="monospace">RFID CART</text>
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-center text-[9px] text-[#A7B4C8] px-1 font-mono">
            <span>VISION: ALIGNED 99.8%</span>
            <span className="text-[#00D9FF] font-semibold">TRANSFERRING →</span>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // STAGE 3: Localized Debris Capture (Cyclone Vacuum)
    // ----------------------------------------------------
    case 3:
      return (
        <div className="relative w-full h-44 rounded-xl bg-[#0C1628] border border-[#26364D] p-2 overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-center px-2.5 py-1 bg-[#111C30] border-b border-[#26364D] rounded-lg text-[10px] font-mono text-[#00D9FF]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-ping" />
              DEBRIS CYCLONE
            </span>
            <span className="text-[#A7B4C8]">VEL: 12.4 m/s</span>
          </div>

          {/* Animated Cyclone Chamber */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="relative w-36 h-28 flex items-center justify-center">
              
              {/* Flexible Corrugated Hose */}
              <svg viewBox="0 0 140 90" className="w-full h-full">
                {/* Corrugated curve tube */}
                <path 
                  d="M 10 15 C 30 15, 35 45, 55 45" 
                  fill="none" 
                  stroke="#26364D" 
                  strokeWidth="8" 
                  strokeDasharray="2,2" 
                  strokeLinecap="round" 
                />
                
                {/* Transparent Cyclone Cylinder */}
                <rect x="55" y="20" width="40" height="40" rx="4" fill="#111C30" stroke="#3973FF" strokeWidth="1.5" opacity="0.9" />
                <polygon points="55,60 95,60 85,75 65,75" fill="#080F1E" stroke="#3973FF" strokeWidth="1" />
                
                {/* Bottom Collection Container */}
                <rect x="63" y="75" width="24" height="12" rx="2" fill="#111C30" stroke="#00D9FF" strokeWidth="1" />
                <rect x="65" y="79" width="20" height="7" rx="1" fill="#3973FF" opacity="0.4" />
                <text x="68" y="85" fill="#00D9FF" fontSize="5" fontFamily="monospace">CANISTER</text>

                {/* Swirling particles inside cyclone */}
                <motion.circle cx="75" cy="35" r="2" fill="#00D9FF"
                  animate={{
                    cx: [65, 85, 75, 65],
                    cy: [30, 38, 48, 30],
                    scale: [1, 0.6, 1.2, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <motion.circle cx="70" cy="45" r="1.5" fill="#F8FAFC"
                  animate={{
                    cx: [82, 68, 80, 82],
                    cy: [40, 52, 35, 40],
                  }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                />
                <motion.circle cx="75" cy="55" r="2" fill="#3973FF"
                  animate={{
                    cx: [72, 78, 72],
                    cy: [55, 65, 55],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </svg>
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-center text-[9px] text-[#A7B4C8] px-1 font-mono">
            <span>SIZE: 15-45 μm</span>
            <span className="text-[#00D9FF] font-semibold">FILTRATION ACTIVE</span>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // STAGE 4: Material Identification & Separation (NIR / AI)
    // ----------------------------------------------------
    case 4:
      return (
        <div className="relative w-full h-44 rounded-xl bg-[#0C1628] border border-[#26364D] p-2 overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-center px-2.5 py-1 bg-[#111C30] border-b border-[#26364D] rounded-lg text-[10px] font-mono text-[#00D9FF]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              AI NIR SPECTROMETER
            </span>
            <span className="text-[#A7B4C8]">CONF: 99.4%</span>
          </div>

          {/* Conveyor Belt & Multi-Bin Separator */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            
            {/* Overhead NIR Sensor Beam */}
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-3 bg-[#111C30] border border-amber-400 rounded-t-sm flex items-center justify-center text-[6px] font-mono text-amber-300">
                NIR / IR
              </div>
              <motion.div 
                className="w-16 h-8 bg-gradient-to-b from-amber-400/30 via-red-500/10 to-transparent border-x border-amber-400/30"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </div>

            {/* Conveyor line */}
            <div className="relative w-36 h-4 bg-[#111C30] border-y border-[#26364D] rounded-sm flex items-center overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#26364D_0px,#26364D_4px,#111C30_4px,#111C30_8px)]"
                animate={{ x: [-16, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              {/* Passing material particles */}
              <motion.div 
                className="relative z-10 w-2 h-2 rounded bg-amber-400 shadow-sm"
                animate={{ x: [0, 130] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </div>

            {/* 4 Sorting Bins */}
            <div className="grid grid-cols-4 gap-1 w-36 mt-2">
              <div className="bg-[#080F1E] border border-[#26364D] rounded p-1 text-center">
                <div className="text-[7px] font-mono text-[#00D9FF] font-bold">METAL</div>
                <div className="w-full h-1.5 bg-[#00D9FF]/40 rounded-full mt-0.5" />
              </div>
              <div className="bg-[#080F1E] border border-[#26364D] rounded p-1 text-center">
                <div className="text-[7px] font-mono text-emerald-300 font-bold">POLY</div>
                <div className="w-full h-1.5 bg-emerald-500/40 rounded-full mt-0.5" />
              </div>
              <div className="bg-[#080F1E] border border-[#26364D] rounded p-1 text-center">
                <div className="text-[7px] font-mono text-[#3973FF] font-bold">COMP</div>
                <div className="w-full h-1.5 bg-[#3973FF]/40 rounded-full mt-0.5" />
              </div>
              <div className="bg-[#080F1E] border border-[#26364D] rounded p-1 text-center">
                <div className="text-[7px] font-mono text-[#A7B4C8] font-bold">OTHER</div>
                <div className="w-full h-1.5 bg-[#A7B4C8]/40 rounded-full mt-0.5" />
              </div>
            </div>

          </div>

          <div className="relative z-10 flex justify-between items-center text-[9px] text-[#A7B4C8] px-1 font-mono">
            <span>CLASSIFY: AL-6061</span>
            <span className="text-amber-400 font-semibold">ROUTING GATE B</span>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // STAGE 5: Recycling & Feedstock Preparation (Induction + Extruder)
    // ----------------------------------------------------
    case 5:
      return (
        <div className="relative w-full h-44 rounded-xl bg-[#0C1628] border border-[#26364D] p-2 overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-center px-2.5 py-1 bg-[#111C30] border-b border-[#26364D] rounded-lg text-[10px] font-mono text-[#00D9FF]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              INDUCTION & EXTRUDER
            </span>
            <span className="text-[#A7B4C8]">TEMP: 660°C</span>
          </div>

          {/* Dual Furnace & Extruder Visual */}
          <div className="relative z-10 flex-1 flex items-center justify-around px-1">
            
            {/* Induction Crucible (Metals) */}
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-16 bg-[#080F1E] border border-orange-500/60 rounded-md p-1 flex flex-col items-center justify-between shadow-lg shadow-orange-500/10">
                {/* Induction Coils */}
                <div className="absolute -left-1 inset-y-2 w-1 border-r-2 border-orange-500 border-dashed" />
                <div className="absolute -right-1 inset-y-2 w-1 border-l-2 border-orange-500 border-dashed" />
                
                <span className="text-[7px] font-mono text-orange-400 font-bold">INDUCTION</span>
                {/* Molten metal glow */}
                <motion.div 
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-300 shadow-md shadow-orange-500/50 flex items-center justify-center text-[7px] font-bold text-slate-950"
                  animate={{
                    scale: [0.92, 1.05, 0.92],
                    opacity: [0.85, 1, 0.85]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  MELT
                </motion.div>
                <span className="text-[6px] font-mono text-[#A7B4C8]">INGOT / POWDER</span>
              </div>
            </div>

            {/* Extruder & Spool (Polymers) */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 bg-[#080F1E] border border-[#00D9FF]/40 rounded-md p-1 flex flex-col items-center justify-between shadow-lg shadow-[#00D9FF]/10">
                <span className="text-[7px] font-mono text-[#00D9FF] font-bold">EXTRUDER</span>
                {/* Rotating Filament Spool */}
                <motion.div 
                  className="w-8 h-8 rounded-full border-2 border-[#00D9FF] border-dashed flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#3973FF]" />
                </motion.div>
                {/* Filament Line Output */}
                <span className="text-[6px] font-mono text-[#00D9FF]">1.75mm SPOOL</span>
              </div>
            </div>

          </div>

          <div className="relative z-10 flex justify-between items-center text-[9px] text-[#A7B4C8] px-1 font-mono">
            <span>PURITY: 99.8%</span>
            <span className="text-emerald-400 font-semibold">FEEDSTOCK READY</span>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // STAGE 6: Product & Material Storage (Storage Vault)
    // ----------------------------------------------------
    case 6:
      return (
        <div className="relative w-full h-44 rounded-xl bg-[#0C1628] border border-[#26364D] p-2 overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-center px-2.5 py-1 bg-[#111C30] border-b border-[#26364D] rounded-lg text-[10px] font-mono text-[#00D9FF]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
              STORAGE VAULT
            </span>
            <span className="text-[#A7B4C8]">RFID INVENTORY</span>
          </div>

          {/* Carousel Rack Visual */}
          <div className="relative z-10 flex-1 flex items-center justify-around py-1">
            {/* Shelf A: Finished Parts */}
            <div className="w-16 h-20 bg-[#080F1E] border border-[#26364D] rounded-lg p-1 flex flex-col justify-between">
              <div className="text-[7px] font-mono text-[#00D9FF] font-bold border-b border-[#26364D] pb-0.5">
                PARTS (14)
              </div>
              <div className="space-y-1 my-auto">
                <div className="w-full h-3 bg-[#111C30] border border-[#3973FF]/40 rounded-sm flex items-center justify-between px-1 text-[6px] text-[#F8FAFC]">
                  <span>BRACKET</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="w-full h-3 bg-[#111C30] border border-[#3973FF]/40 rounded-sm flex items-center justify-between px-1 text-[6px] text-[#F8FAFC]">
                  <span>JOINT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="text-[6px] text-[#A7B4C8] font-mono">SEALED CART</div>
            </div>

            {/* Shelf B: Recycled Feedstock */}
            <div className="w-16 h-20 bg-[#080F1E] border border-[#26364D] rounded-lg p-1 flex flex-col justify-between">
              <div className="text-[7px] font-mono text-[#3973FF] font-bold border-b border-[#26364D] pb-0.5">
                FEEDSTOCK
              </div>
              <div className="space-y-1 my-auto">
                <div className="w-full h-3 bg-[#111C30] border border-[#00D9FF]/40 rounded-sm flex items-center justify-between px-1 text-[6px] text-[#00D9FF]">
                  <span>SPOOL 4.8kg</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                </div>
                <div className="w-full h-3 bg-[#111C30] border border-[#00D9FF]/40 rounded-sm flex items-center justify-between px-1 text-[6px] text-[#00D9FF]">
                  <span>INGOTS 12kg</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                </div>
              </div>
              <div className="text-[6px] text-[#A7B4C8] font-mono">CLOSED-LOOP OK</div>
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-center text-[9px] text-[#A7B4C8] px-1 font-mono">
            <span>ATMOS: 99.9% N2</span>
            <span className="text-[#00D9FF] font-semibold">SECURE MONITORED</span>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // STAGE 7: Waste Management (Non-recoverable)
    // ----------------------------------------------------
    case 7:
      return (
        <div className="relative w-full h-44 rounded-xl bg-[#0C1628] border border-[#26364D] p-2 overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-center px-2.5 py-1 bg-[#111C30] border-b border-[#26364D] rounded-lg text-[10px] font-mono text-[#00D9FF]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              NON-RECOVERABLE
            </span>
            <span className="text-[#A7B4C8]">LEVEL: 14.2%</span>
          </div>

          {/* Hazardous Isolation Canister */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            {/* Top Valve Wheel */}
            <div className="relative flex flex-col items-center">
              <div className="w-8 h-2 bg-[#111C30] border border-[#26364D] rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <div className="w-2 h-2 bg-[#26364D]" />
            </div>

            {/* Heavy-duty Cylinder Container */}
            <div className="relative w-24 h-16 bg-[#080F1E] border border-[#26364D] rounded-lg p-1.5 flex flex-col items-center justify-between shadow-lg">
              {/* Hazard Stripes */}
              <div className="w-full h-1.5 rounded-sm bg-[repeating-linear-gradient(45deg,#eab308_0px,#eab308_4px,#080F1E_4px,#080F1E_8px)] opacity-70" />
              
              <div className="flex items-center gap-1 text-[7px] font-mono text-[#F8FAFC] font-bold">
                <span>NON-RECOVERABLE</span>
              </div>

              <div className="w-full bg-[#111C30] border border-[#26364D] rounded px-1 py-0.5 flex justify-between items-center text-[6px] font-mono text-[#A7B4C8]">
                <span>ISOLATION</span>
                <span className="text-emerald-400 font-semibold">HERMETIC</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-center text-[9px] text-[#A7B4C8] px-1 font-mono">
            <span>DISPOSAL: EARTH RET</span>
            <span className="text-amber-400 font-semibold">CONTAINED</span>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // STAGE 8: Supervisory Control & Safety System (Tablet Console)
    // ----------------------------------------------------
    case 8:
      return (
        <div className="relative w-full h-44 rounded-xl bg-[#0C1628] border border-[#26364D] p-2 overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-center px-2.5 py-1 bg-[#111C30] border-b border-[#26364D] rounded-lg text-[10px] font-mono text-[#00D9FF]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-ping" />
              SUPERVISORY CONTROL
            </span>
            <span className="text-[#A7B4C8]">PWR: 82 W</span>
          </div>

          {/* Rugged Spacecraft Tablet Terminal Screen */}
          <div className="relative z-10 flex-1 flex flex-col justify-between p-1.5 bg-[#080F1E] border border-[#26364D] rounded-lg shadow-inner my-1 font-mono">
            <div className="flex justify-between items-center text-[8px] text-[#00D9FF] border-b border-[#26364D] pb-0.5">
              <span className="font-bold">ASTRAFORGE OS</span>
              <span className="text-emerald-400">NOMINAL</span>
            </div>

            {/* Checklist from diagram */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[7px] text-[#A7B4C8] my-0.5">
              <div className="flex justify-between">
                <span className="text-[#A7B4C8]/70">Chamber:</span>
                <span className="text-emerald-400 font-bold">Sealed ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B4C8]/70">Debris Cap:</span>
                <span className="text-[#00D9FF] font-bold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B4C8]/70">Sorting:</span>
                <span className="text-amber-400 font-bold">Running</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B4C8]/70">Recycling:</span>
                <span className="text-emerald-400 font-bold">Standby</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B4C8]/70">Storage:</span>
                <span className="text-[#00D9FF] font-bold">OK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B4C8]/70">Alerts:</span>
                <span className="text-emerald-400 font-bold">None</span>
              </div>
            </div>

            {/* Live sparkline bar */}
            <div className="flex items-center justify-between text-[7px] text-[#A7B4C8] border-t border-[#26364D] pt-0.5">
              <span>PEAK MARGIN:</span>
              <div className="w-16 h-1.5 bg-[#111C30] rounded-full overflow-hidden border border-[#26364D]">
                <div className="w-[55%] h-full bg-[#00D9FF] rounded-full" />
              </div>
              <span className="text-[#00D9FF] font-semibold">55%</span>
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-center text-[9px] text-[#A7B4C8] px-1 font-mono">
            <span>UPLINK: CAN-BUS</span>
            <span className="text-[#00D9FF] font-semibold">CENTRAL SUPERVISOR</span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
