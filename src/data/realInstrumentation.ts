export interface RealSensorSpec {
  id: string;
  name: string;
  technology: string;
  model: string;
  nominalRange: string;
  currentValue: string;
  unit: string;
  tolerance: string;
  updateRate: string;
  status: 'Nominal' | 'Active' | 'Calibrated' | 'Armed';
  statusColor: string;
}

export interface RealControllerSpec {
  id: string;
  name: string;
  architecture: string;
  controlLoop: string;
  setpoint: string;
  feedback: string;
  outputSignal: string;
  errorMargin: string;
  status: 'Closed-Loop Active' | 'Regulating' | 'Tracking' | 'Standby' | 'Locked';
  statusColor: string;
}

export interface StageInstrumentation {
  stageId: number;
  stageName: string;
  sensors: RealSensorSpec[];
  controllers: RealControllerSpec[];
  busTelemetry: {
    voltage: string;
    current: string;
    powerAllocated: string;
    protocol: string;
    interlockState: string;
  };
}

export const REAL_STAGE_INSTRUMENTATION: Record<number, StageInstrumentation> = {
  1: {
    stageId: 1,
    stageName: 'Enclosed Manufacturing Zone',
    sensors: [
      {
        id: 'S1-01',
        name: 'Chamber Absolute Pressure Gauge',
        technology: 'Piezo-Resistive / Pirani Hybrid',
        model: 'MKS-Baratron Space-Spec 925',
        nominalRange: '0.01 – 150.0 kPa',
        currentValue: '101.32',
        unit: 'kPa',
        tolerance: '±0.05 kPa',
        updateRate: '50 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S1-02',
        name: 'Melt Pool & Extruder Pyrometer',
        technology: 'Dual-Wavelength Infrared Optical',
        model: 'Mikron M770-S Fiber Optic',
        nominalRange: '50.0 – 1,800.0 °C',
        currentValue: '248.6',
        unit: '°C',
        tolerance: '±0.5 °C',
        updateRate: '1,000 Hz',
        status: 'Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'S1-03',
        name: 'In-Chamber Aerosol Particle Counter',
        technology: 'Laser Optical Scattering (0.3–10μm)',
        model: 'Fluke/MetOne Space Grade OPC-300',
        nominalRange: '0 – 100,000 part/cm³',
        currentValue: '3.4',
        unit: 'p/cm³',
        tolerance: '±0.2 p/cm³',
        updateRate: '10 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S1-04',
        name: 'Chamber Micro-Vibration Monitor',
        technology: 'Tri-Axial MEMS Accelerometer',
        model: 'Kistler Space-8395B',
        nominalRange: '±2.0 g',
        currentValue: '0.012',
        unit: 'm/s²',
        tolerance: '1.2×10⁻⁴ g',
        updateRate: '2,500 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S1-05',
        name: 'Hermetic Interlock Door Sensor',
        technology: 'Magnetic Reed + Dual Optical Switch',
        model: 'Honeywell Aerospace HM-2',
        nominalRange: 'Open / Sealed',
        currentValue: 'SEALED',
        unit: '100% Interlock',
        tolerance: 'Zero Leak',
        updateRate: 'Event-driven',
        status: 'Armed',
        statusColor: '#38bdf8'
      }
    ],
    controllers: [
      {
        id: 'C1-01',
        name: '3-Axis Gantry / CNC Motion Controller',
        architecture: 'FPGA Hardware Servo (Xilinx Artix-7)',
        controlLoop: '20 kHz PID + Feedforward Current Loop',
        setpoint: 'X: 140.00 mm, Y: 85.00 mm, Z: 24.50 mm',
        feedback: 'X: 140.00 mm, Y: 85.00 mm, Z: 24.49 mm',
        outputSignal: '±10V / 3-Phase Stepper Pulse',
        errorMargin: 'ΔE: ±2.1 μm',
        status: 'Closed-Loop Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'C1-02',
        name: 'Closed-Loop Extruder/Laser PID Unit',
        architecture: 'Automated PWM Power Inverter (32-Bit ARM)',
        controlLoop: '100 Hz Thermal Derivative Control',
        setpoint: '250.0 °C',
        feedback: '248.6 °C (Heating)',
        outputSignal: 'PWM 78.4% Duty @ 28V DC',
        errorMargin: '-1.4 °C (Transient settling)',
        status: 'Regulating',
        statusColor: '#10b981'
      },
      {
        id: 'C1-03',
        name: 'In-Chamber Vacuum & Purge Regulator',
        architecture: 'Micro-Solenoid Valve Driver ASIC',
        controlLoop: 'Proportional Flow Valve Servo',
        setpoint: '101.30 kPa N2 Inert Blanket',
        feedback: '101.32 kPa',
        outputSignal: 'Valve Orifice: 0.0% (Holding)',
        errorMargin: '+0.02 kPa',
        status: 'Standby',
        statusColor: '#38bdf8'
      }
    ],
    busTelemetry: {
      voltage: '28.08 V DC',
      current: '1.35 A',
      powerAllocated: '38.0 W',
      protocol: 'CAN-bus 2.0B / SpaceWire-100',
      interlockState: 'Chamber Sealed & Interlocked'
    }
  },
  2: {
    stageId: 2,
    stageName: 'Product Collection & Handling',
    sensors: [
      {
        id: 'S2-01',
        name: '6-Axis Compliant Gripper F/T Sensor',
        technology: 'Miniature Silicon Strain Gauge',
        model: 'ATI Industrial Automation Mini40-Space',
        nominalRange: 'Fx,Fy: ±40 N, Fz: ±120 N',
        currentValue: 'Fz: 4.82',
        unit: 'N',
        tolerance: '±0.02 N',
        updateRate: '1,000 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S2-02',
        name: 'Machine Vision Part Alignment Camera',
        technology: 'Global Shutter CMOS Color + Telecentric Lens',
        model: 'Basler ace-2 Space-Hardened 5.1 MP',
        nominalRange: '30 FPS @ 2448×2048',
        currentValue: '99.8',
        unit: '% align',
        tolerance: '±0.04 mm',
        updateRate: '30 Hz',
        status: 'Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'S2-03',
        name: 'Joint Absolute Optical Encoders (J1-J6)',
        technology: 'Dual-Disc 21-Bit Absolute Optical Glass',
        model: 'Gurley Precision Systems A21 Space',
        nominalRange: '0 – 360.0°',
        currentValue: 'J1: 42.18°',
        unit: 'deg',
        tolerance: '±0.005°',
        updateRate: '2,000 Hz',
        status: 'Calibrated',
        statusColor: '#10b981'
      },
      {
        id: 'S2-04',
        name: 'Flight Spec RFID Product Scanner',
        technology: 'Ultra-High Frequency 860–960 MHz',
        model: 'Impinj Indy R2000 Module',
        nominalRange: 'EPC Class 1 Gen 2 / ISO 18000-6C',
        currentValue: 'AF-PT-8891',
        unit: 'Tag ID',
        tolerance: '100% Read',
        updateRate: 'Polled',
        status: 'Nominal',
        statusColor: '#38bdf8'
      },
      {
        id: 'S2-05',
        name: 'Transfer Cartridge Mass Sensor',
        technology: 'High-Precision Micro-Load Cell',
        model: 'HBM Space Series 1 kg',
        nominalRange: '0 – 1,000 g',
        currentValue: '342.50',
        unit: 'g',
        tolerance: '±0.05 g',
        updateRate: '20 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      }
    ],
    controllers: [
      {
        id: 'C2-01',
        name: 'Robotic Arm Inverse Kinematics Controller',
        architecture: '6-DOF Trajectory Planning RTOS DSP',
        controlLoop: '1,000 Hz Quintic Spline Interpolator',
        setpoint: 'Pick Pose: [112.5, 45.0, 18.2] mm',
        feedback: 'Pose: [112.48, 45.01, 18.20] mm',
        outputSignal: '6× CANopen Motor Drive Commands',
        errorMargin: 'Pos Err: 0.024 mm',
        status: 'Tracking',
        statusColor: '#06b6d4'
      },
      {
        id: 'C2-02',
        name: 'Compliant Gripper Soft-Capture Limiter',
        architecture: 'Current-Regulated Voice-Coil Gripper Drive',
        controlLoop: 'Haptic Impedance Control (5.0 N threshold)',
        setpoint: 'Clamp Force: 5.00 N',
        feedback: 'Clamp Force: 4.82 N',
        outputSignal: 'PWM 42% (Current: 0.48A)',
        errorMargin: '-0.18 N (Safe soft-touch)',
        status: 'Closed-Loop Active',
        statusColor: '#10b981'
      },
      {
        id: 'C2-03',
        name: 'Cartridge Automated Lockout Solenoid',
        architecture: 'Bistable Magnetic Latch Relay',
        controlLoop: 'Optical Proximity Interlock',
        setpoint: 'Cartridge Docked & Clamped',
        feedback: 'Engaged & Latched',
        outputSignal: '24V Hold Pulse',
        errorMargin: '0 mm Play',
        status: 'Locked',
        statusColor: '#38bdf8'
      }
    ],
    busTelemetry: {
      voltage: '28.05 V DC',
      current: '0.64 A',
      powerAllocated: '18.0 W',
      protocol: 'CANopen / SpaceWire',
      interlockState: 'Safe Workspace Cleared'
    }
  },
  3: {
    stageId: 3,
    stageName: 'Localized Debris Capture',
    sensors: [
      {
        id: 'S3-01',
        name: 'Suction Intake MEMS Anemometer',
        technology: 'Thermal Boundary Layer Hot-Wire MEMS',
        model: 'Sensirion Space Spec SFM3000',
        nominalRange: '0 – 30.0 m/s',
        currentValue: '14.82',
        unit: 'm/s',
        tolerance: '±0.15 m/s',
        updateRate: '100 Hz',
        status: 'Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'S3-02',
        name: 'Cyclonic Differential Pressure Sensor',
        technology: 'Piezoresistive Diaphragm Silicon',
        model: 'Honeywell Aerospace TruStability HSC',
        nominalRange: '0 – 10.0 kPa',
        currentValue: '2.42',
        unit: 'kPa',
        tolerance: '±0.02 kPa',
        updateRate: '50 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S3-03',
        name: 'In-Line Forward Scattering Particle Sizer',
        technology: 'Laser Diode Multi-Angle Forward Scatter',
        model: 'Grimm Aerosol Space Dust Sizer 11-D',
        nominalRange: '0.25 – 35.0 μm',
        currentValue: '18.4',
        unit: 'μm (d50)',
        tolerance: '±0.5 μm',
        updateRate: '20 Hz',
        status: 'Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'S3-04',
        name: 'Debris Collector Time-of-Flight Fill Gauge',
        technology: 'Class 1 940nm VCSEL Micro-LiDAR',
        model: 'STMicroelectronics FlightSense VL53L8',
        nominalRange: '0 – 100%',
        currentValue: '28.6',
        unit: '% full',
        tolerance: '±1.0%',
        updateRate: '5 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S3-05',
        name: 'Blower Housing Vibration Sensor',
        technology: 'Ceramic Shear Accelerometer',
        model: 'PCB Piezotronics 352C33',
        nominalRange: '±50 g pk',
        currentValue: '0.08',
        unit: 'mm/s²',
        tolerance: '±0.01 mm/s²',
        updateRate: '1,000 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      }
    ],
    controllers: [
      {
        id: 'C3-01',
        name: 'Brushless DC Suction Blower VFD',
        architecture: 'Field-Oriented Control (FOC) Sinusoidal Inverter',
        controlLoop: 'Closed-Loop Airflow Velocity Controller',
        setpoint: 'Velocity: 15.0 m/s (18,500 RPM)',
        feedback: '14.82 m/s (18,480 RPM)',
        outputSignal: '3-Phase PWM 64.2% Duty',
        errorMargin: 'RPM Err: 0.1%',
        status: 'Closed-Loop Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'C3-02',
        name: 'Electrostatic Precipitator HV Supply Unit',
        architecture: 'High-Voltage Resonant Cockcroft-Walton Multiplier',
        controlLoop: 'Constant Current Discharge Loop',
        setpoint: 'Grid Voltage: +4.20 kV DC',
        feedback: '+4.19 kV DC, 0.16 mA',
        outputSignal: 'DC Multiplier Drive 82 kHz',
        errorMargin: 'Arc Voltage Spike: 0 (Stable)',
        status: 'Regulating',
        statusColor: '#10b981'
      },
      {
        id: 'C3-03',
        name: 'Vortex Swirl Nozzle Orifice Actuator',
        architecture: 'Micro-Stepper Dual Flap Linkage',
        controlLoop: 'Aerosol Density Responsive Positioning',
        setpoint: 'Flap Angle: 38.0°',
        feedback: 'Flap Angle: 38.0°',
        outputSignal: 'Digital Micro-step Index',
        errorMargin: 'Δθ: 0.0°',
        status: 'Regulating',
        statusColor: '#38bdf8'
      }
    ],
    busTelemetry: {
      voltage: '28.02 V DC',
      current: '0.50 A',
      powerAllocated: '14.0 W',
      protocol: 'CAN-bus 2.0B / Telemetry Stream',
      interlockState: 'Suction Differential Verified'
    }
  },
  4: {
    stageId: 4,
    stageName: 'Material Identification & Separation',
    sensors: [
      {
        id: 'S4-01',
        name: 'NIR Diffuse Reflectance Spectrometer',
        technology: 'InGaAs Diode Array 900–1700 nm',
        model: 'Hamamatsu C12880MA / NIR-Space',
        nominalRange: '900 – 1,700 nm (256 bands)',
        currentValue: '99.4% Al-6061',
        unit: 'match',
        tolerance: 'R² > 0.992',
        updateRate: '120 Hz',
        status: 'Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'S4-02',
        name: 'High-Frequency Eddy Current Inductance',
        technology: 'Differential Coil High-Q Resonant Tank',
        model: 'Rohmann Aerospace Elotest Micro',
        nominalRange: '100 kHz – 5.0 MHz',
        currentValue: '18.42',
        unit: 'μH',
        tolerance: '±0.05 μH',
        updateRate: '500 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S4-03',
        name: 'Multi-Spectral Line-Scan Machine Vision',
        technology: '2048-Pixel RGB+NIR Linear CCD Array',
        model: 'Teledyne DALSA Linea Space 2k',
        nominalRange: '10 kHz line rate',
        currentValue: '2,048 px',
        unit: '@ 5 kHz',
        tolerance: '0 Frame Drop',
        updateRate: '5,000 Hz',
        status: 'Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'S4-04',
        name: 'Micro-Gravimetric In-Line Strain Scale',
        technology: 'Quartz Crystal Microbalance / Force Shunt',
        model: 'Mettler Toledo Aerospace Micro-W5',
        nominalRange: '0.001 – 50.000 g',
        currentValue: '12.45',
        unit: 'g',
        tolerance: '±0.01 g',
        updateRate: '100 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S4-05',
        name: 'Ferrous Magnetic Field Fluxgate Sensor',
        technology: 'Tri-Axial Fluxgate Magnetometer',
        model: 'Bartington Instruments Mag-03MS',
        nominalRange: '±250 μT',
        currentValue: '0.82',
        unit: 'Tesla (loc)',
        tolerance: '±0.01 T',
        updateRate: '200 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      }
    ],
    controllers: [
      {
        id: 'C4-01',
        name: 'Edge AI NPU Spectral Classifier Unit',
        architecture: 'Embedded Neural Processor (Coral/Hailo-8 Space)',
        controlLoop: 'Real-time Deep Convolutional Spectral Match',
        setpoint: 'Classification Confidence > 95.0%',
        feedback: 'Class: Al-6061 Metal (Conf: 99.4%)',
        outputSignal: 'Diverter Gate Command: ROUTE_BIN_B',
        errorMargin: 'Inference Latency: 8.2 ms',
        status: 'Closed-Loop Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'C4-02',
        name: '4-Way High-Speed Pneumatic Routing Diverter',
        architecture: 'Direct-Acting High-Speed Solenoid Manifold',
        controlLoop: 'Microsecond Triggered Solenoid Pulse',
        setpoint: 'Gate B (Metal Processing) OPEN',
        feedback: 'Actuator B Position: Verified 100%',
        outputSignal: 'Sol-B Energized 24V Pulse (3.8 ms)',
        errorMargin: 'Timing jitter: < 0.2 ms',
        status: 'Regulating',
        statusColor: '#10b981'
      },
      {
        id: 'C4-03',
        name: 'Micro-Conveyor Indexing Velocity Controller',
        architecture: 'Precision Micro-Stepping Drive (1/32 step)',
        controlLoop: 'Optical Encoder Synchronized Feed Rate',
        setpoint: 'Belt Speed: 45.0 mm/s',
        feedback: 'Belt Speed: 45.02 mm/s',
        outputSignal: 'Pulse Frequency 14.4 kHz',
        errorMargin: 'Velocity ripple: < 0.1%',
        status: 'Tracking',
        statusColor: '#38bdf8'
      }
    ],
    busTelemetry: {
      voltage: '28.06 V DC',
      current: '0.57 A',
      powerAllocated: '16.0 W',
      protocol: 'CAN-bus 2.0B / Ethernet Bus',
      interlockState: 'Gate Routing Synchronized'
    }
  },
  5: {
    stageId: 5,
    stageName: 'Recycling & Feedstock Preparation',
    sensors: [
      {
        id: 'S5-01',
        name: 'Electromagnetic Induction Pyrometer',
        technology: 'Two-Color Optical Fiber Infrared',
        model: 'Raytek Marathon MM Space Fiber',
        nominalRange: '450 – 1,400 °C',
        currentValue: '660.2',
        unit: '°C',
        tolerance: '±0.8 °C',
        updateRate: '500 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S5-02',
        name: 'Dual-Axis Laser Filament Micrometer',
        technology: 'High-Speed He-Ne Laser Scanning Ribbon',
        model: 'Zumbach ODAC 14xy Space Precision',
        nominalRange: '0.10 – 10.00 mm',
        currentValue: '1.748',
        unit: 'mm',
        tolerance: '±0.002 mm',
        updateRate: '1,200 Hz',
        status: 'Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'S5-03',
        name: 'Extruder Melt Pressure Piezo-Transducer',
        technology: 'High-Temp Piezoresistive Silicon Diaphragm',
        model: 'Dynisco MDT-422 Space Melt Sensor',
        nominalRange: '0 – 50.0 MPa',
        currentValue: '4.12',
        unit: 'MPa',
        tolerance: '±0.05 MPa',
        updateRate: '100 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S5-04',
        name: 'Induction Inverter Hall-Current Transducer',
        technology: 'Closed-Loop Hall Effect Current Sensor',
        model: 'LEM Aerospace IT-60-S Micro',
        nominalRange: '0 – 20.0 A DC',
        currentValue: '2.14',
        unit: 'A',
        tolerance: '±0.01 A',
        updateRate: '1,000 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S5-05',
        name: 'In-Chamber Oxygen Concentration Sensor',
        technology: 'Zirconia Solid Electrolyte Potentiometric',
        model: 'SST Sensing Space Zirconia O2',
        nominalRange: '0.1 – 1,000 ppm O2',
        currentValue: '8.4',
        unit: 'ppm O2',
        tolerance: '±0.5 ppm',
        updateRate: '2 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      }
    ],
    controllers: [
      {
        id: 'C5-01',
        name: 'High-Frequency Induction Heating Inverter',
        architecture: 'Silicon Carbide (SiC) Half-Bridge Resonant Driver',
        controlLoop: 'Phase-Locked Loop (PLL) Automatic Resonance Tuning',
        setpoint: 'Al Melt Bath: 660.0 °C @ 52.4 kHz',
        feedback: '660.2 °C (Holding Liquidus)',
        outputSignal: 'PWM 48.2 kHz / 36.5 W RF Output',
        errorMargin: 'ΔT: +0.2 °C (Stable Eutectic)',
        status: 'Closed-Loop Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'C5-02',
        name: 'Twin-Screw Polymer Extruder Servo Controller',
        architecture: 'Digital Brushless Servo Controller (DSP 32-Bit)',
        controlLoop: 'Vector Speed & Torque Closed-Loop Control',
        setpoint: 'Screw Speed: 42.0 RPM (Torque Limit: 4.5 Nm)',
        feedback: '42.01 RPM (Torque: 2.18 Nm)',
        outputSignal: 'FOC Vector Stator Currents (Ia, Ib, Ic)',
        errorMargin: 'Speed Ripple: < 0.05%',
        status: 'Regulating',
        statusColor: '#10b981'
      },
      {
        id: 'C5-03',
        name: 'Constant-Tension Spool Winding Capstan',
        architecture: 'Micro-Tension Dancer Arm PID Positioner',
        controlLoop: 'Constant Linear Velocity (CLV) Filament Pull',
        setpoint: 'Diameter: 1.750 mm (Pull: 18.0 mm/s)',
        feedback: 'Diameter: 1.748 mm (Dancer: 1.22 N)',
        outputSignal: 'Capstan Motor PWM 54.1%',
        errorMargin: 'Diameter Err: -0.002 mm',
        status: 'Tracking',
        statusColor: '#38bdf8'
      }
    ],
    busTelemetry: {
      voltage: '28.02 V DC',
      current: '1.50 A',
      powerAllocated: '42.0 W',
      protocol: 'CAN-bus 2.0B / SpaceWire',
      interlockState: 'Crucible Thermal Insulation Active'
    }
  },
  6: {
    stageId: 6,
    stageName: 'Product & Material Storage',
    sensors: [
      {
        id: 'S6-01',
        name: 'Vault Temperature & RH Dual Sensor',
        technology: 'Bandgap Temperature + Capacitive Polymer RH',
        model: 'Sensirion SHT45 Space-Certified',
        nominalRange: '-40 – 85 °C / 0 – 100% RH',
        currentValue: '20.1',
        unit: '°C (18.2% RH)',
        tolerance: '±0.1 °C',
        updateRate: '1 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S6-02',
        name: 'Automated RFID Inventory Antenna Matrix',
        technology: 'Multi-Port Multiplexed Circular UHF Patch',
        model: 'ThingMagic Nano Micro-RFID Reader',
        nominalRange: 'ISO 18000-6C / 64 Tag slots',
        currentValue: '14 Units',
        unit: 'Flight items',
        tolerance: '100% Verified',
        updateRate: '10 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S6-03',
        name: 'Recycled Feedstock Spool Scale',
        technology: 'Precision Temperature-Compensated Strain Gauge',
        model: 'Flintec Aerospace Load Cell 10kg',
        nominalRange: '0 – 10.0 kg',
        currentValue: '4.82',
        unit: 'kg spool stock',
        tolerance: '±0.005 kg',
        updateRate: '5 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S6-04',
        name: 'Inert Nitrogen Blanket Pressure Gauge',
        technology: 'MEMS Resonant Silicon Absolute Pressure',
        model: 'Druck/GE Space-RPS 8000',
        nominalRange: '50.0 – 150.0 kPa',
        currentValue: '103.8',
        unit: 'kPa N2',
        tolerance: '±0.01 kPa',
        updateRate: '10 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S6-05',
        name: 'Storage Microgravity Damping Accelerometer',
        technology: 'Ultra-Quiet Quartz Pendulous Servo',
        model: 'Honeywell QA-2000 Aerospace',
        nominalRange: '±1.0 g',
        currentValue: '< 0.004',
        unit: 'g peak',
        tolerance: '1.0×10⁻⁶ g',
        updateRate: '500 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      }
    ],
    controllers: [
      {
        id: 'C6-01',
        name: 'Multi-Tier Carousel Indexing Stepper',
        architecture: 'Harmonic Drive Micro-Step Positioner',
        controlLoop: 'Absolute Optical Indexing Closed-Loop',
        setpoint: 'Carousel Slot: 08 (Feedstock Bay A)',
        feedback: 'Slot 08 Locked (Angle: 180.00°)',
        outputSignal: 'Holding Current 0.35 A',
        errorMargin: 'Index Repeatability: ±0.02°',
        status: 'Locked',
        statusColor: '#06b6d4'
      },
      {
        id: 'C6-02',
        name: 'Airlock Hermetic Dual-Flange Actuator',
        architecture: 'High-Torque Planetary Gearhead DC Motor',
        controlLoop: 'Double-Seal Interlock Sequencing Logic',
        setpoint: 'External Airlock Door: SECURED',
        feedback: 'Dual Micro-switches Engaged',
        outputSignal: 'Motor Off / Latch Powered',
        errorMargin: 'Zero Hermetic Leakage',
        status: 'Closed-Loop Active',
        statusColor: '#10b981'
      },
      {
        id: 'C6-03',
        name: 'Inert Gas Purge & Pressure Balancer',
        architecture: 'Proportional Micro-Solenoid Bleed Valve',
        controlLoop: 'PID Absolute Pressure Regulating Loop',
        setpoint: 'Overpressure: +2.5 kPa over cabin',
        feedback: '+2.48 kPa differential',
        outputSignal: 'Bleed Valve 2.1% Duty Cycle',
        errorMargin: '-0.02 kPa',
        status: 'Regulating',
        statusColor: '#38bdf8'
      }
    ],
    busTelemetry: {
      voltage: '28.10 V DC',
      current: '0.28 A',
      powerAllocated: '8.0 W',
      protocol: 'CAN-bus 2.0B / Inventory Ledger',
      interlockState: 'Vault Atmospheric Seals Verified'
    }
  },
  7: {
    stageId: 7,
    stageName: 'Waste Management (Non-recoverable)',
    sensors: [
      {
        id: 'S7-01',
        name: 'Canister Non-Contact Ultrasonic Level',
        technology: 'Acoustic Pulse-Echo Transducer (200 kHz)',
        model: 'Massa Space-Sonic M-300',
        nominalRange: '0 – 100% (0 – 10.0 L)',
        currentValue: '14.2',
        unit: '% full',
        tolerance: '±0.5%',
        updateRate: '2 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S7-02',
        name: 'Hazardous VOC / Outgassing Monitor',
        technology: 'Miniature Photoionization Detector (PID)',
        model: 'Ion Science MiniPID 2 Space-PPB',
        nominalRange: '0.00 – 50.00 ppm VOC',
        currentValue: '0.00',
        unit: 'ppm VOC',
        tolerance: '±0.01 ppm',
        updateRate: '1 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S7-03',
        name: 'Isolation Valve Hermetic Seal Sensor',
        technology: 'Dual O-Ring Cavity Pressure Transducer',
        model: 'Kulite Aerospace HKM-375',
        nominalRange: '0 – 200.0 kPa',
        currentValue: 'Hermetic',
        unit: 'OK (0.0 sccm)',
        tolerance: 'Zero Leak',
        updateRate: '10 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S7-04',
        name: 'Canister Core Resistance Thermometer',
        technology: 'Thin-Film Platinum RTD PT-100 Class A',
        model: 'Omega Space-Hardened RTD 100',
        nominalRange: '-50 – 150 °C',
        currentValue: '18.9',
        unit: '°C',
        tolerance: '±0.15 °C',
        updateRate: '2 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      }
    ],
    controllers: [
      {
        id: 'C7-01',
        name: 'Isolation Ball Valve High-Torque Servo',
        architecture: 'Brushless High-Ratio Actuator with Worm Drive',
        controlLoop: 'Non-Backdrivable Mechanical Sealing Logic',
        setpoint: 'Valve Position: 100% ISOLATED',
        feedback: 'Position: 100.0% Closed & Seated',
        outputSignal: 'Holding Torque: 18.5 N·m',
        errorMargin: 'Seal Compression: 100%',
        status: 'Locked',
        statusColor: '#10b981'
      },
      {
        id: 'C7-02',
        name: 'Overpressure Emergency Relief Bypass Unit',
        architecture: 'Dual-Redundant Burst Disc + Pilot Solenoid',
        controlLoop: 'Autonomous Hard-Wired Pressure Interlock',
        setpoint: 'Vent Threshold: 180.0 kPa (Emergency)',
        feedback: 'Current Pressure: 101.3 kPa',
        outputSignal: 'Bypass Pilot Valve: CLOSED',
        errorMargin: 'Armed & Nominal',
        status: 'Standby',
        statusColor: '#38bdf8'
      },
      {
        id: 'C7-03',
        name: 'Earth-Return Safe-Arm Lockout Interlock',
        architecture: 'Pyrotechnic & Mechanical Safe-Arm Mechanism',
        controlLoop: 'Commanded Ground Authorization State Machine',
        setpoint: 'Safe-Arm Status: ARMED FOR JETTISON/STORAGE',
        feedback: 'Interlock Latch: VERIFIED',
        outputSignal: 'Safe Line Monitored',
        errorMargin: 'Interlock Status: Ready',
        status: 'Standby',
        statusColor: '#38bdf8'
      }
    ],
    busTelemetry: {
      voltage: '28.12 V DC',
      current: '0.14 A',
      powerAllocated: '4.0 W',
      protocol: 'CAN-bus 2.0B / Safety Bus',
      interlockState: 'Hermetic Isolation Active'
    }
  },
  8: {
    stageId: 8,
    stageName: 'Supervisory Control & Safety System',
    sensors: [
      {
        id: 'S8-01',
        name: 'Primary 28V Bus Voltage & Current Shunt',
        technology: 'Four-Wire Kelvin Precision Manganin Shunt',
        model: 'Vishay Dale Space-Shunt WSMS',
        nominalRange: '18.0 – 36.0 V / 0 – 10.0 A',
        currentValue: '28.06 V / 2.92 A',
        unit: '81.9 W draw',
        tolerance: '±0.02 V / ±0.01 A',
        updateRate: '1,000 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S8-02',
        name: 'Safety Hardware Interlock Loop Monitor',
        technology: 'Optocoupled Continuous Current Loop (SIL-3)',
        model: 'Aerospace Discrete Hardware Matrix',
        nominalRange: '8/8 Subsystem Interlocks',
        currentValue: '8 / 8 Verified',
        unit: '100% Safe',
        tolerance: '0 Faults',
        updateRate: '10,000 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S8-03',
        name: 'Thermal Cold Plate Temperature Array',
        technology: 'Multichannel Thermocouple & RTD Grid',
        model: 'Spacecraft Payload Heat Rejection Loop',
        nominalRange: '0 – 50.0 °C',
        currentValue: '14.2',
        unit: '°C (78W heat flux)',
        tolerance: '±0.2 °C',
        updateRate: '10 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S8-04',
        name: 'Spacecraft SpaceWire / CAN Bus Monitor',
        technology: 'MIL-STD-1553B & SpaceWire Protocol Analyzer',
        model: 'Cobham Gaisler GR712RC Dual-Core LEON3FT',
        nominalRange: '100 Mbps SpaceWire Bus',
        currentValue: '0 Packet Drops',
        unit: '100% Integrity',
        tolerance: 'BER < 10⁻¹²',
        updateRate: 'Continuous',
        status: 'Nominal',
        statusColor: '#10b981'
      },
      {
        id: 'S8-05',
        name: 'Hardware Watchdog & Heartbeat Counter',
        technology: 'Radiation-Hardened Timer ASIC',
        model: 'Texas Instruments TPS3823-33-Q1 Space',
        nominalRange: '50 ms timeout window',
        currentValue: '40',
        unit: 'ms ping',
        tolerance: '±1 ms',
        updateRate: '25 Hz',
        status: 'Nominal',
        statusColor: '#10b981'
      }
    ],
    controllers: [
      {
        id: 'C8-01',
        name: 'Master RTOS Supervisory Executive',
        architecture: 'Triple Modular Redundant (TMR) Rad-Hard Processor',
        controlLoop: 'Real-Time Deterministic 100 Hz Scheduling Loop',
        setpoint: 'System State: AUTONOMOUS_PRODUCTION_RUN',
        feedback: 'All 8 Subsystems Synchronized (Nominal)',
        outputSignal: 'Spacecraft Downlink Telemetry Packet #88921',
        errorMargin: 'CPU Utilization: 24.8%',
        status: 'Closed-Loop Active',
        statusColor: '#06b6d4'
      },
      {
        id: 'C8-02',
        name: 'Intelligent Dynamic Power Governor',
        architecture: 'Energy Management DSP with Prioritized Shedding',
        controlLoop: 'Real-time Power Budget Arbiter (≤ 150 W Limit)',
        setpoint: 'Max Peak Limit: 150.0 W (Allocated: 81.9 W)',
        feedback: 'Current Consumption: 81.94 W',
        outputSignal: 'Power Headroom Available: +68.06 W',
        errorMargin: 'Safety Margin: 45.4%',
        status: 'Regulating',
        statusColor: '#10b981'
      },
      {
        id: 'C8-03',
        name: 'FDIR Autonomous Fault Isolation Matrix',
        architecture: 'Deterministic Hardware Interlock State Machine',
        controlLoop: 'Sub-millisecond Emergency Trip & Safe Mode',
        setpoint: 'Active Faults: 0 / Threshold Violations: 0',
        feedback: 'Health Diagnostics: 100% PASS',
        outputSignal: 'Interlock Power Gate: ENABLED',
        errorMargin: 'Fault Trip Latency: < 50 μs',
        status: 'Closed-Loop Active',
        statusColor: '#10b981'
      },
      {
        id: 'C8-04',
        name: 'Closed-Loop Circular Feedback Coordinator',
        architecture: 'Continuous Mass-Balance Optimization Algorithm',
        controlLoop: 'Recycled Feedstock Loop Return (5/6 → 1)',
        setpoint: 'Closed-Loop Recovery Target: ≥ 95.0%',
        feedback: 'Current Yield: 98.2% Material Recycled',
        outputSignal: 'Refeed Routing Rate: 1.75 mm @ 18 mm/s',
        errorMargin: 'Loss to Waste: 1.8%',
        status: 'Closed-Loop Active',
        statusColor: '#06b6d4'
      }
    ],
    busTelemetry: {
      voltage: '28.06 V DC',
      current: '2.92 A',
      powerAllocated: '12.0 W (Supervisor)',
      protocol: 'SpaceWire-100 / CAN-bus 2.0B / MIL-STD-1553',
      interlockState: 'Central Safety Loop OK (8/8)'
    }
  }
};
