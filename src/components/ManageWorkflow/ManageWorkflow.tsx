import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Zap,
  CheckCircle2,
  Database,
  X,
  Play,
  Settings,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { ProjectId, ToolAccess } from '../../data/types';

interface ManageWorkflowProps {
  projectId: ProjectId;
  toolAccess: ToolAccess[];
  onBack: () => void;
  onAddTool?: (newTool: ToolAccess) => void;
}

// Available integrations library for adding new tools
const availableIntegrationsList = [
  { id: 'hubspot', name: 'HubSpot CRM', icon: 'Database', type: 'CRM', accessLevel: 'full' as const },
  { id: 'zendesk', name: 'Zendesk Support', icon: 'Headphones', type: 'Support', accessLevel: 'full' as const },
  { id: 'jira', name: 'Jira Software', icon: 'BookOpen', type: 'Issue Tracking', accessLevel: 'write' as const },
  { id: 'slack', name: 'Slack Notifications', icon: 'MessageSquare', type: 'Messaging', accessLevel: 'full' as const },
  { id: 'stripe', name: 'Stripe Payments', icon: 'CreditCard', type: 'Billing', accessLevel: 'read-only' as const },
  { id: 'notion', name: 'Notion Workspace', icon: 'BookOpen', type: 'Knowledge Base', accessLevel: 'read-only' as const },
];

