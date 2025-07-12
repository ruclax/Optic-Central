import {
  Home,
  Users,
  Eye,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const APP_PATHS = {
  DASHBOARD: "/dashboard",
  PATIENTS: "/patients",
  EXAMS: "/exams",
  USERS: "/users",
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

export const businessNavigationItems: NavItem[] = [];

export const systemNavigationItems: NavItem[] = [
  {
    title: "Usuarios",
    url: APP_PATHS.USERS,
    icon: Shield,
  },
];
