import { redirect } from "next/navigation";

export default function AdminIndex() {
  // Redirect the root admin path to the dashboard since the sidebar handles navigation
  redirect("/admin/dashboard");
}