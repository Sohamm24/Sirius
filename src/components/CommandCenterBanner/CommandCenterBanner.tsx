import React, { useState } from 'react';
import {
  Plus,
  ArrowLeft,
  Activity,
} from 'lucide-react';
import type { ProjectId, Task, Escalation } from '../../data/types';

interface CommandCenterBannerProps {
  projectId: ProjectId;
  tasks: Task[];
  escalations: Escalation[];
  isAssigningTask: boolean;
  onToggleAssignTask: () => void;
  isLoading?: boolean;
}

// Chart data points per project
const chartDataSets: Record<
  ProjectId,
  { time: string; completed: number; escalated: number }[]
> = {
  sales: [
    { time: '08:00', completed: 12, escalated: 1 },
    { time: '10:00', completed: 28, escalated: 3 },
    { time: '12:00', completed: 45, escalated: 2 },
    { time: '14:00', completed: 68, escalated: 6 },
    { time: '16:00', completed: 94, escalated: 4 },
    { time: '18:00', completed: 126, escalated: 7 },
    { time: '20:00', completed: 148, escalated: 8 },
  ],
  'customer-service': [
    { time: '08:00', completed: 20, escalated: 2 },
    { time: '10:00', completed: 55, escalated: 4 },
    { time: '12:00', completed: 90, escalated: 5 },
    { time: '14:00', completed: 135, escalated: 8 },
    { time: '16:00', completed: 172, escalated: 10 },
    { time: '18:00', completed: 210, escalated: 11 },
    { time: '20:00', completed: 245, escalated: 13 },
  ],
};

