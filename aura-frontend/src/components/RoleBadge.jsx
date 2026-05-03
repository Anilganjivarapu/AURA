const styles = {
  admin: "bg-aura-coral/15 text-rose-100 border-aura-coral/30",
  student: "bg-aura-teal/15 text-teal-100 border-aura-teal/30",
  staff: "bg-aura-gold/15 text-amber-100 border-aura-gold/30",
};

const RoleBadge = ({ role }) => (
  <span
    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
      styles[role] || "border-white/10 bg-white/5 text-white"
    }`}
  >
    {role}
  </span>
);

export default RoleBadge;
