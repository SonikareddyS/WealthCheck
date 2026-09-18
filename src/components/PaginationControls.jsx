import React from "react";
import { Button } from "./ui/Button";

export const PaginationControls = ({
  currentPage,
  totalItems,
  limit,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-5 border-t border-gray-100"
      aria-label="Opportunity pagination"
    >
      <span
        className="text-sm text-gray-600"
        aria-live="polite"
      >
        Page{" "}
        <span className="font-semibold text-gray-900">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {totalPages}
        </span>
      </span>

      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="px-3 py-1.5 text-sm"
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="px-3 py-1.5 text-sm"
        >
          Next
        </Button>
      </div>
    </nav>
  );
};