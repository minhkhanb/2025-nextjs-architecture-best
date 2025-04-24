'use client';

import React, { useState } from 'react';
import { Task } from '@src/types/Task';
import { TaskProvider } from '@src/contexts/TaskContext';
import TaskList from '@src/components/todo/TaskList';
import TaskForm from '@src/components/todo/TaskForm';
import { useTaskContext } from '@src/contexts/TaskContext';
import {
  XMarkIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

const TaskBoard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const { addTask, updateTask } = useTaskContext();

  const handleAddTask = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSubmitTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> | Partial<Task>
  ) => {
    if ('id' in taskData) {
      // Editing existing task
      updateTask(taskData.id as string, taskData);
    } else {
      // Adding new task
      addTask(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  return (
    <div className="relative min-h-screen">
      {/* Main task board */}
      <div
        className={`transition-all duration-300 ${showForm ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="flex items-center mb-4">
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          <a href="/home" className="text-blue-600 hover:underline">
            Back to Dashboard
          </a>
        </div>
        <TaskList onAddTask={handleAddTask} onEditTask={handleEditTask} />
      </div>

      {/* Task form modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end p-4">
              <button
                onClick={handleCancelForm}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close form"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-4 pb-6">
              <TaskForm
                onSubmit={handleSubmitTask}
                onCancel={handleCancelForm}
                initialTask={editingTask}
                isEditing={!!editingTask}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap with TaskProvider
export default function TodoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TaskProvider>
        <TaskBoard />
      </TaskProvider>
    </div>
  );
}
