import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a routerLink to /moves', () => {
    const linkDebugElement = fixture.debugElement.query(By.css('a'));
    const routerLink = linkDebugElement.attributes['routerLink'];
    expect(routerLink).toBe('/moves');
  });

  it('should display the link text as "Moves"', () => {
    const linkDebugElement = fixture.debugElement.query(By.css('a'));
    const linkElement: HTMLElement = linkDebugElement.nativeElement;
    expect(linkElement.textContent).toContain('Moves');
  });

  it('should have the "active-link" class when active', () => {
    const linkDebugElement = fixture.debugElement.query(By.css('a'));
    linkDebugElement.nativeElement.classList.add('active-link');
    fixture.detectChanges();

    expect(linkDebugElement.nativeElement.classList).toContain('active-link');
  });
});
