import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Role } from '../../models /role.model';
import { ROLES } from '../../data/roles';
import { GameSession } from '../game-setup/game-session';

type PlayPhase = 'sleep' | 'night' | 'morning' | 'captain' | 'vote' | 'captain-tiebreak' | 'captain-successor' | 'hunter-shot' | 'servante-choice' | 'result' | 'finished';
type NightAction = 'mentor' | 'cupidon' | 'seer' | 'wolves' | 'infect' | 'witch' | 'fox' | 'dog-wolf' | 'thief' | 'comedian' | 'judge' | 'recognize' | 'white-wolf' | 'grand-wolf' | 'sectarian';
interface NightCall {
  id: string;
  label: string;
  role: Role;
  prompt: string;
  targets: number;
  action: NightAction;
  firstNightOnly?: boolean;
}

const ROLE_BY_ID = new Map(ROLES.map((role) => [role.id, role]));
const SIMPLE_VILLAGER = ROLE_BY_ID.get('simple-villageois')!;
const BASIC_WOLF = ROLE_BY_ID.get('loup-garou')!;

@Component({
  selector: 'app-game-play',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game-play.html',
  styleUrl: './game-play.css',
})
export class GamePlay {
  private readonly session = inject(GameSession);
  private readonly router = inject(Router);
  readonly assignments = this.session.playerAssignments;
  readonly reserveCards = this.session.reserveCards;
  readonly phase = signal<PlayPhase>('sleep');
  readonly nightNumber = signal(1);
  readonly activeCallId = signal<string | null>(null);
  readonly selectedTargets = signal<string[]>([]);
  readonly revealedPlayerRole = signal<{ name: string; role: Role } | null>(null);
  readonly roleHasBeenRevealed = signal(false);
  readonly roleRosterOpen = signal(false);
  readonly reserveSelection = signal<string | null>(null);
  readonly dogWolfChoice = signal<'village' | 'loup' | null>(null);
  readonly calledIds = signal<string[]>([]);
  readonly aliveNames = signal<string[]>(this.assignments().map((player) => player.name));
  readonly roleOverrides = signal<Record<string, Role>>({});
  readonly deadNames = signal<string[]>([]);
  readonly lovers = signal<string[]>([]);
  readonly mentorByName = signal<Record<string, string>>({});
  readonly infectedNames = signal<string[]>([]);
  readonly infectedDeathsTonight = signal<string[]>([]);
  readonly wolfVictims = signal<string[]>([]);
  readonly hunterUsed = signal<string[]>([]);
  readonly witchHealUsed = signal(false);
  readonly witchPoisonUsed = signal(false);
  readonly foxPowerLost = signal(false);
  readonly foxFoundWolf = signal<boolean | null>(null);
  readonly secondVoteReady = signal<string[]>([]);
  readonly comedianRolesUsed = signal<string[]>([]);
  readonly comedianBorrowed = signal<Record<string, Role>>({});
  readonly comedianCurrentNightRole = signal<Role | null>(null);
  readonly comedianNightsPlayed = signal(0);
  readonly jesterSignSet = signal(false);
  readonly jesterSign = signal('');
  readonly secondVoteUsed = signal(false);
  readonly secondVoteInProgress = signal(false);
  readonly villageGroups = signal<Record<string, 'A' | 'B'>>({});
  readonly sectarianGroup = signal<'A' | 'B' | null>(null);
  readonly winnerMessage = signal('');
  readonly pendingHunter = signal<string | null>(null);
  readonly pendingServante = signal<string | null>(null);
  readonly servanteDeclinedVictim = signal<string | null>(null);
  readonly servanteFirstNightRole = signal<string | null>(null);
  readonly deathQueue = signal<string[]>([]);
  readonly deathQueueCause = signal<'night' | 'vote' | 'power'>('night');
  readonly nightVictim = signal<string | null>(null);
  readonly savedVictim = signal(false);
  readonly poisonedPlayer = signal<string | null>(null);
  readonly witchKillMode = signal(false);
  readonly victimInfected = signal(false);
  readonly infectionUsed = signal(false);
  readonly captain = signal<string | null>(null);
  readonly captainVotes = signal<Record<string, number>>({});
  readonly captainBallots = signal(0);
  readonly captainVoteHistory = signal<string[]>([]);
  readonly captainElectionRound = signal(0);
  readonly captainRunoffCandidates = signal<string[]>([]);
  readonly captainElectionMessage = signal('');
  readonly villageVotes = signal<Record<string, number>>({});
  readonly villageBallots = signal(0);
  readonly villageVoterIndex = signal(0);
  readonly villageVoteHistory = signal<Array<{ target: string; voter: string; weight: number }>>([]);
  readonly villageRunoff = signal(false);
  readonly villageRunoffCandidates = signal<string[]>([]);
  readonly tiedCandidates = signal<string[]>([]);
  readonly eliminatedPlayerName = signal<string | null>(null);
  readonly resultMessage = signal('');
  readonly successionMessage = signal('');
  readonly successionReturnsToMorning = signal(false);
  readonly infoMessage = signal('');
  readonly nightActionMessage = signal('');
  readonly firstVillageVoteDone = signal(false);

