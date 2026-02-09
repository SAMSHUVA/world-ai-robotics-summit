
import type { Metadata } from 'next';
import './admin.css';
import { CONFERENCE_CONFIG } from '@/config/conference';

export const metadata: Metadata = {
    title: `Admin Dashboard | ${CONFERENCE_CONFIG.name} ${CONFERENCE_CONFIG.year}`,
    description: `Administrative access for ${CONFERENCE_CONFIG.fullName} management.`,
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="admin-theme-root min-h-screen selection:bg-[#5B4DFF] selection:text-white">
            {children}
        </div>
    )
}
