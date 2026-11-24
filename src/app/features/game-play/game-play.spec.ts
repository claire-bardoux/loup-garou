import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ROLES } from '../../data/roles';
import { GameSession } from '../game-setup/game-session';
import { GamePlay } from './game-play';

describe('GamePlay', () => {
  function createGameFixture(roleIds: string[], reserveRoleIds: string[] = []) {
    const session = TestBed.inject(GameSession);
    const assignments = roleIds.map((id, cardIndex) => ({
      name: `Joueur ${cardIndex + 1}`,
      role: ROLES.find((role) => role.id === id)!,
      cardIndex,
    }));
    session.setDraft(assignments.length, assignments.map(({ role }) => role), reserveRoleIds.map((id) => ROLES.find((role) => role.id === id)!));
    session.setPlayerAssignments(assignments);
    const fixture = TestBed.createComponent(GamePlay);
    fixture.componentInstance.nightNumber.set(2);
    return fixture;
  }

  function createGame(roleIds: string[], reserveRoleIds: string[] = []): GamePlay {
    return createGameFixture(roleIds, reserveRoleIds).componentInstance;
  }

  function voteFor(game: GamePlay, target: string): void {
    game.goToVillageVote();
    for (let ballot = 0; ballot < game.aliveNames().length; ballot++) game.recordVillageVote(target);
    game.finishVillageVote();
  }

  it('affiche le titre au pluriel et la carte du loup-garou pour l’appel collectif', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const fixture = createGameFixture(['loup-garou-blanc', 'simple-villageois', 'loup-garou']);
    const game = fixture.componentInstance;

    game.openCall('loups');
    fixture.detectChanges();

    const dialog = (fixture.nativeElement as HTMLElement).querySelector('[aria-labelledby="call-title-loups"]');
    expect(dialog?.querySelector('h2')?.textContent).toBe('Les loups se réveillent');
    expect(dialog?.querySelector('img')?.getAttribute('src')).toBe(ROLES.find(({ id }) => id === 'loup-garou')!.image);
    expect(game.calls().find(({ id }) => id === 'loup-garou-blanc')?.role.id).toBe('loup-garou-blanc');
  });

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

  it('fait gagner l’Ange si les loups le tuent lors du premier tour avec des morts', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['ange', 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')]);
    game.nightNumber.set(2);
    game.startNight();
    game.openCall('loups');
    game.toggleTarget('Joueur 1');
    game.confirmCall();
    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();

    expect(game.phase()).toBe('finished');
    expect(game.winnerMessage()).toContain('L’Ange remporte la partie');
  });

  it('déclenche le tir du Chasseur lorsqu’il est tué par les Loups-Garous', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['chasseur', 'loup-garou', 'loup-garou', ...Array(5).fill('simple-villageois')]);
    game.startNight();
    game.openCall('loups');
    game.toggleTarget('Joueur 1');
    game.confirmCall();
    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();

    expect(game.phase()).toBe('hunter-shot');
    expect(game.pendingHunter()).toBe('Joueur 1');
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
    ['Joueur 2', 'pourra réutiliser son pouvoir'],
    ['Joueur 8', 'perd son pouvoir'],
  ])('révèle le résultat du groupe central %s et le Renard %s', async (center, expectedResult) => {
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
    game.toggleTarget(center);
    const foxNeighbors = center === 'Joueur 2' ? ['Joueur 1', 'Joueur 3'] : ['Joueur 7', 'Joueur 1'];
    foxNeighbors.forEach((name) => game.toggleFoxNeighbor(name));
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
    expect(game.roleFor('Joueur 1').id).toBe('renard');
  });

  it('utilise les voisins indiqués par le MJ et reconnaît le Loup-Garou Blanc', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['renard', 'simple-villageois', 'simple-villageois', 'loup-garou-blanc', 'simple-villageois', 'simple-villageois']);
    game.aliveNames.set(game.aliveNames().filter((name) => name !== 'Joueur 3'));
    game.startNight();
    game.openCall('renard');
    game.toggleTarget('Joueur 2');
    game.toggleFoxNeighbor('Joueur 1');
    game.toggleFoxNeighbor('Joueur 4');

    expect(game.foxGroupNames()).toEqual(['Joueur 1', 'Joueur 2', 'Joueur 4']);
    game.revealFoxResult();
    expect(game.foxFoundWolf()).toBe(true);
  });

  it('permet au Loup-Garou Blanc de viser n’importe quel joueur vivant sauf lui-même', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['loup-garou-blanc', 'loup-garou', 'simple-villageois', 'simple-villageois']);
    game.startNight();
    game.openCall('loup-garou-blanc');

    expect(game.targetNames()).toContain('Joueur 2');
    expect(game.targetNames()).toContain('Joueur 3');
    expect(game.targetNames()).not.toContain('Joueur 1');

    game.toggleTarget('Joueur 3');
    game.confirmCall();
    expect(game.wolfVictims()).toContain('Joueur 3');
  });

  it('détecte un joueur devenu loup par changement de camp', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['renard', 'simple-villageois', 'simple-villageois', 'simple-villageois', 'simple-villageois']);
    game.roleOverrides.set({ 'Joueur 3': ROLES.find((role) => role.id === 'loup-garou')! });
    game.startNight();
    game.openCall('renard');
    game.toggleTarget('Joueur 2');
    game.toggleFoxNeighbor('Joueur 1');
    game.toggleFoxNeighbor('Joueur 3');
    game.revealFoxResult();

    expect(game.foxGroupNames()).toEqual(['Joueur 1', 'Joueur 2', 'Joueur 3']);
    expect(game.foxFoundWolf()).toBe(true);
  });

  it('appelle le Renard avant les Loups et le laisse passer une nuit sans perdre son pouvoir', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['renard', 'loup-garou', 'simple-villageois', 'simple-villageois']);
    game.startNight();

    const calls = game.calls().map((call) => call.id);
    expect(calls.indexOf('renard')).toBeLessThan(calls.indexOf('loups'));

    game.openCall('renard');
    game.skipFox();
    expect(game.calledIds()).toContain('renard');
    expect(game.foxPowerLost()).toBe(false);
    expect(game.roleFor('Joueur 1').id).toBe('renard');

    game.beginNextNight();
    game.startNight();
    expect(game.calls().some((call) => call.id === 'renard')).toBe(true);
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
    expect(game.wolfAlignedNames()).toContain('Joueur 3');
    expect(game.dayDeaths()).not.toContain('Joueur 3');

    game.beginNextNight();
    game.startNight();
    expect(game.infectedDeathsTonight()).not.toContain('Joueur 3');
    expect(game.calls().some((call) => call.id === 'loups')).toBe(true);
    expect(game.calls().some((call) => call.id === 'voyante' && game.actorForCall(call) === 'Joueur 3')).toBe(true);

    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();
    expect(game.aliveNames()).toContain('Joueur 3');
  });

  it('autorise Cupidon à se choisir comme l’un des amoureux', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['cupidon', 'simple-villageois', 'loup-garou']);
    game.nightNumber.set(1);
    game.startNight();
    game.openCall('cupidon');

    expect(game.targetNames()).toContain('Joueur 1');
    game.toggleTarget('Joueur 1');
    game.toggleTarget('Joueur 2');
    expect(game.canConfirmCall()).toBe(true);
    game.confirmCall();
    expect(game.lovers()).toEqual(['Joueur 1', 'Joueur 2']);
  });

  it('permet à la Sorcière de se choisir comme cible de son poison', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['sorciere', 'loup-garou', 'simple-villageois']);
    game.startNight();
    game.openCall('sorciere');
    game.enterWitchKillMode();

    expect(game.targetNames()).toContain('Joueur 1');
  });

  it('fait grogner le Montreur d’Ours infecté chaque matin tant qu’il vit', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['montreur-ours', 'loup-garou', 'simple-villageois', 'simple-villageois', 'simple-villageois']);
    game.wolfAlignedNames.set(['Joueur 1']);
    game.startNight();
    game.calledIds.set(game.calls().map((call) => call.id));
    expect(game.remainingCalls()).toEqual([]);
    game.goToMorning();
    expect(game.phase()).toBe('bear-neighbors');
    game.toggleBearNeighbor('Joueur 2');
    game.toggleBearNeighbor('Joueur 3');
    game.confirmBearNeighbors();

    expect(game.infoMessage()).toContain('infecté');
  });

  it('calcule le grognement avec les voisins indiqués par le MJ', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['montreur-ours', 'simple-villageois', 'loup-garou', 'simple-villageois', 'simple-villageois']);
    game.startNight();
    game.calledIds.set(game.calls().map((call) => call.id));
    game.goToMorning();
    game.toggleBearNeighbor('Joueur 2');
    game.toggleBearNeighbor('Joueur 3');
    game.confirmBearNeighbors();

    expect(game.infoMessage()).toContain('grogne');
  });

  it('ne consomme pas le premier vote de l’Ange quand le premier tour finit à égalité', async () => {
    await TestBed.configureTestingModule({ imports: [GamePlay], providers: [provideRouter([])] }).compileComponents();
    const game = createGame(['ange', 'loup-garou', 'loup-garou', 'simple-villageois']);
    game.nightNumber.set(1);
    game.goToVillageVote();
    for (const target of game.aliveNames()) game.recordVillageVote(target);
    game.finishVillageVote(); // départage demandé
    for (const target of game.aliveNames()) game.recordVillageVote(target);
    game.finishVillageVote();

    expect(game.phase()).toBe('result');
    expect(game.firstVillageVoteDone()).toBe(false);
    expect(game.roleFor('Joueur 1').id).toBe('ange');
    expect(game.resultMessage()).toContain('Première manche sans élimination');
  });
});