  readonly roleFor = (name: string): Role => this.roleOverrides()[name]
    ?? this.assignments().find((player) => player.name === name)?.role
    ?? SIMPLE_VILLAGER;
  readonly calls = computed<NightCall[]>(() => {
    const players = this.assignments();
    const actor = (id: string) => players.find((player) => this.roleFor(player.name).id === id && this.aliveNames().includes(player.name) && !this.infectedDeathsTonight().includes(player.name));
    const calls: NightCall[] = [];
    const add = (id: string, action: NightAction, prompt: string, targets = 0, firstNightOnly = false) => {
      const player = actor(id);
      if (player) calls.push({ id, label: this.roleFor(player.name).name, role: this.roleFor(player.name), prompt, targets, action, ...(firstNightOnly ? { firstNightOnly: true } : {}) });
    };
    const resetRole = this.servanteFirstNightRole();
    if (this.nightNumber() === 1 || resetRole === 'voleur') add('voleur', 'thief', 'Le Voleur regarde les cartes de réserve et choisit son nouveau personnage.', 0, true);
    if (this.nightNumber() === 1 || resetRole === 'enfant-sauvage') add('enfant-sauvage', 'mentor', 'Demande à l’Enfant Sauvage de choisir un mentor. Il changera de camp si cette personne meurt.', 1, true);
    if (this.nightNumber() === 1 || resetRole === 'chien-loup') add('chien-loup', 'dog-wolf', 'Le Chien-Loup choisit secrètement le camp qu’il rejoindra pour la partie.', 0, true);
    if (this.nightNumber() === 1 || resetRole === 'cupidon') add('cupidon', 'cupidon', 'Demande à Cupidon de désigner deux joueurs qui deviennent amoureux.', 2, true);
    if (this.nightNumber() === 1 || resetRole === 'juge-begue') add('juge-begue', 'judge', 'Le Juge Bègue choisit un signe secret pour demander un second vote une fois dans la partie.', 0, true);
    if (this.nightNumber() === 1 || resetRole === 'abominable-sectaire') add('abominable-sectaire', 'sectarian', 'Le Maître du Jeu répartit les joueurs entre deux groupes secrets, puis choisit le groupe de l’Abominable Sectaire.', 0, true);
    if (this.nightNumber() === 1 || resetRole === 'deux-soeurs') add('deux-soeurs', 'recognize', 'Réveille les Deux Sœurs pour qu’elles se reconnaissent.', 0, true);
    if (this.nightNumber() === 1 || resetRole === 'trois-freres') add('trois-freres', 'recognize', 'Réveille les Trois Frères pour qu’elles se reconnaissent.', 0, true);
    if (this.comedianNightsPlayed() < 3 && this.reserveCards().some((role) => !this.comedianRolesUsed().includes(role.id))) {
      add('comedien', 'comedian', 'Le Comédien choisit un rôle de réserve inutilisé et emprunte son pouvoir pour cette nuit.');
    }
    const borrowed = this.comedianCurrentNightRole();
    const comedian = players.find((player) => this.aliveNames().includes(player.name) && this.roleFor(player.name).id === 'comedien');
    if (borrowed && comedian && this.calledIds().includes('comedien') && !this.calledIds().includes('comedien-pouvoir')) {
      const action = this.borrowedAction(borrowed.id);
      if (action && (!(action === 'witch' || action === 'infect') || this.nightVictim())) {
        calls.push({ id: 'comedien-pouvoir', label: `Comédien · ${borrowed.name}`, role: borrowed, prompt: `Le Comédien utilise maintenant le pouvoir de ${borrowed.name}.`, targets: action === 'seer' || action === 'fox' || action === 'white-wolf' || action === 'grand-wolf' ? 1 : 0, action });
      }
    }
    add('voyante', 'seer', 'Demande à la Voyante de désigner un joueur dont elle veut connaître le rôle.', 1);
    if (!this.foxPowerLost()) add('renard', 'fox', 'Le Renard peut désigner le joueur central d’un groupe de trois joueurs voisins. Les joueurs éliminés ne sont pas comptés.', 1);
    const wolves = players.find((player) => this.aliveNames().includes(player.name) && !this.infectedDeathsTonight().includes(player.name) && (this.roleFor(player.name).team === 'loup' || this.roleFor(player.name).id === 'loup-garou-blanc'))?.role;
    if (wolves) {
      const littleGirlAlive = players.some((player) => this.aliveNames().includes(player.name) && this.roleFor(player.name).id === 'petite-fille');
      const prompt = littleGirlAlive
        ? 'Réveille les loups. La Petite Fille peut tenter de les observer pendant leur choix. Ils choisissent ensemble un joueur à éliminer.'
        : 'Réveille les loups. Ils choisissent ensemble un joueur à éliminer.';
      calls.push({ id: 'loups', label: 'Les Loups', role: wolves, prompt, targets: 1, action: 'wolves' });
    }
    if (this.nightNumber() % 2 === 0) add('loup-garou-blanc', 'white-wolf', 'Le Loup-Garou Blanc peut éliminer un autre loup cette nuit.', 1);
    if (actor('grand-mechant-loup') && players.filter((player) => this.aliveNames().includes(player.name) && this.roleFor(player.name).team === 'loup').length > 1) {
      add('grand-mechant-loup', 'grand-wolf', 'Tant qu’aucun autre loup n’est mort, le Grand Méchant Loup peut choisir une victime supplémentaire.', 1);
    }
    if (this.nightVictim() && !this.savedVictim() && !this.infectionUsed() && !this.victimInfected()) add('infect-pere-des-loups', 'infect', 'Le Père des Loups peut infecter la victime des loups au lieu de la laisser mourir.');
    if (!this.witchHealUsed() || !this.witchPoisonUsed()) add('sorciere', 'witch', 'Présente à la Sorcière la victime des loups. Chaque potion ne peut être utilisée qu’une fois.');
    return calls;
  });
  readonly otherRoles = computed(() => this.assignments()
    .filter(({ name }) => !this.calls().some((call) => call.id === this.roleFor(name).id || (call.id === 'loups' && this.roleFor(name).team === 'loup')))
    .map(({ name }) => ({ name, role: this.roleFor(name) })));
  readonly currentCall = computed(() => this.calls().find((call) => call.id === this.activeCallId()) ?? null);
  readonly foxGroupNames = computed(() => this.foxGroupForCenter(this.selectedTargets()[0] ?? null));
  readonly targetNames = computed(() => {
    const call = this.currentCall();
    const actorName = call && call.id !== 'loups' ? this.actorForCall(call) : null;
    return this.aliveNames().filter((name) => !this.infectedDeathsTonight().includes(name)).filter((name) => {
      if (name === actorName && call?.action !== 'fox') return false;
      if (call?.action === 'wolves') return this.roleFor(name).team !== 'loup' && this.roleFor(name).id !== 'loup-garou-blanc';
      if (call?.action === 'white-wolf') return this.roleFor(name).team === 'loup';
      return true;
    });
  });
  readonly votedPlayer = computed(() => {
    const name = this.eliminatedPlayerName();
    return name ? { name, role: this.roleFor(name) } : null;
  });
  readonly remainingCalls = computed(() => this.calls().filter((call) => !this.calledIds().includes(call.id)));
  readonly dayDeaths = computed(() => {
    if (this.nightNumber() === 1) return [];
    const victim = this.victimInfected() ? null : this.nightVictim();
    const deaths = [...this.wolfVictims(), ...this.infectedDeathsTonight(), victim, this.poisonedPlayer()].filter((name): name is string => !!name);
    return [...new Set(deaths.filter((name) => !(name === this.nightVictim() && this.savedVictim())))];
  });
  readonly validTargetCount = computed(() => this.currentCall()?.action === 'witch' && this.witchKillMode()
    ? 1
    : this.currentCall()?.targets ?? 0);
  readonly captainCandidates = computed(() => this.captainElectionRound() > 0 ? this.captainRunoffCandidates() : this.aliveNames());
  readonly currentVoter = computed(() => this.aliveNames()[this.villageVoterIndex()] ?? null);
  readonly villageCandidates = computed(() => this.villageRunoff() ? this.villageRunoffCandidates() : this.aliveNames());
  readonly canConfirmCall = computed(() => {
    const call = this.currentCall();
    if (!call) return false;
    if (call.action === 'fox') return this.selectedTargets().length === 1 && this.foxGroupNames().length === 3;
    if (call.action === 'witch') return !this.witchKillMode() || this.selectedTargets().length === 1;
    if (call.action === 'thief' || call.action === 'comedian') return !!this.reserveSelection();
    if (call.action === 'dog-wolf') return !!this.dogWolfChoice();
    if (call.action === 'judge') return this.jesterSign().trim().length > 0;
    if (call.action === 'sectarian') return !!this.sectarianGroup() && this.assignments().every(({ name }) => !!this.villageGroups()[name]);
    return this.selectedTargets().length === call.targets;
  });
  readonly canRequestSecondVote = computed(() => !this.secondVoteUsed() && this.jesterSignSet()
    && this.assignments().some((player) => this.aliveNames().includes(player.name) && this.roleFor(player.name).id === 'juge-begue'));

