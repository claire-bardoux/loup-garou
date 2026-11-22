import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { GameSetup } from './game-setup';
import { GameSession } from './game-session';

describe('GameSetup', () => {
  it('génère une composition bornée, permet le changement de niveau et la sélection', async () => {
    await TestBed.configureTestingModule({ imports: [GameSetup], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(GameSetup);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.composition().length).toBe(13);
    component.decreasePlayers();
    expect(component.composition().length).toBe(12);
    component.setStyle('decouverte');
    expect(component.style()).toBe('decouverte');
    component.setStyle('invalid');
    expect(component.style()).toBe('decouverte');
    component.chooseComposition();
    fixture.detectChanges();
    expect(TestBed.inject(GameSession).compositionChosen()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Composition choisie');
  });

  it('respecte les limites de joueurs', async () => {
    await TestBed.configureTestingModule({ imports: [GameSetup], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(GameSetup);
    const component = fixture.componentInstance;
    for (let i = 0; i < 30; i++) component.decreasePlayers();
    expect(component.playerCount()).toBe(5);
    for (let i = 0; i < 30; i++) component.increasePlayers();
    expect(component.playerCount()).toBe(24);
  });
});
