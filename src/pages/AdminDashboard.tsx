import React, { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import type {
  ProjectId,
  Project,
  CriticalAction,
} from '../data/types';
import {
  getProjectData,
  getCriticalActions,
} from '../services/mockApi';

import Navbar from '../components/Navbar/Navbar';
import TeamSidebar from '../components/TeamSidebar/TeamSidebar';
import CriticalActions from '../components/CriticalActions/CriticalActions';
import TaskTable from '../components/TaskTable/TaskTable';
import AssignTask from '../components/AssignTask/AssignTask';
import UsageStats from '../components/Usage/UsageStats';
import TeamMemberDetail from '../components/TeamMemberDetail/TeamMemberDetail';
import CommandCenterBanner from '../components/CommandCenterBanner/CommandCenterBanner';
import ManageWorkflow from '../components/ManageWorkflow/ManageWorkflow';

interface LoadingState {
  project: boolean;
  criticalActions: boolean;
  sidebar: boolean;
  usage: boolean;
}

const AdminDashboard: React.FC = () => {
  const [activeProject, setActiveProject] = useState<ProjectId>('sales');
  const [project, setProject] = useState<Project | null>(null);
  const [criticalActions, setCriticalActions] = useState<CriticalAction[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [isManagingWorkflow, setIsManagingWorkflow] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    project: true,
    criticalActions: true,
    sidebar: true,
    usage: true,
  });
  const [tableError, setTableError] = useState<string | null>(null);

  // Load project data
  const loadProject = useCallback(async (projectId: ProjectId) => {
    try {
      const data = await getProjectData(projectId);
      setProject(data);
      setLoadingState((prev) => ({ ...prev, project: false, sidebar: false, usage: false }));
    } catch {
      setTableError('Failed to load project data');
      setLoadingState((prev) => ({ ...prev, project: false, sidebar: false, usage: false }));
    }
  }, []);

  const loadCriticalActions = useCallback(async (projectId: ProjectId) => {
    try {
      const actions = await getCriticalActions(projectId);
      setCriticalActions(actions);
    } finally {
      setLoadingState((prev) => ({ ...prev, criticalActions: false }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    setLoadingState({ project: true, criticalActions: true, sidebar: true, usage: true });
    loadProject(activeProject);
    loadCriticalActions(activeProject);
  }, []);

  // Project switch
  const handleProjectChange = async (id: ProjectId) => {
    if (id === activeProject || isSwitching) return;
    setIsSwitching(true);
    setSelectedMemberId(null);
    setIsAssigningTask(false);
    setIsManagingWorkflow(false);
    setProject(null);
    setCriticalActions([]);
    setTableError(null);
    setLoadingState({ project: true, criticalActions: true, sidebar: true, usage: true });

    setActiveProject(id);

    try {
      const [data, actions] = await Promise.all([
        getProjectData(id),
        getCriticalActions(id),
      ]);
      setProject(data);
      setCriticalActions(actions);
    } catch {
      setTableError('Failed to load project data');
    } finally {
      setLoadingState({ project: false, criticalActions: false, sidebar: false, usage: false });
      setIsSwitching(false);
    }
  };

  const handleTaskAssigned = () => {
    setTaskRefreshKey((k) => k + 1);
    loadProject(activeProject);
  };

  const handleRetry = () => {
    setTableError(null);
    setLoadingState({ project: true, criticalActions: true, sidebar: true, usage: true });
    loadProject(activeProject);
    loadCriticalActions(activeProject);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0A0A0A] text-[#F2F2F2]">
      <Navbar
        activeProject={activeProject}
        onProjectChange={handleProjectChange}
        isLoading={isSwitching}
      />

      {/* Loading banner for project switch */}
      {isSwitching && (
        <div className="fixed top-12 left-0 right-0 z-[90] bg-[#141414] border-b border-[#262626] px-4 py-2 flex items-center gap-2 text-xs text-[#737373]">
          <Loader2 size={12} className="animate-spin text-[#EC4899]" />
          Loading {activeProject === 'sales' ? 'Sales Team' : 'Customer Service Team'}...
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <TeamSidebar
          projectId={activeProject}
          teamMembers={project?.teamMembers ?? []}
          toolAccess={project?.toolAccess ?? []}
          selectedMemberId={selectedMemberId}
          onSelectMember={(id) => {
            setIsAssigningTask(false);
            setIsManagingWorkflow(false);
            setSelectedMemberId((prev) => (prev === id ? null : id));
          }}
          onOpenManageWorkflow={() => {
            setSelectedMemberId(null);
            setIsAssigningTask(false);
            setIsManagingWorkflow(true);
          }}
          isLoading={loadingState.sidebar}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 min-w-0">
          {isManagingWorkflow ? (
            <ManageWorkflow
              projectId={activeProject}
              toolAccess={project?.toolAccess ?? []}
              onBack={() => setIsManagingWorkflow(false)}
            />
          ) : (
            <>
              {/* Command Center Banner with Process Completed, Process Escalated, and Graph */}
              <CommandCenterBanner
                projectId={activeProject}
                tasks={project?.tasks ?? []}
                escalations={project?.escalations ?? []}
                isAssigningTask={isAssigningTask}
                onToggleAssignTask={() => {
                  if (isAssigningTask) {
                    setIsAssigningTask(false);
                  } else {
                    setSelectedMemberId(null);
                    setIsAssigningTask(true);
                  }
                }}
                isLoading={loadingState.project}
              />

              {isAssigningTask ? (
                <div className="flex-1 rounded-xl overflow-hidden border border-[#262626]">
                  <AssignTask
                    projectId={activeProject}
                    taskTypes={project?.taskTypes ?? []}
                    onTaskAssigned={handleTaskAssigned}
                    onClose={() => setIsAssigningTask(false)}
                  />
                </div>
              ) : selectedMemberId ? (
                <TeamMemberDetail
                  key={`${activeProject}-${selectedMemberId}`}
                  projectId={activeProject}
                  memberId={selectedMemberId}
                  onBack={() => setSelectedMemberId(null)}
                />
              ) : (
                <>
                  {/* Task Execution Table */}
                  <TaskTable
                    key={taskRefreshKey}
                    tasks={project?.tasks ?? []}
                    teamMembers={project?.teamMembers ?? []}
                    isLoading={loadingState.project}
                    error={tableError}
                    onRetry={handleRetry}
                  />
                </>
              )}
            </>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-[288px] min-w-[288px] bg-[#0A0A0A] border-l border-[#262626] flex flex-col overflow-hidden">
          {/* Critical Actions in right sidebar */}
          <div className="flex-1 overflow-y-auto flex flex-col p-3.5 space-y-3">
            <CriticalActions
              actions={criticalActions}
              isLoading={loadingState.criticalActions}
            />
          </div>

          {/* 17% Usage Stats at bottom */}
          <UsageStats
            isLoading={loadingState.usage}
          />
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
