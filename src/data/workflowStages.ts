import { WorkflowStageData, ManufacturedItem } from '../types';

export const WORKFLOW_STAGES: WorkflowStageData[] = [
  {
    id: 1,
    name: 'Enclosed Manufacturing Zone',
    shortName: 'Manufacturing Zone',
    badgeColor: 'bg-blue-600 text-white',
    accentHex: '#2563EB',
    iconName: 'Printer',
    summary: 'Manufacturing starts in a sealed environment. Sensors monitor process and detect debris.',
    keyComponents: [
      'Enclosed chamber',
      'Manufacturing tool (3D printer / CNC)',
      'Local debris capture nozzle',
      'Interlock door'
    ],
    sensorsUsed: [
      'Temperature sensor',
      'Pressure sensor',
      'Vibration sensor',
      'Camera (process monitoring)',
      'Door position sensor',
      'Particle sensor (in-chamber)'
    ],
    liveSensors: [
      { name: 'Chamber Pressure', type: 'Pressure', currentValue: '101.3', unit: 'kPa', status: 'nominal' },
      { name: 'Extruder/Laser Temp', type: 'Temperature', currentValue: '245.0', unit: '°C', status: 'active' },
      { name: 'Chamber Vibration', type: 'Vibration', currentValue: '0.04', unit: 'mm/s²', status: 'nominal' },
      { name: 'Particle Count', type: 'Aerosol', currentValue: '18', unit: 'ppm', status: 'nominal' }
    ],
    operationalStatus: 'Running',
    powerConsumptionW: 38,
    flowRole: {
      inputs: ['Recycled Feedstock (from Stage 5/6)', 'Power (28V DC)'],
      outputs: ['Finished Parts (to Stage 2)', 'Debris & Particulates (to Stage 3)'],
      flowTypes: ['product', 'material', 'data', 'control', 'feedback']
    }
  },
  {
    id: 2,
    name: 'Product Collection & Handling',
    shortName: 'Product Collection',
    badgeColor: 'bg-teal-600 text-white',
    accentHex: '#0D9488',
    iconName: 'Bot',
    summary: 'Finished product is detected, picked and placed in a secure storage cartridge.',
    keyComponents: [
      'Robotic arm with compliant gripper',
      'Vision system',
      'Transfer mechanism',
      'Secured storage cartridge'
    ],
    sensorsUsed: [
      'Vision camera',
      'Force/torque sensor (gripper)',
      'Position encoder',
      'Proximity sensor',
      'Weight sensor (cartridge)',
      'RFID (product identification)'
    ],
    liveSensors: [
      { name: 'Gripper Force', type: 'Force/Torque', currentValue: '14.2', unit: 'N', status: 'nominal' },
      { name: 'Vision Alignment', type: 'Optical', currentValue: '99.8', unit: '%', status: 'nominal' },
      { name: 'RFID Tagging', type: 'RFID', currentValue: 'AF-PT-8891', unit: '', status: 'active' },
      { name: 'Cartridge Mass', type: 'Weight', currentValue: '342.5', unit: 'g', status: 'nominal' }
    ],
    operationalStatus: 'Active',
    powerConsumptionW: 18,
    flowRole: {
      inputs: ['Finished Part (from Stage 1)'],
      outputs: ['Secure Part Transfer (to Stage 6)'],
      flowTypes: ['product', 'data', 'control']
    }
  },
  {
    id: 3,
    name: 'Localized Debris Capture',
    shortName: 'Debris Capture',
    badgeColor: 'bg-purple-600 text-white',
    accentHex: '#9333EA',
    iconName: 'Wind',
    summary: 'Debris is captured at source before it spreads. Sensors adjust capture in real-time.',
    keyComponents: [
      'Localized capture nozzle',
      'Multi-stage collector (mechanical + optional electrostatic)',
      'Sealed debris container'
    ],
    sensorsUsed: [
      'Particle concentration sensor',
      'Particle size sensor',
      'Differential pressure sensor',
      'Flow sensor',
      'Fill-level sensor (collector)',
      'Camera (optional)'
    ],
    liveSensors: [
      { name: 'Capture Velocity', type: 'Flow', currentValue: '12.4', unit: 'm/s', status: 'active' },
      { name: 'Differential Pressure', type: 'Pressure', currentValue: '2.4', unit: 'kPa', status: 'nominal' },
      { name: 'Particle Size Est.', type: 'Laser Size', currentValue: '15 - 45', unit: 'μm', status: 'active' },
      { name: 'Canister Fill Level', type: 'Capacity', currentValue: '28.6', unit: '%', status: 'nominal' }
    ],
    operationalStatus: 'Active',
    powerConsumptionW: 14,
    flowRole: {
      inputs: ['Airborne Debris & Micro-chips (from Stage 1)'],
      outputs: ['Captured Debris Stream (to Stage 4)'],
      flowTypes: ['material', 'data', 'control']
    }
  },
  {
    id: 4,
    name: 'Material Identification & Separation',
    shortName: 'Material Identification',
    badgeColor: 'bg-amber-600 text-white',
    accentHex: '#D97706',
    iconName: 'Layers',
    summary: 'Recovered material is identified and separated into different categories using sensor data and AI.',
    keyComponents: [
      'Conveyor & sorting mechanism',
      'Optical/NIR/IR sensor',
      'Magnetic sensor',
      'AI-based classification unit',
      'Automated routing gates'
    ],
    sensorsUsed: [
      'Spectroscopy sensor (NIR/IR/XRF)',
      'Magnetic sensor',
      'Weight sensor',
      'Vision camera',
      'Material database (process data)',
      'Contamination sensor'
    ],
    liveSensors: [
      { name: 'NIR Spectrometer', type: 'Spectral', currentValue: '99.4% Al-6061', unit: 'match', status: 'active' },
      { name: 'Magnetic Inductance', type: 'Magnetic', currentValue: '0.82', unit: 'Tesla', status: 'nominal' },
      { name: 'AI Model Latency', type: 'Inference', currentValue: '14.2', unit: 'ms', status: 'nominal' },
      { name: 'Routing Diverter', type: 'Actuator', currentValue: 'Gate B: Metal', unit: '', status: 'active' }
    ],
    operationalStatus: 'Running',
    powerConsumptionW: 16,
    flowRole: {
      inputs: ['Raw Debris Stream (from Stage 3)'],
      outputs: [
        'Separated Recyclables (Metals/Polymers to Stage 5)',
        'Contaminated/Unidentified (to Stage 7)'
      ],
      flowTypes: ['material', 'data', 'control']
    }
  },
  {
    id: 5,
    name: 'Recycling & Feedstock Preparation',
    shortName: 'Recycling & Feedstock',
    badgeColor: 'bg-emerald-600 text-white',
    accentHex: '#059669',
    iconName: 'RefreshCw',
    summary: 'Separated material is processed into reusable feedstock with quality inspection.',
    keyComponents: [
      'Shredder (size reduction)',
      'Induction furnace (metals)',
      'Extruder (polymers)',
      'Filtration classification',
      'Feedstock storage'
    ],
    sensorsUsed: [
      'Temperature sensor',
      'Current sensor (induction)',
      'Motor load sensor',
      'Mass flow sensor',
      'Material quality sensor',
      'Thermal/IR sensor',
      'Oxygen/atmosphere sensor (if required)'
    ],
    liveSensors: [
      { name: 'Induction Crucible', type: 'Temperature', currentValue: '660.2', unit: '°C', status: 'nominal' },
      { name: 'Filament Diameter', type: 'Laser Gauge', currentValue: '1.75 ± 0.02', unit: 'mm', status: 'nominal' },
      { name: 'Extruder Motor Load', type: 'Current', currentValue: '2.1', unit: 'A', status: 'nominal' },
      { name: 'Feedstock Purity', type: 'Spectral', currentValue: '99.8', unit: '%', status: 'nominal' }
    ],
    operationalStatus: 'Running',
    powerConsumptionW: 42,
    flowRole: {
      inputs: ['Sorted Metals & Polymers (from Stage 4)'],
      outputs: [
        'Metal Ingot/Powder & Filament/Pellets (to Stage 6)',
        'Direct Closed-Loop Feedstock (re-fed to Stage 1)'
      ],
      flowTypes: ['material', 'feedback', 'data', 'control']
    }
  },
  {
    id: 6,
    name: 'Product & Material Storage',
    shortName: 'Storage Vault',
    badgeColor: 'bg-sky-600 text-white',
    accentHex: '#0284C7',
    iconName: 'Archive',
    summary: 'Finished products and recycled feedstock are safely stored with continuous monitoring.',
    keyComponents: [
      'Sealed storage modules',
      'Environmental control',
      'Inventory management'
    ],
    sensorsUsed: [
      'RFID',
      'Weight sensor',
      'Temperature & humidity sensor',
      'Storage level sensor',
      'Camera (inventory check)'
    ],
    liveSensors: [
      { name: 'Storage Vault Temp', type: 'Environment', currentValue: '20.1', unit: '°C', status: 'nominal' },
      { name: 'Finished Parts Qty', type: 'Inventory', currentValue: '14 Units', unit: '', status: 'nominal' },
      { name: 'Recycled Spool Stock', type: 'Inventory', currentValue: '4.8', unit: 'kg', status: 'nominal' },
      { name: 'Atmosphere Inertness', type: 'Gas Purity', currentValue: '99.9% N2', unit: '', status: 'nominal' }
    ],
    operationalStatus: 'Nominal',
    powerConsumptionW: 8,
    flowRole: {
      inputs: ['Finished Products (from Stage 2)', 'Recycled Feedstock (from Stage 5)'],
      outputs: ['Mission Payload Dispense', 'Closed-Loop Feedstock Refill (to Stage 1)'],
      flowTypes: ['product', 'material', 'feedback', 'data', 'control']
    }
  },
  {
    id: 7,
    name: 'Waste Management (Non-recoverable)',
    shortName: 'Waste Isolation',
    badgeColor: 'bg-purple-900 text-white',
    accentHex: '#581C87',
    iconName: 'Trash2',
    summary: 'Non-recoverable or contaminated waste is isolated and safely stored.',
    keyComponents: [
      'Sealed waste container',
      'Isolation valve',
      'Safe storage for disposal or return to Earth'
    ],
    sensorsUsed: [
      'Fill-level sensor',
      'Gas/pressure sensor',
      'Temperature sensor'
    ],
    liveSensors: [
      { name: 'Waste Canister Level', type: 'Capacity', currentValue: '14.2', unit: '%', status: 'nominal' },
      { name: 'Isolation Valve Seal', type: 'Seal Pressure', currentValue: 'Hermetic / OK', unit: '', status: 'nominal' },
      { name: 'Outgassing Sensor', type: 'Gas Detection', currentValue: '0.00', unit: 'ppm', status: 'nominal' },
      { name: 'Canister Core Temp', type: 'Thermal', currentValue: '18.9', unit: '°C', status: 'nominal' }
    ],
    operationalStatus: 'Standby',
    powerConsumptionW: 4,
    flowRole: {
      inputs: ['Contaminated / Non-recoverable stream (from Stage 4)'],
      outputs: ['Earth Return Capsule / Orbital Safe Storage'],
      flowTypes: ['material', 'data', 'control']
    }
  },
  {
    id: 8,
    name: 'Supervisory Control & Safety System',
    shortName: 'Supervisory Control',
    badgeColor: 'bg-cyan-600 text-white',
    accentHex: '#0891B2',
    iconName: 'Cpu',
    summary: 'Central control coordinates all modules, ensures safety, optimizes power and provides real-time status.',
    keyComponents: [
      'Real-time monitoring engine',
      'Power management supervisor',
      'Fault detection & safe mode controller',
      'Data logging & traceability ledger',
      'Operator interface console',
      'Spacecraft communication bus'
    ],
    sensorsUsed: [
      'All sensor data from modules (1-7)',
      'Power consumption telemetry',
      'Health diagnostics & bus monitors'
    ],
    liveSensors: [
      { name: 'System Status', type: 'Executive', currentValue: 'Nominal', unit: '', status: 'nominal' },
      { name: 'Chamber Sealed', type: 'Interlock', currentValue: 'Verified ✓', unit: '', status: 'nominal' },
      { name: 'Active Power Draw', type: 'Power', currentValue: '82.0', unit: 'W (≤150W)', status: 'nominal' },
      { name: 'Fault Detection', type: 'Diagnostics', currentValue: '0 Faults / Clear', unit: '', status: 'nominal' }
    ],
    operationalStatus: 'Monitoring',
    powerConsumptionW: 12,
    flowRole: {
      inputs: ['Sensor Telemetry streams from Stages 1-7', 'Spacecraft Ground Commands'],
      outputs: ['Actuation & Safety Control Signals to Stages 1-7', 'Spacecraft Downlink'],
      flowTypes: ['data', 'control']
    }
  }
];

