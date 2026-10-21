const StatCard = ({ title, value, change, icon: Icon, color = 'orange' }) => {
  const colorClasses = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  const isPositive = change?.startsWith('+');

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
        {change && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 font-medium">{title}</p>
      <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  );
};

export default StatCard;