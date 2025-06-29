"use client"

import { supabase } from "@/lib/supabase"
import React, { createContext, useContext, useReducer } from "react"

interface Patient {
  id: string
  name: string
  phone: string
  email?: string
}

interface Appointment {
  id: string
  patientId: string
  date: string
  time: string
  type: string
  status: string
}

interface DataState {
  patients: Patient[]
  appointments: Appointment[]
  isLoading: boolean
  error: Error | null
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: Error | null }
  | { type: "SET_PATIENTS"; payload: Patient[] }
  | { type: "ADD_PATIENT"; payload: Patient }
  | { type: "SET_APPOINTMENTS"; payload: Appointment[] }
  | { type: "ADD_APPOINTMENT"; payload: Appointment }

interface DataContextType extends DataState {
  addPatient: (patient: Omit<Patient, "id">) => Promise<void> // ID será generado por Supabase
  addAppointment: (appointment: Omit<Appointment, "id">) => Promise<void> // ID será generado por Supabase

  fetchPatients: () => Promise<void>
  fetchAppointments: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)



function dataReducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_PATIENTS":
      return { ...state, patients: action.payload }
    case "ADD_PATIENT":
      return { ...state, patients: [...state.patients, action.payload] }
    case "SET_APPOINTMENTS":
      return { ...state, appointments: action.payload }
    case "ADD_APPOINTMENT":
      return { ...state, appointments: [...state.appointments, action.payload] }
    default:
      return state
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, {
    patients: [],
    appointments: [],
    isLoading: false,
    error: null,
  })

  const addPatient = async (patient: Omit<Patient, "id">) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const { data, error } = await supabase
        .from("patients") // Asegúrate que 'patients' es el nombre de tu tabla
        .insert({ name: patient.name, phone: patient.phone, email: patient.email })
        .select()
        .single() // Espera un solo objeto de vuelta

      if (error) throw error
      if (data) {
        dispatch({ type: "ADD_PATIENT", payload: data as Patient })
      } else {
        throw new Error("Paciente añadido, pero no se pudieron recuperar los datos.")
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error as Error })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const addAppointment = async (appointment: Omit<Appointment, "id">) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const { data, error } = await supabase
        .from("appointments") // Asegúrate que 'appointments' es el nombre de tu tabla
        .insert({
          patientId: appointment.patientId,
          date: appointment.date,
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
        })
        .select()
        .single() // Espera un solo objeto de vuelta

      if (error) throw error
      if (data) {
        dispatch({ type: "ADD_APPOINTMENT", payload: data as Appointment })
      } else {
        throw new Error("Cita añadida, pero no se pudieron recuperar los datos.")
      }

    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error as Error })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }

  }

  const fetchPatients = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const { data, error } = await supabase
        .from("patients") // Asegúrate que 'patients' es el nombre de tu tabla
        .select("*")

      if (error) throw error
      dispatch({ type: "SET_PATIENTS", payload: data || [] })

    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error as Error })

      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }

  }

  const fetchAppointments = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const { data, error } = await supabase
        .from("appointments") // Asegúrate que 'appointments' es el nombre de tu tabla
        .select("*")
      // Si necesitas datos relacionados, por ejemplo, del paciente:
      // .select("*, patients(name)") // Asegúrate que 'patients' es el nombre de la tabla relacionada

      if (error) throw error
      dispatch({ type: "SET_APPOINTMENTS", payload: data || [] })

    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error as Error })

      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })

    }
  }

  return (
    <DataContext.Provider
      value={{
        ...state,
        addPatient,
        addAppointment,
        fetchPatients,
        fetchAppointments,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}