import React, { useState, useEffect, useCallback } from 'react';
import { WORKFLOW_STAGES } from './data/workflowStages';
import { WorkflowStageData, FlowType } from './types';
import { Header } from './components/Header';
import { FlowControls } from './components/FlowControls';
import { WorkflowDiagram } from './components/WorkflowDiagram';
import { SupportingSystemsBar } from './components/SupportingSystemsBar';
import { StageDetailModal } from './components/StageDetailModal';
import { SimulateCycleModal } from './components/SimulateCycleModal';
import { SystemInfoModal } from './components/SystemInfoModal';
import { HapNripSection } from './components/HapNripSection';
import { AercsGanSection } from './components/AercsGanSection';
import { AatmXSection } from './components/AatmXSection';
import { ReferencesSection } from './components/ReferencesSection';
import { OpeningDomainModal } from './components/OpeningDomainModal';
import { soundEffects } from './utils/audio';

export default function App() {
  const [currentSection, setCurrentSection] = useState<'workflow' | 'hap-nrip' | 'aercs-gan' | 'aatm-x' | 'references'>('workflow');
  const [isDomainModalOpen, setIsDomainModalOpen] = useState<boolean>(true);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Layer filters
  const [visibleFlows, setVisibleFlows] = useState<Record<FlowType, boolean>>({
    product: true,
    material: true,
    data: true,
    control: true,
    feedback: true
  });

  // Modals
  const [selectedStageForModal, setSelectedStageForModal] = useState<WorkflowStageData | null>(null);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.setEnabled(next);
    if (next) {
      soundEffects.playStepPulse();
    }
  };

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const stepIntervalMs = Math.round(3000 / speed);
      interval = setInterval(() => {
        setActiveStageId((prev) => {
          const next = prev >= 8 ? 1 : prev + 1;
          soundEffects.playStepPulse();
          return next;
        });
      }, stepIntervalMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handleNextStage = useCallback(() => {
    setActiveStageId((prev) => {
      const next = prev >= 8 ? 1 : prev + 1;
      soundEffects.playStepPulse();
      return next;
    });
  }, []);

  const handlePrevStage = useCallback(() => {
    setActiveStageId((prev) => {
      const next = prev <= 1 ? 8 : prev - 1;
      soundEffects.playStepPulse();
      return next;
    });
  }, []);

  const handleSelectStage = (id: number) => {
    setActiveStageId(id);
    const targetStage = WORKFLOW_STAGES.find((s) => s.id === id);
    if (targetStage) {
      setSelectedStageForModal(targetStage);
      soundEffects.playScanChime();
    }
  };

  const handleToggleFlow = (flow: FlowType) => {
    setVisibleFlows((prev) => ({
      ...prev,
      [flow]: !prev[flow]
    }));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStageId(1);
    soundEffects.playStepPulse();
    showToast('Workflow reset to Stage 1 (Enclosed Manufacturing Zone)');
  };

  // Calculate total power
  const activeStage = WORKFLOW_STAGES.find((s) => s.id === activeStageId);
  const totalPowerW = 82 + (activeStage?.powerConsumptionW ? Math.round(activeStage.powerConsumptionW * 0.4) : 0);

  return (
    <div className="min-h-screen bg-[#080F1E] text-[#F8FAFC] flex flex-col justify-between selection:bg-[#00D9FF] selection:text-[#080F1E] font-sans">
      
      {/* Top Header */}
      <Header
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={handleReset}
        onLaunchCycle={() => setIsCycleModalOpen(true)}
        activeStageId={activeStageId}
        totalPowerW={totalPowerW}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenInfo={() => setIsInfoModalOpen(true)}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
        currentSection={currentSection}
        onChangeSection={setCurrentSection}
      />

      {currentSection === 'workflow' ? (
        <>
          {/* Control Bar & Flow Layer Selectors */}
          <FlowControls
            activeStageId={activeStageId}
            onSelectStage={(id) => {
              setActiveStageId(id);
              soundEffects.playStepPulse();
            }}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onPrevStage={handlePrevStage}
            onNextStage={handleNextStage}
            speed={speed}
            onChangeSpeed={(newSpeed) => setSpeed(newSpeed)}
            visibleFlows={visibleFlows}
            onToggleFlow={handleToggleFlow}
          />

          {/* Main Workflow Visualization Area */}
          <main className="flex-1 w-full max-w-[1700px] mx-auto py-2">
            <WorkflowDiagram
              stages={WORKFLOW_STAGES}
              activeStageId={activeStageId}
              onSelectStage={handleSelectStage}
              visibleFlows={visibleFlows}
              cycleActive={false}
              cycleStageId={activeStageId}
            />
          </main>
        </>
      ) : currentSection === 'hap-nrip' ? (
        /* Dedicated HAP-NRIP Platform Section */
        <main className="flex-1 w-full max-w-[1700px] mx-auto py-2">
          <HapNripSection />
        </main>
      ) : currentSection === 'aercs-gan' ? (
        /* Dedicated AERCS-GaN Containment & Recovery Section */
        <main className="flex-1 w-full max-w-[1700px] mx-auto py-2">
          <AercsGanSection />
        </main>
      ) : currentSection === 'aatm-x' ? (
        /* Dedicated AATM-X Thermal Management Section */
        <main className="flex-1 w-full max-w-[1700px] mx-auto py-2">
          <AatmXSection />
        </main>
      ) : (
        /* Dedicated References & Photo Repository Section */
        <main className="flex-1 w-full max-w-[1700px] mx-auto py-2">
          <ReferencesSection />
        </main>
      )}

      {/* Supporting Systems & Power Management Bar */}
      <SupportingSystemsBar totalPowerW={totalPowerW} activeStageId={activeStageId} />

      {/* Stage Detail / Diagnostics Modal */}
      <StageDetailModal
        stage={selectedStageForModal}
        onClose={() => setSelectedStageForModal(null)}
        onTriggerAction={(actionName) => {
          showToast(`Executed: ${actionName}`);
          soundEffects.playSuccessChime();
        }}
      />

      {/* Simulated Cycle Runner Modal */}
      <SimulateCycleModal
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
        onStageChange={(stageId) => setActiveStageId(stageId)}
      />

      {/* System Information Modal */}
      <SystemInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Opening Manufacturing Domain Selector Window */}
      <OpeningDomainModal
        isOpen={isDomainModalOpen}
        onSelectSemiconductor={() => {
          setIsDomainModalOpen(false);
          showToast('Orbital Semiconductor Wafers (GaN/SiC) Console Initialized');
        }}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111C30] border border-[#26364D] text-[#F8FAFC] px-4 py-2.5 rounded-xl shadow-2xl shadow-black/60 text-xs font-mono flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF] shrink-0" />
          <span className="text-[#A7B4C8] font-normal">EVENT:</span>
          <span className="font-medium text-[#F8FAFC]">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