const CommandCenterBanner: React.FC<CommandCenterBannerProps> = ({
  projectId,
  tasks,
  escalations,
  isAssigningTask,
  onToggleAssignTask,
  isLoading,
}) => {
  const [activeModal, setActiveModal] = useState<'completed' | 'escalated' | 'trend' | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const chartData = chartDataSets[projectId] ?? chartDataSets.sales;

  // Compute live metrics
  const completedInTasks = tasks.filter((t) => t.status === 'completed').length;
  const escalatedInTasks = tasks.filter((t) => t.status === 'escalated').length;

  const baseCompleted = projectId === 'sales' ? 142 : 238;
  const baseEscalated = projectId === 'sales' ? 8 : 13;

  const totalCompleted = baseCompleted + completedInTasks;
  const totalEscalated = baseEscalated + escalatedInTasks + escalations.length;

  // SVG chart drawing path helpers
  const svgWidth = 500;
  const svgHeight = 75;
  const paddingY = 10;

  const maxCompleted = Math.max(...chartData.map((d) => d.completed), 1);
  const pointsCompleted = chartData.map((d, index) => {
    const x = (index / (chartData.length - 1)) * svgWidth;
    const y = svgHeight - paddingY - (d.completed / maxCompleted) * (svgHeight - paddingY * 2);
    return `${x},${y}`;
  });

  const pointsEscalated = chartData.map((d, index) => {
    const x = (index / (chartData.length - 1)) * svgWidth;
    const y = svgHeight - paddingY - ((d.escalated * 10) / maxCompleted) * (svgHeight - paddingY * 2);
    return `${x},${y}`;
  });

  const pathCompleted = `M ${pointsCompleted.join(' L ')}`;
  const areaCompleted = `M 0,${svgHeight} L ${pointsCompleted.join(' L ')} L ${svgWidth},${svgHeight} Z`;

  const pathEscalated = `M ${pointsEscalated.join(' L ')}`;
  const areaEscalated = `M 0,${svgHeight} L ${pointsEscalated.join(' L ')} L ${svgWidth},${svgHeight} Z`;

  if (isLoading) {
    return (
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-4.5 animate-pulse space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-[#171717] rounded w-64" />
          <div className="h-9 bg-[#171717] rounded w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="h-28 bg-[#171717] rounded-lg" />
          <div className="h-28 bg-[#171717] rounded-lg" />
          <div className="h-28 bg-[#171717] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4.5 space-y-4 shadow-2xl">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#262626] gap-3">
        <div className="flex items-center gap-3">
          {isAssigningTask ? (
            <button
              onClick={onToggleAssignTask}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#171717] hover:bg-[#202020] border border-[#404040] text-[#F2F2F2] rounded-lg cursor-pointer transition-all shrink-0"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>
          ) : (
            <button
              onClick={onToggleAssignTask}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#EC4899] to-[#DB2777] hover:opacity-95 text-white rounded-lg cursor-pointer shadow-md shadow-[#EC4899]/25 transition-all shrink-0"
            >
              <Plus size={15} />
              Assign Task
            </button>
          )}

          {/* Welcome Back Line beside Assign Task Button */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-[#D4D4D4] ml-1">
            <span>
              Welcome back, while you were away, AI Teammate closed{' '}
              <strong className="text-[#38BDF8] font-extrabold underline decoration-[#38BDF8]/40 underline-offset-4">
                {projectId === 'sales' ? `${38 + completedInTasks} leads` : `${64 + completedInTasks} cases`}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards & Graph Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Box 1: Process Completed */}
        <div
          onClick={() => setActiveModal('completed')}
          className="lg:col-span-3 bg-[#111111] border border-[#262626] hover:border-[#38BDF8] rounded-xl p-4 flex flex-col justify-between transition-all group relative overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-[#38BDF8]/10"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveModal('completed')}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#38BDF8]/5 rounded-full blur-xl group-hover:bg-[#38BDF8]/15 transition-all pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#737373] group-hover:text-[#38BDF8] transition-colors">
                Process Completed
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-[#F2F2F2] tracking-tight font-sans">
                {totalCompleted}
              </div>
              <div className="text-xs text-[#737373] mt-1">
                Tasks executed autonomously
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Process Escalated */}
        <div
          onClick={() => setActiveModal('escalated')}
          className="lg:col-span-3 bg-[#111111] border border-[#262626] hover:border-[#EC4899] rounded-xl p-4 flex flex-col justify-between transition-all group relative overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-[#EC4899]/10"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveModal('escalated')}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#EC4899]/5 rounded-full blur-xl group-hover:bg-[#EC4899]/15 transition-all pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#737373] group-hover:text-[#EC4899] transition-colors">
                Process Escalated
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-[#F2F2F2] tracking-tight font-sans">
                {totalEscalated}
              </div>
              <div className="text-xs text-[#737373] mt-1">
                Handed over for human review
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#F59E0B]">
                {escalations.filter((e) => e.humanStatus === 'pending').length} Pending
              </span>
              <div className="text-[10px] text-[#525252] uppercase font-semibold">Requires Action</div>
            </div>
          </div>
        </div>

        {/* Box 3: Graph Banner */}
        <div
          onClick={() => setActiveModal('trend')}
          className="lg:col-span-6 bg-[#111111] border border-[#262626] hover:border-[#38BDF8]/60 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all hover:shadow-lg group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveModal('trend')}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#EC4899]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#737373] group-hover:text-[#F2F2F2] transition-colors">
                Execution Volume & Trend Graph
              </span>
            </div>
            <div className="flex items-center gap-3.5 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                <span className="text-[#737373]">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
                <span className="text-[#737373]">Escalated</span>
              </div>
            </div>
          </div>

          {/* SVG Sparkline Area Graph */}
          <div className="relative w-full h-18 mt-1">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gradientCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradientEscalated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path d={areaCompleted} fill="url(#gradientCompleted)" />
              <path d={areaEscalated} fill="url(#gradientEscalated)" />

              {/* Stroke lines */}
              <path
                d={pathCompleted}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={pathEscalated}
                fill="none"
                stroke="#EC4899"
                strokeWidth="2"
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {chartData.map((d, index) => {
                const cx = (index / (chartData.length - 1)) * svgWidth;
                const cyCompleted = svgHeight - paddingY - (d.completed / maxCompleted) * (svgHeight - paddingY * 2);
                const isHovered = hoveredPoint === index;

                return (
                  <g key={index} onMouseEnter={() => setHoveredPoint(index)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle
                      cx={cx}
                      cy={cyCompleted}
                      r={isHovered ? 5.5 : 3.5}
                      fill="#38BDF8"
                      stroke="#0A0A0A"
                      strokeWidth="1.5"
                      className="transition-all cursor-pointer"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint !== null && (
              <div
                className="absolute bg-[#171717] border border-[#404040] rounded-md px-2.5 py-1.5 text-xs shadow-lg pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(hoveredPoint / (chartData.length - 1)) * 100}%`,
                  top: '0px',
                }}
              >
                <div className="font-semibold text-[#F2F2F2]">{chartData[hoveredPoint].time}</div>
                <div className="text-[#38BDF8]">{chartData[hoveredPoint].completed} completed</div>
                <div className="text-[#EC4899]">{chartData[hoveredPoint].escalated} escalated</div>
              </div>
            )}
          </div>

          {/* Time Labels */}
          <div className="flex justify-between text-[10px] text-[#525252] pt-1">
            {chartData.map((d) => (
              <span key={d.time}>{d.time}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* MODAL 1: PROCESS COMPLETED DETAILS */}
      {activeModal === 'completed' && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-xl w-full max-w-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <h3 className="text-lg font-bold text-[#F2F2F2]">Process Completed Audit Log</h3>
                <span className="text-xs bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 px-2 py-0.5 rounded font-bold">
                  {totalCompleted} Total Finished
                </span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#737373] hover:text-[#F2F2F2] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg">
                <div className="text-[11px] text-[#737373] uppercase font-semibold">Success Rate</div>
                <div className="text-xl font-extrabold text-[#22C55E] mt-0.5">99.2%</div>
                <div className="text-[10px] text-[#525252] mt-0.5">Autonomous execution accuracy</div>
              </div>
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg">
                <div className="text-[11px] text-[#737373] uppercase font-semibold">Avg Speed</div>
                <div className="text-xl font-extrabold text-[#38BDF8] mt-0.5">1.38s</div>
                <div className="text-[10px] text-[#525252] mt-0.5">Per process completion</div>
              </div>
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg">
                <div className="text-[11px] text-[#737373] uppercase font-semibold">Cost Saved</div>
                <div className="text-xl font-extrabold text-[#EC4899] mt-0.5">$1,840</div>
                <div className="text-[10px] text-[#525252] mt-0.5">Estimated human hours saved</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#737373] uppercase tracking-wider">Recently Completed Execution Stream</div>
              <div className="bg-[#171717] border border-[#262626] rounded-lg divide-y divide-[#262626] max-h-56 overflow-y-auto">
                {tasks.filter((t) => t.status === 'completed').length > 0 ? (
                  tasks.filter((t) => t.status === 'completed').map((t) => (
                    <div key={t.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#F2F2F2]">{t.title}</div>
                        <div className="text-[11px] text-[#737373]">Assigned to: {t.owner} • {t.updatedAt}</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-white bg-[#111111] border border-[#262626]">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        Success
                      </span>
                    </div>
                  ))
                ) : (
                  [
                    { id: 'c1', title: 'Auto-updated enterprise contract terms in Salesforce', time: '10 mins ago', agent: 'Soham N' },
                    { id: 'c2', title: 'Processed batch email responses for inbound leads', time: '25 mins ago', agent: 'Pratik P' },
                    { id: 'c3', title: 'Resolved customer ticket #8492 with automated refund flow', time: '42 mins ago', agent: 'Sahil M' },
                  ].map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#F2F2F2]">{item.title}</div>
                        <div className="text-[11px] text-[#737373]">Assigned Agent: {item.agent} • {item.time}</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-white bg-[#111111] border border-[#262626]">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        Success
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#262626]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PROCESS ESCALATED DETAILS */}
      {activeModal === 'escalated' && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-xl w-full max-w-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <h3 className="text-lg font-bold text-[#F2F2F2]">Process Escalations Queue</h3>
                <span className="text-xs bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 px-2 py-0.5 rounded font-bold">
                  {totalEscalated} Handed Over
                </span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#737373] hover:text-[#F2F2F2] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#171717] border border-[#262626] rounded-lg p-3 text-xs text-[#737373]">
              Escalations occur when AI confidence falls below strict policy thresholds or when human authorization is required.
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#737373] uppercase tracking-wider">Active Escalation Items</div>
              <div className="bg-[#171717] border border-[#262626] rounded-lg divide-y divide-[#262626] max-h-60 overflow-y-auto">
                {escalations.length > 0 ? (
                  escalations.map((esc) => (
                    <div key={esc.id} className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-[#F2F2F2]">{esc.taskTitle}</div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-white bg-[#111111] border border-[#262626]">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                          {esc.humanStatus}
                        </span>
                      </div>
                      <div className="text-xs text-[#EC4899] bg-[#EC4899]/10 border border-[#EC4899]/20 p-2 rounded">
                        <span className="font-semibold">Reason:</span> {esc.reason}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#737373]">
                        <span>Assigned Human: <strong className="text-[#F2F2F2]">{esc.assignedTo}</strong></span>
                        <span>{esc.escalatedAt}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  [
                    { id: 'e1', title: 'High discount request (25%) on ACME Corp enterprise renewal', reason: 'Exceeds standard 15% manager authorization limit', assigned: 'Soham N', time: '15 mins ago' },
                    { id: 'e2', title: 'Refund request for billing error exceeding $1,000', reason: 'Requires dual human approval under compliance policy', assigned: 'Pratik P', time: '1 hour ago' },
                  ].map((item) => (
                    <div key={item.id} className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-[#F2F2F2]">{item.title}</div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-white bg-[#111111] border border-[#262626]">
                          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                          Requires Action
                        </span>
                      </div>
                      <div className="text-xs text-[#EC4899] bg-[#EC4899]/10 border border-[#EC4899]/20 p-2 rounded">
                        <span className="font-semibold">Reason:</span> {item.reason}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#737373]">
                        <span>Assigned Human: <strong className="text-[#F2F2F2]">{item.assigned}</strong></span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#262626]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Queue View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TREND & PERFORMANCE ANALYTICS */}
      {activeModal === 'trend' && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-xl w-full max-w-3xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2.5">
                <Activity size={18} className="text-[#38BDF8]" />
                <h3 className="text-lg font-bold text-[#F2F2F2]">System Execution Volume & Performance Trend</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#737373] hover:text-[#F2F2F2] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg text-center">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Peak Throughput</div>
                <div className="text-xl font-extrabold text-[#38BDF8] mt-1">245 / hr</div>
              </div>
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg text-center">
                <div className="text-[10px] text-[#737373] uppercase font-bold">System Uptime</div>
                <div className="text-xl font-extrabold text-[#22C55E] mt-1">99.98%</div>
              </div>
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg text-center">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Avg Latency</div>
                <div className="text-xl text-[#EC4899] font-extrabold mt-1">420 ms</div>
              </div>
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg text-center">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Token Load</div>
                <div className="text-xl font-extrabold text-[#F59E0B] mt-1">1.42M</div>
              </div>
            </div>

            <div className="bg-[#171717] border border-[#262626] p-4 rounded-lg space-y-3">
              <div className="text-xs font-bold text-[#F2F2F2]">Hourly Throughput Distribution (Today)</div>
              <div className="space-y-2">
                {chartData.map((d) => (
                  <div key={d.time} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-[#737373] font-mono text-[11px]">{d.time}</span>
                    <div className="flex-1 bg-[#111111] h-3.5 rounded-full overflow-hidden flex border border-[#262626]">
                      <div
                        className="bg-[#38BDF8] h-full transition-all"
                        style={{ width: `${(d.completed / 250) * 100}%` }}
                        title={`${d.completed} completed`}
                      />
                      <div
                        className="bg-[#EC4899] h-full transition-all"
                        style={{ width: `${(d.escalated / 250) * 100}%` }}
                        title={`${d.escalated} escalated`}
                      />
                    </div>
                    <span className="w-16 text-right font-bold text-[#F2F2F2]">{d.completed + d.escalated} tasks</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#262626]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Trend Analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandCenterBanner;
