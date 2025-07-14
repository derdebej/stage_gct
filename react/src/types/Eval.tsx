export interface Eval {
  id_eval: string;
  id_offre: string;
  id_fournisseur: string;
  date: string;
  montant: number;
  id_consultation: string;
  chemin_evaluation: string;
  conformite: "Conforme" | "Non Conforme";
}