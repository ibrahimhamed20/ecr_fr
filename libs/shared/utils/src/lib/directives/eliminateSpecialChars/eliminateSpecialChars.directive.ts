import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEliminateSpecialChars]',
  standalone: true
})
export class EliminateSpecialCharsDirective {

  private specialCharsRegex: RegExp = /[!@#$%^&*(),.?":{}|<>]/g;  // Define special characters

  constructor() {}

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    let currentValue = input.value;

    // Replace special characters with an empty string
    input.value = currentValue.replace(this.specialCharsRegex, '');

    // Manually trigger input event to ensure ngModel updates
    input.dispatchEvent(new Event('input'));
  }
}