  constructor() {
    if (!this.assignments().length) void this.router.navigate(['/game-setup']);
  }

  startNight(): void {
    this.infectedDeathsTonight.set(this.infectedNames().filter((name) => this.aliveNames().includes(name)));
    this.infectedNames.set([]);
    this.phase.set('night');
  }

  openCall(id: string): void {
    if (this.calledIds().includes(id)) return;
    this.activeCallId.set(id);
    this.selectedTargets.set([]);
    this.revealedPlayerRole.set(null);
    this.roleHasBeenRevealed.set(false);
    this.witchKillMode.set(false);
    this.reserveSelection.set(null);
    this.dogWolfChoice.set(null);
  }

  selectReserve(roleId: string): void {
    if (this.reserveCards().some((role) => role.id === roleId)) this.reserveSelection.set(roleId);
  }

  chooseDogWolfCamp(camp: 'village' | 'loup'): void {
    this.dogWolfChoice.set(camp);
  }

  toggleTarget(name: string): void {
    const max = this.validTargetCount();
    const selected = this.selectedTargets();
    if (this.currentCall()?.action === 'fox' && this.foxFoundWolf() !== null) return;
    if (selected.includes(name)) this.selectedTargets.set(selected.filter((item) => item !== name));
    else if (max > 0 && selected.length < max) this.selectedTargets.set([...selected, name]);
    else if (this.currentCall()?.id === 'sorciere') this.poisonedPlayer.set(name);
  }

