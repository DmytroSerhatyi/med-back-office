import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from "@angular/core";

import { AppState, ROUTE_ANIMATIONS_ELEMENTS, selectFavoritePatients, selectPatients } from "../../../core/core.module";
import { Store, select } from "@ngrx/store";
import { fetchPatients, patientsFavor, patientsUnfavor } from "app/core/patients/patients.actions";
import { PatientAge, PatientView } from "app/shared/models/patient.model";
import { BehaviorSubject, Subject, combineLatest } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";

enum PatientsColumnName {
  firstName = 'first-name',
  lastName = 'last-name',
  birthDate = 'birth-date',
  age = 'age',
  favorite = 'favorite',
}

@Component({
  selector: "st-patients",
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.scss", "../../styles/table.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientsComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  columnNames = PatientsColumnName;
  displayedColumns = [
    PatientsColumnName.favorite,
    PatientsColumnName.firstName,
    PatientsColumnName.lastName,
    PatientsColumnName.birthDate,
    PatientsColumnName.age
  ];
  isFetching$: Subject<boolean> = new Subject<boolean>();
  patientViews$: BehaviorSubject<PatientView[]> =  new BehaviorSubject<PatientView[]>([]);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const patients$ = this.store.pipe(select(selectPatients));
    const favorites$ = this.store.pipe(select(selectFavoritePatients));

    combineLatest([patients$, favorites$])
      .pipe(
        tap(() => this.isFetching$.next(false)),
        filter(([patients]) => !!patients),
        map(([patients, favorites]) => {
          const favoritesSet = new Set<string>(favorites);

          return patients.map(patient => {
              return {
                id: patient.defaultId,
                firstName: patient.firstName,
                lastName: patient.lastName,
                birthDate: patient.birthDate.formattedDate,
                age: this.calculateAge(patient.birthDate.formattedDate),
                isFavorite: favoritesSet.has(patient.defaultId)
              };
            });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(patientsViews => {
        this.patientViews$.next(patientsViews);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPatients(): void {
    this.isFetching$.next(true);
    this.store.dispatch(fetchPatients());
  }

  toggleFavorite(order: PatientView): void {
    const patientId = order.id;
    this.store.dispatch(order.isFavorite ? patientsUnfavor({ patientId }) : patientsFavor({ patientId }));
  }

  private calculateAge(formattedBirthDate: string): PatientAge {
    if (!formattedBirthDate) {
      return 'N/A';
    }

    const currentDate = new Date();
    const birthDate = new Date(formattedBirthDate);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }

    return age;
  }
}
