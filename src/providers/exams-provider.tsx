"use client";

import React, { createContext, useContext } from "react";
import { useExamsApi } from "@/hooks/useExamsApi";

// Contexto para los exámenes
const ExamsContext = createContext<any>(null);

export const ExamsProvider = ({ children }: { children: React.ReactNode }) => {
    // Hook que maneja la lógica y endpoints
    const examsApi = useExamsApi();

    return (
        <ExamsContext.Provider value={examsApi}>
            {children}
        </ExamsContext.Provider>
    );
};

// Hook para consumir el contexto global de exámenes
export const useExamsContext = () => {
    const ctx = useContext(ExamsContext);
    if (!ctx) throw new Error("useExamsContext debe usarse dentro de ExamsProvider");
    return ctx;
};
