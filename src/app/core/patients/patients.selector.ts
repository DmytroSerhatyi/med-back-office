import { createSelector } from "@ngrx/store";
import { PatientsState } from "./patients.model";
import { selectPatientsState } from "../core.state";

export const selectPatients = createSelector(
  selectPatientsState,
  (state: PatientsState) => state.patients
);

export const selectFavoritePatients = createSelector(
  selectPatientsState,
  (state: PatientsState) => state.favoritePatients
);