  showSelectedRole(): void {
    const selectedName = this.selectedTargets()[0];
    const target = this.assignments().find((player) => player.name === selectedName);
    if (target) {
      this.revealedPlayerRole.set({ name: target.name, role: this.roleFor(target.name) });
      this.roleHasBeenRevealed.set(true);
    }
  }

  confirmCall(): void {
    const call = this.currentCall();
    if (!call || !this.canConfirmCall() || (call.action === 'fox' && this.foxFoundWolf() === null)) return;
    const actorName = call.id === 'comedien-pouvoir'
      ? this.assignments().find((player) => this.aliveNames().includes(player.name) && this.roleFor(player.name).id === 'comedien')?.name
      : this.assignments().find((player) => this.roleFor(player.name).id === call.id)?.name;
    if (call.action === 'mentor' && actorName) this.mentorByName.update((mentors) => ({ ...mentors, [actorName]: this.selectedTargets()[0] }));
    if (call.action === 'cupidon') this.lovers.set([...this.selectedTargets()]);
    if (call.action === 'wolves') {
      const victim = this.selectedTargets()[0] ?? null;
      this.nightVictim.set(victim);
      this.wolfVictims.set([]);
    }
    if (call.action === 'white-wolf' || call.action === 'grand-wolf') {
      const victim = this.selectedTargets()[0];
      if (victim) this.wolfVictims.update((victims) => [...new Set([...victims, victim])]);
    }
    if (call.action === 'dog-wolf' && actorName) {
      const role = this.dogWolfChoice() === 'loup' ? BASIC_WOLF : SIMPLE_VILLAGER;
      this.roleOverrides.update((overrides) => ({ ...overrides, [actorName]: role }));
    }
    if (call.action === 'thief' && actorName) {
      const selected = this.reserveCards().find((role) => role.id === this.reserveSelection());
      if (selected) this.roleOverrides.update((overrides) => ({ ...overrides, [actorName]: selected }));
    }
    if (call.action === 'comedian' && actorName) {
      const selected = this.reserveCards().find((role) => role.id === this.reserveSelection());
      if (selected) {
        this.comedianNightsPlayed.update((nights) => nights + 1);
        this.comedianRolesUsed.update((used) => [...used, selected.id]);
        this.comedianBorrowed.update((roles) => ({ ...roles, [actorName]: selected }));
        this.comedianCurrentNightRole.set(selected);
      }
    }
    if (call.action === 'judge') {
      this.jesterSignSet.set(true);
    }
    if (call.action === 'sectarian' && actorName) this.sectarianGroup.set(this.villageGroups()[actorName] ?? null);
    if (call.action === 'infect' && this.victimInfected()) {
      this.infectionUsed.set(true);
    }
    if (call.action === 'witch' && this.witchKillMode()) {
      this.poisonedPlayer.set(this.selectedTargets()[0] ?? null);
      this.witchPoisonUsed.set(true);
    }
    if (call.action === 'fox' && call.id === 'renard' && this.foxFoundWolf() === false) {
      this.foxPowerLost.set(true);
    }
    if (call.firstNightOnly && this.servanteFirstNightRole() === call.id) this.servanteFirstNightRole.set(null);
    this.calledIds.set([...this.calledIds(), call.id]);
    this.activeCallId.set(null);
    this.selectedTargets.set([]);
    this.revealedPlayerRole.set(null);
    this.roleHasBeenRevealed.set(false);
  }

  revealFoxResult(): void {
    const call = this.currentCall();
    if (!call || call.action !== 'fox' || !this.canConfirmCall() || this.foxFoundWolf() !== null) return;

    const group = this.foxGroupNames();
    const wolfFound = group.some((name) => this.isWolfForFox(name));
    this.foxFoundWolf.set(wolfFound);
    if (call.id === 'renard') {
      this.nightActionMessage.set(wolfFound
        ? 'Au moins un Loup-Garou parmi ces trois voisins : le Renard pourra réutiliser son pouvoir une nuit suivante.'
        : 'Aucun Loup-Garou parmi ces trois voisins : le Renard perd son pouvoir et ces joueurs sont innocents selon cette information.');
    } else {
      this.nightActionMessage.set(wolfFound
        ? 'Au moins un Loup-Garou parmi ces trois voisins : le Comédien réussit son pouvoir emprunté.'
        : 'Aucun Loup-Garou parmi ces trois voisins : le Comédien peut considérer ces joueurs innocents selon cette information.');
    }
  }

