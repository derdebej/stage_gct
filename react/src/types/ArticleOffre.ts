import { Art } from "./Art";

export type ArticleOffre = Art & {
  id_offre?:string;
  id_fournisseur?:string;
  montant:number;
}

