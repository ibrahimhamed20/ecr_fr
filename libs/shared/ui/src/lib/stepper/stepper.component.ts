import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'shared-ui-stepper',
  standalone: true,
  imports: [CommonModule, StepperModule, ButtonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  @Input() steps: { id: number, label: string, template: TemplateRef<any> }[] = [];
  @Input() activeStep: number = 0;
  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>(true);
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>(true);
}
