import { describe, expect, it } from 'vitest';
import { ROLES } from '../../data/roles';
import { GameSession, interleaveRolesByTeam } from './game-session';

describe('GameSession', () => {
  it('sauvegarde une copie du brouillon et réinitialise les attributions', () => {
    const session = new GameSession();
    const roles = [ROLES.find((role) => role.id === 'voyante')!];
    session.setPlayerAssignments([{ name: 'Alice', role: roles[0], cardIndex: 0 }]);
    session.chooseDraft();
    session.setDraft(5, roles, [], 'decouverte', ['note']);
    roles.length = 0;
    expect(session.playerCount()).toBe(5);
    expect(session.roles()).toHaveLength(1);
    expect(session.compositionStyle()).toBe('decouverte');
    expect(session.compositionNotes()).toEqual(['note']);
    expect(session.compositionChosen()).toBe(false);
    expect(session.playerAssignments()).toEqual([]);
  });

  it('choisit le brouillon puis conserve les affectations', () => {
    const session = new GameSession();
    const assignment = { name: 'Alice', role: ROLES[0], cardIndex: 2 };
    session.setDraft(13, [ROLES[0]]);
    session.chooseDraft();
    session.setPlayerAssignments([assignment]);
    expect(session.compositionChosen()).toBe(true);
    expect(session.playerAssignments()).toEqual([assignment]);
  });

  it('mélange les équipes pour éviter les longues séries dans l’ordre de distribution', () => {
    const roles = [
      ...Array(4).fill(ROLES.find((role) => role.id === 'simple-villageois')!),
      ...Array(2).fill(ROLES.find((role) => role.id === 'loup-garou')!),
      ROLES.find((role) => role.id === 'ange')!,
      ROLES.find((role) => role.id === 'chien-loup')!,
    ];

    const result = interleaveRolesByTeam(roles, () => 0.5);

    expect(result).toHaveLength(roles.length);
    expect(result.map((role) => role.id).sort()).toEqual(roles.map((role) => role.id).sort());
    expect(result.every((role, index) => index === 0 || role.team !== result[index - 1].team)).toBe(true);
  });
});
