import { Injectable, signal } from '@angular/core';
import { Role } from '../../models /role.model';

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

  setPlayerAssignments(assignments: Array<{ name: string; role: Role; cardIndex: number }>): void {
    this.playerAssignments.set([...assignments]);
  }
}
