import { Injectable, signal } from '@angular/core';
import { Role, RoleTeam } from '../../models /role.model';

export function interleaveRolesByTeam(roles: Role[], random: () => number = Math.random): Role[] {
  const teams: RoleTeam[] = ['village', 'loup', 'ambigu', 'solitaire'];
  const remaining = new Map<RoleTeam, Role[]>();
  for (const team of teams) {
    remaining.set(team, shuffle(roles.filter((role) => role.team === team), random));
  }

  const ordered: Role[] = [];
  let previousTeam: RoleTeam | undefined;
  while (ordered.length < roles.length) {
    let candidates = teams.filter((team) => (remaining.get(team)?.length ?? 0) > 0 && team !== previousTeam);
    if (!candidates.length) candidates = teams.filter((team) => (remaining.get(team)?.length ?? 0) > 0);
    const largestGroup = Math.max(...candidates.map((team) => remaining.get(team)!.length));
    const largestTeams = candidates.filter((team) => remaining.get(team)!.length === largestGroup);
    const randomIndex = Math.min(largestTeams.length - 1, Math.floor(random() * largestTeams.length));
    const team = largestTeams[randomIndex];
    ordered.push(remaining.get(team)!.pop()!);
    previousTeam = team;
  }
  return ordered;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.min(index, Math.floor(random() * (index + 1)));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

@Injectable({ providedIn: 'root' })
export class GameSession {
  readonly playerCount = signal(13);
  readonly compositionStyle = signal<'decouverte' | 'equilibree' | 'experte'>('equilibree');
  readonly roles = signal<Role[]>([]);
  readonly reserveCards = signal<Role[]>([]);
  readonly compositionNotes = signal<string[]>([]);
  readonly compositionChosen = signal(false);
  readonly playerAssignments = signal<Array<{ name: string; role: Role; cardIndex: number }>>([]);

  setDraft(
    playerCount: number,
    roles: Role[],
    reserveCards: Role[] = [],
    style: 'decouverte' | 'equilibree' | 'experte' = this.compositionStyle(),
    notes: string[] = this.compositionNotes(),
  ): void {
    this.playerCount.set(playerCount);
    this.compositionStyle.set(style);
    this.roles.set([...roles]);
    this.reserveCards.set([...reserveCards]);
    this.compositionNotes.set([...notes]);
    this.compositionChosen.set(false);
    this.playerAssignments.set([]);
  }

  chooseDraft(): void {
    this.compositionChosen.set(true);
  }

  setDistributionOrder(roles: Role[]): void {
    this.roles.set([...roles]);
    this.playerAssignments.set([]);
  }

  setPlayerAssignments(assignments: Array<{ name: string; role: Role; cardIndex: number }>): void {
    this.playerAssignments.set([...assignments]);
  }
}
