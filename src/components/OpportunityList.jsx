import React, { useCallback, useEffect, useState } from "react";

import { OpportunityCard } from "./OpportunityCard";
import { OpportunityDetailModal } from "./OpportunityDetailModal";
import { SortFilterBar } from "./SortFilterBar";
import { PaginationControls } from "./PaginationControls";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorBanner } from "./ErrorBanner";
import { opportunityApi } from "../services/opportunityApi";
import { useAppContext } from "../context/useAppContext";

export const OpportunityList = () => {
  const { state, dispatch } = useAppContext();

  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    limit: 6,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  /*
   * Fetch opportunities
   */
  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await opportunityApi.getOpportunities(
        state.searchCriteria
      );

      setData(result);

      /*
       * If filtering/searching makes the current
       * page invalid, return to page 1.
       */
      const totalPages =
        Math.ceil(
          result.total / state.searchCriteria.limit
        ) || 1;

      if (state.searchCriteria.page > totalPages) {
        dispatch({
          type: "SET_SEARCH_CRITERIA",
          payload: {
            page: 1,
          },
        });
      }
    } catch (err) {
      setError(
        err?.message || "Failed to load opportunities."
      );
    } finally {
      setLoading(false);
    }
  }, [state.searchCriteria, dispatch]);

  /*
   * Fetch whenever search criteria change
   */
  // oxlint-disable-next-line react(set-state-in-effect)
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  /*
   * Pagination
   */
  const handlePageChange = (newPage) => {
    dispatch({
      type: "SET_SEARCH_CRITERIA",
      payload: {
        page: newPage,
      },
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div>
        <SortFilterBar />
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <div>
        <SortFilterBar />
        <ErrorBanner
          message={error}
          onRetry={fetchOpportunities}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Search / Sort */}
      <SortFilterBar />

      {/* Comparison selection status */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-sm text-gray-600"
          aria-live="polite"
        >
          <span className="font-semibold text-gray-900">
            {data.total}
          </span>{" "}
          {data.total === 1
            ? "opportunity"
            : "opportunities"}{" "}
          found
        </p>

        {state.selectedForCompare.length > 0 && (
          <div
            className="text-sm font-medium text-blue-700"
            aria-live="polite"
          >
            {state.selectedForCompare.length}{" "}
            {state.selectedForCompare.length === 1
              ? "opportunity"
              : "opportunities"}{" "}
            selected to compare
          </div>
        )}
      </div>

      {/* Comparison limit message */}
      {state.compareLimitMessage && (
        <div
          className="mb-5 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm font-semibold text-yellow-900">
            Comparison limit reached
          </p>

          <p className="mt-1 text-sm text-yellow-800">
            {state.compareLimitMessage}
          </p>
        </div>
      )}

      {/* Empty state */}
      {data.items.length === 0 ? (
        <div
          className="
            text-center
            py-12
            px-6
            bg-white
            rounded-xl
            border
            border-gray-100
          "
          role="status"
          aria-live="polite"
        >
          {/* Search icon */}
          <div
            className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-gray-50
            "
            aria-hidden="true"
          >
            <svg
              className="h-7 w-7 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            No opportunities found
          </h3>

          <p className="mt-2 max-w-md mx-auto text-sm text-gray-500">
            We couldn't find opportunities matching your
            current requirements. Try changing your amount,
            tenure, risk preference, or search.
          </p>

          {/* Clear search */}
          {state.searchCriteria.search && (
            <button
              type="button"
              onClick={() => {
                dispatch({
                  type: "CLEAR_SEARCH",
                });
              }}
              className="
                mt-5
                text-sm
                font-semibold
                text-primary
                hover:underline
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                rounded
              "
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Dynamic opportunity cards */}
          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {data.items.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onClick={() =>
                  setSelectedOpportunity(opportunity)
                }
              />
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={state.searchCriteria.page}
            totalItems={data.total}
            limit={state.searchCriteria.limit}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Opportunity details modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={() =>
            setSelectedOpportunity(null)
          }
          /*
           * Compare selection is handled by the
           * application state.
           */
          onCompare={(opportunity) => {
            dispatch({
              type: "TOGGLE_COMPARE",
              payload: opportunity.id,
            });
          }}
          isCompared={state.selectedForCompare.includes(
            selectedOpportunity?.id
          )}
        />
      )}
    </div>
  );
};