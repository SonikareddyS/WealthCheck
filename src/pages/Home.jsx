import React from "react";
import { RequirementForm } from "../components/RequirementForm";
import { OpportunityList } from "../components/OpportunityList";
import { useAppContext } from "../context/useAppContext";
import { Link } from "react-router-dom";

export const Home = () => {
  const { state } = useAppContext();

  const selectedCount = state.selectedForCompare.length;
  const canCompare = selectedCount >= 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
            Financial opportunity discovery
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Discover Opportunities
          </h1>

          <p className="text-gray-500 mt-2 max-w-2xl text-sm sm:text-base leading-6">
            Find the right financial opportunity tailored to your needs.
          </p>
        </div>

        {selectedCount > 0 && (
          <div
            className={`
              mt-5
              sm:mt-0
              flex
              w-full
              sm:w-auto
              flex-col
              sm:flex-row
              sm:items-center
              gap-3
              bg-blue-50
              px-4
              py-3
              rounded-xl
              border
              border-blue-100
              shadow-sm
              transition-all
              duration-200
              hover:shadow-md
            `}
            aria-live="polite"
          >
            <div>
              <p className="text-sm font-semibold text-blue-800">
                {selectedCount}{" "}
                {selectedCount === 1
                  ? "opportunity selected"
                  : "opportunities selected"}
              </p>

              {!canCompare && (
                <p className="mt-1 text-xs text-blue-700">
                  Select at least 1 more opportunity to compare.
                </p>
              )}
            </div>

            {canCompare ? (
              <Link
                to="/compare"
                aria-label={`Compare ${selectedCount} selected opportunities`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-4
                  py-2
                  rounded-lg
                  font-medium
                  transition-all
                  duration-200
                  bg-primary
                  text-white
                  hover:bg-blue-600
                  hover:-translate-y-0.5
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-primary
                  text-sm
                  shadow-sm
                  hover:shadow-md
                  whitespace-nowrap
                "
              >
                Compare Now
              </Link>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-4
                  py-2
                  rounded-lg
                  font-medium
                  bg-gray-200
                  text-gray-500
                  cursor-not-allowed
                  text-sm
                  whitespace-nowrap
                "
              >
                Compare Now
              </button>
            )}
          </div>
        )}
      </header>

      <section aria-labelledby="requirement-heading">
        <h2 id="requirement-heading" className="sr-only">
          Opportunity requirements
        </h2>

        <RequirementForm />
      </section>

      <section
        className="mt-8 sm:mt-10"
        aria-labelledby="opportunities-heading"
      >
        <h2 id="opportunities-heading" className="sr-only">
          Available opportunities
        </h2>

        <OpportunityList />
      </section>

      {canCompare && (
        <div
          className="
            fixed
            bottom-5
            right-5
            sm:bottom-6
            sm:right-6
            z-40
          "
          aria-live="polite"
        >
          <Link
            to="/compare"
            aria-label={`Compare ${selectedCount} selected opportunities`}
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-primary
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:bg-blue-600
              hover:-translate-y-1
              hover:shadow-xl
              focus:outline-none
              focus:ring-2
              focus:ring-primary
              focus:ring-offset-2
              whitespace-nowrap
            "
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
              />
            </svg>

            <span>
              Compare {selectedCount}
            </span>

            <span className="text-blue-100">
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};