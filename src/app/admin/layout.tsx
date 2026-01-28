import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AdminHeader } from "@/components/AdminHeader";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getAuthSession();

    // Protection: Redirect to login if not authenticated or not an admin
    if (!session) {
        redirect("/login");
    }

    if (session.role !== "ADMIN") {
        redirect("/student/dashboard"); // Or wherever appropriate for students
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] selection:bg-brand-gold/30">
            <AdminHeader />
            <div className="pt-32">
                {children}
            </div>
        </div>
    );
}
