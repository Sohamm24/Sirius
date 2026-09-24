// ============================================================
// SIRIUS AI TEAMMATE — CORE TYPE DEFINITIONS
// ============================================================

export type ProjectId = 'sales' | 'customer-service';

export type TaskStatus =
  | 'queued'
  | 'investigating'
  | 'in-process'
  | 'waiting'
  | 'escalated'
  | 'completed'
  | 'blocked';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type EscalationStatus =
  | 'pending'
  | 'in-progress'
  | 'resolved'
  | 'closed';

export type ToolAccessLevel = 'full' | 'read-only' | 'restricted' | 'write';

export type TeamMemberStatus = 'online' | 'away' | 'busy';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarUrl?: string;
  color: string;
  status: TeamMemberStatus;
  activeTaskCount: number;
  completedTaskCount: number;
  pendingEscalations: number;
  completedEscalations: number;
  responsibilities: string[];
}

export interface Task {
  id: string;
  title: string;
  type: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: string;
  ownerId: string | 'ai';
  startedAt: string;
  updatedAt: string;
  outcome?: string;
  escalatedTo?: string;
  escalationReason?: string;
}

export interface Escalation {
  id: string;
  taskId: string;
  taskTitle: string;
  escalatedAt: string;
  reason: string;
  priority: TaskPriority;
  aiStatus: string;
  humanStatus: EscalationStatus;
  assignedTo: string;
  assignedToId: string;
  resolvedAt?: string;
  resolutionTime?: string;
  finalOutcome?: string;
  actionTaken?: string;
}

export interface CriticalAction {
  id: string;
  actionType: string;
  description: string;
  timestamp: string;
  relatedTask?: string;
  outcome: string;
  severity: 'info' | 'warning' | 'success' | 'critical';
}

export interface ToolAccess {
  id: string;
  name: string;
  icon: string;
  logoUrl?: string;
  status: 'connected' | 'disconnected' | 'error';
  accessLevel: ToolAccessLevel;
  lastUsed: string;
  availableActions: string[];
}

export interface UsageStat {
  label: string;
  used: number;
  limit: number;
  unit: string;
}

export interface Analytics {
  kpis: KPI[];
  pipelineCounts: PipelineCount[];
}

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  color?: 'default' | 'orange' | 'green' | 'red' | 'blue';
}

export interface PipelineCount {
  stage: TaskStatus;
  count: number;
}

export interface Project {
  id: ProjectId;
  name: string;
  description: string;
  teamMembers: TeamMember[];
  tasks: Task[];
  escalations: Escalation[];
  criticalActions: CriticalAction[];
  toolAccess: ToolAccess[];
  usageStats: UsageStat[];
  analytics: Analytics;
  taskTypes: string[];
}

export interface AssignTaskPayload {
  title: string;
  taskType: string;
  priority: TaskPriority;
  context?: string;
  deadline?: string;
}
