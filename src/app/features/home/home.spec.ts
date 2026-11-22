import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';
import { provideRouter } from '@angular/router';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home], providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche l’icône du livre et les deux actions principales', () => {
    const libraryLink = fixture.nativeElement.querySelector('.library-link') as HTMLAnchorElement;
    const createButton = fixture.nativeElement.querySelector('.create-game-button') as HTMLAnchorElement;

    expect(libraryLink.querySelector('img')?.getAttribute('src')).toBe('/assets/images/open-book.png');
    expect(libraryLink.textContent).toContain('Bibliothèque de rôles');
    expect(createButton.textContent).toContain('Créer une partie');
    expect(createButton.textContent).not.toContain('→');
  });
});
