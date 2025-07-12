"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePatientsApi } from "@/hooks/usePatientsApi";
import { Patient } from "@/types/patient";

const PatientsContext = createContext<any>(null);

export const PatientsProvider = ({ children }: { children: React.ReactNode }) => {
    const api = usePatientsApi();
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        api.getAll().then((data: Patient[]) => {
            if (data) setPatients(data);
        });
        // eslint-disable-next-line
    }, []);

    const refresh = async () => {
        const data = await api.getAll();
        if (data) setPatients(data);
    };

    return (
        <PatientsContext.Provider value={{ ...api, data: patients, refresh }}>
            {children}
        </PatientsContext.Provider>
    );
};

export const usePatients = () => {
    const ctx = useContext(PatientsContext);
    if (!ctx) throw new Error("usePatients debe usarse dentro de PatientsProvider");
    return ctx;
};
