export interface OffreType {
  id: string;
  fournisseur: string;
  dateSoumission: string;
  montant: number;
  IdConsultation: string;
  CheminOffre: string;
  statut: "Acceptée" | "En attente" | "Rejetée";
}
