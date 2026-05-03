const particles = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  size: 10 + ((index * 7) % 26),
  left: `${(index * 7) % 90}%`,
  top: `${(index * 11) % 85}%`,
  delay: `${index * 0.6}s`,
}));

const AuthShowcase = ({ mode, onModeChange, role, onRoleChange, children }) => {
  const roleOptions = mode === "login" ? ["student", "staff", "admin"] : ["student", "staff"];

  return (
    <div className="auth-stage relative min-h-screen overflow-hidden px-4 py-6 md:px-6 md:py-8">
    <div className="auth-orb auth-orb-one" />
    <div className="auth-orb auth-orb-two" />
    <div className="auth-orb auth-orb-three" />

    {particles.map((particle) => (
      <span
        key={particle.id}
        className="auth-particle"
        style={{
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          left: particle.left,
          top: particle.top,
          animationDelay: particle.delay,
        }}
      />
    ))}

    <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1600px] items-center gap-6 lg:grid-cols-[1.12fr_0.88fr]">
      <div className="hidden lg:flex">
        <div className="max-w-2xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-aura-gold/40 bg-aura-gold/15 shadow-[0_0_40px_rgba(214,164,76,0.25)]">
            <span className="font-display text-4xl text-aura-sand">A</span>
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.42em] text-aura-gold">AURA premium platform</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-tight text-white xl:text-6xl">
            Modern learning, admin control, payments, and AI support in one premium workspace.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
            Stunning learning experiences for students, focused operations for staff, and full control for admin.
          </p>

          <div className="mt-10 grid max-w-2xl gap-4 md:grid-cols-3">
            {["Role-Based Workspaces", "Courses and Materials", "Payments and AI Assistant"].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel relative mx-auto w-full max-w-[520px] p-6 md:p-8">
        <div className="mb-8 text-center lg:hidden">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-aura-gold/40 bg-aura-gold/15 shadow-[0_0_40px_rgba(214,164,76,0.25)]">
            <span className="font-display text-4xl text-aura-sand">A</span>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.42em] text-aura-gold">AURA</p>
          <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">
            {mode === "login" ? "Welcome back" : "Create your workspace"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Premium academy access with courses, materials, payments, reports, and AI assistance.
          </p>
        </div>

        <div className="mb-6 flex rounded-full border border-white/10 bg-white/5 p-1">
          {["login", "register"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onModeChange(value)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === value ? "bg-aura-gold text-slate-950" : "text-slate-300"
              }`}
            >
              {value === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Access Role
          </p>
          <div
            className={`grid gap-2 rounded-[26px] border border-white/10 bg-white/5 p-2 ${
              roleOptions.length === 3 ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {roleOptions.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onRoleChange(value)}
                className={`rounded-[20px] px-4 py-3 text-sm font-semibold capitalize transition ${
                  role === value ? "bg-white text-slate-950" : "text-slate-300"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          {mode === "register" && role === "admin" ? (
            <p className="mt-3 text-center text-xs text-slate-400">
              Admin accounts are owner-managed. Switch to student or staff to register.
            </p>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">{children}</div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {["Courses", "Payments", "AI Assistant"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs uppercase tracking-[0.2em] text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs uppercase tracking-[0.3em] text-slate-500">Powered by AURA</p>
      </div>
    </div>
  </div>
  );
};

export default AuthShowcase;
