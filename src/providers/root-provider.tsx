"use client"

import { AuthProvider } from "@/providers/auth-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { ToastProvider } from "@/providers/toast-provider"
import { ModalProvider } from "@/providers/modal-provider"
import { NetworkStatusProvider } from "@/providers/network-status-provider"
import { LocalizationProvider } from "@/providers/localization-provider"
import { ErrorBoundaryProvider } from "@/providers/error-boundary-provider"
import { ExamsProvider } from "@/providers/exams-provider"
import { PatientsProvider } from "@/providers/patients-provider"

export function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundaryProvider>
            <ThemeProvider>
                <LocalizationProvider>
                    <NetworkStatusProvider>
                        <ToastProvider>
                            <ModalProvider>
                                <AuthProvider>
                                    <ExamsProvider>
                                        <PatientsProvider>
                                            {children}
                                        </PatientsProvider>
                                    </ExamsProvider>
                                </AuthProvider>
                            </ModalProvider>
                        </ToastProvider>
                    </NetworkStatusProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </ErrorBoundaryProvider>
    )
}
