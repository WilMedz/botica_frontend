import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';  // ← era App
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {  // ← era App
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],  // ← agregar RouterTestingModule
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);  // ← era App
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show breadcrumb', async () => {  // ← era 'should render title'
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.breadcrumb')).toBeTruthy();  // ← era h1 con 'Hello, BoticaFrontend'
  });
});