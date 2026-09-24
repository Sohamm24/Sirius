import React from 'react';
import {
  Clock,
  List,
  Zap,
  Search,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import type { TaskStatus } from '../data/types';

interface PipelineStageConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  badgeClass: string;
}

const pipelineConfigs: Record<TaskStatus, PipelineStageConfig> = {
  queued: {
    label: 'Queued',
    icon: <List size={13} />,
    color: '#9CA3AF',
    bg: 'rgba(156, 163, 175, 0.1)',
    badgeClass: 'badge-queued',
  },
  investigating: {
    label: 'Investigating',
    icon: <Search size={13} />,
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.1)',
    badgeClass: 'badge-investigating',
  },
  'in-process': {
    label: 'In Process',
    icon: <Zap size={13} />,
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.1)',
    badgeClass: 'badge-in-process',
  },
  waiting: {
    label: 'Waiting',
    icon: <Clock size={13} />,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    badgeClass: 'badge-waiting',
  },
  escalated: {
    label: 'Escalated',
    icon: <AlertTriangle size={13} />,
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    badgeClass: 'badge-escalated',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle2 size={13} />,
    color: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.1)',
    badgeClass: 'badge-completed',
  },
  blocked: {
    label: 'Blocked',
    icon: <AlertTriangle size={13} />,
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.1)',
    badgeClass: 'badge-blocked',
  },
};

export function getPipelineConfig(stage: string): PipelineStageConfig {
  if (stage === 'executing') return pipelineConfigs['in-process'];
  return pipelineConfigs[stage as TaskStatus] ?? pipelineConfigs.queued;
}

export default pipelineConfigs;
