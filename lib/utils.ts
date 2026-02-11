export function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("tr-TR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return "-";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};


