import React from 'react';
import {
  Award,
  Star,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function Performance() {
  const { currentEmployee, performanceReviews } = useApp();

  const employee = currentEmployee;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Performance & Appraisals
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quarterly goals, manager feedback, and skill development targets.
          </p>
        </div>

        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  // Filter reviews for this employee
  const myReviews = performanceReviews.filter((r) => r.employeeId === employee.id);

  // Compute average rating
  const avgRating =
    myReviews.length > 0
      ? (
          myReviews.reduce((acc, curr) => acc + (parseFloat(curr.rating) || 0), 0) /
          myReviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Performance & Appraisals
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {myReviews.length} Reviews Published
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Quarterly goals, manager feedback, and skill development targets.
          </p>
        </div>
      </div>

      {/* 2. Top Summary KPI Card */}
      {myReviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Star className="h-6 w-6 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-slate-400">Average Rating</span>
              <p className="text-2xl font-bold text-slate-900">{avgRating} / 5.0</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-50 text-violet-600 border border-violet-200">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-slate-400">Total Evaluations</span>
              <p className="text-2xl font-bold text-slate-900">{myReviews.length} Cycles</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-slate-400">Appraisal Status</span>
              <p className="text-2xl font-bold text-emerald-700">Good Standing</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Reviews List */}
      {myReviews.length === 0 ? (
        <EmployeeEmptyState
          icon={Award}
          heading="No Performance Appraisals Recorded"
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
                    Evaluated on {rev.reviewDate} • Role: {employee.designation}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-700 font-bold text-sm self-start sm:self-auto">
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
                  <Sparkles className="h-3.5 w-3.5 text-violet-600 shrink-0" />
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
