import { Role } from '../model/role.model';
import { Side } from './sides.data';

export const ROLES: Role[] = [
  // Village 
  { id: 'thief', name: 'Voleur', side: Side.VILLAGE, order: 16, description: 'Peut changer de rôle avec un autre joueur chaque nuit.' },
  { id: 'two_sisters', name: 'Deux Soeurs', side: Side.VILLAGE, order: 21, description: 'Se reconnaissent mutuellement et communiquent entre elles.' },
  { id: 'villager', name: 'Villageois', side: Side.VILLAGE, order: 0, description: 'Il n\'a aucun pouvoir particulier.' },
  { id: 'seer', name: 'Voyante', side: Side.VILLAGE, order: 1, description: 'Découvre chaque nuit le rôle d\'un joueur.' },
  { id: 'little_girl', name: 'Petite Fille', side: Side.VILLAGE, order: 19, description: 'Peut regarder les loups-garous chaque nuit (mais ils la verront).' },
  { id: 'witch', name: 'Sorcière', side: Side.VILLAGE, order: 2, description: 'Peut chaque nuit sauver quelqu\'un ou éliminer quelqu\'un.' },
  { id: 'servant', name: 'Servante', side: Side.VILLAGE, order: 18, description: 'Apprend si la cible qu\'elle a choisie est un rôle spécial.' },
  { id: 'fox', name: 'Renard', side: Side.VILLAGE, order: 14, description: 'Apprend chaque nuit si un loup-garou est parmi ses cibles.' },
  { id: 'bear_showman', name: 'Montreur d\'ours', side: Side.VILLAGE, order: 15, description: 'Son ours attaque chaque nuit le joueur qu\'il désigne.' },
  { id: 'hunter', name: 'Chasseur', side: Side.VILLAGE, order: 3, description: 'En mourant, il tue le joueur de son choix.' },
  { id: 'rusty_sword_knight', name: 'Le chevalier à l\'épée rouillée', side: Side.VILLAGE, order: 12, description: 'Chaque jour, juge et exécute son verdict.' },
  { id: 'cupid', name: 'Cupidon', side: Side.VILLAGE, order: 4, description: 'La première nuit, lie deux joueurs qui meurent ensemble.' },
  { id: 'three_brothers', name: 'Trois Frères', side: Side.VILLAGE, order: 22, description: 'Se reconnaissent mutuellement et communiquent entre eux.' },
  { id: 'mute_judge', name: 'Juge Bègue', side: Side.VILLAGE, order: 17, description: 'Son vote vaut double lors des votes.' },
  
  // Loups-Garous
  { id: 'wolf', name: 'Loup-Garou', side: Side.WOLVES, order: 5, description: 'Se réveille chaque nuit pour éliminer un villageois.' },
  { id: 'big_bad_wolf', name: 'Grand Méchant Loup', side: Side.WOLVES, order: 6, description: 'Loup-Garou renforcé avec des pouvoirs additionnels.' },
  { id: 'white_wolf', name: 'Loup Blanc', side: Side.WOLVES, order: 7, description: 'Peut éliminer un autre loup-garou chaque nuit.' },
  { id: 'infected_father_wolves', name: 'Infect Père des Loups', side: Side.WOLVES, order: 9, description: 'Peut convertir un villageois en loup-garou.' },
  
  // Rôles Ambigus
  { id: 'werewolf_dog', name: 'Chien-Loup', side: Side.AMBIGUS, order: 8, description: 'Peut choisir de rejoindre le village ou les loups.' },
  { id: 'abominable_sectarian', name: 'L\'abominable Sectaire', side: Side.AMBIGUS, order: 10, description: 'Gagne avec les loups-garous s\'il les sauve ou meurt en héros.' },
  { id: 'angel', name: 'L\'ange', side: Side.AMBIGUS, order: 11, description: 'Gagne si le joueur choisi au premier jour meurt.' },
  { id: 'comedian', name: 'Comédien', side: Side.AMBIGUS, order: 13, description: 'Fait rire le village et gagne s\'il n\'est pas découvert.' },
  { id: 'wild_child', name: 'Enfant Sauvage', side: Side.AMBIGUS, order: 20, description: 'Choisit un modèle - s\'il meurt, l\'enfant devient loup-garou.' },
  
  
];