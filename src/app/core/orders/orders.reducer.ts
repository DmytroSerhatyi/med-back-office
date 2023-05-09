import { Action, createReducer, on } from "@ngrx/store";
import { OrdersState } from "./orders.model";
import { ordersFavor, ordersFetched, ordersUnfavor } from "./orders.actions";

export const initialState: OrdersState = {
  orders: [],
  favoriteOrders: []
};

const reducer = createReducer(
  initialState,
  on(ordersFetched, (state, { orders }) => ({ ...state, orders: [...orders] })),
  on(ordersFavor, (state, { orderId }) => ({ ...state, favoriteOrders: [...state.favoriteOrders, orderId] })),
  on(ordersUnfavor, (state, { orderId }) => ({ ...state, favoriteOrders: state.favoriteOrders.filter(id => id !== orderId) }))
);

export function ordersReducer(
  state: OrdersState | undefined,
  action: Action
): OrdersState {
  return reducer(state, action);
}
