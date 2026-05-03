const AvatarCircle = ({ user, size = "md" }) => {
  const dimensionClass = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
  }[size];

  const initials = (user?.name || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} className={`${dimensionClass} rounded-full object-cover`} />;
  }

  return (
    <div className={`${dimensionClass} flex items-center justify-center rounded-full bg-aura-gold/20 font-semibold text-aura-sand`}>
      {initials}
    </div>
  );
};

export default AvatarCircle;
