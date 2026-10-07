import { AdminLoginForm } from "@/components/admin/login-form";

// Admin login page - Supabase authenticated users

export default function AdminLoginPage() {
  return <AdminLoginForm next="/admin" />;
}