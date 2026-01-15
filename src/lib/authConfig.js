const rawAdminEmails = import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL || '';

export const adminEmails = rawAdminEmails
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const isEmailAllowed = (email) => {
  if (!adminEmails.length) {
    return true;
  }
  if (!email) {
    return false;
  }
  return adminEmails.includes(email.trim().toLowerCase());
};
