import { Action, createReducer, on } from "@ngrx/store";
import { PatientsState } from "./patients.model";
import { patientsFavor, patientsFetched, patientsUnfavor } from "./patients.actions";

export const initialState: PatientsState = {
  patients: [],
  favoritePatients: []
};

const reducer = createReducer(
  initialState,
  on(patientsFetched, (state, { patients }) => ({ ...state, patients: [...patients] })),
  on(patientsFavor, (state, { patientId }) => ({ ...state, favoritePatients: [...state.favoritePatients, patientId] })),
  on(patientsUnfavor, (state, { patientId }) => ({ ...state, favoritePatients: state.favoritePatients.filter(id => id !== patientId) }))
);

export function patientsReducer(
  state: PatientsState | undefined,
  action: Action
): PatientsState {
  return reducer(state, action);
}
