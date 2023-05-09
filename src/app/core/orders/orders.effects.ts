import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, tap, withLatestFrom } from "rxjs/operators";
import { fetchOrders, ordersFavor, ordersFetched, ordersUnfavor } from "./orders.actions";
import { selectFavoriteOrders } from "./orders.selector";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { OrdersAppState } from "./orders.model";
import { HttpService } from "app/core/http/http.service";
import { GetOrdersResponse } from "app/shared/models/order.model";

export const FAVORITE_ORDERS_STATE_PATH_KEY = "ORDERS.FAVORITE-ORDERS";

@Injectable()
export class OrdersEffects {
  fetchOrders = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchOrders),
      exhaustMap(() => this.httpService.get<GetOrdersResponse>("https://api.mocki.io/v2/79fb05cb")
        .pipe(
          map(response => {
            return ordersFetched({ orders: response.order });
          })
        )
      )
    )
  );

  persistFavorites = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ordersFavor,
          ordersUnfavor
        ),
        withLatestFrom(this.store.pipe(select(selectFavoriteOrders))),
        tap(([_action, favoriteOrders]) =>
          this.localStorageService.setItem(FAVORITE_ORDERS_STATE_PATH_KEY, favoriteOrders)
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<OrdersAppState>,
    private httpService: HttpService,
    private localStorageService: LocalStorageService
  ) {}
}
