import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";

import { MatTableModule } from "@angular/material/table";
import { FavoritesComponent } from "./favorites/favorites.component";
import { FavoritesRoutingModule } from "./favorites-routing.module";

@NgModule({
  declarations: [FavoritesComponent],
  imports: [
    CommonModule,
    SharedModule,
    FavoritesRoutingModule,
    MatTableModule,
  ]
})
export class FavoritesModule {}
