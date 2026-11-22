import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Role, RoleTeam } from '../../models /role.model';
import { GameSession, interleaveRolesByTeam } from '../game-setup/game-session';

interface TeamSection {
  key: RoleTeam;
  label: string;
}

@Component({
  selector: 'app-role-summary',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './role-summary.html',
  styleUrl: './role-summary.css',
})
export class RoleSummary {
  private readonly router = inject(Router);
  private readonly session = inject(GameSession);
  readonly playerCount = this.session.playerCount;
  readonly distributionStarted = signal(false);
  readonly showPlayerRoles = signal(false);
  readonly selectedCard = signal<number | null>(null);
  readonly playerName = signal('');
  readonly revealedAssignment = signal<{ name: string; role: Role; cardIndex: number } | null>(null);
  readonly assignments = this.session.playerAssignments;
  readonly cards = computed(() => this.session.roles().map((role, index) => ({ role, index }))
    .filter(({ index }) => !this.assignments().some((assignment) => assignment.cardIndex === index)));
  readonly nextPlayerNumber = computed(() => this.assignments().length + 1);
  readonly distributionComplete = computed(() => this.assignments().length >= this.playerCount());
  readonly teams: TeamSection[] = [
    { key: 'village', label: 'Village' },
    { key: 'loup', label: 'Loups' },
    { key: 'ambigu', label: 'Ambigus' },
    { key: 'solitaire', label: 'Solitaires' },
  ];
  readonly sections = computed(() => this.teams
    .map((team) => {
      const counts = new Map<string, { role: Role; count: number }>();
      for (const role of this.session.roles().filter((item) => item.team === team.key)) {
        const entry = counts.get(role.id);
        if (entry) entry.count += 1;
        else counts.set(role.id, { role, count: 1 });
      }
      const roleCounts = [...counts.values()];
      return {
        ...team,
        roleCounts,
        uniqueRoles: roleCounts.length,
        players: roleCounts.reduce((total, entry) => total + entry.count, 0),
      };
    })
    .filter((team) => team.players > 0));

  constructor() {
    if (!this.session.roles().length) void this.router.navigate(['/game-setup']);
  }

  continue(): void {
    this.session.setDistributionOrder(interleaveRolesByTeam(this.session.roles()));
    this.distributionStarted.set(true);
  }

  chooseCard(index: number): void {
    if (this.distributionComplete() || this.selectedCard() !== null) return;
    this.selectedCard.set(index);
    this.playerName.set('');
  }

  revealRole(): void {
    const index = this.selectedCard();
    const name = this.playerName().trim();
    if (index === null || !name) return;
    const role = this.session.roles()[index];
    if (!role) return;
    const assignment = { name, role, cardIndex: index };
    const updated = [...this.assignments(), assignment];
    this.session.setPlayerAssignments(updated);
    this.selectedCard.set(null);
    this.revealedAssignment.set(assignment);
  }

  closeReveal(): void {
    this.revealedAssignment.set(null);
  }

  openPlayerRoles(): void {
    this.showPlayerRoles.set(true);
  }

  closePlayerRoles(): void {
    this.showPlayerRoles.set(false);
  }

  startGame(): void {
    void this.router.navigate(['/game-play']);
  }
}
