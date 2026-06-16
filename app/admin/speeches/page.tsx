import { adminGetSpeeches } from "@/lib/actions/speeches";
import AdminSpeechesClient from "./AdminSpeechesClient";

export const metadata = { title: "Speeches — TYLON Admin" };

export default async function AdminSpeechesPage() {
  const speeches = await adminGetSpeeches();
  return <AdminSpeechesClient speeches={speeches} />;
}
