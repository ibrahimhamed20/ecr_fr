import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true
})
export class OnlyNumbersDirective {

  constructor() {}

  // Handle keyboard input, allow only numbers, backspace, and navigation keys
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'
    ]; // Add other control keys if needed

    // Allow only digits (0-9), control keys, and numpad digits
    if (
      !((event.key >= '0' && event.key <= '9') ||
        (event.key >= 'Numpad0' && event.key <= 'Numpad9') ||
        allowedKeys.includes(event.key))
    ) {
      event.preventDefault();
    }
  }

  // Handle paste event, ensuring only numbers are pasted
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    const numericText = pastedText.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    // Prevent the default paste if non-numeric characters are found
    if (numericText !== pastedText) {
      event.preventDefault();

      const target = event.target as HTMLInputElement;
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const value = target.value;

      // Update the input value with numeric text
      target.value = value.slice(0, start) + numericText + value.slice(end);
      target.setSelectionRange(start + numericText.length, start + numericText.length);
    }
  }
}
