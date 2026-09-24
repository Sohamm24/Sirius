import React from 'react';
import type { KPI, PipelineCount } from '../../data/types';
import { getPipelineConfig } from '../../utils/pipelineConfig';

interface KPISectionProps {
  kpis: KPI[];
  pipelineCounts: PipelineCount[];
  activeStage: string | null;
  onStageClick: (stage: string | null) => void;
  isLoading: boolean;
}

function PipelineSkeleton() {
  return (
    <div className="h-16 bg-[#111111] border border-[#262626] rounded-xl animate-pulse" />
  );
}

const KPISection: React.FC<KPISectionProps> = ({
  pipelineCounts,
  activeStage,
  onStageClick,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        <PipelineSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Task Pipeline */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#262626]">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#737373]">Task Execution Pipeline</span>
          {activeStage && (
            <button
              onClick={() => onStageClick(null)}
              className="text-[10px] text-[#525252] hover:text-[#F2F2F2] bg-none border-none cursor-pointer px-1.5 py-0.5 rounded transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
        <div className="flex items-center overflow-x-auto divide-x divide-[#262626]">
          {pipelineCounts.map((pc) => {
            const cfg = getPipelineConfig(pc.stage);
            const isSelected = activeStage === pc.stage;
            return (
              <div
                key={pc.stage}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 flex-1 cursor-pointer transition-colors hover:bg-[#171717] min-w-0 ${
                  isSelected ? 'bg-[#EC4899]/10' : ''
                }`}
                onClick={() => onStageClick(isSelected ? null : pc.stage)}
                role="button"
                tabIndex={0}
                aria-label={`${cfg.label}: ${pc.count} tasks`}
                onKeyDown={(e) => e.key === 'Enter' && onStageClick(pc.stage)}
              >
                <div
                  className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-bold text-lg leading-none"
                    style={{ color: isSelected ? cfg.color : '#F2F2F2' }}
                  >
                    {pc.count}
                  </div>
                  <div className="text-[9px] font-semibold tracking-wider uppercase text-[#525252] mt-0.5 truncate">
                    {cfg.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KPISection;
