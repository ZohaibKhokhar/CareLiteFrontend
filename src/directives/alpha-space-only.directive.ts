import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaSpaceOnly]',
  standalone: true
})
export class AlphaSpaceOnlyDirective {
  private regex = /^[a-zA-Z ]*$/;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(event.key)) return;

    if (!this.regex.test(event.key)) {
      event.preventDefault();
    }
  }
}
