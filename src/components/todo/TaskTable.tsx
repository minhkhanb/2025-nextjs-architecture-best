'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Task, TaskStatus, TaskPriority } from '@src/types/Task';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface TaskTableProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columnHelper = createColumnHelper<Task>();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.title, {
        id: 'title',
        header: () => <span>Title</span>,
        cell: (info) => (
          <div className="font-medium text-gray-900">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor((row) => row.description, {
        id: 'description',
        header: () => <span>Description</span>,
        cell: (info) => (
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {info.getValue() || 'No description'}
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.status, {
        id: 'status',
        header: () => <span>Status</span>,
        cell: (info) => {
          const status = info.getValue();
          const getStatusClass = () => {
            switch (status) {
              case TaskStatus.TODO:
                return 'bg-gray-100 text-gray-800';
              case TaskStatus.IN_PROGRESS:
                return 'bg-blue-100 text-blue-800';
              case TaskStatus.REVIEW:
                return 'bg-yellow-100 text-yellow-800';
              case TaskStatus.DONE:
                return 'bg-green-100 text-green-800';
              default:
                return 'bg-gray-100 text-gray-800';
            }
          };
          return (
            <select
              value={status}
              onChange={(e) =>
                onStatusChange(info.row.original.id, e.target.value)
              }
              className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusClass()} border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {Object.values(TaskStatus).map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          );
        },
        filterFn: 'equals',
      }),
      columnHelper.accessor((row) => row.priority, {
        id: 'priority',
        header: () => <span>Priority</span>,
        cell: (info) => {
          const priority = info.getValue();
          const getPriorityClass = () => {
            switch (priority) {
              case TaskPriority.LOW:
                return 'bg-gray-100 text-gray-800';
              case TaskPriority.MEDIUM:
                return 'bg-blue-100 text-blue-800';
              case TaskPriority.HIGH:
                return 'bg-orange-100 text-orange-800';
              case TaskPriority.CRITICAL:
                return 'bg-red-100 text-red-800';
              default:
                return 'bg-gray-100 text-gray-800';
            }
          };
          return (
            <span
              className={`inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityClass()}`}
            >
              {priority}
            </span>
          );
        },
        filterFn: 'equals',
      }),
      columnHelper.accessor((row) => row.dueDate, {
        id: 'dueDate',
        header: () => <span>Due Date</span>,
        cell: (info) => {
          const dueDate = info.getValue();
          if (!dueDate) return <span className="text-gray-400">-</span>;

          const date = new Date(dueDate);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          // Check if the due date is past
          const isPast =
            date < new Date() && info.row.original.status !== TaskStatus.DONE;

          return (
            <span
              className={isPast ? 'text-red-600 font-medium' : 'text-gray-600'}
            >
              {formattedDate}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row.assignee, {
        id: 'assignee',
        header: () => <span>Assignee</span>,
        cell: (info) => {
          const assignee = info.getValue();
          if (!assignee)
            return <span className="text-gray-400">Unassigned</span>;

          return (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-sm mr-2">
                {assignee.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm">{assignee}</span>
            </div>
          );
        },
        filterFn: 'equals',
      }),
      columnHelper.accessor((row) => row.tags, {
        id: 'tags',
        header: () => <span>Tags</span>,
        cell: (info) => {
          const tags = info.getValue();
          if (!tags || tags.length === 0)
            return <span className="text-gray-400">-</span>;

          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const tags = row.getValue(columnId) as string[] | undefined;
          return tags?.includes(filterValue as string) || false;
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span>Actions</span>,
        cell: (info) => (
          <div className="flex space-x-2">
            <button
              onClick={() => onEditTask(info.row.original)}
              className="text-indigo-600 hover:text-indigo-900"
              aria-label="Edit task"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDeleteTask(info.row.original.id)}
              className="text-red-600 hover:text-red-900"
              aria-label="Delete task"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper, onEditTask, onDeleteTask, onStatusChange]
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table filter section */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={
                (table.getColumn('status')?.getFilterValue() as string) ?? ''
              }
              onChange={(e) =>
                table
                  .getColumn('status')
                  ?.setFilterValue(e.target.value || undefined)
              }
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={
                (table.getColumn('priority')?.getFilterValue() as string) ?? ''
              }
              onChange={(e) =>
                table
                  .getColumn('priority')
                  ?.setFilterValue(e.target.value || undefined)
              }
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="">All Priorities</option>
              {Object.values(TaskPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ArrowUpIcon className="w-4 h-4" />,
                        desc: <ArrowDownIcon className="w-4 h-4" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 whitespace-nowrap text-center text-gray-500"
                >
                  No tasks found. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !table.getCanPreviousPage()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !table.getCanNextPage()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>{' '}
              of{' '}
              <span className="font-medium">
                {table.getFilteredRowModel().rows.length}
              </span>{' '}
              results
            </p>
          </div>
          <div className="flex gap-x-2 items-center">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {[5, 10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>

            <div className="flex gap-x-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className={`relative inline-flex items-center p-1.5 rounded-md ${
                  !table.getCanPreviousPage()
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="First page"
              >
                <ChevronDoubleLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`relative inline-flex items-center p-1.5 rounded-md ${
                  !table.getCanPreviousPage()
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={`relative inline-flex items-center p-1.5 rounded-md ${
                  !table.getCanNextPage()
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Next page"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className={`relative inline-flex items-center p-1.5 rounded-md ${
                  !table.getCanNextPage()
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Last page"
              >
                <ChevronDoubleRightIcon className="h-5 w-5" />
              </button>
            </div>
            <span className="text-sm text-gray-700">
              Page{' '}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{' '}
              of <span className="font-medium">{table.getPageCount()}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
