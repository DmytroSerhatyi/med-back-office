import { Patient } from "app/shared/models/patient.model";
import { AppState } from "../core.module";

export interface PatientsState {
  patients: Patient[];
  favoritePatients: string[];
}

export interface PatientsAppState extends AppState {
  patients: PatientsState;
}
