import { Lot } from "./Lot";
export type LotOffre = Lot & {
  id_offre?: string;
  id_fournisseur?: string;
  montant: number;
};
