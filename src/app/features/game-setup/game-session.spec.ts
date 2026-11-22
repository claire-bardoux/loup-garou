import { describe, expect, it } from 'vitest';
import { ROLES } from '../../data/roles';
import { GameSession } from './game-session';

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
});
