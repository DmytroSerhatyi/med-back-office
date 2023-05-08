import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";

import { PatientsRoutingModule } from "./patients-routing.module";
import { PatientsComponent } from "./patients/patients.component";
import { MatTableModule } from "@angular/material/table";

@NgModule({
  declarations: [PatientsComponent],
  imports: [CommonModule, SharedModule, PatientsRoutingModule, MatTableModule],
  providers: []
})
export class PatientsModule {}
