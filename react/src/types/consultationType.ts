export interface consultationType {
  id_consultation:string;
  date_creation:string;
  nombre_des_lots:number;
  type: "equipement" | "consomable";
  statut_offre: "non recue" | "partiel" | "total";
  statut_evaluation: "non évalué" | "évalué";
}