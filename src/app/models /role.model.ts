export type RoleTeam = 'village' | 'loup' | 'solitaire';

export interface Role {
  id: string;
  name: string;
  image: string;
  team: RoleTeam;
  description: string[];
  generalInfo: string[];
  howToPlay: string[];
  strategies: string[];
}