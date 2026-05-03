const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const getOwnerAdminEmail = () => normalizeEmail(process.env.ADMIN_EMAIL || "admin@aura.dev");

const isOwnerAdminEmail = (email) => normalizeEmail(email) === getOwnerAdminEmail();

const isOwnerAdminUser = (user) => {
  if (!user) {
    return false;
  }

  return user.role === "admin" && isOwnerAdminEmail(user.email);
};

module.exports = { normalizeEmail, getOwnerAdminEmail, isOwnerAdminEmail, isOwnerAdminUser };
