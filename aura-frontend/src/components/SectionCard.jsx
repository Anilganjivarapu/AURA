const SectionCard = ({ title, eyebrow, description, actions, children, className = "" }) => (
  <section className={`glass-panel p-6 md:p-7 ${className}`}>
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-aura-gold">{eyebrow}</p>
        ) : null}
        <h2 className="section-title mt-2">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
    {children}
  </section>
);

export default SectionCard;
