'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function ClientThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            {children}
            <ThemeToggle />
        </ThemeProvider>
    );
}
