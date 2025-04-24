'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  QuestionMarkCircleIcon,
  Cog8ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for projects
  const projects = [
    { id: 1, name: 'Kanto Dex', key: 'KANTO', type: 'Pokédex', icon: '🔴' },
    {
      id: 2,
      name: 'To Do',
      key: 'TODO',
      type: 'Task Management',
      icon: '📝',
      link: '/todo',
    },
    {
      id: 3,
      name: 'Hoenn Exploration',
      key: 'HOENN',
      type: 'Exploration',
      icon: '🟢',
    },
    {
      id: 4,
      name: 'Sinnoh Legends',
      key: 'SINNOH',
      type: 'Legends',
      icon: '🟡',
    },
  ];

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, name: 'Added Charizard data', project: 'KANTO', time: '2h ago' },
    {
      id: 2,
      name: 'Updated Pikachu evolution chain',
      project: 'KANTO',
      time: '5h ago',
    },
    {
      id: 3,
      name: 'Created new task list',
      project: 'TODO',
      time: '1d ago',
    },
    {
      id: 4,
      name: 'Documented Kyogre sightings',
      project: 'HOENN',
      time: '2d ago',
    },
  ];

  const assignedToMe = [
    {
      id: 1,
      name: 'Document new Sinnoh forms',
      type: 'Task',
      status: 'IN PROGRESS',
      priority: 'High',
    },
    {
      id: 2,
      name: 'Update Pokéball success rates',
      type: 'Documentation',
      status: 'TO DO',
      priority: 'Medium',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-900 flex flex-col items-center py-6 fixed h-full">
        <div className="mb-8">
          <Image
            src="/next.svg"
            alt="Logo"
            width={30}
            height={30}
            className="rounded bg-white p-1"
          />
        </div>
        <nav className="flex flex-col items-center space-y-6 text-gray-400">
          <Link href="#" className="hover:text-white">
            <UserCircleIcon className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-white">
            <StarIcon className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-white">
            <ClockIcon className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-white">
            <ArrowTrendingUpIcon className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-white">
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-white mt-auto">
            <Cog8ToothIcon className="h-6 w-6" />
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-16 w-full">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Pokémon Explorer
            </h1>
          </div>
          <div className="relative w-96">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              <PlusIcon className="h-5 w-5 mr-1" />
              Create Project
            </button>
          </div>

          {/* Projects Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Projects</h3>
              <Link
                href="/pokemon"
                className="text-blue-600 hover:underline text-sm"
              >
                View all projects
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.map((project) => (
                <Link
                  href={project.link || `/pokemon?project=${project.key}`}
                  key={project.id}
                  className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition border-l-4 border-blue-600"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">{project.icon}</span>
                    <span className="font-medium text-gray-700">
                      {project.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{project.type}</span>
                    <span className="text-gray-400">{project.key}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assigned to me */}
            <div className="bg-white rounded-md shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Assigned to me
              </h3>
              {assignedToMe.length > 0 ? (
                <div className="space-y-3">
                  {assignedToMe.map((item) => (
                    <div key={item.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-blue-600 hover:underline">
                          {item.name}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          {item.priority}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">{item.type}</span>
                        <span>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No tasks assigned to you
                </p>
              )}
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-md shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Recent activity
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start border-b pb-3 last:border-0"
                  >
                    <div className="bg-gray-200 rounded-full p-2 mr-3">
                      <ClockIcon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm">{activity.name}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span className="bg-gray-200 px-2 py-0.5 rounded mr-2">
                          {activity.project}
                        </span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
