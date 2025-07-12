export interface Eval {
  id: string;
  IdOffre: string;
  fournisseur: string;
  date: string;
  montant: number;
  IdConsultation: string;
  CheminEvaluation: string;
  statut: "Conforme" | "Non Conforme";
}