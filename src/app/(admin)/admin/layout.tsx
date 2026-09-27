import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: { default: "Admin", template: "%s · Admin — Worldwide Collection" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main
          id="main"
          className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