  skipFox(): void {
    const call = this.currentCall();
    if (!call || call.action !== 'fox') return;
    this.calledIds.set([...this.calledIds(), call.id]);
    this.activeCallId.set(null);
    this.selectedTargets.set([]);
    this.foxFoundWolf.set(null);
  }

  private foxGroupForCenter(centerName: string | null): string[] {
    if (!centerName || !this.aliveNames().includes(centerName) || this.infectedDeathsTonight().includes(centerName)) return [];
    const ordered = [...this.assignments()].sort((a, b) => a.cardIndex - b.cardIndex);
    const centerIndex = ordered.findIndex((player) => player.name === centerName);
    if (centerIndex < 0) return [];
    const living = this.aliveNames().filter((name) => !this.infectedDeathsTonight().includes(name));
    if (living.length < 3) return [];
    const neighbor = (direction: -1 | 1): string | undefined => {
      for (let step = 1; step < ordered.length; step += 1) {
        const candidate = ordered[(centerIndex + direction * step + ordered.length * 2) % ordered.length];
        if (living.includes(candidate.name) && candidate.name !== centerName) return candidate.name;
      }
      return undefined;
    };
    const left = neighbor(-1);
    const right = neighbor(1);
    return left && right && left !== right ? [left, centerName, right] : [];
  }

  private isWolfForFox(name: string): boolean {
    const role = this.roleFor(name);
    return role.team === 'loup' || role.id === 'loup-garou-blanc';
  }

  markVictimSaved(): void {
    this.savedVictim.set(true);
    this.witchHealUsed.set(true);
  }

  enterWitchKillMode(): void {
    this.witchKillMode.set(true);
    this.selectedTargets.set([]);
  }

  infectVictim(): void {
    this.victimInfected.set(true);
    this.confirmCall();
  }

  doNothingAsWitch(): void {
    this.poisonedPlayer.set(null);
    this.confirmCall();
  }

  goToMorning(): void {
    if (this.remainingCalls().length) return;
    if (this.victimInfected() && !this.savedVictim() && this.nightVictim()) {
      this.roleOverrides.update((overrides) => ({ ...overrides, [this.nightVictim()!]: BASIC_WOLF }));
    }
    this.resolveDeaths(this.dayDeaths(), 'night', 'morning');
  }

  private bearAnnouncement(): string {
    const ordered = [...this.assignments()].sort((a, b) => a.cardIndex - b.cardIndex);
    const bear = ordered.find((player) => this.aliveNames().includes(player.name) && this.roleFor(player.name).id === 'montreur-ours');
    if (!bear) return this.infoMessage();
    const index = ordered.findIndex((player) => player.name === bear.name);
    const neighbors = [-1, 1].map((direction) => {
      for (let step = 1; step < ordered.length; step++) {
        const candidate = ordered[(index + direction * step + ordered.length * 2) % ordered.length];
        if (this.aliveNames().includes(candidate.name)) return candidate;
      }
      return undefined;
    });
    return neighbors.some((player) => player && this.roleFor(player.name).team === 'loup')
      ? 'Le Montreur d’Ours grogne : au moins un de ses voisins vivants est un loup.'
      : 'Le Montreur d’Ours ne grogne pas.';
  }

  private resolveDeaths(names: string[], cause: 'night' | 'vote' | 'power', destination: 'morning' | 'result'): void {
    this.deathQueueCause.set(cause);
    this.deathQueue.set([...new Set([...this.deathQueue(), ...names])].filter((name) => this.aliveNames().includes(name)));
    this.processDeathQueue(destination);
  }

