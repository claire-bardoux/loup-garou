import { Side } from "../constants /sides.data";

export interface Role {
  id: string;
  name: string;
  description: string;
  side: Side;
  order: number; // Ordre d'appel nocturne
}