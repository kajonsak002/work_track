
import { redirect } from "next/navigation";

// This page acts as a redirect since we don't have role-based logic yet.
// For now, let's redirect to the Employee Dashboard by default.
export default function DashboardPage() {
    redirect('/dashboard/employee');
}
