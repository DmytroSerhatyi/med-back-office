import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { AppState, ROUTE_ANIMATIONS_ELEMENTS, selectFavoriteOrders, selectOrders } from "../../../core/core.module";
import { OrderView } from "app/shared/models/order.model";
import { Store, select } from "@ngrx/store";
import { BehaviorSubject, Subject, combineLatest } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { fetchOrders, ordersFavor, ordersUnfavor } from "../../../core/orders/orders.actions";


enum OrdersColumnName {
  name = 'name',
  medicalCenter = 'medical-center',
  physician = 'physician',
  date = 'date',
  favorite = 'favorite',
}

@Component({
  selector: "st-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss", "../../styles/table.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  orders: OrderView[];
  columnNames = OrdersColumnName;
  displayedColumns = [
    OrdersColumnName.favorite,
    OrdersColumnName.name,
    OrdersColumnName.medicalCenter,
    OrdersColumnName.physician,
    OrdersColumnName.date
  ];
  isFetching$: Subject<boolean> = new Subject<boolean>();
  orderViews$: BehaviorSubject<OrderView[]> =  new BehaviorSubject<OrderView[]>([]);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const orders$ = this.store.pipe(select(selectOrders));
    const favorites$ = this.store.pipe(select(selectFavoriteOrders));

    combineLatest([orders$, favorites$])
      .pipe(
        tap(() => this.isFetching$.next(false)),
        filter(([orders]) => !!orders),
        map(([orders, favorites]) => {
          const favoritesSet = new Set<string>(favorites);

          return orders.map(order => {
              return {
                id: order.identifier,
                name: order.orderName,
                medicalCenter: order.facility.name,
                physician: order.physician.name,
                date: order.creationDate.formattedDate,
                isFavorite: favoritesSet.has(order.identifier)
              };
            });
        })
      )
      .subscribe(ordersViews => {
        this.orderViews$.next(ordersViews);
      });
  }

  getOrders(): void {
    this.isFetching$.next(true);
    this.store.dispatch(fetchOrders());
  }

  toggleFavorite(order: OrderView): void {
    const orderId = order.id;
    this.store.dispatch(order.isFavorite ? ordersUnfavor({ orderId }) : ordersFavor({ orderId }));
  }
}
