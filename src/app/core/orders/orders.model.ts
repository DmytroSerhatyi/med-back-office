import { Order } from "app/shared/models/order.model";
import { AppState } from "../core.module";

export interface OrdersState {
  orders: Order[];
  favoriteOrders: string[];
}

export interface OrdersAppState extends AppState {
  orders: OrdersState;
}
