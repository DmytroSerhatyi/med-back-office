import { createSelector } from "@ngrx/store";
import { OrdersState } from "./orders.model";
import { selectOrdersState } from "../core.state";

export const selectOrders = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.orders
);

export const selectFavoriteOrders = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.favoriteOrders
);
