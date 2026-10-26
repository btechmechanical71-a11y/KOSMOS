export type FlowType = 'product' | 'material' | 'data' | 'control' | 'feedback';

export type MaterialCategory = 'metal' | 'polymer' | 'composite' | 'other';

export interface SensorInfo {
  name: string;
  type: string;
  currentValue: string;
  unit?: string;
  status: 'nominal' | 'active' | 'standby' | 'alert';
}

export interface WorkflowStageData {
  id: number;
  name: string;
  shortName: string;
  badgeColor: string;
  accentHex: string;
  iconName: string;
  summary: string;
  keyComponents: string[];
  sensorsUsed: string[];
  liveSensors: SensorInfo[];
  operationalStatus: 'Running' | 'Active' | 'Standby' | 'Nominal' | 'Monitoring';
  powerConsumptionW: number;
  flowRole: {
    inputs: string[];
    outputs: string[];
    flowTypes: FlowType[];
  };
}

export interface CycleEventLog {
  id: string;
  timestamp: string;
  stageId: number;
  stageName: string;
  message: string;
  type: 'info' | 'success' | 'process' | 'warning';
}

export interface ManufacturedItem {
  id: string;
  name: string;
  material: string;
  massGrams: number;
  specGrade: string;
  recyclabilityRate: number;
}
