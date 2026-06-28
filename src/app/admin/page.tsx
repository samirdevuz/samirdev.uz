import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata = {
  title: "Admin",
  description: "Private admin dashboard for managing Samir's portfolio content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
