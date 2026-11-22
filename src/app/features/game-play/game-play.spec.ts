import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ROLES } from '../../data/roles';
import { GameSession } from '../game-setup/game-session';
import { GamePlay } from './game-play';

describe('GamePlay', () => {
  it('garde en vie la victime infectée et la fait rejoindre les loups les nuits suivantes', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    const infectFather = ROLES.find((role) => role.id === 'infect-pere-des-loups')!;
    const wolf = ROLES.find((role) => role.id === 'loup-garou')!;
    const seer = ROLES.find((role) => role.id === 'voyante')!;
    const villager = ROLES.find((role) => role.id === 'simple-villageois')!;
    const assignments = [infectFather, wolf, seer, ...Array(5).fill(villager)]
      .map((role, cardIndex) => ({ name: `Joueur ${cardIndex + 1}`, role, cardIndex }));
    session.setDraft(assignments.length, assignments.map(({ role }) => role));
    session.setPlayerAssignments(assignments);
    const fixture = TestBed.createComponent(GamePlay);
    const game = fixture.componentInstance;

    game.startNight();
    game.openCall('loups');
    game.toggleTarget('Joueur 3');
    game.confirmCall();
    game.openCall('infect-pere-des-loups');
    game.infectVictim();
    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();

    expect(game.aliveNames()).toContain('Joueur 3');
    expect(game.roleFor('Joueur 3').id).toBe('loup-garou');
    expect(game.dayDeaths()).not.toContain('Joueur 3');

    game.beginNextNight();
    game.startNight();
    expect(game.infectedDeathsTonight()).not.toContain('Joueur 3');
    expect(game.calls().some((call) => call.id === 'loups')).toBe(true);

    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();
    expect(game.aliveNames()).toContain('Joueur 3');
  });
});
