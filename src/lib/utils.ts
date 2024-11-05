import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const highlight = cn(
  "text-white",
  "font-semibold",
  "[text-shadow:-1px_2px_0_black]",
  "[-webkit-text-stroke:1px_black]"
);

export function timeAgo(createdAt: string): string {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const secondsDiff = Math.floor(
    (now.getTime() - createdDate.getTime()) / 1000
  );

  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(secondsDiff / 3600);
  const daysDiff = Math.floor(secondsDiff / 86400);
  const monthsDiff = Math.floor(daysDiff / 30);
  const yearsDiff = Math.floor(daysDiff / 365);

  if (secondsDiff < 60) {
    return `${secondsDiff} second${secondsDiff === 1 ? "" : "s"} ago`;
  } else if (minutesDiff < 60) {
    return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
  } else if (daysDiff < 30) {
    return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
  } else if (monthsDiff < 12) {
    return `${monthsDiff} month${monthsDiff === 1 ? "" : "s"} ago`;
  } else {
    return `${yearsDiff} year${yearsDiff === 1 ? "" : "s"} ago`;
  }
}

export function prettyTimeStamp(isoTime: string): string {
  const date = new Date(isoTime);

  // Get the components of the date
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const time = date.toTimeString().split(" ")[0]; // Get the time in HH:mm:ss format

  // Function to get the correct suffix for the day
  const daySuffix = (day: number): string => {
    if (day % 10 === 1 && day % 100 !== 11) return "st";
    if (day % 10 === 2 && day % 100 !== 12) return "nd";
    if (day % 10 === 3 && day % 100 !== 13) return "rd";
    return "th";
  };

  // Construct the final output string
  return `${day}${daySuffix(day)} ${month}, ${year} - ${time}`;
}

export const baseUrl = (request: Request) => {
  const protocol = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("x-forwarded-host");

  return `${protocol}://${host}`;
};
