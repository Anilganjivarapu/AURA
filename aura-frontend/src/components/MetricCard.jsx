const MetricCard = ({ label, value, accent = "text-aura-sand" }) => (
  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`mt-3 font-display text-3xl ${accent}`}>{value}</p>
  </div>
);

export default MetricCard;
