"use client"

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
  addPatient: (patient: Patient) => Promise<void>
  addAppointment: (appointment: Appointment) => Promise<void>
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

  const addPatient = async (patient: Patient) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch({ type: "ADD_PATIENT", payload: patient })
      dispatch({ type: "SET_LOADING", payload: false })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error as Error })
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const addAppointment = async (appointment: Appointment) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch({ type: "ADD_APPOINTMENT", payload: appointment })
      dispatch({ type: "SET_LOADING", payload: false })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error as Error })
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const fetchPatients = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch({ type: "SET_PATIENTS", payload: [] })
      dispatch({ type: "SET_LOADING", payload: false })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error as Error })
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const fetchAppointments = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch({ type: "SET_APPOINTMENTS", payload: [] })
      dispatch({ type: "SET_LOADING", payload: false })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error as Error })
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
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