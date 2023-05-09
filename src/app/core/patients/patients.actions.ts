import { createAction, props } from '@ngrx/store';
import { Patient } from 'app/shared/models/patient.model';

export const fetchPatients = createAction('[Patients] Fetch');
export const patientsFetched = createAction('[Patients] Fetched', props<{patients: Patient[]}>());
export const patientsFavor = createAction('[Patients] Favor', props<{patientId: string}>());
export const patientsUnfavor = createAction('[Patients] Unfavor', props<{patientId: string}>());
