import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Zap,
  Award,
  Send,
  Plus,
  Flame,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function KudosFeedWidget() {
  const {
    currentEmployee,
    kudos = [],
    colleagues = [],
    sendKudos,
    toggleLikeKudos,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetColleague, setTargetColleague] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('Problem Solver');
  const [kudosMessage, setKudosMessage] = useState('');
  const [formError, setFormError] = useState('');

  const badgeOptions = [
    { label: 'Problem Solver', icon: Sparkles, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Team Player', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { label: 'Innovation Leader', icon: Zap, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { label: 'Customer Champion', icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  const handleSendKudos = (e) => {
    e.preventDefault();
    setFormError('');

    if (!targetColleague) {
      setFormError('Please select a team member to recognize.');
      return;
    }
    if (!kudosMessage.trim()) {
      setFormError('Please include a message celebrating their contribution.');
      return;
    }

    sendKudos({
      to: targetColleague,
      badge: selectedBadge,
      message: kudosMessage.trim(),
    });

    setIsModalOpen(false);
    setTargetColleague('');
    setKudosMessage('');
  };

  const getBadgeStyle = (badgeName) => {
    const found = badgeOptions.find((b) => b.label === badgeName);
    return found ? found.color : 'text-violet-600 bg-violet-50 border-violet-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Workplace Kudos & Wall of Fame
            </h3>
            <p className="text-xs text-slate-500">
              Celebrate peer achievements, team support, and innovation milestones.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Award Kudos</span>
        </button>
      </div>

      {/* Kudos Feed Stream */}
      {kudos.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          <Sparkles className="h-8 w-8 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-slate-600">No Kudos Shared Yet</p>
          <p className="mt-1 text-slate-400">
            Be the first to celebrate a colleague's outstanding work!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {kudos.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between text-xs space-y-3 hover:border-violet-200 transition-colors"
            >
              <div className="space-y-2">
                {/* Header: Avatars & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-violet-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {item.fromAvatar}
                    </div>
                    <span className="text-slate-400">→</span>
                    <div className="h-7 w-7 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {item.toAvatar}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(
                      item.badge
                    )}`}
                  >
                    ★ {item.badge}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {item.from}{' '}
                    <span className="font-normal text-slate-500">celebrated</span>{' '}
                    <strong>{item.to}</strong>
                  </p>
                  <p className="text-slate-600 italic mt-1 leading-relaxed">
                    "{item.message}"
                  </p>
                </div>
              </div>

              {/* Bottom: Timestamp & Like Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-400">
                <span>{item.timestamp}</span>

                <button
                  type="button"
                  onClick={() => toggleLikeKudos(item.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    item.hasLiked
                      ? 'text-rose-600 bg-rose-50 font-bold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>{item.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Kudos Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Recognize a Peer with Kudos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Share public praise visible across the team portal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {formError}
              </div>
            )}

            <form onSubmit={handleSendKudos} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Colleague <span className="text-violet-600">*</span>
                </label>
                <select
                  required
                  value={targetColleague}
                  onChange={(e) => setTargetColleague(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white"
                >
                  <option value="">Select a colleague to praise...</option>
                  {colleagues
                    .filter((c) => c.name !== currentEmployee?.name)
                    .map((col) => (
                      <option key={col.id} value={col.name}>
                        {col.name} — {col.role} ({col.department})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Badge Classification <span className="text-violet-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {badgeOptions.map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => setSelectedBadge(b.label)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        selectedBadge === b.label
                          ? 'border-violet-600 bg-violet-50 text-violet-900 shadow-2xs font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <b.icon className="h-4 w-4 shrink-0 text-violet-600" />
                      <span className="text-xs">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Appreciation Message <span className="text-violet-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={kudosMessage}
                  onChange={(e) => setKudosMessage(e.target.value)}
                  placeholder="Tell everyone what made their collaboration so impactful..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Publish Kudos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

