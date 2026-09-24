import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import type { TeamMember, Task, Escalation } from '../../data/types';
import { getTeamMemberDetails } from '../../services/mockApi';
import type { ProjectId } from '../../data/types';
import { getPipelineConfig } from '../../utils/pipelineConfig';

interface TeamMemberDetailProps {
  projectId: ProjectId;
  memberId: string;
  onBack: () => void;
}

const statusColors: Record<string, string> = {
  online: '#22C55E',
  away: '#F59E0B',
  busy: '#EF4444',
};

const escalationDotColors: Record<string, { label: string; dotColor: string }> = {
  pending: { label: 'Pending', dotColor: 'bg-[#F59E0B]' },
  'in-progress': { label: 'In Progress', dotColor: 'bg-[#38BDF8]' },
  resolved: { label: 'Resolved', dotColor: 'bg-[#22C55E]' },
  closed: { label: 'Closed', dotColor: 'bg-[#9CA3AF]' },
};

function EscalationStatusBadge({ status }: { status: string }) {
  const c = escalationDotColors[status] ?? { label: status, dotColor: 'bg-[#9CA3AF]' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-white bg-[#171717] border border-[#262626] uppercase">
      <span className={`w-1.5 h-1.5 rounded-full ${c.dotColor}`} />
      {c.label}
    </span>
  );
}

const taskDotColors: Record<string, string> = {
  queued: 'bg-[#9CA3AF]',
  investigating: 'bg-[#38BDF8]',
  executing: 'bg-[#38BDF8]',
  in_process: 'bg-[#EC4899]',
  waiting_input: 'bg-[#F59E0B]',
  escalated: 'bg-[#EF4444]',
  completed: 'bg-[#22C55E]',
  blocked: 'bg-[#8B5CF6]',
};

const priorityDotColors: Record<string, string> = {
  critical: 'bg-[#EF4444]',
  high: 'bg-[#EC4899]',
  medium: 'bg-[#F59E0B]',
  low: 'bg-[#9CA3AF]',
};

const TeamMemberDetail: React.FC<TeamMemberDetailProps> = ({
  projectId,
  memberId,
  onBack,
}) => {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeamMemberDetails(projectId, memberId);
      setMember(data.member);
      setTasks(data.tasks);
      setEscalations(data.escalations);
    } catch {
      setError('Unable to load team member activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId, memberId]);

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#262626] rounded-md transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft size={13} /> Back to command center
        </button>
        <div className="flex flex-col items-center justify-center p-8 text-center bg-[#111111] border border-[#262626] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#171717] flex items-center justify-center text-[#EF4444]">
            <AlertTriangle size={24} strokeWidth={1.5} />
          </div>
          <div className="text-xs font-medium text-[#F2F2F2]">Unable to load team member activity</div>
          <div className="text-[11px] text-[#737373] max-w-sm">
            Something went wrong while retrieving the activity for this team member.
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !member) {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#262626] rounded-md transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft size={13} /> Back to command center
        </button>
        <div className="flex items-center gap-2 py-2 text-[#525252] text-xs">
          <Loader2 size={13} className="animate-spin text-[#EC4899]" />
          Loading team member activity...
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-xl p-4 flex gap-3.5 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-[#171717]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#171717] rounded w-1/2" />
            <div className="h-3 bg-[#171717] rounded w-1/3" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#111111] border border-[#262626] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const activeTaskCount = tasks.filter((t) => !['completed', 'escalated'].includes(t.status)).length;
  const completedTaskCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingEscalations = escalations.filter((e) => e.humanStatus === 'pending' || e.humanStatus === 'in-progress').length;
  const resolvedEscalations = escalations.filter((e) => e.humanStatus === 'resolved').length;

  return (
    <div className="flex flex-col gap-3.5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#262626] rounded-md transition-colors cursor-pointer w-fit"
      >
        <ArrowLeft size={13} /> Back to command center
      </button>

      {/* Member Header */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-4 flex items-center gap-3.5">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden shadow-md"
          style={{ background: member.color }}
        >
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            member.initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-[#F2F2F2]">{member.name}</div>
          <div className="text-xs text-[#737373]">{member.role}</div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: statusColors[member.status] ?? '#22C55E' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: statusColors[member.status] ?? '#22C55E' }}
              />
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </span>
            <span className="text-[#262626]">·</span>
            <span className="text-xs text-[#525252] truncate">
              {member.responsibilities.slice(0, 2).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5">
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#EC4899] mb-0.5">{activeTaskCount}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#525252]">Active</div>
        </div>
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#22C55E] mb-0.5">{completedTaskCount}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#525252]">Completed</div>
        </div>
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#EF4444] mb-0.5">{pendingEscalations}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#525252]">Pending Esc.</div>
        </div>
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#F2F2F2] mb-0.5">{resolvedEscalations}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#525252]">Resolved</div>
        </div>
      </div>

      {/* Escalations */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#262626]">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#737373]">AI Escalations</span>
          <span className="text-[10px] text-[#525252]">{escalations.length} total</span>
        </div>
        <div className="p-3.5 space-y-3">
          {escalations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
              <CheckCircle2 size={24} strokeWidth={1.5} className="text-[#22C55E]" />
              <div className="text-xs font-medium text-[#F2F2F2]">No escalations</div>
              <div className="text-[11px] text-[#737373]">
                The AI Teammate has no tasks requiring human intervention from {member.name}.
              </div>
            </div>
          ) : (
            escalations.map((esc) => (
              <div key={esc.id} className="bg-[#171717] border border-[#262626] rounded-lg p-3.5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-[#F2F2F2]">{esc.taskTitle}</div>
                    <div className="text-[10px] text-[#525252] mt-0.5">Escalated {esc.escalatedAt}</div>
                  </div>
                  <EscalationStatusBadge status={esc.humanStatus} />
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[9px] font-semibold tracking-wider uppercase text-[#525252] mb-1">
                      WHY
                    </div>
                    <div className="text-xs text-[#737373] bg-[#0A0A0A] p-2 rounded-md border border-[#262626]">{esc.reason}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-[#525252] mb-1">Priority</div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-medium text-white bg-[#111111] border border-[#262626] uppercase">
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityDotColors[esc.priority] ?? 'bg-[#9CA3AF]'}`} />
                        {esc.priority}
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#525252] mb-1">AI Status</div>
                      <div className="text-xs text-[#F2F2F2]">{esc.aiStatus}</div>
                    </div>
                  </div>

                  {esc.actionTaken && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-[#525252]">Action Taken</div>
                      <div className="text-xs text-[#F2F2F2]">{esc.actionTaken}</div>
                    </div>
                  )}

                  {esc.finalOutcome && (
                    <div className="flex items-center gap-1.5 p-2 bg-[#171717] border border-[#22C55E]/40 rounded-md text-xs text-white">
                      <CheckCircle2 size={11} className="text-[#22C55E]" />
                      {esc.finalOutcome}
                    </div>
                  )}

                  {esc.resolutionTime && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#525252]">
                      <Clock size={10} />
                      Resolved in {esc.resolutionTime} · {esc.resolvedAt}
                    </div>
                  )}

                  {(esc.humanStatus === 'pending' || esc.humanStatus === 'in-progress') && !esc.finalOutcome && (
                    <div className="flex gap-2 pt-2 border-t border-[#262626]">
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white font-semibold text-xs rounded-md cursor-pointer transition-all hover:opacity-95"
                        onClick={() => {}}
                      >
                        <CheckCircle2 size={11} />
                        Mark Resolved
                      </button>
                      <button
                        className="flex-0 px-3 py-1.5 bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                        onClick={() => {}}
                      >
                        Reassign
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task History */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#262626]">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#737373]">Task History</span>
          <span className="text-[10px] text-[#525252]">{tasks.length} tasks</span>
        </div>
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#737373]">No tasks found</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262626]">
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-[#525252] px-3.5 py-2.5">Task</th>
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-[#525252] px-3.5 py-2.5">Status</th>
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-[#525252] px-3.5 py-2.5">Priority</th>
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-[#525252] px-3.5 py-2.5">Updated</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const cfg = getPipelineConfig(task.status);
                  const dotColor = taskDotColors[task.status] ?? 'bg-[#9CA3AF]';
                  return (
                    <tr key={task.id} className="border-b border-[#262626]/60 hover:bg-[#171717]/80 transition-colors">
                      <td className="text-xs text-[#F2F2F2] px-3.5 py-2.5 font-medium max-w-xs truncate" title={task.title}>{task.title}</td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-white bg-[#171717] border border-[#262626]">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-white bg-[#171717] border border-[#262626] uppercase">
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityDotColors[task.priority] ?? 'bg-[#9CA3AF]'}`} />
                          {task.priority}
                        </span>
                      </td>
                      <td className="text-xs text-[#525252] px-3.5 py-2.5 whitespace-nowrap">{task.updatedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberDetail;
