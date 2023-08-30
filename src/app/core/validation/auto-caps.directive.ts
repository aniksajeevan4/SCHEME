import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[autoCaps]'
  })
  export class AutoCapsDirective {
    constructor(private el: ElementRef, private control: NgControl) {}
  
    @HostListener('keyup')
    onKeyUp() {
    //   const inputValue = this.el.nativeElement.value;
    //   const result = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    //   this.control.control?.setValue(result);

    //capslock all input value
    const inputValue = this.el.nativeElement.value;
    const result = inputValue.toUpperCase();
    this.control.control?.setValue(result);
    }
  }