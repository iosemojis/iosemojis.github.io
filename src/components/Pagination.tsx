import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (count: number) => void;
  className?: string;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 60,
  onPageChange,
  onItemsPerPageChange,
  className = '',
  pageSizeOptions = [30, 60, 120, 240],
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems <= itemsPerPage)) {
    return null;
  }

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const startItem = totalItems !== undefined && totalItems > 0
    ? (currentPage - 1) * itemsPerPage + 1
    : 0;
  const endItem = totalItems !== undefined
    ? Math.min(currentPage * itemsPerPage, totalItems)
    : 0;

  return (
    <nav
      id="pagination-navigation"
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs text-sm ${className}`}
    >
      {/* Items info and page size selector */}
      <div className="flex flex-wrap items-center gap-3 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
        {totalItems !== undefined && totalItems > 0 ? (
          <span>
            Showing <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{startItem.toLocaleString()}</strong>–
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{endItem.toLocaleString()}</strong> of{' '}
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{totalItems.toLocaleString()}</strong> emojis
          </span>
        ) : (
          <span>
            Page <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{currentPage}</strong> of{' '}
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{totalPages}</strong>
          </span>
        )}

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-0 sm:ml-2 pl-0 sm:pl-3 sm:border-l sm:border-neutral-200 sm:dark:border-neutral-800">
            <label htmlFor="pagination-page-size" className="text-xs text-neutral-500 dark:text-neutral-400">
              Per page:
            </label>
            <select
              id="pagination-page-size"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              aria-label="Items per page"
              className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page navigation buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          id="pagination-first-page"
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="Go to first page"
          title="First page"
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-35 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          id="pagination-prev-page"
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
          title="Previous page"
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-35 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page list */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, idx) => {
            if (typeof p === 'string') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-neutral-400 dark:text-neutral-500 select-none"
                >
                  …
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={p}
                id={`pagination-page-${p}`}
                type="button"
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[32px] h-8 px-2 text-xs rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          id="pagination-next-page"
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
          title="Next page"
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-35 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          id="pagination-last-page"
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Go to last page"
          title="Last page"
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-35 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