  private processDeathQueue(destination: 'morning' | 'result'): void {
    if (this.nightNumber() === 1) {
      this.deathQueue.set([]);
      this.eliminatedPlayerName.set(null);
      if (destination === 'morning') {
        this.infoMessage.set(this.bearAnnouncement());
      } else {
        this.secondVoteInProgress.set(false);
        this.resultMessage.set('Première manche sans élimination : personne ne meurt.');
      }
      this.phase.set(destination);
      return;
    }
    while (this.deathQueue().length) {
      const next = this.deathQueue()[0];
      const servant = this.assignments().find((player) => this.aliveNames().includes(player.name) && this.roleFor(player.name).id === 'servante-devouee');
      if (this.deathQueueCause() === 'vote' && next === this.eliminatedPlayerName() && next !== this.servanteDeclinedVictim() && servant && !this.lovers().includes(servant.name)) {
        this.pendingServante.set(servant.name);
        this.eliminatedPlayerName.set(next);
        this.phase.set('servante-choice');
        return;
      }
      const [name, ...remaining] = this.deathQueue();
      this.deathQueue.set(remaining);
      if (!this.aliveNames().includes(name)) continue;
      this.aliveNames.set(this.aliveNames().filter((player) => player !== name));
      this.deadNames.update((dead) => [...new Set([...dead, name])]);
      const child = this.mentorByName()[name];
      if (child && this.aliveNames().includes(child)) this.roleOverrides.update((overrides) => ({ ...overrides, [child]: BASIC_WOLF }));
      if (this.lovers().includes(name)) {
        const partner = this.lovers().find((lover) => lover !== name);
        if (partner && this.aliveNames().includes(partner)) this.deathQueue.set([...this.deathQueue(), partner]);
      }
      if (this.deathQueueCause() === 'night' && name === this.nightVictim() && this.roleFor(name).id === 'chevalier-epee-rouillee') {
        const ordered = [...this.assignments()].sort((a, b) => a.cardIndex - b.cardIndex);
        const start = ordered.findIndex((player) => player.name === name);
        for (let step = 1; step < ordered.length; step++) {
          const next = ordered[(start + step) % ordered.length];
          if (this.aliveNames().includes(next.name) && this.roleFor(next.name).team === 'loup') {
            this.infectedNames.update((infected) => [...new Set([...infected, next.name])]);
            break;
          }
        }
      }
      if (this.captain() === name && this.aliveNames().length) {
        this.eliminatedPlayerName.set(name);
        this.successionReturnsToMorning.set(destination === 'morning');
        this.successionMessage.set(`${name} était capitaine. Il ou elle désigne son successeur.`);
        this.phase.set('captain-successor');
        return;
      }
      if (this.captain() === name) this.captain.set(null);
      if (this.roleFor(name).id === 'chasseur' && !this.hunterUsed().includes(name) && this.aliveNames().length) {
        this.pendingHunter.set(name);
        this.phase.set('hunter-shot');
        return;
      }
      if (this.deathQueueCause() === 'vote' && this.roleFor(name).id === 'ange' && !this.firstVillageVoteDone()) {
        this.finishGame('L’Ange remporte la partie : il a été éliminé au premier vote du village.');
        return;
      }
    }
    if (this.checkVictory()) return;
    if (destination === 'morning') this.infoMessage.set(this.bearAnnouncement());
    if (destination === 'result' && !this.firstVillageVoteDone()) {
      this.firstVillageVoteDone.set(true);
      this.downgradeAngel();
    }
    this.phase.set(destination);
    if (destination === 'result') this.resultMessage.set(`${this.eliminatedPlayerName() ?? 'Le joueur'} a été éliminé.`);
  }

  shootWithHunter(target: string): void {
    const hunter = this.pendingHunter();
    if (!hunter) return;
    this.hunterUsed.update((used) => [...used, hunter]);
    this.pendingHunter.set(null);
    if (target && this.aliveNames().includes(target)) this.deathQueue.set([...this.deathQueue(), target]);
    this.processDeathQueue(this.deathQueueCause() === 'vote' ? 'result' : 'morning');
  }

  takeServanteRole(): void {
    const servant = this.pendingServante();
    const eliminated = this.eliminatedPlayerName();
    if (!servant || !eliminated) return;
    const takenRole = this.roleFor(eliminated);
    this.roleOverrides.update((overrides) => ({ ...overrides, [servant]: takenRole }));
    this.resetTakenRolePower(takenRole.id, servant);
    this.servanteDeclinedVictim.set(null);
    this.pendingServante.set(null);
    this.deathQueue.set(this.deathQueue().filter((name) => name !== eliminated));
    this.aliveNames.set(this.aliveNames().filter((name) => name !== eliminated));
    this.deadNames.update((dead) => [...new Set([...dead, eliminated])]);
    this.processDeathQueue(this.deathQueueCause() === 'vote' ? 'result' : 'morning');
  }

  declineServanteRole(): void {
    this.servanteDeclinedVictim.set(this.eliminatedPlayerName());
    this.pendingServante.set(null);
    this.processDeathQueue(this.deathQueueCause() === 'vote' ? 'result' : 'morning');
  }

  private resetTakenRolePower(roleId: string, holder: string): void {
    const firstNightRoles = ['voleur', 'enfant-sauvage', 'chien-loup', 'cupidon', 'juge-begue', 'abominable-sectaire', 'deux-soeurs', 'trois-freres'];
    if (firstNightRoles.includes(roleId)) this.servanteFirstNightRole.set(roleId);
    if (roleId === 'sorciere') {
      this.witchHealUsed.set(false);
      this.witchPoisonUsed.set(false);
    }
    if (roleId === 'infect-pere-des-loups') this.infectionUsed.set(false);
    if (roleId === 'renard') {
      this.foxPowerLost.set(false);
      this.foxFoundWolf.set(null);
    }
    if (roleId === 'juge-begue') {
      this.jesterSignSet.set(false);
      this.jesterSign.set('');
      this.secondVoteUsed.set(false);
      this.secondVoteInProgress.set(false);
      this.secondVoteReady.set([]);
    }
    if (roleId === 'abominable-sectaire') {
      this.villageGroups.set({});
      this.sectarianGroup.set(null);
    }
    if (roleId === 'chasseur') this.hunterUsed.update((used) => used.filter((name) => name !== holder));
    if (roleId === 'enfant-sauvage') this.mentorByName.update((mentors) => {
      const { [holder]: _previousMentor, ...remainingMentors } = mentors;
      return remainingMentors;
    });
    if (roleId === 'chien-loup') this.dogWolfChoice.set(null);
    if (roleId === 'comedien') {
      this.comedianNightsPlayed.set(0);
      this.comedianCurrentNightRole.set(null);
      this.comedianBorrowed.update((borrowed) => {
        const { [holder]: _previousBorrow, ...remainingBorrowed } = borrowed;
        return remainingBorrowed;
      });
    }
  }

