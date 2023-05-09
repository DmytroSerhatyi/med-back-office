import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "st-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {}
