import { getPublishedEvents } from "@/lib/actions/event";
import EventsClient from "./EventsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ইভেন্ট ও অনুষ্ঠান — আস-সুন্নাহ স্কিল",
  description: "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউটের আসন্ন ও সম্পন্ন ইভেন্ট, সেমিনার ও কর্মশালা।",
  openGraph: { title: "ইভেন্ট ও অনুষ্ঠান", description: "প্রশিক্ষণ সেমিনার, কর্মশালা ও ভর্তি অনুষ্ঠান" },
};

export default async function EventsPage() {
  const events = await getPublishedEvents();

  const serialized = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date.toISOString(),
    time: e.time,
    location: e.location,
    status: e.status,
    type: e.type,
    attendees: e.attendees,
  }));

  return <EventsClient events={serialized} />;
}
