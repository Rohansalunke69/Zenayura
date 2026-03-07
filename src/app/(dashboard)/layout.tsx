import { DashboardLayoutClient } from "@/components/DashboardLayoutClient";
import { ProfileGuard } from "@/components/ProfileGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProfileGuard>
            <DashboardLayoutClient>
                {children}
            </DashboardLayoutClient>
        </ProfileGuard>
    );
}