  private checkVictory(): boolean {
    const alive = this.aliveNames();
    if (alive.length === 1 && this.roleFor(alive[0]).id === 'loup-garou-blanc') return this.finishGame('Le Loup-Garou Blanc est le dernier survivant et remporte la partie.');
    const sectarian = this.assignments().find((player) => alive.includes(player.name) && this.roleFor(player.name).id === 'abominable-sectaire');
    if (sectarian && this.sectarianGroup()) {
      const opposing = Object.entries(this.villageGroups()).filter(([, group]) => group !== this.sectarianGroup()).map(([name]) => name);
      if (opposing.length && opposing.every((name) => !alive.includes(name))) return this.finishGame(`${sectarian.name}, l’Abominable Sectaire, remporte la partie.`);
    }
    const livingLovers = this.lovers().filter((name) => alive.includes(name));
    if (alive.length === 2 && livingLovers.length === 2 && livingLovers.some((name) => this.roleFor(name).team === 'loup')) return this.finishGame('Les deux amoureux remportent la partie ensemble.');
    const wolves = alive.filter((name) => this.roleFor(name).team === 'loup').length;
    const villagers = alive.length - wolves;
    if (!wolves) return this.finishGame('Le village a éliminé tous les loups-garous.');
    if (wolves >= villagers) return this.finishGame('Les loups-garous prennent le contrôle du village.');
    return false;
  }

  setJesterSign(value: string): void { this.jesterSign.set(value); }

  private borrowedAction(roleId: string): NightAction | null {
    const actions: Record<string, NightAction> = {
      voyante: 'seer', renard: 'fox', sorciere: 'witch', 'loup-garou-blanc': 'white-wolf',
      'grand-mechant-loup': 'grand-wolf', 'infect-pere-des-loups': 'infect',
    };
    return actions[roleId] ?? null;
  }

  setVillageGroup(name: string, group: 'A' | 'B'): void {
    this.villageGroups.update((groups) => ({ ...groups, [name]: group }));
  }

  startJudgeSecondVote(): void {
    if (!this.canRequestSecondVote()) return;
    this.secondVoteUsed.set(true);
    this.secondVoteInProgress.set(true);
    this.goToVillageVote();
  }

  private finishGame(message: string): boolean {
    this.winnerMessage.set(message);
    this.phase.set('finished');
    return true;
  }

  private downgradeAngel(): void {
    for (const player of this.assignments()) {
      if (this.aliveNames().includes(player.name) && this.roleFor(player.name).id === 'ange') {
        this.roleOverrides.update((overrides) => ({ ...overrides, [player.name]: SIMPLE_VILLAGER }));
      }
    }
  }

  openCaptainVote(): void {
    this.captainVotes.set({});
    this.captainBallots.set(0);
    this.captainVoteHistory.set([]);
    this.captainElectionRound.set(0);
    this.captainRunoffCandidates.set([]);
    this.captainElectionMessage.set('');
    this.phase.set('captain');
  }

  recordCaptainVote(name: string): void {
    if (this.captainBallots() >= this.aliveNames().length || !this.captainCandidates().includes(name)) return;
    this.captainVotes.update((votes) => ({ ...votes, [name]: (votes[name] ?? 0) + 1 }));
    this.captainBallots.update((count) => count + 1);
    this.captainVoteHistory.update((history) => [...history, name]);
  }

  undoCaptainVote(): void {
    const history = this.captainVoteHistory();
    const lastVote = history.at(-1);
    if (!lastVote) return;
    this.captainVotes.update((votes) => ({ ...votes, [lastVote]: Math.max(0, (votes[lastVote] ?? 0) - 1) }));
    this.captainVoteHistory.set(history.slice(0, -1));
    this.captainBallots.update((count) => Math.max(0, count - 1));
  }

  finishCaptainElection(): void {
    if (this.captainBallots() !== this.aliveNames().length) return;
    const votes = this.captainVotes();
    const highest = Math.max(0, ...Object.values(votes));
    const leaders = Object.keys(votes).filter((name) => votes[name] === highest);
    if (leaders.length === 1) {
      this.captain.set(leaders[0]);
      this.captainElectionMessage.set(`${leaders[0]} est élu capitaine. Son vote comptera double.`);
      this.phase.set('morning');
      return;
    }
    if (this.captainElectionRound() === 0) {
      this.captainRunoffCandidates.set(leaders);
      this.captainElectionRound.set(1);
      this.captainVotes.set({});
      this.captainBallots.set(0);
      this.captainVoteHistory.set([]);
      this.captainElectionMessage.set(`Égalité entre ${leaders.join(' et ')}. Organise un nouveau vote entre eux.`);
      return;
    }
    this.captainElectionMessage.set('Le vote reste à égalité : aucun capitaine n’est élu pour le moment.');
    this.phase.set('morning');
  }

