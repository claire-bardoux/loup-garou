import { ROLES } from '../../data/roles';
import { Role } from '../../models /role.model';

export type CompositionStyle = 'decouverte' | 'equilibree' | 'experte';

export interface GameComposition {
  roles: Role[];
  reserveCards: Role[];
  wolfCount: number;
  notes: string[];
}

interface RoleProfile {
  players: number;
  power: number;
  group?: 'information' | 'elimination' | 'vote' | 'bond' | 'solo' | 'wolf-power';
  reserve?: number;
  styles: CompositionStyle[];
}

const ROLE_PROFILES: Record<string, RoleProfile> = {
  'voyante': { players: 5, power: 3, group: 'information', styles: ['decouverte', 'equilibree', 'experte'] },
  'sorciere': { players: 8, power: 3, group: 'elimination', styles: ['equilibree', 'experte'] },
  'chasseur': { players: 8, power: 2, group: 'elimination', styles: ['equilibree', 'experte'] },
  'petite-fille': { players: 9, power: 1, group: 'information', styles: ['equilibree', 'experte'] },
  'capitaine': { players: 8, power: 1, group: 'vote', styles: ['equilibree', 'experte'] },
  'villageois-villageois': { players: 9, power: 1, group: 'bond', styles: ['equilibree', 'experte'] },
  'deux-soeurs': { players: 10, power: 1, group: 'bond', styles: ['equilibree', 'experte'] },
  'trois-freres': { players: 12, power: 1, group: 'bond', styles: ['equilibree', 'experte'] },
  'juge-begue': { players: 10, power: 2, group: 'vote', styles: ['equilibree', 'experte'] },
  'chevalier-epee-rouillee': { players: 10, power: 1, group: 'elimination', styles: ['equilibree', 'experte'] },
  'comedien': { players: 12, power: 2, reserve: 3, styles: ['experte'] },
  'renard': { players: 10, power: 2, group: 'information', styles: ['equilibree', 'experte'] },
  'montreur-ours': { players: 10, power: 1, group: 'information', styles: ['equilibree', 'experte'] },
  'cupidon': { players: 8, power: 1, group: 'bond', styles: ['equilibree', 'experte'] },
  'voleur': { players: 8, power: 1, reserve: 2, styles: ['equilibree', 'experte'] },
  'servante-devouee': { players: 11, power: 2, styles: ['experte'] },
  'enfant-sauvage': { players: 10, power: 2, styles: ['experte'] },
  'chien-loup': { players: 10, power: 2, styles: ['experte'] },
  'ange': { players: 10, power: 2, group: 'solo', styles: ['experte'] },
  'abominable-sectaire': { players: 13, power: 2, group: 'solo', styles: ['experte'] },
  'loup-garou-blanc': { players: 13, power: 3, group: 'solo', styles: ['experte'] },
  'grand-mechant-loup': { players: 13, power: 2, group: 'wolf-power', styles: ['equilibree', 'experte'] },
  'infect-pere-des-loups': { players: 13, power: 2, group: 'wolf-power', styles: ['equilibree', 'experte'] },
};

const ROLE_BY_ID = new Map(ROLES.map((role) => [role.id, role]));
const SIMPLE_VILLAGER = ROLE_BY_ID.get('simple-villageois')!;
const BASIC_WOLF = ROLE_BY_ID.get('loup-garou')!;

/**
 * The classic distribution follows the published Thiercelieux table for 8–18
 * players. Values below 8 and above 18 extend that curve for this app's range.
 */
export function classicWolfCount(playerCount: number): number {
  if (playerCount < 8) return 1;
  if (playerCount <= 12) return 2;
  if (playerCount <= 18) return 3;
  return Math.min(5, 3 + Math.ceil((playerCount - 18) / 6));
}

