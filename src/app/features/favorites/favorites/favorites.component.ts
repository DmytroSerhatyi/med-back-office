import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from "@angular/core";
import {
  AppState,
  ROUTE_ANIMATIONS_ELEMENTS,
  selectFavoriteOrders,
  selectOrders,
  selectPatients,
  selectFavoritePatients
} from "../../../core/core.module";
import { Store, select } from "@ngrx/store";
import { BehaviorSubject, Subject, combineLatest } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";
import { fetchOrders, ordersUnfavor } from "../../../core/orders/orders.actions";
import { fetchPatients, patientsUnfavor } from "../../../core/patients/patients.actions";
import { FavoriteType, FavoriteView } from "app/shared/models/favorite.model";

enum FavoritesColumnName {
  type = "type",
  name = "name",
  remove = "remove"
}

@Component({
  selector: "st-favorites",
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.scss", "../../styles/table.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  columnNames = FavoritesColumnName;
  displayedColumns = [
    FavoritesColumnName.type,
    FavoritesColumnName.name,
    FavoritesColumnName.remove
  ];
  isFetching$: Subject<boolean> = new Subject<boolean>();
  favoriteViews$: BehaviorSubject<FavoriteView[]> = new BehaviorSubject<FavoriteView[]>([]);

  private filter$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const patients$ = this.store.pipe(select(selectPatients));
    const orders$ = this.store.pipe(select(selectOrders));
    const favoritePatientIds$ = this.store.pipe(select(selectFavoritePatients));
    const favoriteOrderIds$ = this.store.pipe(select(selectFavoriteOrders));

    combineLatest([
      patients$,
      orders$,
      favoritePatientIds$,
      favoriteOrderIds$,
      this.filter$,
    ])
      .pipe(
        tap(() => this.isFetching$.next(false)),
        filter(([orders, patients]) => !!orders && !!patients),
        map(([patients, orders, favoritePatientIds, favoriteOrderIds, filterValue]) => {
          const favoriteOrdersSet = new Set<string>(favoriteOrderIds);
          const favoritePatientsSet = new Set<string>(favoritePatientIds);

          const favoritePatients: FavoriteView[] = patients
            .filter(patient => favoritePatientsSet.has(patient.defaultId) && this.filterFavoriteByName(patient.fullName, filterValue))
            .map(patient => {
              return {
                id: patient.defaultId,
                name: patient.fullName,
                type: FavoriteType.patient,
                typeKey: "stms.favorites.table.columns.type-patient"
              }
            });

          const favoriteOrders: FavoriteView[] = orders
            .filter(order => favoriteOrdersSet.has(order.identifier) && this.filterFavoriteByName(order.orderName, filterValue))
            .map(order => {
              return {
                id: order.identifier,
                name: order.orderName,
                type: FavoriteType.order,
                typeKey: "stms.favorites.table.columns.type-order"
              }
            });

          return [...favoritePatients, ... favoriteOrders];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(favoriteViews => {
        this.favoriteViews$.next(favoriteViews);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFavorites(): void {
    this.isFetching$.next(true);
    this.store.dispatch(fetchPatients());
    this.store.dispatch(fetchOrders());
  }

  unfavorite(favorite: FavoriteView): void {
    const favoriterId = favorite.id;

    switch (favorite.type) {
      case FavoriteType.patient:
        this.store.dispatch(patientsUnfavor({ patientId: favoriterId }));
        break;
      case FavoriteType.order:
        this.store.dispatch(ordersUnfavor({ orderId: favoriterId }));
        break;
    }
  }

  onFilter(filterValue: string): void {
    this.filter$.next(filterValue.toLowerCase());
  }

  private filterFavoriteByName(name: string, filterValue: string): boolean {
    if (!filterValue) {
      return true;
    }

    return name.toLowerCase().includes(filterValue);
  }
}
