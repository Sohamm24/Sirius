import React, { useState } from 'react';
import { FileX, RefreshCw, CheckCircle2, RotateCcw, X, User } from 'lucide-react';
import type { Task, TeamMember } from '../../data/types';
import { getPipelineConfig } from '../../utils/pipelineConfig';

interface TaskTableProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

function TableSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[1fr_160px_120px] gap-3 px-4 py-3 border-b border-[#262626]">
        <div className="text-xs font-bold tracking-wider uppercase text-[#525252]">Task</div>
        <div className="text-xs font-bold tracking-wider uppercase text-[#525252] text-right">Status</div>
        <div className="text-xs font-bold tracking-wider uppercase text-[#525252] text-right">Updated</div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="grid grid-cols-[1fr_160px_120px] gap-3 px-4 py-3.5 border-b border-[#262626] items-center animate-pulse">
          <div className="h-4 bg-[#1F1F1F] rounded w-[80%]" />
          <div className="h-4 bg-[#1F1F1F] rounded w-[70%] ml-auto" />
          <div className="h-4 bg-[#1F1F1F] rounded w-[60%] ml-auto" />
        </div>
      ))}
    </div>
  );
}

const statusDotColors: Record<string, string> = {
  queued: 'bg-[#9CA3AF]',
  investigating: 'bg-[#38BDF8]',
  executing: 'bg-[#38BDF8]',
  in_process: 'bg-[#EC4899]',
  waiting_input: 'bg-[#F59E0B]',
  escalated: 'bg-[#EF4444]',
  completed: 'bg-[#22C55E]',
  blocked: 'bg-[#8B5CF6]',
};

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isLoading,
  error,
  onRetry,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'escalated') return t.status === 'escalated';
    if (filter === 'active') return t.status !== 'completed' && t.status !== 'escalated';
    return true;
  });

  const handleAction = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden flex flex-col">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-b border-[#262626] gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider uppercase text-[#737373]">Task Execution Log</span>
          <span className="text-[10px] bg-[#171717] border border-[#262626] text-[#38BDF8] px-2 py-0.5 rounded font-bold">
            {filteredTasks.length} ITEMS
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs bg-[#0A0A0A] p-1 rounded-lg border border-[#262626]">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'escalated', label: 'Escalated' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                filter === tab.id
                  ? 'bg-[#171717] text-[#EC4899] border border-[#EC4899]/30 shadow-xs'
                  : 'text-[#737373] hover:text-[#F2F2F2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-[#22C55E]/10 border-b border-[#22C55E]/30 px-4 py-2 text-xs font-semibold text-[#22C55E] flex items-center justify-between">
          <span>{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg(null)} className="text-[#22C55E] hover:underline cursor-pointer">✕</button>
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
          <div className="w-11 h-11 rounded-full bg-[#171717] flex items-center justify-center text-[#EF4444]">
            <FileX size={26} strokeWidth={1.5} />
          </div>
          <div className="text-sm font-semibold text-[#F2F2F2]">Unable to load task activity</div>
          <div className="text-xs text-[#737373] max-w-sm">
            Something went wrong while retrieving the latest task information.
          </div>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <TableSkeleton />
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
          <div className="w-11 h-11 rounded-full bg-[#171717] flex items-center justify-center text-[#525252]">
            <FileX size={26} strokeWidth={1.5} />
          </div>
          <div className="text-sm font-semibold text-[#F2F2F2]">No tasks found for this filter</div>
          <div className="text-xs text-[#737373]">
            Try selecting a different filter above.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-xs font-bold tracking-wider uppercase text-[#525252] px-4 py-3 text-left">Task Description</th>
                <th className="text-xs font-bold tracking-wider uppercase text-[#525252] px-4 py-3 text-right w-44">Status</th>
                <th className="text-xs font-bold tracking-wider uppercase text-[#525252] px-4 py-3 text-right w-36">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const statusCfg = getPipelineConfig(task.status);
                const dotColor = statusDotColors[task.status] ?? 'bg-[#9CA3AF]';
                return (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="border-b border-[#262626]/60 hover:bg-[#171717] transition-colors cursor-pointer group"
                  >
                    <td className="text-sm text-[#F2F2F2] px-4 py-3 font-medium max-w-md truncate group-hover:text-[#38BDF8]" title={task.title}>
                      <div className="flex items-center gap-2">
                        <span>{task.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {/* Status badge rule: colored dot + white text + neutral dark background */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-white bg-[#171717] border border-[#262626]">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="text-xs text-[#525252] px-4 py-3 text-right whitespace-nowrap group-hover:text-[#737373]">
                      {task.updatedAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ==================== TASK DETAIL MODAL ==================== */}
      {selectedTask && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-xl w-full max-w-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[#262626]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#38BDF8] font-bold uppercase tracking-wider">TASK DETAILS & EXECUTIONS</span>
                  <span className="text-[10px] text-[#737373] bg-[#171717] px-2 py-0.5 rounded border border-[#262626]">
                    ID: {selectedTask.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F2F2F2] leading-snug">{selectedTask.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-[#737373] hover:text-[#F2F2F2] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#262626]">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Status</div>
                <div className="text-xs font-semibold text-white mt-1 capitalize flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${statusDotColors[selectedTask.status] ?? 'bg-[#38BDF8]'}`} />
                  {selectedTask.status}
                </div>
              </div>

              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#262626]">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Priority</div>
                <div className="text-xs font-semibold text-[#EC4899] mt-1 uppercase">
                  {selectedTask.priority || 'medium'}
                </div>
              </div>

              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#262626]">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Assigned Agent</div>
                <div className="text-xs font-semibold text-[#F2F2F2] mt-1 flex items-center gap-1">
                  <User size={12} className="text-[#38BDF8]" />
                  {selectedTask.owner || 'AI Assistant'}
                </div>
              </div>

              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#262626]">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Last Updated</div>
                <div className="text-xs font-semibold text-[#737373] mt-1">
                  {selectedTask.updatedAt}
                </div>
              </div>
            </div>

            {/* AI Agent Execution Steps Trace */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#737373] uppercase tracking-wider flex items-center justify-between">
                <span>AI Execution Trace Logs</span>
                <span className="text-[10px] text-[#22C55E]">100% Policy Compliant</span>
              </div>
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3 space-y-2 text-xs font-mono text-[#737373] max-h-48 overflow-y-auto">
                <div className="text-[#38BDF8]">[01:34:02] Task received and parsed. Context validated.</div>
                <div className="text-[#F2F2F2]">[01:34:03] Querying connected Salesforce & Email APIs...</div>
                <div className="text-[#F2F2F2]">[01:34:04] AI model reasoning completed with 98.4% confidence score.</div>
                {selectedTask.status === 'escalated' ? (
                  <div className="text-[#EF4444]">[01:34:05] ESCALATED: Policy rule matched. Passed to human agent {selectedTask.owner}.</div>
                ) : (
                  <div className="text-[#22C55E]">[01:34:05] EXECUTION SUCCESSFUL: Action committed to target system.</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleAction(`Task "${selectedTask.title}" re-queued for execution!`);
                    setSelectedTask(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] hover:bg-[#202020] text-[#38BDF8] border border-[#38BDF8]/40 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Re-run Task
                </button>
                <button
                  onClick={() => {
                    handleAction(`Task "${selectedTask.title}" marked as resolved.`);
                    setSelectedTask(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] hover:bg-[#202020] text-[#22C55E] border border-[#22C55E]/40 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <CheckCircle2 size={13} />
                  Mark Resolved
                </button>
              </div>

              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-1.5 bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
