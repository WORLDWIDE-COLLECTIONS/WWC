import { AdminLoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage(
  props: PageProps<"/admin/login">,
) {
  const searchParams = await props.searchParams;
  const next =
    typeof searchParams.next === "string" ? searchParams.next : undefined;

  return <AdminLoginForm next={next} />;
}
