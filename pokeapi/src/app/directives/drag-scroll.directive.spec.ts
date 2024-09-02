import { DragScrollDirective } from './drag-scroll.directive';
import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('DragScrollDirective', () => {
  let directive: DragScrollDirective;
  let elementRefMock: ElementRef;
  let renderer2Mock: Renderer2;

  beforeEach(() => {
    elementRefMock = {
      nativeElement: document.createElement('div')
    };

    renderer2Mock = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);

    directive = new DragScrollDirective(elementRefMock, renderer2Mock);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should remove active class on mouseup', () => {
    directive.onMouseUp();

    expect(directive['isDown']).toBeFalse();
    expect(renderer2Mock.removeClass).toHaveBeenCalledWith(elementRefMock.nativeElement, 'active');
  });

  it('should remove active class on mouseleave', () => {
    directive.onMouseLeave();

    expect(directive['isDown']).toBeFalse();
    expect(renderer2Mock.removeClass).toHaveBeenCalledWith(elementRefMock.nativeElement, 'active');
  });
});