const ManageWorkflow: React.FC<ManageWorkflowProps> = ({
  projectId,
  toolAccess: initialTools,
  onBack,
}) => {
  const [tools, setTools] = useState<ToolAccess[]>(initialTools);
  const [selectedNode, setSelectedNode] = useState<string>('node-2');
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [customToolName, setCustomToolName] = useState('');
  const [customAccessLevel, setCustomAccessLevel] = useState<'full' | 'read-only' | 'restricted'>('full');

  // Interactive Flow Diagram Nodes
  const flowNodes = [
    {
      id: 'node-1',
      title: 'Inbound Trigger',
      subtitle: projectId === 'sales' ? 'Inbound Lead / Web Inquiry' : 'Customer Support Ticket',
      type: 'trigger',
      icon: <Zap size={18} className="text-[#38BDF8]" />,
      status: 'Active',
      details: 'Captures incoming requests via Webhook, Email API, or CRM sync in real-time.',
    },
    {
      id: 'node-2',
      title: 'Sirius AI Agent Analysis',
      subtitle: 'Intent, Context & Risk Score',
      type: 'ai-core',
      icon: <Sparkles size={18} className="text-[#EC4899]" />,
      status: 'Processing',
      details: 'Evaluates intent, checks historical account context, and calculates confidence score.',
    },
    {
      id: 'node-3',
      title: 'Tool Action Execution',
      subtitle: `${tools.length} Connected AI Tools`,
      type: 'tools',
      icon: <Sliders size={18} className="text-[#38BDF8]" />,
      status: 'Configured',
      details: 'Invokes CRM updates, email dispatches, calendar bookings, and knowledge queries.',
    },
    {
      id: 'node-4',
      title: 'Human Escalation Gateway',
      subtitle: 'Risk Threshold > 85%',
      type: 'decision',
      icon: <Settings size={18} className="text-[#F59E0B]" />,
      status: 'Active',
      details: 'Automatically routes complex deals or sensitive issues to assigned team members.',
    },
    {
      id: 'node-5',
      title: 'Resolution & Audit Log',
      subtitle: 'Outcome Logged in CRM',
      type: 'output',
      icon: <CheckCircle2 size={18} className="text-[#22C55E]" />,
      status: 'Completed',
      details: 'Stores exact execution transcript, action taken, and response metrics.',
    },
  ];

  const handleAddToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customToolName.trim()) return;

    const newTool: ToolAccess = {
      id: `tool-${Date.now()}`,
      name: customToolName.trim(),
      icon: 'Database',
      status: 'connected',
      accessLevel: customAccessLevel,
      lastUsed: 'Just now',
      availableActions: ['Read records', 'Create entries', 'Update status'],
    };

    setTools((prev) => [...prev, newTool]);
    setCustomToolName('');
    setShowAddToolModal(false);
  };

  const selectedNodeData = flowNodes.find((n) => n.id === selectedNode) ?? flowNodes[1];

  return (
    <div className="flex flex-col gap-4 text-[#F2F2F2]">
      {/* Top Header */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-[#171717] hover:bg-[#202020] border border-[#404040] text-[#F2F2F2] rounded-lg cursor-pointer transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#F2F2F2]">
              AI Teammate Workflow & Integration Manager
            </h1>
            <p className="text-xs text-[#737373] mt-0.5">
              Visual Execution Flow Diagram & Tool Permission Controller ({projectId === 'sales' ? 'Sales Operations' : 'Customer Support'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddToolModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-[#EC4899] to-[#DB2777] hover:opacity-95 text-white rounded-lg cursor-pointer shadow-md shadow-[#EC4899]/20 transition-all"
          >
            <Plus size={15} />
            Connect New Tool
          </button>
        </div>
      </div>

      {/* SECTION 1: VISUAL FLOW DIAGRAM */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div>
            <h2 className="text-sm font-bold text-[#F2F2F2] uppercase tracking-wider">
              Current Workflow Flow Diagram
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Click any node to inspect execution details and gateway logic
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#171717] border border-[#262626] text-[#38BDF8]">
            <Play size={12} className="fill-[#38BDF8]" />
            Live Flow Active
          </span>
        </div>

        {/* Visual Flow Diagram Nodes Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative py-2">
          {flowNodes.map((node, index) => {
            const isSelected = selectedNode === node.id;
            return (
              <div key={node.id} className="flex flex-col items-center relative">
                {/* Flow Node Box */}
                <div
                  onClick={() => setSelectedNode(node.id)}
                  className={`w-full bg-[#171717] border rounded-xl p-3.5 cursor-pointer transition-all flex flex-col justify-between space-y-2 relative ${
                    isSelected
                      ? 'border-[#EC4899] shadow-lg shadow-[#EC4899]/15 ring-1 ring-[#EC4899]'
                      : 'border-[#262626] hover:border-[#404040]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-[#0A0A0A] border border-[#262626]">
                      {node.icon}
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#0A0A0A] text-[#737373] border border-[#262626]">
                      STEP {index + 1}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#F2F2F2] line-clamp-1">{node.title}</div>
                    <div className="text-[11px] text-[#737373] mt-0.5 truncate">{node.subtitle}</div>
                  </div>
                </div>

                {/* Arrow Connector between nodes */}
                {index < flowNodes.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#404040]">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Node Details Box */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wide">
              Node Config: {selectedNodeData.title}
            </span>
            <span className="text-xs text-[#22C55E] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              {selectedNodeData.status}
            </span>
          </div>
          <p className="text-xs text-[#737373]">{selectedNodeData.details}</p>
        </div>
      </div>

      {/* SECTION 2: CONNECTED TOOLS & INTEGRATIONS GRID */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div>
            <h2 className="text-sm font-bold text-[#F2F2F2] uppercase tracking-wider">
              Connected Tools & Access Permissions
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Tools available for AI Teammate autonomous execution
            </p>
          </div>

          <button
            onClick={() => setShowAddToolModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#171717] hover:bg-[#202020] border border-[#404040] text-[#F2F2F2] rounded-md cursor-pointer transition-colors"
          >
            <Plus size={14} />
            Add More Tools
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-[#171717] border border-[#262626] rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-[#404040] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#262626] flex items-center justify-center text-[#38BDF8]">
                    {tool.logoUrl ? (
                      <img src={tool.logoUrl} alt={tool.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <Database size={16} />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F2F2F2]">{tool.name}</div>
                    <div className="text-[11px] text-[#737373] capitalize">{tool.accessLevel} Access</div>
                  </div>
                </div>

                <span className="w-2 h-2 rounded-full bg-[#22C55E]" title="Connected" />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-[#525252] uppercase">Capabilities</div>
                <div className="flex flex-wrap gap-1">
                  {tool.availableActions.map((act, i) => (
                    <span key={i} className="text-[10px] bg-[#0A0A0A] border border-[#262626] text-[#737373] px-2 py-0.5 rounded">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONNECT NEW TOOL MODAL */}
      {showAddToolModal && (
        <div className="fixed inset-0 z-[350] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-xl w-full max-w-md p-4 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F2F2F2]">
                <Plus size={16} className="text-[#EC4899]" />
                Connect New AI Tool Integration
              </div>
              <button
                onClick={() => setShowAddToolModal(false)}
                className="text-[#525252] hover:text-[#F2F2F2] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Quick Select Integrations */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#737373]">
                Popular Integrations
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableIntegrationsList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCustomToolName(item.name);
                      setCustomAccessLevel(item.accessLevel as any);
                    }}
                    className={`flex items-center gap-2 p-2 bg-[#171717] border text-left rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      customToolName === item.name
                        ? 'border-[#EC4899] text-white bg-[#EC4899]/10'
                        : 'border-[#262626] text-[#737373] hover:text-[#F2F2F2]'
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddToolSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#737373] mb-1">
                  Tool Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linear Issues or Notion KB"
                  value={customToolName}
                  onChange={(e) => setCustomToolName(e.target.value)}
                  className="w-full bg-[#171717] border border-[#262626] focus:border-[#EC4899] rounded-md p-2.5 text-xs text-[#F2F2F2] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737373] mb-1">
                  Access Level
                </label>
                <select
                  value={customAccessLevel}
                  onChange={(e) => setCustomAccessLevel(e.target.value as any)}
                  className="w-full bg-[#171717] border border-[#262626] focus:border-[#EC4899] rounded-md p-2.5 text-xs text-[#F2F2F2] outline-none"
                >
                  <option value="full">Full Access (Read/Write/Delete)</option>
                  <option value="read-only">Read Only (Inspection)</option>
                  <option value="restricted">Restricted (Approval required)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowAddToolModal(false)}
                  className="flex-1 py-2 px-3 bg-[#171717] hover:bg-[#202020] text-[#F2F2F2] border border-[#404040] rounded-md text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-[#EC4899] to-[#DB2777] hover:opacity-95 text-white rounded-md text-xs font-semibold cursor-pointer shadow-md"
                >
                  Connect Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWorkflow;