  goToVillageVote(): void {
    this.villageVotes.set({});
    this.villageBallots.set(0);
    this.villageVoterIndex.set(0);
    this.villageVoteHistory.set([]);
    this.villageRunoff.set(false);
    this.villageRunoffCandidates.set([]);
    this.phase.set('vote');
  }

  recordVillageVote(target: string): void {
    const voter = this.currentVoter();
    if (!voter || !this.villageCandidates().includes(target)) return;
    const weight = voter === this.captain() ? 2 : 1;
    this.villageVotes.update((votes) => ({ ...votes, [target]: (votes[target] ?? 0) + weight }));
    this.villageBallots.update((count) => count + 1);
    this.villageVoterIndex.update((index) => index + 1);
    this.villageVoteHistory.update((history) => [...history, { target, voter, weight }]);
  }

  undoVillageVote(): void {
    const history = this.villageVoteHistory();
    const lastVote = history.at(-1);
    if (!lastVote) return;
    this.villageVotes.update((votes) => ({ ...votes, [lastVote.target]: Math.max(0, (votes[lastVote.target] ?? 0) - lastVote.weight) }));
    this.villageVoteHistory.set(history.slice(0, -1));
    this.villageBallots.update((count) => Math.max(0, count - 1));
    this.villageVoterIndex.update((index) => Math.max(0, index - 1));
  }

  finishVillageVote(): void {
    if (this.villageBallots() !== this.aliveNames().length) return;
    const votes = this.villageVotes();
    const highest = Math.max(0, ...Object.values(votes));
    const leaders = Object.keys(votes).filter((name) => votes[name] === highest);
    if (leaders.length === 1) {
      this.eliminatePlayer(leaders[0]);
      this.secondVoteInProgress.set(false);
      return;
    }
    this.tiedCandidates.set(leaders);
    if (this.captain() && this.aliveNames().includes(this.captain()!)) {
      this.phase.set('captain-tiebreak');
      return;
    }
    if (!this.villageRunoff()) {
      this.villageRunoff.set(true);
      this.villageRunoffCandidates.set(leaders);
      this.villageVotes.set({});
      this.villageBallots.set(0);
      this.villageVoterIndex.set(0);
      this.villageVoteHistory.set([]);
      return;
    }
    this.firstVillageVoteDone.set(true);
    this.secondVoteInProgress.set(false);
    this.downgradeAngel();
    this.eliminatedPlayerName.set(null);
    this.resultMessage.set('Le vote reste à égalité : personne n’est éliminé.');
    this.phase.set('result');
  }

  resolveCaptainTie(name: string): void {
    if (this.tiedCandidates().includes(name)) this.eliminatePlayer(name);
  }

  private eliminatePlayer(name: string): void {
    this.eliminatedPlayerName.set(name);
    this.resolveDeaths([name], 'vote', 'result');
    if (this.nightNumber() > 1) this.firstVillageVoteDone.set(true);
  }

  chooseSuccessor(name: string): void {
    if (!this.aliveNames().includes(name)) return;
    this.captain.set(name);
    if (this.successionReturnsToMorning()) {
      this.successionMessage.set(`${name} reprend la médaille de capitaine.`);
      this.processDeathQueue('morning');
      return;
    }
    this.resultMessage.set(`${this.eliminatedPlayerName()} a été éliminé. ${name} reprend la médaille de capitaine.`);
    this.processDeathQueue('result');
  }

  beginNextNight(): void {
    this.nightNumber.update((number) => number + 1);
    this.calledIds.set([]);
    this.nightVictim.set(null);
    this.savedVictim.set(false);
    this.poisonedPlayer.set(null);
    this.captainVotes.set({});
    this.captainBallots.set(0);
    this.captainVoteHistory.set([]);
    this.captainElectionRound.set(0);
    this.captainRunoffCandidates.set([]);
    this.captainElectionMessage.set('');
    this.villageVotes.set({});
    this.villageBallots.set(0);
    this.villageVoterIndex.set(0);
    this.villageVoteHistory.set([]);
    this.villageRunoff.set(false);
    this.villageRunoffCandidates.set([]);
    this.tiedCandidates.set([]);
    this.eliminatedPlayerName.set(null);
    this.resultMessage.set('');
    this.successionMessage.set('');
    this.successionReturnsToMorning.set(false);
    this.infoMessage.set('');
    this.nightActionMessage.set('');
    this.foxFoundWolf.set(null);
    this.victimInfected.set(false);
    this.comedianCurrentNightRole.set(null);
    this.phase.set('sleep');
  }

  nameOf(role: Role): string {
    return this.assignments().find((player) => this.roleFor(player.name).id === role.id)?.name ?? 'Joueur';
  }

  actorForCall(call: NightCall): string {
    if (call.id === 'comedien-pouvoir') return this.assignments().find((player) => this.aliveNames().includes(player.name) && this.roleFor(player.name).id === 'comedien')?.name ?? 'Comédien';
    return this.nameOf(call.role);
  }

  openRoleRoster(): void {
    this.roleRosterOpen.set(true);
  }

  closeRoleRoster(): void {
    this.roleRosterOpen.set(false);
  }
}
