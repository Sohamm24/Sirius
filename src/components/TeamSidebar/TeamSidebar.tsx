import React, { useState } from 'react';
import {
  Database,
  Mail,
  Calendar,
  BookOpen,
  MessageSquare,
  Headphones,
  CreditCard,
  X,
  ChevronRight,
  Plus,
  Users,
  UserPlus,
  Workflow,
  PlusCircle,
} from 'lucide-react';
import type { TeamMember, ToolAccess, ProjectId } from '../../data/types';

// --- Icon map ---
const iconMap: Record<string, React.ReactNode> = {
  Database: <Database size={12} />,
  Mail: <Mail size={12} />,
  Calendar: <Calendar size={12} />,
  BookOpen: <BookOpen size={12} />,
  MessageSquare: <MessageSquare size={12} />,
  Headphones: <Headphones size={12} />,
  CreditCard: <CreditCard size={12} />,
};

interface TeamSidebarProps {
  projectId: ProjectId;
  teamMembers: TeamMember[];
  toolAccess: ToolAccess[];
  selectedMemberId: string | null;
  onSelectMember: (id: string) => void;
  onOpenManageWorkflow?: () => void;
  isLoading: boolean;
}

function TeamSidebarSkeleton() {
  return (
    <>
      <div className="p-3.5 flex-1 overflow-hidden">
        <div className="text-[10px] font-semibold tracking-wider uppercase text-[#38BDF8] mb-2 px-1 flex items-center gap-1.5">
          <Users size={12} />
          TEAM BOARD
        </div>
        <div className="bg-gradient-to-b from-[#0284C7] to-[#0369A1] rounded-xl p-2.5 flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2.5 p-2 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white/20" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3 bg-white/20 rounded w-3/4" />
                <div className="h-2 bg-white/20 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3.5 border-t border-[#262626]">
        <div className="text-[10px] font-semibold tracking-wider uppercase text-[#525252] mb-2 px-1">AI ACCESS</div>
        <div className="flex flex-col gap-1.5 animate-pulse">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-[#1F1F1F] rounded w-full" />
          ))}
        </div>
      </div>
    </>
  );
}

const statusColors: Record<string, string> = {
  online: '#22C55E',
  away: '#F59E0B',
  busy: '#EF4444',
};