export const SAMPLE_MANUFACTURED_PARTS: ManufacturedItem[] = [
  {
    id: 'PART-01',
    name: 'Orbital Hinge Bracket',
    material: 'Al-6061 Metal',
    massGrams: 84.5,
    specGrade: 'Aero-Space Flight Ready',
    recyclabilityRate: 98.5
  },
  {
    id: 'PART-02',
    name: 'Solar Boom Deployment Joint',
    material: 'PEEK-CF Polymer/Composite',
    massGrams: 112.0,
    specGrade: 'Cryo-Thermal Grade',
    recyclabilityRate: 94.2
  },
  {
    id: 'PART-03',
    name: 'Fluid Transfer Coupler',
    material: 'Ti-6Al-4V Titanium',
    massGrams: 65.8,
    specGrade: 'High Pressure Hermetic',
    recyclabilityRate: 99.1
  },
  {
    id: 'PART-04',
    name: 'Optical Sensor Lens Mount',
    material: 'Al-7075 Anodized',
    massGrams: 42.2,
    specGrade: 'Micro-Vibration Dampened',
    recyclabilityRate: 97.8
  }
];

export const SUPPORTING_SYSTEMS = [
  {
    title: 'Power Supply',
    spec: 'Spacecraft bus 28 V / 120 V DC',
    desc: 'Dual-rail regulated bus with battery peak buffering',
    status: 'Nominal (28.4 V DC)'
  },
  {
    title: 'Thermal Management',
    spec: 'Heat dissipation & active cooling',
    desc: 'Pumped single-phase fluid loop connected to radiator panel',
    status: 'Loop Temp: 21.3 °C'
  },
  {
    title: 'Structural Interface',
    spec: 'Mounting & vibration isolation',
    desc: 'Tuned mass damping to prevent launch/maneuver harmonic excitation',
    status: 'Vibe Damping: Active'
  },
  {
    title: 'Communication',
    spec: 'To spacecraft (telemetry & data)',
    desc: 'CAN-bus and SpaceWire telemetry uplink to flight computer',
    status: 'High-Gain Uplink: 100%'
  }
];
