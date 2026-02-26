import { getPublishedNotices } from "@/lib/actions/notice";
import NoticesClient from "./NoticesClient";

export default async function NoticesPage() {
  const notices = await getPublishedNotices();

  // Serialize dates for client component
  const serialized = notices.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    type: n.type,
    isImportant: n.isImportant,
    link: n.link,
    publishedAt: n.publishedAt.toISOString(),
  }));

  return <NoticesClient notices={serialized} />;
}
