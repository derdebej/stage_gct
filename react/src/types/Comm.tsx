export interface Commande {
  id: string;
  fournisseur: string;
  dateCommande: string;
  montant: number;
  IdConsultation: string;
  CheminCommande: string;
  statut: "En cours" | "Terminée" | "Annulée";
}