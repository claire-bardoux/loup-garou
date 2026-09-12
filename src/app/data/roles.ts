import { Role } from "../models /role.model";


export const ROLES: Role[] = [
  {
    id: 'voyante',
    name: 'Voyante',
    image: 'assets/roles/voyante.png',
    team: 'village'
  },
  {
    id: 'sorciere',
    name: 'Sorcière',
    image: 'assets/roles/sorciere.png',
    team: 'village'
  },
  {
    id: 'loup-garou',
    name: 'Loup Garou',
    image: 'assets/roles/loup-garou.png',
    team: 'loup'
  },
  {
    id: 'chasseur',
    name: 'Chasseur',
    image: 'assets/roles/chasseur.png',
    team: 'village'
  },
  {
    id: 'cupidon',
    name: 'Cupidon',
    image: 'assets/roles/cupidon.png',
    team: 'village'
  },
  {
    id: 'ancien',
    name: 'Ancien',
    image: 'assets/roles/ancien.png',
    team: 'village'
  }
];