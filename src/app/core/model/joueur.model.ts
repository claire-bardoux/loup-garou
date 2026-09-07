import { Side } from "../constants /sides.data";
import { Role } from "./role.model";

export enum Status {
  ALIVE = 'alive',
  DEAD = 'dead',
}

export interface Joueur {
  name: string; 
  role: Role; 
  Status: Status;
  ActionMJ?: string;
}