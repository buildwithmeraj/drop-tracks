export const AUTH_MESSAGE_KEY = "auth_required";

export function buildLoginRedirect(pathname) {
  const params = new URLSearchParams({
    message: AUTH_MESSAGE_KEY,
  });

  if (pathname) {
    params.set("callbackUrl", pathname);
  }

  return `/login?${params.toString()}`;
}

export function getAuthMessage(messageKey) {
  if (messageKey === AUTH_MESSAGE_KEY) {
    return "Please sign in to access that page.";
  }

  return null;
}
