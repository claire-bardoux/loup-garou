import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Role } from '../../models /role.model';
import { composeGame, CompositionStyle } from './composition-engine';
import { GameSession } from './game-session';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game-setup.html',
  styleUrl: './game-setup.css',
})
export class GameSetup {
  private readonly session = inject(GameSession);
  readonly minPlayers = 5;
  readonly maxPlayers = 24;
  readonly playerCount = signal(this.session.playerCount());
  readonly composition = signal<Role[]>([]);
  readonly reserveCards = signal<Role[]>([]);
  readonly compositionNotes = signal<string[]>([]);
  readonly style = signal<CompositionStyle>(this.session.compositionStyle());
  readonly compositionChosen = signal(this.session.compositionChosen());

  readonly roleCounts = computed(() => {
    const counts = new Map<string, { role: Role; count: number }>();
    for (const role of this.composition()) {
      const entry = counts.get(role.id);
      if (entry) entry.count += 1;
      else counts.set(role.id, { role, count: 1 });
    }
    return [...counts.values()];
  });

  constructor() {
    if (this.session.roles().length) {
      this.composition.set(this.session.roles());
      this.reserveCards.set(this.session.reserveCards());
      this.compositionNotes.set(this.session.compositionNotes());
    }
    else this.generateComposition();
  }

  decreasePlayers(): void {
    this.setPlayerCount(this.playerCount() - 1);
  }

  setStyle(value: string): void {
    if (value !== 'decouverte' && value !== 'equilibree' && value !== 'experte') return;
    this.style.set(value);
    this.generateComposition();
  }

  increasePlayers(): void {
    this.setPlayerCount(this.playerCount() + 1);
  }

  private setPlayerCount(count: number): void {
    const nextCount = Math.max(this.minPlayers, Math.min(this.maxPlayers, count));
    if (nextCount === this.playerCount()) return;
    this.playerCount.set(nextCount);
    this.generateComposition();
  }

  generateComposition(): void {
    const result = composeGame(this.playerCount(), this.style());
    this.composition.set(result.roles);
    this.reserveCards.set(result.reserveCards);
    this.compositionNotes.set(result.notes);
    this.session.setDraft(this.playerCount(), result.roles, result.reserveCards, this.style(), result.notes);
    this.compositionChosen.set(false);
  }

  chooseComposition(): void {
    this.compositionChosen.set(true);
    this.session.setDraft(this.playerCount(), this.composition(), this.reserveCards(), this.style(), this.compositionNotes());
    this.session.chooseDraft();
    this.compositionChosen.set(true);
  }

}
