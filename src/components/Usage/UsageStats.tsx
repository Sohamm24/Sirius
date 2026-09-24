import React, { useState } from 'react';
import { CreditCard, PieChart, ShieldCheck, X } from 'lucide-react';

interface UsageStatsProps {
  isLoading?: boolean;
}

const UsageStats: React.FC<UsageStatsProps> = ({ isLoading }) => {
  const [showUsageModal, setShowUsageModal] = useState(false);

  const percentage = 17;
  const radius = 34;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (isLoading) {
    return (
      <div className="p-3.5 bg-[#111111] border-t border-[#262626]">
        <div className="text-[11px] font-bold tracking-wider text-[#525252] mb-3 uppercase">USAGE</div>
        <div className="flex items-center gap-3.5 animate-pulse">
          <div className="w-[68px] h-[68px] rounded-full bg-[#171717]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-[#171717] rounded w-3/4" />
            <div className="h-2.5 bg-[#171717] rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => setShowUsageModal(true)}
        className="p-3.5 bg-[#111111] border-t border-[#262626] cursor-pointer hover:bg-[#171717] transition-all group relative overflow-hidden"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowUsageModal(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider text-[#525252] group-hover:text-[#EC4899] uppercase transition-colors">
            USAGE & CREDITS
          </span>
          <span className="text-[10px] text-[#EC4899] underline font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Details &rarr;
          </span>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="relative w-[68px] h-[68px] flex items-center justify-center shrink-0">
            <svg height={radius * 2} width={radius * 2}>
              <circle
                stroke="#171717"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#EC4899"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                transform={`rotate(-90 ${radius} ${radius})`}
              />
            </svg>
            <span className="absolute text-xs font-bold text-[#F2F2F2]">
              17%
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-xs font-semibold text-[#F2F2F2] group-hover:text-[#EC4899] transition-colors">
              17% of credits used
            </div>
            <div className="text-[11px] text-[#737373]">
              17,000 / 100,000 credits
            </div>
          </div>
        </div>
      </div>

      {/* ==================== USAGE BREAKDOWN MODAL ==================== */}
      {showUsageModal && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-xl w-full max-w-xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#EC4899]" />
                <h3 className="text-lg font-bold text-[#F2F2F2]">Enterprise API & Credit Breakdown</h3>
              </div>
              <button
                onClick={() => setShowUsageModal(null as unknown as boolean)}
                className="text-[#737373] hover:text-[#F2F2F2] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Credits Used</div>
                <div className="text-xl font-extrabold text-[#EC4899] mt-0.5">17,000</div>
                <div className="text-[10px] text-[#525252] mt-0.5">17% of monthly quota</div>
              </div>
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Remaining</div>
                <div className="text-xl font-extrabold text-[#22C55E] mt-0.5">83,000</div>
                <div className="text-[10px] text-[#525252] mt-0.5">Renews in 18 days</div>
              </div>
              <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg">
                <div className="text-[10px] text-[#737373] uppercase font-bold">Current Tier</div>
                <div className="text-xl font-extrabold text-[#38BDF8] mt-0.5">Pro Enterprise</div>
                <div className="text-[10px] text-[#525252] mt-0.5">Auto-scale enabled</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-[#737373] uppercase tracking-wider flex items-center justify-between">
                <span>Consumption by Service Category</span>
                <PieChart size={14} className="text-[#737373]" />
              </div>

              <div className="space-y-2.5 bg-[#171717] border border-[#262626] p-4 rounded-lg">
                {[
                  { name: 'LLM Reasoning & Agentic Calls (GPT-4o / Claude 3.5)', used: 10200, pct: 60, color: 'bg-[#EC4899]' },
                  { name: 'CRM & Database Sync Operations (Salesforce / HubSpot)', used: 3400, pct: 20, color: 'bg-[#38BDF8]' },
                  { name: 'Automated Email & Support Webhooks', used: 2040, pct: 12, color: 'bg-[#22C55E]' },
                  { name: 'Vector Search & Embedding Indexing', used: 1360, pct: 8, color: 'bg-[#F59E0B]' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium text-[#F2F2F2]">
                      <span>{item.name}</span>
                      <span className="text-[#737373]">{item.used.toLocaleString()} credits ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-[#111111] h-2 rounded-full overflow-hidden border border-[#262626]">
                      <div className={`${item.color} h-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#171717] border border-[#262626] p-3 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#22C55E]">
                <ShieldCheck size={16} />
                <span>Zero overage protection active. No unapproved charges will occur.</span>
              </div>
              <button
                onClick={() => alert('Quota limit updated to 150,000 credits!')}
                className="px-3 py-1 bg-[#0A0A0A] hover:bg-[#202020] text-[#38BDF8] border border-[#38BDF8]/40 rounded-md font-semibold text-[11px] cursor-pointer"
              >
                Increase Quota
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#262626]">
              <button
                onClick={() => setShowUsageModal(false)}
                className="px-4 py-2 bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Usage Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsageStats;
