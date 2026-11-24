import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ROLES } from '../../data/roles';
import { GameSession } from '../game-setup/game-session';
import { GamePlay } from './game-play';

describe('GamePlay', () => {
  function createGame(roleIds: string[], reserveRoleIds: string[] = []): GamePlay {
    const session = TestBed.inject(GameSession);
    const assignments = roleIds.map((id, cardIndex) => ({
      name: `Joueur ${cardIndex + 1}`,
      role: ROLES.find((role) => role.id === id)!,
      cardIndex,
    }));
    session.setDraft(assignments.length, assignments.map(({ role }) => role), reserveRoleIds.map((id) => ROLES.find((role) => role.id === id)!));
    session.setPlayerAssignments(assignments);
    const game = TestBed.createComponent(GamePlay).componentInstance;
    game.nightNumber.set(2);
    return game;
  }

  function voteFor(game: GamePlay, target: string): void {
    game.goToVillageVote();
    for (let ballot = 0; ballot < game.aliveNames().length; ballot++) game.recordVillageVote(target);
    game.finishVillageVote();
  }

  it('propose à la Servante le rôle de la personne éliminée par le village avant son élimination', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', 'loup-garou', 'loup-garou', 'sorciere', 'voyante', ...Array(4).fill('simple-villageois')]);

    voteFor(game, 'Joueur 4');

    expect(game.phase()).toBe('servante-choice');
    expect(game.pendingServante()).toBe('Joueur 1');
    expect(game.aliveNames()).toContain('Joueur 4');

    game.takeServanteRole();

    expect(game.roleFor('Joueur 1').id).toBe('sorciere');
    expect(game.aliveNames()).not.toContain('Joueur 4');
    expect(game.witchHealUsed()).toBe(false);
    expect(game.witchPoisonUsed()).toBe(false);
  });

  it('ne propose pas la Servante sur une victime des loups', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', 'loup-garou', 'loup-garou', 'voyante', ...Array(5).fill('simple-villageois')]);

    game.startNight();
    game.openCall('loups');
    game.toggleTarget('Joueur 5');
    game.confirmCall();
    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();

    expect(game.phase()).toBe('morning');
    expect(game.pendingServante()).toBeNull();
    expect(game.aliveNames()).not.toContain('Joueur 5');
  });

  it('empêche toute mort pendant la première nuit et le premier vote, puis reprend à la deuxième nuit', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['loup-garou', 'loup-garou', 'sorciere', 'voyante', ...Array(5).fill('simple-villageois')]);
    game.nightNumber.set(1);

    game.startNight();
    game.openCall('loups');
    game.toggleTarget('Joueur 5');
    game.confirmCall();
    game.openCall('sorciere');
    game.enterWitchKillMode();
    game.toggleTarget('Joueur 6');
    game.confirmCall();
    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();

    expect(game.dayDeaths()).toEqual([]);
    expect(game.aliveNames()).toHaveLength(9);
    voteFor(game, 'Joueur 7');
    expect(game.aliveNames()).toHaveLength(9);
    expect(game.phase()).toBe('result');
    expect(game.resultMessage()).toContain('Première manche sans élimination');

    game.beginNextNight();
    expect(game.nightNumber()).toBe(2);
    game.startNight();
    game.openCall('loups');
    game.toggleTarget('Joueur 5');
    game.confirmCall();
    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();
    expect(game.aliveNames()).not.toContain('Joueur 5');
  });

  it('garde le pouvoir de l’Ange après le vote protégé et lui permet de gagner à la manche suivante', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['ange', 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')]);
    game.nightNumber.set(1);

    voteFor(game, 'Joueur 1');

    expect(game.aliveNames()).toContain('Joueur 1');
    expect(game.roleFor('Joueur 1').id).toBe('ange');
    expect(game.firstVillageVoteDone()).toBe(false);

    game.beginNextNight();
    voteFor(game, 'Joueur 1');

    expect(game.phase()).toBe('finished');
    expect(game.winnerMessage()).toContain('L’Ange remporte la partie');
  });

  it('permet au MJ d’ouvrir le récapitulatif des rôles pendant un appel nocturne', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    const roles = ['voyante', 'loup-garou', 'simple-villageois'].map((id) => ROLES.find((role) => role.id === id)!);
    const assignments = roles.map((role, cardIndex) => ({ name: `Joueur ${cardIndex + 1}`, role, cardIndex }));
    session.setDraft(assignments.length, roles);
    session.setPlayerAssignments(assignments);
    const fixture = TestBed.createComponent(GamePlay);
    const game = fixture.componentInstance;
    game.startNight();
    game.openCall('voyante');
    fixture.detectChanges();

    const rosterButton = [...fixture.nativeElement.querySelectorAll('button')]
      .find((button: HTMLButtonElement) => button.textContent?.trim() === 'Voir les rôles de la partie') as HTMLButtonElement | undefined;
    expect(rosterButton).toBeDefined();
    rosterButton!.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#role-roster-title')?.textContent).toContain('Rôles de la partie');
    expect(fixture.nativeElement.textContent).toContain('Joueur 1');
    expect(fixture.nativeElement.textContent).toContain('Voyante');
    expect(fixture.nativeElement.textContent).toContain('Joueur 2');
    expect(fixture.nativeElement.textContent).toContain('Loup-Garou');
  });

  it('permet à la Servante de refuser puis de choisir lors d’un vote ultérieur', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', 'loup-garou', 'loup-garou', 'voyante', ...Array(5).fill('simple-villageois')]);

    voteFor(game, 'Joueur 5');
    expect(game.phase()).toBe('servante-choice');
    game.declineServanteRole();
    expect(game.aliveNames()).not.toContain('Joueur 5');
    expect(game.phase()).toBe('result');

    game.beginNextNight();
    game.startNight();
    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();
    voteFor(game, 'Joueur 6');

    expect(game.phase()).toBe('servante-choice');
    expect(game.eliminatedPlayerName()).toBe('Joueur 6');
  });

  it.each([
    ['voleur', 'voleur'],
    ['enfant-sauvage', 'enfant-sauvage'],
    ['chien-loup', 'chien-loup'],
    ['cupidon', 'cupidon'],
    ['juge-begue', 'juge-begue'],
    ['abominable-sectaire', 'abominable-sectaire'],
    ['deux-soeurs', 'deux-soeurs'],
    ['trois-freres', 'trois-freres'],
  ])('rappelle le pouvoir de première nuit récupéré (%s)', async (roleId, callId) => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', roleId, 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')]);

    voteFor(game, 'Joueur 2');
    game.takeServanteRole();
    game.beginNextNight();
    game.startNight();

    const call = game.calls().find(({ id }) => id === callId);
    expect(call).toBeDefined();
    expect(game.actorForCall(call!)).toBe('Joueur 1');
  });

  it('rend au Comédien récupéré ses trois nuits, même si le début de partie est passé', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', 'comedien', 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')], ['voyante']);
    game.nightNumber.set(4);

    voteFor(game, 'Joueur 2');
    game.takeServanteRole();
    expect(game.comedianNightsPlayed()).toBe(0);
    game.beginNextNight();
    game.startNight();

    expect(game.calls().some(({ id }) => id === 'comedien')).toBe(true);
    game.openCall('comedien');
    game.selectReserve('voyante');
    game.confirmCall();
    expect(game.comedianNightsPlayed()).toBe(1);
  });

  it('réinitialise le pouvoir unique du Juge Bègue récupéré', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', 'juge-begue', 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')]);
    game.jesterSignSet.set(true);
    game.jesterSign.set('signe');
    game.secondVoteUsed.set(true);

    voteFor(game, 'Joueur 2');
    game.takeServanteRole();

    expect(game.jesterSignSet()).toBe(false);
    expect(game.jesterSign()).toBe('');
    expect(game.secondVoteUsed()).toBe(false);
    game.beginNextNight();
    game.startNight();
    expect(game.calls().some(({ id }) => id === 'juge-begue')).toBe(true);
  });

  it.each([
    ['renard', 'foxPowerLost'],
    ['infect-pere-des-loups', 'infectionUsed'],
  ])('réactive le pouvoir consommable récupéré (%s)', async (roleId, stateName) => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', roleId, 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')]);
    if (stateName === 'foxPowerLost') game.foxPowerLost.set(true);
    if (stateName === 'infectionUsed') game.infectionUsed.set(true);

    voteFor(game, 'Joueur 2');
    game.takeServanteRole();

    expect(stateName === 'foxPowerLost' ? game.foxPowerLost() : game.infectionUsed()).toBe(false);
  });

  it('réactive le tir d’un Chasseur récupéré', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', 'chasseur', 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')]);
    game.hunterUsed.set(['Joueur 1']);

    voteFor(game, 'Joueur 2');
    game.takeServanteRole();

    expect(game.hunterUsed()).not.toContain('Joueur 1');
  });

  it('rappelle la capacité passive de la Petite Fille pendant l’appel des loups', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['servante-devouee', 'petite-fille', 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')]);

    voteFor(game, 'Joueur 2');
    game.takeServanteRole();
    game.beginNextNight();
    game.startNight();

    expect(game.calls().find(({ id }) => id === 'loups')?.prompt).toContain('La Petite Fille peut tenter de les observer');
  });

  it.each([
    ['Joueur 2', 'Joueur 4', 'Joueur 5', 'garde son pouvoir'],
    ['Joueur 4', 'Joueur 5', 'Joueur 6', 'perd son pouvoir'],
  ])('révèle avec un bouton si le Renard %s, %s, %s', async (first, second, third, expectedResult) => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    const roles = ['renard', 'loup-garou', 'loup-garou', ...Array(6).fill('simple-villageois')]
      .map((id) => ROLES.find((role) => role.id === id)!);
    const assignments = roles.map((role, cardIndex) => ({ name: `Joueur ${cardIndex + 1}`, role, cardIndex }));
    session.setDraft(assignments.length, roles);
    session.setPlayerAssignments(assignments);
    const fixture = TestBed.createComponent(GamePlay);
    const game = fixture.componentInstance;
    game.startNight();
    game.openCall('renard');
    game.toggleTarget(first);
    game.toggleTarget(second);
    game.toggleTarget(third);
    fixture.detectChanges();

    const revealButton = [...fixture.nativeElement.querySelectorAll('button')]
      .find((button: HTMLButtonElement) => button.textContent?.trim() === 'Révéler le résultat') as HTMLButtonElement | undefined;
    expect(revealButton).toBeDefined();
    revealButton!.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(expectedResult);
    expect(game.foxPowerLost()).toBe(false);
    expect(game.currentCall()?.id).toBe('renard');
    expect(game.calledIds()).not.toContain('renard');

    const nextRoleButton = [...fixture.nativeElement.querySelectorAll('button')]
      .find((button: HTMLButtonElement) => button.textContent?.trim() === 'Passer au rôle suivant') as HTMLButtonElement | undefined;
    expect(nextRoleButton).toBeDefined();
    nextRoleButton!.click();
    expect(game.calledIds()).toContain('renard');
    expect(game.foxPowerLost()).toBe(expectedResult === 'perd son pouvoir');
  });

  it('appelle l’Infect Père avant la Sorcière et permet de soigner la victime infectée', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const session = TestBed.inject(GameSession);
    const infectFather = ROLES.find((role) => role.id === 'infect-pere-des-loups')!;
    const wolf = ROLES.find((role) => role.id === 'loup-garou')!;
    const witch = ROLES.find((role) => role.id === 'sorciere')!;
    const seer = ROLES.find((role) => role.id === 'voyante')!;
    const villager = ROLES.find((role) => role.id === 'simple-villageois')!;
    const assignments = [infectFather, wolf, witch, seer, ...Array(5).fill(villager)]
      .map((role, cardIndex) => ({ name: `Joueur ${cardIndex + 1}`, role, cardIndex }));
    session.setDraft(assignments.length, assignments.map(({ role }) => role));
    session.setPlayerAssignments(assignments);
    const game = TestBed.createComponent(GamePlay).componentInstance;

    game.startNight();
    game.openCall('loups');
    game.toggleTarget('Joueur 5');
    game.confirmCall();

    const calls = game.calls().map((call) => call.id);
    expect(calls.indexOf('loups')).toBeLessThan(calls.indexOf('infect-pere-des-loups'));
    expect(calls.indexOf('infect-pere-des-loups')).toBeLessThan(calls.indexOf('sorciere'));

    game.openCall('infect-pere-des-loups');
    game.infectVictim();
    expect(game.victimInfected()).toBe(true);

    game.openCall('sorciere');
    game.markVictimSaved();
    game.doNothingAsWitch();

    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();
    expect(game.aliveNames()).toContain('Joueur 5');
    expect(game.roleFor('Joueur 5').id).toBe('simple-villageois');
    expect(game.dayDeaths()).not.toContain('Joueur 5');
  });

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
