const BrandWordmark = ({ compact = false, subtitle, subtitleClassName = "", textSize = "md" }) => {
  const titleClassName =
    textSize === "lg"
      ? "text-xl tracking-[0.34em]"
      : textSize === "sm"
        ? "text-sm tracking-[0.28em]"
        : "text-base tracking-[0.3em]";

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <img
        src="/aura-logo.png"
        alt="AURA logo"
        className={`${compact ? "h-10 w-10" : "h-14 w-14"} rounded-[18px] object-cover shadow-[0_0_24px_rgba(214,164,76,0.14)]`}
      />
      <div>
        <p className={`font-semibold uppercase text-aura-gold ${titleClassName}`}>AURA</p>
        {subtitle ? <p className={`mt-1 text-sm text-slate-300 ${subtitleClassName}`}>{subtitle}</p> : null}
      </div>
    </div>
  );
};

export default BrandWordmark;
