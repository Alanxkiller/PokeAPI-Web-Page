import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDragScroll]'
})
export class DragScrollDirective {
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    this.renderer.addClass(this.el.nativeElement, 'active');
    this.startX = event.pageX - this.el.nativeElement.offsetLeft;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isDown = false;
    this.renderer.removeClass(this.el.nativeElement, 'active');
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.isDown = false;
    this.renderer.removeClass(this.el.nativeElement, 'active');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return;
    event.preventDefault();
    const x = event.pageX - this.el.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.el.nativeElement.scrollLeft = this.scrollLeft - walk;
  }
}