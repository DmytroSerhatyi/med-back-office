import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "st-big-input",
  templateUrl: "./big-input.component.html",
  styleUrls: ["./big-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BigInputComponent {
  @Input()
  placeholder: string;

  @Input()
  value = "";
  @Input()
  disabled = false;

  @Output()
  changed: EventEmitter<string> = new EventEmitter<string>();

  hasFocus = false;

  onChange(): void {
    this.changed.emit(this.value);
  }
}