const TeamSidebar: React.FC<TeamSidebarProps> = ({
  teamMembers: initialTeamMembers,
  toolAccess,
  selectedMemberId,
  onSelectMember,
  onOpenManageWorkflow,
  isLoading,
}) => {
  const [localMembers, setLocalMembers] = useState<TeamMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const [toolPopover, setToolPopover] = useState<{
    tool: ToolAccess;
    x: number;
    y: number;
  } | null>(null);

  // Combine initial members with newly added local members
  const allMembers = [...initialTeamMembers, ...localMembers];

  const handleToolClick = (e: React.SyntheticEvent, tool: ToolAccess) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setToolPopover({ tool, x: rect.right + 8, y: rect.top });
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const initials = newName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = ['#EC4899', '#38BDF8', '#8B5CF6', '#10B981', '#F59E0B'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const dummyAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    ];
    const randomAvatar = dummyAvatars[Math.floor(Math.random() * dummyAvatars.length)];

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Team Member',
      initials: initials || 'TM',
      avatarUrl: randomAvatar,
      color: randomColor,
      status: 'online',
      activeTaskCount: 0,
      completedTaskCount: 0,
      pendingEscalations: 0,
      completedEscalations: 0,
      responsibilities: ['General operations'],
    };

    setLocalMembers((prev) => [...prev, newMember]);
    setNewName('');
    setNewRole('');
    setShowAddModal(false);
  };

  if (isLoading) {
    return (
      <aside className="w-[248px] min-w-[248px] bg-[#0A0A0A] border-r border-[#262626] flex flex-col overflow-hidden">
        <TeamSidebarSkeleton />
      </aside>
    );
  }

  return (
    <aside className="w-[248px] min-w-[248px] bg-[#0A0A0A] border-r border-[#262626] flex flex-col overflow-hidden">
      {/* Team list board with vibrant solid Sky Blue background */}
      <div className="p-3 border-b border-[#262626] flex-1 overflow-hidden flex flex-col">
        <div className="text-[10px] font-bold tracking-wider uppercase text-[#38BDF8] mb-2 px-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Users size={12} />
            TEAM BOARD
          </span>
          <span className="text-[9px] bg-[#0284C7] text-white px-2 py-0.5 rounded font-bold border border-[#38BDF8]/40 shadow-sm">
            {allMembers.length} ACTIVE
          </span>
        </div>

        {/* SOLID VIBRANT SKY BLUE TEAM BOARD CONTAINER */}
        <div className="bg-gradient-to-b from-[#0284C7] to-[#0369A1] border border-[#38BDF8]/40 rounded-xl p-2.5 flex flex-col flex-1 overflow-hidden shadow-xl text-white">
          <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-0.5">
            {allMembers.map((member) => {
              const isSelected = selectedMemberId === member.id;
              return (
                <div
                  key={member.id}
                  className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-white text-[#0369A1] border-2 border-white shadow-md font-bold'
                      : 'bg-black/25 hover:bg-black/35 text-white border border-white/10'
                  }`}
                  onClick={() => onSelectMember(member.id)}
                  role="button"
                  tabIndex={0}
                  aria-selected={isSelected}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectMember(member.id)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 relative shadow-sm overflow-visible"
                    style={{ background: member.color }}
                  >
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      member.initials
                    )}
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0284C7] z-10"
                      style={{ background: statusColors[member.status] ?? '#22C55E' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs truncate ${isSelected ? 'font-bold text-[#0369A1]' : 'font-semibold text-white'}`}>
                      {member.name}
                    </div>
                    <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-[#0369A1]/80 font-medium' : 'text-sky-100/80'}`}>
                      {member.role}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isSelected ? 'bg-[#0284C7] text-white' : 'bg-white/20 text-white border border-white/30'
                  }`}>
                    {member.activeTaskCount}
                  </span>
                </div>
              );
            })}
          </div>

          {/* + ADD TEAM MEMBERS BUTTON AT BOTTOM OF VIBRANT SKY BLUE BOARD */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-1.5 mt-2.5 py-2 px-3 bg-white hover:bg-sky-50 text-[#0284C7] font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer shrink-0 border border-white"
          >
            <Plus size={14} className="stroke-[2.5]" />
            Add Team Members
          </button>
        </div>
      </div>

      {/* AI ACCESS SECTION WITH TWO BUTTONS */}
      <div className="p-3 space-y-2">
        <div className="text-[10px] font-bold tracking-wider uppercase text-[#525252] px-1 flex items-center justify-between">
          <span>AI ACCESS</span>
          <span className="text-[9px] text-[#737373]">{toolAccess.length} Tools</span>
        </div>

        {/* TWO BUTTONS UNDER AI ACCESS */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onOpenManageWorkflow}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#171717] hover:bg-[#202020] border border-[#EC4899]/40 hover:border-[#EC4899] text-[#EC4899] hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm"
            title="Manage Workflow & Flow Diagram"
          >
            <Workflow size={13} />
            Manage Workflow
          </button>

          <button
            onClick={onOpenManageWorkflow}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#171717] hover:bg-[#202020] border border-[#38BDF8]/40 hover:border-[#38BDF8] text-[#38BDF8] hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm"
            title="Add More AI Tools"
          >
            <PlusCircle size={13} />
            Add Tools
          </button>
        </div>

        {/* Tool List */}
        <div className="flex flex-col gap-0.5 pt-1">
          {toolAccess.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center gap-2 p-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#171717] relative"
              onClick={(e) => handleToolClick(e, tool)}
              role="button"
              tabIndex={0}
              aria-label={`${tool.name} — ${tool.status}`}
              onKeyDown={(e) => e.key === 'Enter' && handleToolClick(e, tool)}
            >
              <div className="w-5.5 h-5.5 flex items-center justify-center bg-[#171717] rounded text-[#737373] shrink-0">
                {tool.logoUrl ? (
                  <img
                    src={tool.logoUrl}
                    alt={tool.name}
                    className="w-4 h-4 object-contain"
                  />
                ) : (
                  iconMap[tool.icon] ?? <Database size={12} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-[#F2F2F2] truncate">{tool.name}</div>
                <div className="text-[10px] text-[#525252] truncate">{tool.accessLevel}</div>
              </div>
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  tool.accessLevel === 'read-only' ? 'bg-[#38BDF8]' : 'bg-[#22C55E]'
                }`}
              />
              <ChevronRight size={10} className="text-[#525252] ml-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* MODAL TO ADD TEAM MEMBER */}
      {showAddModal && (
        <div className="fixed inset-0 z-[350] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-xl w-full max-w-sm p-4 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F2F2F2]">
                <UserPlus size={16} className="text-[#38BDF8]" />
                Add New Team Member
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#525252] hover:text-[#F2F2F2] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#171717] border border-[#262626] focus:border-[#38BDF8] rounded-md p-2 text-xs text-[#F2F2F2] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior AE"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#171717] border border-[#262626] focus:border-[#38BDF8] rounded-md p-2 text-xs text-[#F2F2F2] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-1.5 px-3 bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-md text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 px-3 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-md text-xs font-semibold cursor-pointer shadow-md"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tool popover */}
      {toolPopover && (
        <>
          <div className="fixed inset-0 z-[299]" onClick={() => setToolPopover(null)} />
          <div
            className="fixed z-[300] w-[290px] bg-[#111111] border border-[#262626] rounded-xl shadow-2xl p-3.5 space-y-3"
            style={{
              left: Math.min(toolPopover.x, window.innerWidth - 310),
              top: Math.max(8, Math.min(toolPopover.y, window.innerHeight - 280)),
            }}
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#262626]">
              <div className="w-6 h-6 bg-[#171717] rounded flex items-center justify-center shrink-0">
                {toolPopover.tool.logoUrl ? (
                  <img
                    src={toolPopover.tool.logoUrl}
                    alt={toolPopover.tool.name}
                    className="w-4 h-4 object-contain rounded-xs"
                  />
                ) : (
                  iconMap[toolPopover.tool.icon] ?? <Database size={12} />
                )}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#F2F2F2]">
                  {toolPopover.tool.name}
                </div>
                <div className="text-[10px] text-[#525252]">
                  {toolPopover.tool.status}
                </div>
              </div>
              <button
                onClick={() => setToolPopover(null)}
                className="bg-none border-none text-[#525252] hover:text-[#F2F2F2] cursor-pointer p-0"
              >
                <X size={13} />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#737373]">Permission</span>
                <span className="capitalize font-medium text-[#F2F2F2]">{toolPopover.tool.accessLevel}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#737373]">Last Used</span>
                <span className="text-[#F2F2F2]">{toolPopover.tool.lastUsed}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-[#525252] uppercase tracking-wide">Available Actions</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {toolPopover.tool.availableActions.map((action, i) => (
                    <span key={i} className="text-[10px] bg-[#171717] border border-[#262626] text-[#737373] px-1.5 py-0.5 rounded">
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default TeamSidebar;
