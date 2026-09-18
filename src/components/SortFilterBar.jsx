import React from "react";
import { Select } from "./ui/Select";
import { useAppContext } from "../context/useAppContext";
export const SortFilterBar = () => {
  const { state, dispatch } = useAppContext();

  const search = state.searchCriteria.search || "";
  const sort = state.searchCriteria.sort || "";

  const handleSearchChange = (event) => {
    dispatch({
      type: "SET_SEARCH",
      payload: event.target.value,
    });
  };

  const handleSortChange = (event) => {
    dispatch({
      type: "SET_SORT",
      payload: event.target.value,
    });
  };

  const clearSearch = () => {
    dispatch({
      type: "CLEAR_SEARCH",
    });
  };

  return (
    <section
      className="
        bg-white
        rounded-xl
        border border-gray-100
        shadow-sm
        p-4
        sm:p-5
        mb-6
        w-full
        max-w-full
        overflow-hidden
        transition-shadow
        duration-200
        hover:shadow-md
      "
      aria-label="Opportunity search and sorting controls"
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M3 6h18M6 12h12m-9 6h6"
            />
          </svg>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-800">
            Refine opportunities
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Search, sort, and refine the opportunities below.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="w-full min-w-0">
          <label
            htmlFor="opportunity-search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search opportunities
          </label>

          <div className="relative w-full">
            <input
              id="opportunity-search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search provider or product..."
              className="
                w-full
                min-w-0
                h-11
                rounded-lg
                border border-gray-300
                bg-white
                px-3
                pr-16
                text-sm
                text-gray-900
                placeholder:text-gray-400
                outline-none
                transition-all
                duration-200
                hover:border-gray-400
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                focus:shadow-sm
              "
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  px-2
                  py-1
                  rounded-md
                  text-xs
                  font-medium
                  text-gray-500
                  hover:bg-gray-100
                  hover:text-gray-800
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition-all
                  duration-200
                "
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="w-full min-w-0">
          <Select
            id="sort"
            label="Sort by"
            value={sort}
            onChange={handleSortChange}
            className="mb-0"
            options={[
              {
                value: "",
                label: "Relevance",
              },
              {
                value: "rate_asc",
                label: "Interest Rate — Low to High",
              },
              {
                value: "rate_desc",
                label: "Interest Rate — High to Low",
              },
              {
                value: "fee_asc",
                label: "Processing Fee — Low to High",
              },
              {
                value: "ltv_desc",
                label: "LTV — High to Low",
              },
              {
                value: "amount_desc",
                label: "Max Amount — High to Low",
              },
              {
                value: "tenure_desc",
                label: "Max Tenure — High to Low",
              },
            ]}
          />
        </div>
      </div>

      {search && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-500">
            Searching for:
          </span>

          <span
            className="
              max-w-full
              break-all
              px-3
              py-1.5
              rounded-full
              bg-blue-50
              border border-blue-100
              text-blue-700
              text-xs sm:text-sm
            "
          >
            "{search}"
          </span>
        </div>
      )}
    </section>
  );
};