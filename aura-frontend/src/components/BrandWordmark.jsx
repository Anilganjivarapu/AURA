const BrandWordmark = ({ compact = false, subtitle, subtitleClassName = "", textSize = "md" }) => {
  const titleClassName =
    textSize === "lg"
      ? "text-lg tracking-[0.24em] sm:text-xl sm:tracking-[0.34em]"
      : textSize === "sm"
        ? "text-xs tracking-[0.18em] sm:text-sm sm:tracking-[0.28em]"
        : "text-sm tracking-[0.22em] sm:text-base sm:tracking-[0.3em]";

  return (
    <div className={`flex min-w-0 items-center ${compact ? "gap-2" : "gap-3"}`}>
      <img
        src="/aura-logo.png"
        alt="AURA logo"
        className={`${compact ? "h-8 w-8 sm:h-10 sm:w-10" : "h-12 w-12 sm:h-14 sm:w-14"} rounded-[18px] object-cover shadow-[0_0_24px_rgba(214,164,76,0.14)]`}
      />
      <div className="min-w-0">
        <p className={`truncate font-semibold uppercase text-aura-gold ${titleClassName}`}>AURA</p>
        {subtitle ? <p className={`mt-1 text-sm text-slate-300 ${subtitleClassName}`}>{subtitle}</p> : null}
      </div>
    </div>
  );
};

export default BrandWordmark;
