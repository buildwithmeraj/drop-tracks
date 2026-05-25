export function formatDate(dateString, options) {
  if (!dateString) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    options || {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(dateString));
}

export function formatRelativeWindow(dateString) {
  if (!dateString) {
    return "No date";
  }

  const now = new Date();
  const target = new Date(dateString);
  const difference = target.getTime() - now.getTime();
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "Tomorrow";
  }

  if (days < 0) {
    return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  }

  return `In ${days} day${days === 1 ? "" : "s"}`;
}
