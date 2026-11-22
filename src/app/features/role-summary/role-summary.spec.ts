import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { ROLES } from '../../data/roles';
import { GameSession } from '../game-setup/game-session';
import { RoleSummary } from './role-summary';

describe('RoleSummary', () => {
  it('résume chaque équipe sans assimiler les rôles ambigus ou solitaires au village', async () => {
    await TestBed.configureTestingModule({ imports: [RoleSummary], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    session.setDraft(5, [
      ROLES.find((role) => role.id === 'voyante')!,
      ROLES.find((role) => role.id === 'loup-garou')!,
      ROLES.find((role) => role.id === 'ange')!,
      ROLES.find((role) => role.id === 'chien-loup')!,
      ROLES.find((role) => role.id === 'simple-villageois')!,
    ]);
    const fixture = TestBed.createComponent(RoleSummary);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.team-village .team-totals').textContent).toContain('2 joueurs');
    expect(fixture.nativeElement.querySelector('.team-loup .team-totals').textContent).toContain('1 joueur');
    expect(fixture.nativeElement.querySelector('.team-solitaire .team-totals').textContent).toContain('1 joueur');
    expect(fixture.nativeElement.querySelector('.team-ambigu .team-totals').textContent).toContain('1 joueur');
  });

  it('attribue une carte une seule fois et enregistre le nom nettoyé', async () => {
    await TestBed.configureTestingModule({ imports: [RoleSummary], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    session.setDraft(5, [ROLES.find((role) => role.id === 'voyante')!, ...Array(4).fill(ROLES[0])]);
    const fixture = TestBed.createComponent(RoleSummary);
    const summary = fixture.componentInstance;
    summary.continue();
    summary.chooseCard(0);
    summary.playerName.set('  Alice  ');
    summary.revealRole();
    fixture.detectChanges();
    expect(session.playerAssignments()[0]).toEqual({ name: 'Alice', role: session.roles()[0], cardIndex: 0 });
    expect(summary.cards()).toHaveLength(4);
    expect(summary.selectedCard()).toBeNull();
    expect(summary.revealedAssignment()?.name).toBe('Alice');
  });

  it('attend la fermeture de la dernière révélation avant d’afficher la fin de distribution', async () => {
    await TestBed.configureTestingModule({ imports: [RoleSummary], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    session.setDraft(2, [
      ROLES.find((role) => role.id === 'voyante')!,
      ROLES.find((role) => role.id === 'simple-villageois')!,
    ]);
    const fixture = TestBed.createComponent(RoleSummary);
    const summary = fixture.componentInstance;
    summary.continue();

    for (const name of ['Alice', 'Bob']) {
      summary.chooseCard(summary.cards()[0].index);
      summary.playerName.set(name);
      summary.revealRole();
      fixture.detectChanges();
      if (name === 'Alice') {
        summary.closeReveal();
        fixture.detectChanges();
      }
    }

    expect(summary.distributionComplete()).toBe(true);
    expect(fixture.nativeElement.querySelector('#role-reveal-title')?.textContent).toContain('Bob, tu es');
    expect(fixture.nativeElement.querySelector('#completion-title')).toBeNull();

    summary.closeReveal();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#completion-title')?.textContent).toContain('La partie va commencer');
  });

  it('mélange les équipes au lancement de la distribution sans perdre de cartes', async () => {
    await TestBed.configureTestingModule({ imports: [RoleSummary], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    const roles = [
      ...Array(4).fill(ROLES.find((role) => role.id === 'simple-villageois')!),
      ...Array(2).fill(ROLES.find((role) => role.id === 'loup-garou')!),
      ROLES.find((role) => role.id === 'ange')!,
      ROLES.find((role) => role.id === 'chien-loup')!,
    ];
    session.setDraft(8, roles);
    const summary = TestBed.createComponent(RoleSummary).componentInstance;

    summary.continue();

    expect(session.roles()).toHaveLength(roles.length);
    expect(session.roles().every((role, index) => index === 0 || role.team !== session.roles()[index - 1].team)).toBe(true);
  });

  it('ignore les indices invalides et ne révèle pas un nom vide', async () => {
    await TestBed.configureTestingModule({ imports: [RoleSummary], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    session.setDraft(5, [ROLES[0]]);
    const summary = TestBed.createComponent(RoleSummary).componentInstance;
    summary.chooseCard(5);
    summary.playerName.set('   ');
    summary.revealRole();
    expect(session.playerAssignments()).toEqual([]);
    expect(summary.revealedAssignment()).toBeNull();
  });

  it('redirige vers le paramétrage si aucune composition ne se trouve en session', async () => {
    await TestBed.configureTestingModule({ imports: [RoleSummary], providers: [provideRouter([])] }).compileComponents();
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(RoleSummary);
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith(['/game-setup']);
  });
});
