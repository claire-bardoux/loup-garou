import { describe, expect, it } from 'vitest';
import { ROLES } from '../../data/roles';
import { classicWolfCount, composeGame } from './composition-engine';

const constantRandom = (value = 0.5) => () => value;

describe('classicWolfCount', () => {
  it.each([[5, 1], [7, 1], [8, 2], [12, 2], [13, 3], [18, 3], [19, 4], [24, 4], [30, 5]])(
    'retourne %i loup(s) pour %i joueurs', (players, expected) => {
      expect(classicWolfCount(players)).toBe(expected);
    },
  );
});

describe('composeGame', () => {
  it.each(['decouverte', 'equilibree', 'experte'] as const)(
    'distribue exactement autant de rôles que de joueurs (%s)', (style) => {
      for (let players = 5; players <= 24; players += 1) {
        const result = composeGame(players, style, constantRandom());
        expect(result.roles).toHaveLength(players);
        expect(result.roles.some((role) => role.id === 'capitaine')).toBe(false);
        expect(result.wolfCount).toBe(classicWolfCount(players));
        expect(result.roles.filter((role) => role.team === 'loup' || role.id === 'loup-garou-blanc').length)
          .toBe(result.wolfCount);
        expect(result.roles.every((role) => ROLES.some((known) => known.id === role.id))).toBe(true);
      }
    },
  );

  it('inclut toujours la Voyante et complète avec des villageois simples en découverte', () => {
    const result = composeGame(8, 'decouverte', constantRandom());
    expect(result.roles.filter((role) => role.id === 'voyante')).toHaveLength(1);
    expect(result.roles.some((role) => role.team === 'solitaire' || role.team === 'ambigu')).toBe(false);
  });

  it('garde les cartes de réserve hors du nombre de joueurs', () => {
    const result = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
      .map((value) => composeGame(13, 'experte', constantRandom(value)))
      .find((composition) => composition.reserveCards.length > 0)!;
    expect(result.roles).toHaveLength(13);
    expect(result.reserveCards.length).toBeGreaterThan(0);
    expect(result.reserveCards.length).toBeLessThanOrEqual(3);
  });

  it('fournit des notes hors de la plage officielle', () => {
    expect(composeGame(5, 'decouverte', constantRandom()).notes.join(' ')).toContain('extrapolé');
    expect(composeGame(24, 'equilibree', constantRandom()).notes.join(' ')).toContain('extrapolé');
  });

  it('permet de reproduire la composition avec une source aléatoire déterministe', () => {
    expect(composeGame(13, 'experte', constantRandom(0.3)))
      .toEqual(composeGame(13, 'experte', constantRandom(0.3)));
  });
});
