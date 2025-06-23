// e:\_Programacion\React\OpticaCentral\Optica-Central-V0\lib\navigation.ts
import {
  Home,
  Users,
  Calendar,
  Eye,
  Package,
  DollarSign,
  BarChart3,
  Shield,
  Settings,
  type LucideIcon,
} from "lucide-react";

// Definir una interfaz para los elementos del menú puede mejorar el tipado
export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon; // O React.ElementType si los iconos no son todos de Lucide
}

// Definir las URLS como constantes puede ser útil para referencias
export const APP_PATHS = {
  DASHBOARD: "/dashboard",
  PATIENTS: "/patients",
  EXAMS: "/exams",
  INVENTORY: "/inventory",
  SALES: "/sales",
  REPORTS: "/reports",
  USERS: "/users",
  SETTINGS: "/settings",
};

export const mainNavigationItems: NavItem[] = [
  {
    title: "Dashboard",
    url: APP_PATHS.DASHBOARD,
    icon: Home,
  },
  {
    title: "Pacientes",
    url: APP_PATHS.PATIENTS,
    icon: Users,
  },
  {
    title: "Exámenes",
    url: APP_PATHS.EXAMS,
    icon: Eye,
  },
];

export const businessNavigationItems: NavItem[] = [
  {
    title: "Inventario",
    url: APP_PATHS.INVENTORY,
    icon: Package,
  },
  {
    title: "Ventas",
    url: APP_PATHS.SALES,
    icon: DollarSign,
  },
  {
    title: "Reportes",
    url: APP_PATHS.REPORTS,
    icon: BarChart3,
  },
];

export const systemNavigationItems: NavItem[] = [
  {
    title: "Usuarios",
    url: APP_PATHS.USERS,
    icon: Shield,
  },
  {
    title: "Configuración",
    url: APP_PATHS.SETTINGS,
    icon: Settings,
  },
];
