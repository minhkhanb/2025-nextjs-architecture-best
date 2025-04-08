import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps): JSX.Element {
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const renderPageLink = (pageNumber: number | string, index: number) => {
    if (typeof pageNumber === 'number') {
      return (
        <Link
          key={index}
          href={`${baseUrl}?page=${pageNumber}`}
          aria-label={`Go to page ${pageNumber}`}
          className={`px-4 py-2 rounded-lg ${
            pageNumber === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {pageNumber}
        </Link>
      );
    }

    return (
      <span key={index} className="px-4 py-2 text-gray-500" aria-hidden="true">
        ...
      </span>
    );
  };

  const renderNavigationButton = (
    label: string,
    icon: JSX.Element,
    targetPage: number,
    disabled: boolean
  ) => (
    <Link
      href={`${baseUrl}?page=${targetPage}`}
      aria-label={label}
      className={`px-4 py-2 rounded-lg flex items-center ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {icon}
    </Link>
  );

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {/* Previous Button */}
      {renderNavigationButton(
        'Go to previous page',
        <ChevronLeftIcon className="h-5 w-5" />,
        Math.max(currentPage - 1, 1),
        currentPage === 1
      )}

      {/* Page Numbers */}
      {pageNumbers.map(renderPageLink)}

      {/* Next Button */}
      {renderNavigationButton(
        'Go to next page',
        <ChevronRightIcon className="h-5 w-5" />,
        Math.min(currentPage + 1, totalPages),
        currentPage === totalPages
      )}
    </div>
  );
}
