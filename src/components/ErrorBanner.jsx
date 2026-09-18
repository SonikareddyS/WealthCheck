import React from 'react';
import { Button } from './ui/Button';

export const ErrorBanner = ({
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="
        flex
        flex-col
        gap-4
        rounded-xl
        border border-red-200
        bg-red-50
        p-5
        text-red-900
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            mt-0.5
            flex h-8 w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-red-100
          "
          aria-hidden="true"
        >
          !
        </div>

        <div>
          <h3 className="font-semibold">
            Couldn't load opportunities
          </h3>

          <p className="mt-1 text-sm text-red-700">
            {message ||
              'Something went wrong while loading the opportunities.'}
          </p>
        </div>
      </div>

      {onRetry && (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          aria-label="Retry loading opportunities"
          className="
            shrink-0
            border-red-400
            text-red-700
            hover:bg-red-100
            focus:ring-red-500
          "
        >
          Try again
        </Button>
      )}
    </div>
  );
};