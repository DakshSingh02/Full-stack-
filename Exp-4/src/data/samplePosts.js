// Temporal data model for a scheduled post.
// Each post is mapped to a specific date (ISO "YYYY-MM-DD") + time slot.
// This is the "structured data -> temporal layout" mapping described in 1.4.1.

const pad = (n) => String(n).padStart(2, "0");
const isoToday = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const PLATFORM_COLORS = {
  instagram: "#C8577A",
  twitter: "#3A8FB7",
  linkedin: "#3B6E8F",
  facebook: "#4D6FA6",
};

export const samplePosts = [
  {
    id: "p1",
    title: "Product teaser video",
    platform: "instagram",
    date: isoToday(1),
    time: "09:30",
    status: "scheduled",
    content: "Short teaser clip for the new drop.",
  },
  {
    id: "p2",
    title: "Weekly roundup thread",
    platform: "twitter",
    date: isoToday(1),
    time: "13:00",
    status: "scheduled",
    content: "Recap of this week's updates in a thread.",
  },
  {
    id: "p3",
    title: "Hiring announcement",
    platform: "linkedin",
    date: isoToday(3),
    time: "10:00",
    status: "draft",
    content: "We're hiring frontend engineers.",
  },
  {
    id: "p4",
    title: "Customer spotlight",
    platform: "facebook",
    date: isoToday(5),
    time: "16:00",
    status: "scheduled",
    content: "Feature story about a long-time customer.",
  },
  {
    id: "p5",
    title: "Behind the scenes reel",
    platform: "instagram",
    date: isoToday(5),
    time: "18:00",
    status: "scheduled",
    content: "Studio footage from this week's shoot.",
  },
  {
    id: "p6",
    title: "Feature launch announcement",
    platform: "twitter",
    date: isoToday(8),
    time: "11:00",
    status: "draft",
    content: "Announcing the new dashboard feature.",
  },
];
