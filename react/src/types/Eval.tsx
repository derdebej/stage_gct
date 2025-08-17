export interface Eval {
  id_eval: string;
  id_consultation: string;
  date: string;
  chemin_document: string;
  conformite: "Conforme" | "Non Conforme";
  id_fournisseur: string;
  id_lot: string;
}
