import React from 'react';
import {
  Award,
  Star,
  Calendar,
  CheckCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/common/EmptyState';

export default function EmployeePerformance() {
  const { currentEmployee, performanceReviews, createQuickDemoEmployee } = useApp();

  const employee = currentEmployee;

  // Filter reviews for this employee
  const myReviews = employee
    ? performanceReviews.filter((r) => r.employeeId === employee.id)
    : [];

  if (!employee) {
    return (
      <EmptyState
        icon={Award}
        title="No Active Employee Record"
        description="There is currently no active employee logged into this session."
        actionLabel="Create Demo Employee"
        onAction={createQuickDemoEmployee}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Performance & Appraisals
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {myReviews.length} Reviews
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Quarterly goals, manager feedback, and skill development targets.
          </p>
        </div>
      </div>

      {/* Reviews List */}
      {myReviews.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Performance Appraisals Recorded"
          description="There are currently zero performance appraisals published for your profile. When HR or your manager completes a performance evaluation cycle, it will appear here."
        />
      ) : (
        <div className="space-y-4">
          {myReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{rev.reviewPeriod}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated on {rev.reviewDate} • {employee.designation}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-700 font-bold text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{rev.rating} / 5.0 Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                {rev.goals && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Assigned Goals & Key Results
                    </span>
                    <p className="text-slate-800 leading-relaxed">{rev.goals}</p>
                  </div>
                )}

                {rev.achievements && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Delivered Achievements
                    </span>
                    <p className="text-slate-800 leading-relaxed">{rev.achievements}</p>
                  </div>
                )}
              </div>

              {rev.managerFeedback && (
                <div className="p-4 bg-violet-50/50 border border-violet-100 rounded-xl text-xs sm:text-sm">
                  <span className="text-[10px] uppercase font-bold text-violet-700 block mb-1">
                    Manager Evaluation & Appraisal Feedback
                  </span>
                  <p className="text-slate-800 italic leading-relaxed">
                    "{rev.managerFeedback}"
                  </p>
                </div>
              )}

              {rev.trainingNeeds && (
                <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                  <span className="font-bold text-slate-700">Recommended Professional Training:</span>
                  <span>{rev.trainingNeeds}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

