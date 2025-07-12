import { Art } from "./Art";

export interface Commande {
  id: string;
  fournisseur: string;
  dateCommande: string;
  montant: number;
  IdConsultation: string;
  CheminCommande: string;
  articles: Art[];
  statut: "En cours" | "Terminée" | "Annulée";
}