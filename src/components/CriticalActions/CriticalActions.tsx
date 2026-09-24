import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, X } from 'lucide-react';
import type { CriticalAction } from '../../data/types';

interface CriticalActionsProps {
  actions: CriticalAction[];
  isLoading: boolean;
}

const severityDotColors: Record<string, string> = {
  success: 'bg-[#22C55E]',
  critical: 'bg-[#EF4444]',
  warning: 'bg-[#F59E0B]',
  info: 'bg-[#38BDF8]',
};

function CriticalActionsSkeleton() {
  return (
    <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#262626]">
        <span className="text-xs font-bold tracking-wider uppercase text-[#737373]">Critical Actions</span>
      </div>
      <div className="p-4 flex flex-col gap-3 animate-pulse">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-22 bg-[#171717] rounded-lg border border-[#262626]" />
        ))}
      </div>
    </div>
  );
}

function EmptyActions() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-2.5">
      <div className="w-11 h-11 rounded-full bg-[#171717] flex items-center justify-center text-[#525252]">
        <Activity size={26} strokeWidth={1.5} />
      </div>
      <div className="text-sm font-semibold text-[#F2F2F2]">No recent critical actions</div>
      <div className="text-xs text-[#737373]">
        AI activity will appear here as tasks are executed.
      </div>
    </div>
  );
}

const CriticalActions: React.FC<CriticalActionsProps> = ({ actions, isLoading }) => {
  const [selectedAction, setSelectedAction] = useState<CriticalAction | null>(null);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);

  if (isLoading) return <CriticalActionsSkeleton />;

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden flex flex-col flex-1">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#262626]">
        <span className="text-xs font-bold tracking-wider uppercase text-[#737373]">Critical Actions</span>
        <span className="text-[10px] text-[#38BDF8] font-bold bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded">
          {actions.length} LOGGED
        </span>
      </div>

      {actions.length === 0 ? (
        <EmptyActions />
      ) : (
        <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
          {actions.map((action) => {
            const dotColor = severityDotColors[action.severity] ?? 'bg-[#38BDF8]';
            const isAck = acknowledgedIds.includes(action.id);

            return (
              <div
                key={action.id}
                onClick={() => setSelectedAction(action)}
                className={`bg-[#171717] border rounded-lg p-3.5 flex flex-col gap-2 transition-all hover:border-[#38BDF8] hover:bg-[#1C1C1C] cursor-pointer w-full shrink-0 ${
                  isAck ? 'border-[#262626] opacity-70' : 'border-[#262626]'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedAction(action)}
              >
                <div className="flex items-center justify-between">
                  {/* Status badge rule: colored dot + white text + neutral dark background */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-white bg-[#111111] border border-[#262626] tracking-wider uppercase">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    {action.actionType}
                  </span>
                  {isAck && (
                    <span className="text-[10px] text-[#22C55E] flex items-center gap-1 font-semibold">
                      <CheckCircle size={10} /> Ack
                    </span>
                  )}
                </div>
                <div className="text-sm text-[#F2F2F2] leading-relaxed font-medium">{action.description}</div>
                <div className="flex items-center justify-between text-xs text-[#525252] mt-1 pt-1.5 border-t border-[#262626]">
                  <span>{action.timestamp}</span>
                  <span className="font-semibold text-[#737373]">{action.outcome}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== CRITICAL ACTION DETAIL MODAL ==================== */}
      {selectedAction && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[#262626]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-[#EC4899]" />
                  <span className="text-xs text-[#EC4899] font-bold uppercase tracking-wider">CRITICAL AUDIT EVENT</span>
                </div>
                <h3 className="text-base font-bold text-[#F2F2F2]">{selectedAction.actionType}</h3>
              </div>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-[#737373] hover:text-[#F2F2F2] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#171717] border border-[#262626] p-3.5 rounded-lg space-y-2">
              <div className="text-xs font-bold text-[#737373] uppercase tracking-wide">Event Summary</div>
              <div className="text-sm font-medium text-[#F2F2F2] leading-relaxed">{selectedAction.description}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Severity Rating</div>
                <div className="text-xs font-bold text-white mt-1 capitalize flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${severityDotColors[selectedAction.severity] ?? 'bg-[#38BDF8]'}`} />
                  {selectedAction.severity}
                </div>
              </div>
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Logged Time</div>
                <div className="text-xs font-semibold text-[#F2F2F2] mt-1">{selectedAction.timestamp}</div>
              </div>
            </div>

            <div className="bg-[#171717] border border-[#262626] p-3.5 rounded-lg space-y-1.5">
              <div className="text-xs font-bold text-[#737373] uppercase tracking-wide">System Outcome</div>
              <div className="text-xs text-[#38BDF8] font-semibold">{selectedAction.outcome}</div>
              <div className="text-[11px] text-[#525252]">System verification code: SYS-SEC-84920-OK</div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
              <button
                onClick={() => {
                  if (!acknowledgedIds.includes(selectedAction.id)) {
                    setAcknowledgedIds((prev) => [...prev, selectedAction.id]);
                  }
                  setSelectedAction(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#38BDF8] hover:bg-[#0284C7] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-md"
              >
                <CheckCircle size={13} />
                Acknowledge Alert
              </button>
              <button
                onClick={() => setSelectedAction(null)}
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

export default CriticalActions;
