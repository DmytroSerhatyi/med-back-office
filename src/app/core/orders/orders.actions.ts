import { createAction, props } from "@ngrx/store";
import { Order } from "app/shared/models/order.model";

export const fetchOrders = createAction("[Orders] Fetch");
export const ordersFetched = createAction("[Orders] Fetched", props<{orders: Order[]}>());
export const ordersFavor = createAction("[Orders] Favor", props<{orderId: string}>());
export const ordersUnfavor = createAction("[Orders] Unfavor", props<{orderId: string}>());
