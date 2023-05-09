import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, tap, withLatestFrom } from "rxjs/operators";
import { LocalStorageService } from "../local-storage/local-storage.service";

import { HttpService } from "app/core/http/http.service";
import { fetchPatients, patientsFavor, patientsFetched, patientsUnfavor } from "./patients.actions";
import { selectFavoritePatients } from "./patients.selector";
import { PatientsAppState } from "./patients.model";
import { GetPatientsResponse } from "app/shared/models/patient.model";

export const FAVORITE_PATIENTS_STATE_PATH_KEY = "PATIENTS.FAVORITE-PATIENTS";

@Injectable()
export class PatientsEffects {
  fetchPatients = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchPatients),
      exhaustMap(() => this.httpService.get<GetPatientsResponse>("https://api.mocki.io/v2/51597ef3")
        .pipe(
          map(response => {
            return patientsFetched({ patients: response.patient });
          })
        )
      )
    )
  );

  persistFavorites = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          patientsFavor,
          patientsUnfavor
        ),
        withLatestFrom(this.store.pipe(select(selectFavoritePatients))),
        tap(([_action, favoritePatients]) =>
          this.localStorageService.setItem(FAVORITE_PATIENTS_STATE_PATH_KEY, favoritePatients)
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<PatientsAppState>,
    private httpService: HttpService,
    private localStorageService: LocalStorageService
  ) {}
}
