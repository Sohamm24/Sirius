// ============================================================
// SIRIUS MOCK API SERVICE LAYER
// Simulates backend API calls with realistic delays.
// Replace data sources here to connect a real backend.
// ============================================================

import { salesSeed } from '../data/salesSeed';
import { customerServiceSeed } from '../data/customerServiceSeed';
import type {
  Project,
  ProjectId,
  TeamMember,
  Task,
  Escalation,
  CriticalAction,
  ToolAccess,
  UsageStat,
  Analytics,
  AssignTaskPayload,
} from '../data/types';

// Simulated network delay helper
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Project registry
const projects: Record<ProjectId, Project> = {
  sales: salesSeed,
  'customer-service': customerServiceSeed,
};

// ---- Project Data ----

export async function getProjectData(projectId: ProjectId): Promise<Project> {
  await delay(800 + Math.random() * 400);
  const project = projects[projectId];
  if (!project) throw new Error(`Project ${projectId} not found`);
  return { ...project, tasks: [...project.tasks] };
}

// ---- Team Members ----

export async function getTeamMemberDetails(
  projectId: ProjectId,
  memberId: string
): Promise<{ member: TeamMember; tasks: Task[]; escalations: Escalation[] }> {
  await delay(600 + Math.random() * 300);
  const project = projects[projectId];
  const member = project.teamMembers.find((m) => m.id === memberId);
  if (!member) throw new Error(`Member ${memberId} not found`);
  const memberTasks = project.tasks.filter((t) => t.ownerId === memberId);
  const memberEscalations = project.escalations.filter((e) => e.assignedToId === memberId);
  return { member, tasks: memberTasks, escalations: memberEscalations };
}

// ---- Tasks ----

export async function getTasks(
  projectId: ProjectId,
  filters?: {
    status?: string;
    priority?: string;
    owner?: string;
    type?: string;
    search?: string;
  }
): Promise<Task[]> {
  await delay(400 + Math.random() * 200);
  let tasks = [...projects[projectId].tasks];
  if (filters?.status && filters.status !== 'all') {
    tasks = tasks.filter((t) => t.status === filters.status);
  }
  if (filters?.priority && filters.priority !== 'all') {
    tasks = tasks.filter((t) => t.priority === filters.priority);
  }
  if (filters?.owner && filters.owner !== 'all') {
    tasks = tasks.filter((t) => t.ownerId === filters.owner);
  }
  if (filters?.type && filters.type !== 'all') {
    tasks = tasks.filter((t) => t.type === filters.type);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(q) || t.type.toLowerCase().includes(q));
  }
  return tasks;
}

// ---- Escalations ----

export async function getEscalations(projectId: ProjectId): Promise<Escalation[]> {
  await delay(500 + Math.random() * 200);
  return [...projects[projectId].escalations];
}

// ---- Critical Actions ----

export async function getCriticalActions(projectId: ProjectId): Promise<CriticalAction[]> {
  await delay(350 + Math.random() * 150);
  return [...projects[projectId].criticalActions];
}

// ---- Tool Access ----

export async function getToolAccess(projectId: ProjectId): Promise<ToolAccess[]> {
  await delay(400 + Math.random() * 200);
  return [...projects[projectId].toolAccess];
}

// ---- Usage Stats ----

export async function getUsageStats(projectId: ProjectId): Promise<UsageStat[]> {
  await delay(300 + Math.random() * 150);
  return [...projects[projectId].usageStats];
}

// ---- Analytics ----

export async function getAnalytics(projectId: ProjectId): Promise<Analytics> {
  await delay(500 + Math.random() * 250);
  return projects[projectId].analytics;
}

// ---- Assign Task ----

export async function assignTask(
  projectId: ProjectId,
  payload: AssignTaskPayload
): Promise<Task> {
  await delay(1000 + Math.random() * 500);

  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: payload.title,
    type: payload.taskType,
    status: 'queued',
    priority: payload.priority,
    owner: 'AI Teammate',
    ownerId: 'ai',
    startedAt: 'Just now',
    updatedAt: 'Just now',
  };

  // Add to in-memory store
  projects[projectId].tasks.unshift(newTask);

  // Update pipeline count
  const pipeline = projects[projectId].analytics.pipelineCounts;
  const queuedStage = pipeline.find((p) => p.stage === 'queued');
  if (queuedStage) queuedStage.count++;

  return newTask;
}

// ---- Resolve Escalation ----

export async function resolveEscalation(
  projectId: ProjectId,
  escalationId: string,
  outcome: string
): Promise<Escalation> {
  await delay(700 + Math.random() * 300);

  const escalation = projects[projectId].escalations.find((e) => e.id === escalationId);
  if (!escalation) throw new Error(`Escalation ${escalationId} not found`);

  escalation.humanStatus = 'resolved';
  escalation.finalOutcome = outcome;
  escalation.resolvedAt = 'Just now';

  return { ...escalation };
}
