import { useState } from 'react';
import { 
  LayoutDashboard, Building2, Users, FileText, 
  ScrollText, ShieldAlert, Settings, LogOut, Shield, Menu, X
} from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate, user, onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
    { id: 'security-alerts', label: 'Security Alerts', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#2F4F4F] text-white rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#2F4F4F] text-white flex flex-col z-40 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">SecureTenant</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-600 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;