import { getPublishedEvents } from "@/lib/actions/event";
import EventsClient from "./EventsClient";

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
