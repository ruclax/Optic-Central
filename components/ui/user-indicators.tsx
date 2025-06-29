import React from "react";

interface UserIndicatorProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    colorClass?: string;
}

export const UserIndicator: React.FC<UserIndicatorProps> = ({ icon, label, value, colorClass = "" }) => (
    <div className="flex flex-col items-center flex-1 min-w-0" style={{ flexBasis: '0', flexGrow: 1 }}>
        <div className="flex flex-row items-center gap-1 mb-1">
            {icon}
            <span className={`text-lg md:text-3xl font-extrabold text-foreground ${colorClass}`}>{value}</span>
        </div>
        <span className={`text-xs md:text-base font-bold mb-0.5 uppercase text-muted-foreground ${colorClass}`}>{label}</span>
    </div>
);

interface RoleIndicatorProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    iconColor?: string;
}

export const RoleIndicator: React.FC<RoleIndicatorProps> = ({ icon, label, value, iconColor = "text-muted-foreground" }) => (
    <div className="flex flex-col items-center flex-1 min-w-0 px-1 justify-center" style={{ flexBasis: '0', flexGrow: 1 }}>
        <div className="flex flex-row items-center gap-1">
            <span className={iconColor}>{icon}</span>
            <span className="text-base md:text-xl font-bold text-foreground">{value}</span>
        </div>
        <span className="hidden md:block text-xs md:text-sm font-semibold text-muted-foreground mb-0.5 truncate">{label}</span>
    </div>
);
