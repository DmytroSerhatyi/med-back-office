import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";

import { OrdersComponent } from "./orders/orders.component";
import { OrdersRoutingModule } from "./orders-routing.module";

@NgModule({
  declarations: [OrdersComponent],
  imports: [CommonModule, SharedModule, OrdersRoutingModule]
})
export class OrdersModule {}
