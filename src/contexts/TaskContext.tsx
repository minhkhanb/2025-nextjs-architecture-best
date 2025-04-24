'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '@src/types/Task';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample initial data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design Pokémon Database Schema',
    description: 'Create an efficient database schema for storing Pokémon data',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    createdAt: new Date('2025-04-20'),
    updatedAt: new Date('2025-04-20'),
    tags: ['database', 'design'],
  },
  {
    id: '2',
    title: 'Implement Search Functionality',
    description:
      'Add search capability to find Pokémon by name, type, or ability',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date('2025-04-21'),
    updatedAt: new Date('2025-04-22'),
    assignee: 'Ash Ketchum',
    dueDate: new Date('2025-04-30'),
    tags: ['search', 'frontend'],
  },
  {
    id: '3',
    title: 'Create Evolution Chain Visualization',
    description:
      'Design and implement an interactive visualization for Pokémon evolution chains',
    status: TaskStatus.REVIEW,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date('2025-04-18'),
    updatedAt: new Date('2025-04-23'),
    assignee: 'Misty',
    dueDate: new Date('2025-04-25'),
    tags: ['visualization', 'UI'],
  },
  {
    id: '4',
    title: 'Fix Type Effectiveness Calculator',
    description:
      'The calculator for Pokémon type matchups has a bug with dual types',
    status: TaskStatus.TODO,
    priority: TaskPriority.CRITICAL,
    createdAt: new Date('2025-04-23'),
    updatedAt: new Date('2025-04-23'),
    dueDate: new Date('2025-04-26'),
    tags: ['bug', 'calculator'],
  },
  {
    id: '5',
    title: 'Optimize API Response Times',
    description:
      'Current response times are too slow. Implement caching and optimize queries.',
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-04-22'),
    assignee: 'Brock',
    tags: ['performance', 'api'],
  },
];

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Initialize with sample data
  useEffect(() => {
    // In a real app, you'd fetch from an API here
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert string dates back to Date objects
        const formattedTasks = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Failed to parse tasks from localStorage', error);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, ...updatedFields, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
