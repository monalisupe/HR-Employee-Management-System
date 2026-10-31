import React from 'react';
import { Link } from 'react-router-dom';
import { UserX, ArrowRight } from 'lucide-react';

/**
 * EmployeeEmptyState:
 * Reusable empty-state component conforming to Section 6 of Employee Portal specs:
 * - Icon
 * - Heading
 * - Description
 * - Optional action button
 * - Optional navigation link
 * - Explicitly avoids demo creation functionality for employees.
 */
export default function EmployeeEmptyState({
  icon: Icon = UserX,
  heading = 'No Employee Record Found',
  title, // support either heading or title
  description = 'Please contact your HR administrator.',
  actionLabel,
  onAction,
  linkText,
  linkTo,
  className = '',
}) {
  const displayHeading = heading || title;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-dashed border-slate-200/90 shadow-2xs ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        {displayHeading}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-slate-500 leading-relaxed">
        {description}
      </p>

      {(actionLabel || linkText) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>{actionLabel}</span>
            </button>
          )}

          {linkText && linkTo && (
            <Link
              to={linkTo}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors"
            >
              <span>{linkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

