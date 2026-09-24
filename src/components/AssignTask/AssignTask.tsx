import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import type { AssignTaskPayload, ProjectId, TaskPriority } from '../../data/types';
import { assignTask } from '../../services/mockApi';

interface AssignTaskProps {
  projectId: ProjectId;
  taskTypes: string[];
  onTaskAssigned: () => void;
  onClose?: () => void;
}

type FormState = 'idle' | 'loading' | 'success';

const AssignTask: React.FC<AssignTaskProps> = ({ projectId, taskTypes, onTaskAssigned, onClose }) => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [context, setContext] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task description is required.');
      return;
    }
    setError('');
    setFormState('loading');

    const payload: AssignTaskPayload = {
      title: title.trim(),
      taskType: taskType || taskTypes[0],
      priority,
      context: context.trim() || undefined,
      deadline: deadline || undefined,
    };

    try {
      await assignTask(projectId, payload);
      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        setTitle('');
        setTaskType('');
        setPriority('medium');
        setContext('');
        setDeadline('');
        onTaskAssigned();
        if (onClose) onClose();
      }, 1500);
    } catch {
      setFormState('idle');
      setError('Failed to create task. Please retry.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
        <div className="text-sm font-bold text-[#F2F2F2]">
          Assign Task to AI Teammate
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-[#171717] border border-[#404040] text-[#737373] hover:text-[#F2F2F2] px-2.5 py-1 rounded-md cursor-pointer text-xs font-medium transition-colors"
          >
            Cancel / Back
          </button>
        )}
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4" id="assign-task-form">
          <div>
            <label className="block text-[11px] font-semibold text-[#737373] mb-1.5" htmlFor="task-desc">Task Description</label>
            <textarea
              id="task-desc"
              className="w-full bg-[#171717] border border-[#262626] focus:border-[#EC4899] rounded-md p-2.5 text-xs text-[#F2F2F2] outline-none transition-colors"
              placeholder="Describe the task for the AI Teammate..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={formState !== 'idle'}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#737373] mb-1.5" htmlFor="task-type-select">Task Type</label>
            <select
              id="task-type-select"
              className="w-full bg-[#171717] border border-[#262626] focus:border-[#EC4899] rounded-md p-2.5 text-xs text-[#F2F2F2] outline-none transition-colors"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              disabled={formState !== 'idle'}
            >
              {taskTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#737373] mb-1.5" htmlFor="priority-select">Priority</label>
            <select
              id="priority-select"
              className="w-full bg-[#171717] border border-[#262626] focus:border-[#EC4899] rounded-md p-2.5 text-xs text-[#F2F2F2] outline-none transition-colors"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              disabled={formState !== 'idle'}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#737373] mb-1.5" htmlFor="task-context">Context <span className="text-[#525252] font-normal">(optional)</span></label>
            <textarea
              id="task-context"
              className="w-full bg-[#171717] border border-[#262626] focus:border-[#EC4899] rounded-md p-2.5 text-xs text-[#F2F2F2] outline-none transition-colors"
              placeholder="Additional context or background..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              disabled={formState !== 'idle'}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#737373] mb-1.5" htmlFor="task-deadline">Deadline <span className="text-[#525252] font-normal">(optional)</span></label>
            <input
              id="task-deadline"
              type="date"
              className="w-full bg-[#171717] border border-[#262626] focus:border-[#EC4899] rounded-md p-2.5 text-xs text-[#F2F2F2] outline-none transition-colors scheme-dark"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={formState !== 'idle'}
            />
          </div>

          {error && (
            <div className="text-xs text-[#EF4444] p-2 bg-[#171717] border border-[#EF4444]/40 rounded-md flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span className="text-white font-medium">{error}</span>
            </div>
          )}

          {formState === 'success' ? (
            <div className="flex items-center justify-center gap-2 p-2.5 bg-[#171717] border border-[#22C55E]/40 text-white text-xs font-semibold rounded-md">
              <CheckCircle2 size={14} className="text-[#22C55E]" />
              Task created successfully
            </div>
          ) : (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#EC4899] to-[#DB2777] hover:opacity-95 text-white font-semibold text-xs rounded-md transition-all cursor-pointer shadow-md shadow-[#EC4899]/20 disabled:opacity-50"
              disabled={formState !== 'idle'}
              id="assign-task-btn"
            >
              {formState === 'loading' ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Creating task...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Assign Task
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AssignTask;
