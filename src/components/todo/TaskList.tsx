'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@src/types/Task';
import { useTaskContext } from '@src/contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';
import TaskSkeleton from './TaskSkeleton';
import TaskTable from './TaskTable';
import {
  PlusIcon,
  Square2StackIcon,
  ListBulletIcon,
  ViewColumnsIcon,
  TableCellsIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface TaskListProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

type ViewMode = 'grid' | 'list' | 'kanban' | 'table';

const TaskList: React.FC<TaskListProps> = ({ onAddTask, onEditTask }) => {
  const { tasks, updateTask, deleteTask } = useTaskContext();

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table'); // Default to table view
  const [isLoading, setIsLoading] = useState(true);
  const [showKanbanFilter, setShowKanbanFilter] = useState(false);

  // Extract unique assignees and tags for filters
  const uniqueAssignees = Array.from(
    new Set(
      tasks
        .filter((task) => task.assignee)
        .map((task) => task.assignee as string)
    )
  );

  const uniqueTags = Array.from(
    new Set(tasks.flatMap((task) => task.tags || []))
  );

  // Simulate loading state for better UX
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [
    viewMode,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    tagFilter,
    searchQuery,
  ]);

  // Filter tasks whenever filters change
  useEffect(() => {
    let result = [...tasks];

    // Apply status filter
    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Apply assignee filter
    if (assigneeFilter) {
      result = result.filter((task) => task.assignee === assigneeFilter);
    }

    // Apply tag filter
    if (tagFilter) {
      result = result.filter((task) => task.tags?.includes(tagFilter));
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    setFilteredTasks(result);
  }, [
    tasks,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    tagFilter,
    searchQuery,
  ]);

  const handleStatusChange = (id: string, newStatus: string) => {
    updateTask(id, { status: newStatus as TaskStatus });
  };

  // Group tasks by status for kanban view
  const tasksByStatus = Object.values(TaskStatus).reduce(
    (acc, status) => {
      acc[status] = filteredTasks.filter((task) => task.status === status);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  // Status column styling based on status
  const getStatusColumnStyle = (status: string) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'border-gray-200 bg-gray-50';
      case TaskStatus.IN_PROGRESS:
        return 'border-blue-200 bg-blue-50';
      case TaskStatus.REVIEW:
        return 'border-yellow-200 bg-yellow-50';
      case TaskStatus.DONE:
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // Count tasks by status
  const taskCountByStatus = Object.values(TaskStatus).reduce(
    (acc, status) => {
      acc[status] = filteredTasks.filter(
        (task) => task.status === status
      ).length;
      return acc;
    },
    {} as Record<string, number>
  );

  // Handle view mode change with animation reset
  const handleViewModeChange = (mode: ViewMode) => {
    setIsLoading(true);
    setViewMode(mode);
  };

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setAssigneeFilter(null);
    setTagFilter(null);
    setSearchQuery('');
  };

  return (
    <div>
      {/* Task controls and filters */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          Tasks
          {filteredTasks.length > 0 && (
            <span className="ml-2 text-sm font-medium bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">
              {filteredTasks.length}
            </span>
          )}
        </h1>

        <div className="flex items-center space-x-4">
          {/* View toggle */}
          <div className="flex items-center border rounded-md overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors duration-150 ease-in-out`}
              title="Grid view"
              aria-label="Grid view"
            >
              <Square2StackIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors duration-150 ease-in-out`}
              title="List view"
              aria-label="List view"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('table')}
              className={`p-2 ${
                viewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors duration-150 ease-in-out`}
              title="Table view"
              aria-label="Table view"
            >
              <TableCellsIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('kanban')}
              className={`p-2 ${
                viewMode === 'kanban'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors duration-150 ease-in-out`}
              title="Kanban board view"
              aria-label="Kanban view"
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Kanban filter toggle button */}
          {viewMode === 'kanban' && (
            <button
              onClick={() => setShowKanbanFilter(!showKanbanFilter)}
              className={`p-2 rounded-md ${
                showKanbanFilter
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-100'
              } transition-colors duration-150 ease-in-out shadow-sm`}
              title="Show/hide filters"
              aria-label="Toggle filters"
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          )}

          {/* Add task button */}
          <button
            onClick={onAddTask}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-150 ease-in-out shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Filters - based on view mode */}
      {((viewMode !== 'kanban' && viewMode !== 'table') ||
        showKanbanFilter) && (
        <div
          className={`transition-all duration-300 ease-in-out ${
            showKanbanFilter || (viewMode !== 'kanban' && viewMode !== 'table')
              ? 'opacity-100 max-h-[500px]'
              : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <TaskFilter
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            assigneeFilter={assigneeFilter}
            tagFilter={tagFilter}
            searchQuery={searchQuery}
            onStatusFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onAssigneeFilterChange={setAssigneeFilter}
            onTagFilterChange={setTagFilter}
            onSearchQueryChange={setSearchQuery}
            assignees={uniqueAssignees}
            tags={uniqueTags}
          />
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading ? (
        viewMode === 'kanban' ? (
          <div className="flex space-x-4 overflow-x-auto pb-6 pt-2 -mx-4 px-4">
            {Object.values(TaskStatus).map((status) => (
              <div
                key={status}
                className={`flex-shrink-0 w-80 rounded-md border shadow-sm ${getStatusColumnStyle(status)}`}
              >
                <div className="p-3 border-b bg-white bg-opacity-80 sticky top-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-700">{status}</h3>
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="p-3 space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg border shadow-sm p-3 animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="flex justify-between items-center">
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
            <div className="h-16 bg-gray-50 border-b"></div>
            <div className="h-12 border-b bg-gray-50"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 border-b bg-white"></div>
            ))}
            <div className="h-14 bg-gray-50 border-t"></div>
          </div>
        ) : (
          <TaskSkeleton viewMode={viewMode} />
        )
      ) : filteredTasks.length > 0 ? (
        viewMode === 'table' ? (
          // TanStack Table view
          <TaskTable
            tasks={filteredTasks}
            onEditTask={onEditTask}
            onDeleteTask={deleteTask}
            onStatusChange={handleStatusChange}
          />
        ) : viewMode === 'kanban' ? (
          // Kanban board view
          <div className="flex space-x-4 overflow-x-auto pb-6 pt-2 -mx-4 px-4 animate-fade-in">
            {Object.values(TaskStatus).map((status) => (
              <div
                key={status}
                className={`flex-shrink-0 w-80 rounded-md border shadow-sm ${getStatusColumnStyle(status)}`}
              >
                <div className="p-3 border-b bg-white bg-opacity-80 sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-700">{status}</h3>
                    <span className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full text-xs font-medium text-gray-700">
                      {taskCountByStatus[status] || 0}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-3 max-h-[calc(100vh-230px)] overflow-y-auto">
                  {tasksByStatus[status]?.length > 0 ? (
                    tasksByStatus[status].map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={onEditTask}
                        onDelete={deleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  ) : (
                    <div className="text-center p-4 border-2 border-dashed rounded-md">
                      <p className="text-gray-500 text-sm">No tasks</p>
                      <button
                        onClick={onAddTask}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Add task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid or list view
          <div
            className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            } animate-fade-in`}
          >
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={deleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300 animate-fade-in">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No tasks found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter ||
            priorityFilter ||
            assigneeFilter ||
            tagFilter ||
            searchQuery
              ? 'No tasks match your current filters.'
              : 'Get started by creating a new task.'}
          </p>
          <div className="mt-6">
            {statusFilter ||
            priorityFilter ||
            assigneeFilter ||
            tagFilter ||
            searchQuery ? (
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={onAddTask}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Task
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
