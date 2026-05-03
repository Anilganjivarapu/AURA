import { useState } from "react";

import AvatarCircle from "./AvatarCircle";
import BrandWordmark from "./BrandWordmark";

const AppShell = ({ user, onLogout, activeSection, onNavigate, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sections = [
    { key: "home", label: "Home", compactLabel: "Home" },
    { key: "dashboard", label: "Dashboard", compactLabel: "Dash" },
    { key: "courses", label: "Courses", compactLabel: "Courses" },
    { key: "materials", label: "Materials", compactLabel: "Files" },
    { key: "payments", label: "Payments", compactLabel: "Pay" },
    { key: "assistant", label: "AI Assistant", compactLabel: "AI" },
    { key: "reports", label: "Reports", compactLabel: "Reports" },
    { key: "about", label: "About Us", compactLabel: "About" },
    { key: "contact", label: "Contact", compactLabel: "Contact" },
    ...(user.role === "admin" ? [{ key: "users", label: "Users", compactLabel: "Users" }] : []),
  ];
  const workspaceLabel =
    user.role === "admin" ? "Admin Console" : user.role === "staff" ? "Staff Console" : "Student Space";
  const handleNavigate = (section) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };
  const renderSidebar = ({ mobile = false } = {}) => (
    <div
      className={`glass-panel flex h-full flex-col overflow-hidden ${
        mobile ? "px-4 py-5" : collapsed ? "items-center px-3 py-4" : "px-4 py-5"
      }`}
    >
      <div className={`flex ${mobile || collapsed ? "w-full flex-col items-center gap-4" : "flex-col gap-4"}`}>
        <div className={`flex ${mobile || collapsed ? "w-full justify-between" : "items-center justify-between"}`}>
          <div className={`flex items-center ${mobile || collapsed ? "gap-3" : "gap-3"}`}>
            <img
              src="/aura-logo.png"
              alt="AURA logo"
              className="h-12 w-12 rounded-[18px] object-cover shadow-[0_0_24px_rgba(214,164,76,0.16)]"
            />
            {(!collapsed || mobile) ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-aura-gold">AURA</p>
                <p className="mt-1 text-sm text-slate-300">{workspaceLabel}</p>
              </div>
            ) : null}
          </div>
          {mobile ? (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-300 transition hover:bg-white/10"
            >
              Close
            </button>
          ) : !collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="rounded-2xl border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-300 transition hover:bg-white/10"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>

      <div className={`mt-4 flex min-h-0 flex-1 flex-col overflow-hidden ${collapsed || mobile ? "w-full" : ""}`}>
        {!collapsed || mobile ? (
          <div className="rounded-[20px] border border-white/10 bg-white/[0.035] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.34em] text-aura-gold">Navigation</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">Quick access to platform sections.</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="w-full rounded-2xl border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-300 transition hover:bg-white/10"
            >
              Open
            </button>
          </div>
        )}

        <div
          className={`aura-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto pr-1 ${
            collapsed && !mobile ? "space-y-2.5" : "space-y-2"
          }`}
        >
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => handleNavigate(section.key)}
              title={collapsed && !mobile ? section.label : undefined}
              className={`rounded-2xl transition ${
                collapsed && !mobile
                  ? `w-full px-3 py-3 text-center text-[11px] font-semibold ${
                      activeSection === section.key
                        ? "bg-white text-slate-950 shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
                        : "border border-white/10 bg-white/[0.035] text-slate-300 hover:bg-white/10"
                    }`
                  : `group flex w-full items-center gap-3 px-3 py-3 text-sm font-semibold ${
                      activeSection === section.key
                        ? "bg-white text-slate-950 shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
                        : "bg-white/[0.035] text-slate-300 hover:bg-white/10"
                    }`
              }`}
            >
              {collapsed && !mobile ? (
                <span className="block truncate">{section.compactLabel}</span>
              ) : (
                <>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      activeSection === section.key ? "bg-slate-950" : "bg-aura-gold/70 group-hover:bg-aura-gold"
                    }`}
                  />
                  <span className="flex-1 text-left">{section.label}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={`mt-4 flex shrink-0 ${collapsed && !mobile ? "w-full flex-col items-center gap-3" : "flex-col gap-3"}`}>
        <button
          type="button"
          onClick={() => handleNavigate("profile")}
          title={collapsed && !mobile ? "Profile" : undefined}
          className={`rounded-[24px] border border-white/10 ${
            collapsed && !mobile ? "w-full p-2" : "flex items-center gap-3 bg-white/[0.05] p-3"
          }`}
        >
          <AvatarCircle user={user} size="sm" />
          {(!collapsed || mobile) ? (
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Profile</p>
              <p className="text-xs text-slate-400">{user.name}</p>
            </div>
          ) : null}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className={`rounded-2xl border border-white/10 ${
            collapsed && !mobile ? "w-full px-3 py-2 text-xs" : "w-full px-4 py-3 text-sm"
          } text-slate-300 transition hover:bg-white/10`}
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1700px] gap-6 px-3 py-3 md:px-6 md:py-6">
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[min(86vw,320px)] p-3">{renderSidebar({ mobile: true })}</div>
        </div>
      ) : null}

      <aside className={`no-print hidden shrink-0 xl:block ${collapsed ? "w-[132px]" : "w-[248px]"}`}>
        <div className="sticky top-6 h-[calc(100vh-3rem)]">{renderSidebar()}</div>
      </aside>

      <main className="flex-1 space-y-6">
        <div className="glass-panel flex items-center justify-between gap-4 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-2xl border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 xl:hidden"
            >
              Menu
            </button>
            <div>
              <div className="flex items-center gap-3">
                <BrandWordmark compact textSize="sm" />
                <p className="text-xs uppercase tracking-[0.3em] text-aura-gold">Workspace</p>
              </div>
              <h1 className="mt-2 font-display text-3xl capitalize text-white">
                {sections.find((section) => section.key === activeSection)?.label || activeSection}
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2"
          >
            <AvatarCircle user={user} size="sm" />
            <span className="hidden text-sm text-slate-300 md:inline">{user.name}</span>
          </button>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AppShell;
