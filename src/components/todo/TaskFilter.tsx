'use client';

import React from 'react';
import { TaskStatus, TaskPriority } from '@src/types/Task';
import { FunnelIcon } from '@heroicons/react/24/outline';
import SelectDropdown, { SelectOption } from './SelectDropdown';

interface TaskFilterProps {
  statusFilter: string | null;
  priorityFilter: string | null;
  assigneeFilter: string | null;
  tagFilter: string | null;
  searchQuery: string;
  onStatusFilterChange: (status: string | null) => void;
  onPriorityFilterChange: (priority: string | null) => void;
  onAssigneeFilterChange: (assignee: string | null) => void;
  onTagFilterChange: (tag: string | null) => void;
  onSearchQueryChange: (query: string) => void;
  assignees: string[];
  tags: string[];
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  statusFilter,
  priorityFilter,
  assigneeFilter,
  tagFilter,
  searchQuery,
  onStatusFilterChange,
  onPriorityFilterChange,
  onAssigneeFilterChange,
  onTagFilterChange,
  onSearchQueryChange,
  assignees,
  tags,
}) => {
  // Convert enum values to SelectOption format
  const statusOptions: SelectOption[] = Object.values(TaskStatus).map(
    (status) => ({
      value: status,
      label: status,
    })
  );

  const priorityOptions: SelectOption[] = Object.values(TaskPriority).map(
    (priority) => ({
      value: priority,
      label: priority,
    })
  );

  const assigneeOptions: SelectOption[] = assignees.map((assignee) => ({
    value: assignee,
    label: assignee,
  }));

  const tagOptions: SelectOption[] = tags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-center mb-4">
        <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium">Filter Tasks</h3>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <SelectDropdown
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusFilterChange}
          placeholder="All Statuses"
        />

        {/* Priority Filter */}
        <SelectDropdown
          label="Priority"
          options={priorityOptions}
          value={priorityFilter}
          onChange={onPriorityFilterChange}
          placeholder="All Priorities"
        />

        {/* Assignee Filter */}
        <SelectDropdown
          label="Assignee"
          options={assigneeOptions}
          value={assigneeFilter}
          onChange={onAssigneeFilterChange}
          placeholder="All Assignees"
        />

        {/* Tag Filter */}
        <SelectDropdown
          label="Tag"
          options={tagOptions}
          value={tagFilter}
          onChange={onTagFilterChange}
          placeholder="All Tags"
        />
      </div>

      {/* Reset Filters */}
      {(statusFilter ||
        priorityFilter ||
        assigneeFilter ||
        tagFilter ||
        searchQuery) && (
        <div className="mt-4 text-right">
          <button
            onClick={() => {
              onStatusFilterChange(null);
              onPriorityFilterChange(null);
              onAssigneeFilterChange(null);
              onTagFilterChange(null);
              onSearchQueryChange('');
            }}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilter;
