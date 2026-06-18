import { AppShell } from "@/components/AppShell";
import { requireCurrentUser } from "@/lib/auth/session";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCurrentUser();
  return <AppShell role={user.role}>{children}</AppShell>;
}
