'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@src/types/Task';
import {
  PencilIcon,
  TrashIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import SelectDropdown, { SelectOption } from './SelectDropdown';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert status options to SelectOption format
  const statusOptions: SelectOption[] = Object.values(TaskStatus).map(
    (status) => ({
      value: status,
      label: status,
    })
  );

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          icon: '●',
        };
      case TaskPriority.MEDIUM:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-300',
          icon: '●●',
        };
      case TaskPriority.HIGH:
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          border: 'border-orange-300',
          icon: '●●●',
        };
      case TaskPriority.CRITICAL:
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-300',
          icon: '⚠️',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          icon: '●',
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case TaskStatus.TODO:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />,
        };
      case TaskStatus.IN_PROGRESS:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: (
            <ArrowPathIcon className="h-3.5 w-3.5 mr-1 animate-spin-slow" />
          ),
        };
      case TaskStatus.REVIEW:
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          icon: <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />,
        };
      case TaskStatus.DONE:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />,
        };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date();
  const daysUntilDue = task.dueDate
    ? Math.ceil(
        (new Date(task.dueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const getDueDateMessage = () => {
    if (!task.dueDate) return '';
    if (isPastDue)
      return `Overdue by ${Math.abs(daysUntilDue || 0)} day${Math.abs(daysUntilDue || 0) !== 1 ? 's' : ''}`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  const priorityStyle = getPriorityColor(task.priority);
  const statusStyle = getStatusColor(task.status);

  const handleStatusChange = (value: string | null) => {
    if (value) {
      onStatusChange(task.id, value);
    }
  };

  // Truncate description text if it's too long
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`group bg-white rounded-lg border ${isHovered ? `shadow-md ${priorityStyle.border}` : 'shadow-sm'} hover:shadow-md transition-all duration-200 ease-in-out ${isExpanded ? 'ring-2 ring-blue-400' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Task header with priority indicator */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-5 h-5 rounded-full ${priorityStyle.bg} ${priorityStyle.text} mr-2 text-xs font-bold`}
                title={`Priority: ${task.priority}`}
              >
                {typeof priorityStyle.icon === 'string' &&
                priorityStyle.icon.length <= 1
                  ? priorityStyle.icon
                  : '!'}
              </div>
              <h3 className="font-medium text-gray-900 leading-tight cursor-default">
                {task.title}
              </h3>
            </div>

            {/* Description */}
            {task.description && (
              <div
                className="text-sm text-gray-600 mt-1 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded
                  ? task.description
                  : truncateText(task.description, 100)}
                {task.description.length > 100 && !isExpanded && (
                  <button className="text-blue-600 ml-1 text-xs">
                    Read more
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Status badge */}
          <div
            className={`flex items-center ${statusStyle.bg} ${statusStyle.text} px-2 py-1 rounded-md text-xs font-medium border ${statusStyle.border}`}
          >
            {statusStyle.icon}
            {task.status}
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 mb-1">
            <TagIcon className="h-4 w-4 text-gray-400 mr-1" />
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Task info footer */}
        <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 mt-4">
          {/* Created date */}
          <div className="flex items-center mr-4 mb-1">
            <span className="text-gray-400">Created {createdDate}</span>
          </div>

          <div className="flex flex-wrap">
            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center mr-4 mb-1">
                <UserIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                <span>{task.assignee}</span>
              </div>
            )}

            {/* Due date */}
            {task.dueDate && (
              <div className="flex items-center mb-1">
                <ClockIcon
                  className={`h-3.5 w-3.5 mr-1 ${isPastDue ? 'text-red-500' : 'text-gray-400'}`}
                />
                <span className={isPastDue ? 'text-red-500 font-medium' : ''}>
                  {getDueDateMessage()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Actions */}
      <div
        className={`border-t px-4 py-2 flex justify-between items-center bg-gray-50 rounded-b-lg transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <div className="w-48">
          <SelectDropdown
            options={statusOptions}
            value={task.status}
            onChange={handleStatusChange}
            allowClear={false}
            placeholder="Change status"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 bg-blue-50 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition"
            aria-label="Edit task"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 bg-red-50 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition"
            aria-label="Delete task"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