export function composeGame(
  playerCount: number,
  style: CompositionStyle,
  random: () => number = Math.random,
): GameComposition {
  const wolfCount = classicWolfCount(playerCount);
  const roles: Role[] = [];
  const reserveCards: Role[] = [];
  const notes: string[] = [];

  const wolfSpecials = shuffle(
    ROLES.filter((role) => role.team === 'loup' && role.id !== BASIC_WOLF.id),
    random,
  );
  const wolfSpecialCount = style === 'decouverte' ? 0 : playerCount >= 13 ? 1 : 0;
  const selectedWolfSpecials = wolfSpecials.slice(0, Math.min(wolfSpecialCount, wolfCount - 1));
  roles.push(...selectedWolfSpecials);
  roles.push(...Array.from({ length: wolfCount - selectedWolfSpecials.length }, () => BASIC_WOLF));

  const soloWolf = style === 'experte' && playerCount >= 13 && random() < 0.28
    ? ROLE_BY_ID.get('loup-garou-blanc')
    : undefined;
  if (soloWolf && roles.length > 1) {
    roles[roles.findIndex((role) => role.id === BASIC_WOLF.id)] = soloWolf;
    notes.push('Le Loup-Garou Blanc compte parmi les loups la nuit, mais poursuit un objectif solitaire.');
  }

  const townSlots = playerCount - wolfCount;
  const mandatorySeer = ROLE_BY_ID.get('voyante')!;
  roles.push(mandatorySeer);
  let remainingSlots = townSlots - 1;
  let remainingPower = style === 'decouverte' ? 0 : style === 'equilibree'
    ? Math.min(7, Math.floor(townSlots * 0.75))
    : Math.min(9, Math.floor(townSlots * 0.9));
  // The discovery and balanced profiles retain the classic Seer as their only
  // strong information role. Experienced groups may add one alternate source.
  const usedGroups = new Set<string>(style === 'experte' ? [] : ['information']);
  const available = shuffle(
    ROLES.filter((role) => {
      const profile = ROLE_PROFILES[role.id];
      return role.team === 'village' && role.id !== 'simple-villageois'
        && profile?.styles.includes(style) && playerCount >= (profile?.players ?? 99);
    }),
    random,
  );
  const slotsBudget = style === 'decouverte' ? 0 : style === 'equilibree'
    ? Math.max(1, Math.ceil(remainingSlots / 2))
    : Math.max(1, Math.floor(remainingSlots / 2));
  let chosenSpecials = 0;

  for (const role of available) {
    if (chosenSpecials >= slotsBudget) break;
    const profile = ROLE_PROFILES[role.id];
    if (!profile) continue;
    const units = role.id === 'deux-soeurs' ? 2 : role.id === 'trois-freres' ? 3 : 1;
    if (units > remainingSlots || profile.power > remainingPower) continue;
    if (profile.group && usedGroups.has(profile.group)) continue;
    if (profile.group === 'solo') continue;

    roles.push(...Array.from({ length: units }, () => role));
    remainingSlots -= units;
    remainingPower -= profile.power;
    chosenSpecials += 1;
    if (profile.group) usedGroups.add(profile.group);

    if (profile.reserve) {
      if (role.id === 'voleur') {
        reserveCards.push(SIMPLE_VILLAGER, SIMPLE_VILLAGER);
      } else {
        const reservePool = shuffle(
          ROLES.filter((candidate) => candidate.team === 'village'
            && candidate.id !== 'simple-villageois'
            && !roles.some((activeRole) => activeRole.id === candidate.id)),
          random,
        );
        reserveCards.push(...reservePool.slice(0, profile.reserve));
      }
      notes.push(role.id === 'voleur'
        ? 'Le Voleur nécessite deux cartes supplémentaires, laissées face cachée au centre.'
        : 'Le Comédien nécessite trois rôles supplémentaires à mettre de côté.');
    }
  }

  if (style === 'experte' && playerCount >= 10 && random() < 0.32) {
    const ambiguous = shuffle(
      ROLES.filter((role) => role.team === 'ambigu' && playerCount >= (ROLE_PROFILES[role.id]?.players ?? 99)),
      random,
    )[0];
    if (ambiguous && remainingSlots > 0) {
      roles.push(ambiguous);
      remainingSlots -= 1;
      notes.push(`${ambiguous.name} peut changer de camp : le nombre de loups effectif peut évoluer pendant la partie.`);
    }
  }

  if (style === 'experte' && playerCount >= 10 && !roles.some((role) => ROLE_PROFILES[role.id]?.group === 'solo') && random() < 0.35 && remainingSlots > 0) {
    const soloRoles = shuffle(
      [ROLE_BY_ID.get('ange'), ROLE_BY_ID.get('abominable-sectaire')]
        .filter((role): role is Role => !!role && playerCount >= ROLE_PROFILES[role.id].players),
      random,
    );
    const solo = soloRoles[0];
    if (solo) {
      roles.push(solo);
      remainingSlots -= 1;
      notes.push('L’Abominable Sectaire a son propre objectif et nécessite que le meneur définisse deux groupes.');
    }
  }

  roles.push(...Array.from({ length: Math.max(0, remainingSlots) }, () => SIMPLE_VILLAGER));
  if (playerCount < 8 || playerCount > 18) {
    notes.push('Le nombre de loups est extrapolé hors du tableau de répartition officiel (8 à 18 joueurs).');
  }
  if (style === 'experte') {
    notes.push('La composition experte peut inclure des rôles ambigus ou solitaires ; vérifiez leurs règles avant la partie.');
  }

  return { roles: shuffle(roles, random), reserveCards, wolfCount, notes: [...new Set(notes)] };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}
