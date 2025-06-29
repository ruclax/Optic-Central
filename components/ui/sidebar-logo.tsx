import Image from "next/image";
import { useTheme } from "next-themes";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

/**
 * SidebarLogo: muestra el logo adecuado según el modo (light/dark) y el estado del sidebar (expandido/colapsado).
 */
export function SidebarLogo() {
    const { theme } = useTheme();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    // Puedes reemplazar los src por tus propios logos
    const logos = {
        light: {
            expanded: "/placeholder-logo.png",
            collapsed: "/placeholder-logo.svg",
        },
        dark: {
            expanded: "/placeholder-logo.png",
            collapsed: "/placeholder-logo.svg",
        },
    };

    const currentTheme = theme === "dark" ? "dark" : "light";
    const logoSrc = isCollapsed
        ? logos[currentTheme].collapsed
        : logos[currentTheme].expanded;

    return (
        <Link href="/dashboard" className="header-logo flex items-center justify-center h-16">
            <Image
                src={logoSrc}
                alt="Óptica Central Logo"
                width={isCollapsed ? 40 : 120}
                height={40}
                className="transition-all duration-200"
                priority
            />
        </Link>
    );
}
