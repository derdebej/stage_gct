--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: conformite_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.conformite_enum AS ENUM (
    'Conforme',
    'Non Conforme'
);


ALTER TYPE public.conformite_enum OWNER TO postgres;

--
-- Name: offre_statut_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.offre_statut_enum AS ENUM (
    'Non évalué',
    'évalué'
);


ALTER TYPE public.offre_statut_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article (
    id_article bigint NOT NULL,
    id_da character varying NOT NULL,
    id_lot character varying,
    designation character varying NOT NULL,
    description text,
    prix_unitaire double precision,
    quantite bigint NOT NULL
);


ALTER TABLE public.article OWNER TO postgres;

--
-- Name: article_id_article_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.article_id_article_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.article_id_article_seq OWNER TO postgres;

--
-- Name: article_id_article_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.article_id_article_seq OWNED BY public.article.id_article;


--
-- Name: commande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande (
    id_commande character varying NOT NULL,
    date date NOT NULL,
    statut character varying,
    id_fournisseur bigint,
    id_consultation character varying,
    type character varying,
    CONSTRAINT commande_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_cours'::character varying, 'livree'::character varying, 'annulee'::character varying])::text[])))
);


ALTER TABLE public.commande OWNER TO postgres;

--
-- Name: commande_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande_article (
    id_commande_article integer NOT NULL,
    id_commande character varying,
    id_offre integer NOT NULL,
    id_article integer NOT NULL,
    id_da character varying
);


ALTER TABLE public.commande_article OWNER TO postgres;

--
-- Name: commande_article_id_commande_article_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commande_article_id_commande_article_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_article_id_commande_article_seq OWNER TO postgres;

--
-- Name: commande_article_id_commande_article_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commande_article_id_commande_article_seq OWNED BY public.commande_article.id_commande_article;


--
-- Name: commande_id_commande_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commande_id_commande_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_id_commande_seq OWNER TO postgres;

--
-- Name: commande_id_commande_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commande_id_commande_seq OWNED BY public.commande.id_commande;


--
-- Name: commande_lot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande_lot (
    id_commande_lot integer NOT NULL,
    id_commande character varying,
    id_offre integer NOT NULL,
    id_lot character varying NOT NULL
);


ALTER TABLE public.commande_lot OWNER TO postgres;

--
-- Name: commande_lot_id_commande_lot_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commande_lot_id_commande_lot_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_lot_id_commande_lot_seq OWNER TO postgres;

--
-- Name: commande_lot_id_commande_lot_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commande_lot_id_commande_lot_seq OWNED BY public.commande_lot.id_commande_lot;


--
-- Name: consultation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultation (
    id_consultation character varying NOT NULL,
    id_utilisateur bigint NOT NULL,
    date_creation date NOT NULL,
    nombre_des_lots bigint,
    type character varying,
    statut_offre character varying DEFAULT 'non reçue'::character varying,
    statut_evaluation character varying DEFAULT 'non évalué'::character varying,
    CONSTRAINT chk_statut_evaluation CHECK (((statut_evaluation)::text = ANY ((ARRAY['évalué'::character varying, 'non évalué'::character varying])::text[]))),
    CONSTRAINT chk_statut_offre CHECK (((statut_offre)::text = ANY ((ARRAY['non reçue'::character varying, 'offre partielle'::character varying, 'offre totale'::character varying])::text[])))
);


ALTER TABLE public.consultation OWNER TO postgres;

--
-- Name: consultation_da; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultation_da (
    id_consultation character varying NOT NULL,
    id_da character varying NOT NULL
);


ALTER TABLE public.consultation_da OWNER TO postgres;

--
-- Name: consultation_id_consultation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultation_id_consultation_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultation_id_consultation_seq OWNER TO postgres;

--
-- Name: consultation_id_consultation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultation_id_consultation_seq OWNED BY public.consultation.id_consultation;


--
-- Name: decision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.decision (
    id_decision bigint NOT NULL,
    id_lot character varying NOT NULL,
    id_offre bigint NOT NULL,
    id_fournisseur bigint NOT NULL,
    id_eval bigint NOT NULL,
    date_decision date DEFAULT CURRENT_DATE
);


ALTER TABLE public.decision OWNER TO postgres;

--
-- Name: decision_id_decision_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.decision_id_decision_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.decision_id_decision_seq OWNER TO postgres;

--
-- Name: decision_id_decision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.decision_id_decision_seq OWNED BY public.decision.id_decision;


--
-- Name: demande_d_achat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demande_d_achat (
    id_da character varying NOT NULL,
    id_utilisateur bigint NOT NULL,
    titre character varying NOT NULL,
    date date NOT NULL,
    demandeur character varying NOT NULL,
    etat character varying,
    montant double precision,
    nature character varying,
    objet character varying,
    numaed character varying,
    chemin_document character varying,
    CONSTRAINT demande_d_achat_nature_check CHECK (((nature)::text = ANY ((ARRAY['Investissement'::character varying, 'Exploitation'::character varying])::text[]))),
    CONSTRAINT etat_check CHECK (((etat)::text = ANY ((ARRAY['Non Traitée'::character varying, 'En Cours'::character varying, 'Traitée'::character varying])::text[])))
);


ALTER TABLE public.demande_d_achat OWNER TO postgres;

--
-- Name: demande_d_achat_id_da_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.demande_d_achat_id_da_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demande_d_achat_id_da_seq OWNER TO postgres;

--
-- Name: demande_d_achat_id_da_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.demande_d_achat_id_da_seq OWNED BY public.demande_d_achat.id_da;


--
-- Name: evaluation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluation (
    id_eval bigint NOT NULL,
    date date,
    chemin_document character varying,
    id_fournisseur bigint,
    id_consultation character varying NOT NULL
);


ALTER TABLE public.evaluation OWNER TO postgres;

--
-- Name: evaluation_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluation_article (
    id_evaluation_article integer NOT NULL,
    id_eval integer NOT NULL,
    id_article integer NOT NULL,
    id_da character varying NOT NULL,
    id_offre integer NOT NULL,
    conformite character varying(20) NOT NULL,
    CONSTRAINT evaluation_article_conformite_check CHECK (((conformite)::text = ANY ((ARRAY['Conforme'::character varying, 'Non Conforme'::character varying])::text[])))
);


ALTER TABLE public.evaluation_article OWNER TO postgres;

--
-- Name: evaluation_article_id_evaluation_article_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluation_article_id_evaluation_article_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluation_article_id_evaluation_article_seq OWNER TO postgres;

--
-- Name: evaluation_article_id_evaluation_article_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluation_article_id_evaluation_article_seq OWNED BY public.evaluation_article.id_evaluation_article;


--
-- Name: evaluation_id_eval_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluation_id_eval_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluation_id_eval_seq OWNER TO postgres;

--
-- Name: evaluation_id_eval_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluation_id_eval_seq OWNED BY public.evaluation.id_eval;


--
-- Name: evaluation_lot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluation_lot (
    id_evaluation_lot integer NOT NULL,
    id_eval integer NOT NULL,
    id_lot character varying NOT NULL,
    id_offre integer NOT NULL,
    conformite character varying(20) NOT NULL,
    CONSTRAINT evaluation_lot_conformite_check CHECK (((conformite)::text = ANY ((ARRAY['Conforme'::character varying, 'Non Conforme'::character varying])::text[])))
);


ALTER TABLE public.evaluation_lot OWNER TO postgres;

--
-- Name: evaluation_lot_id_evaluation_lot_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluation_lot_id_evaluation_lot_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluation_lot_id_evaluation_lot_seq OWNER TO postgres;

--
-- Name: evaluation_lot_id_evaluation_lot_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluation_lot_id_evaluation_lot_seq OWNED BY public.evaluation_lot.id_evaluation_lot;


--
-- Name: fournisseur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fournisseur (
    id_fournisseur bigint NOT NULL,
    nom character varying NOT NULL,
    email character varying,
    num_tel character varying
);


ALTER TABLE public.fournisseur OWNER TO postgres;

--
-- Name: fournisseur_id_fournisseur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fournisseur_id_fournisseur_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fournisseur_id_fournisseur_seq OWNER TO postgres;

--
-- Name: fournisseur_id_fournisseur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fournisseur_id_fournisseur_seq OWNED BY public.fournisseur.id_fournisseur;


--
-- Name: lot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lot (
    id_lot character varying NOT NULL,
    id_consultation character varying NOT NULL
);


ALTER TABLE public.lot OWNER TO postgres;

--
-- Name: lot_id_lot_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lot_id_lot_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lot_id_lot_seq OWNER TO postgres;

--
-- Name: lot_id_lot_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lot_id_lot_seq OWNED BY public.lot.id_lot;


--
-- Name: offre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offre (
    id_offre bigint NOT NULL,
    id_fournisseur bigint NOT NULL,
    date_offre date NOT NULL,
    chemin_document character varying,
    id_consultation character varying
);


ALTER TABLE public.offre OWNER TO postgres;

--
-- Name: offre_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offre_article (
    id_offre bigint NOT NULL,
    id_article bigint NOT NULL,
    id_da character varying NOT NULL,
    montant numeric(12,3) NOT NULL
);


ALTER TABLE public.offre_article OWNER TO postgres;

--
-- Name: offre_id_offre_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offre_id_offre_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offre_id_offre_seq OWNER TO postgres;

--
-- Name: offre_id_offre_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offre_id_offre_seq OWNED BY public.offre.id_offre;


--
-- Name: offre_lot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offre_lot (
    id_offre bigint NOT NULL,
    id_lot character varying NOT NULL,
    montant numeric(12,3) DEFAULT 0 NOT NULL
);


ALTER TABLE public.offre_lot OWNER TO postgres;

--
-- Name: reception; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reception (
    id_reception character varying NOT NULL,
    date date NOT NULL,
    id_commande character varying,
    type character varying
);


ALTER TABLE public.reception OWNER TO postgres;

--
-- Name: reception_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reception_article (
    id_reception character varying NOT NULL,
    id_commande_article bigint NOT NULL,
    quantite_recue numeric NOT NULL,
    CONSTRAINT reception_article_quantite_recue_check CHECK ((quantite_recue >= (0)::numeric))
);


ALTER TABLE public.reception_article OWNER TO postgres;

--
-- Name: reception_id_reception_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reception_id_reception_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reception_id_reception_seq OWNER TO postgres;

--
-- Name: reception_id_reception_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reception_id_reception_seq OWNED BY public.reception.id_reception;


--
-- Name: reception_lot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reception_lot (
    id_reception character varying NOT NULL,
    id_commande_lot character varying NOT NULL,
    recu boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reception_lot OWNER TO postgres;

--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    id_utilisateur bigint NOT NULL,
    nom character varying NOT NULL,
    email character varying NOT NULL,
    mot_de_passe character varying NOT NULL,
    date_de_naissance date
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_id_utilisateur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_id_utilisateur_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateur_id_utilisateur_seq OWNER TO postgres;

--
-- Name: utilisateur_id_utilisateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_utilisateur_seq OWNED BY public.utilisateur.id_utilisateur;


--
-- Name: article id_article; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article ALTER COLUMN id_article SET DEFAULT nextval('public.article_id_article_seq'::regclass);


--
-- Name: commande id_commande; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande ALTER COLUMN id_commande SET DEFAULT nextval('public.commande_id_commande_seq'::regclass);


--
-- Name: commande_article id_commande_article; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_article ALTER COLUMN id_commande_article SET DEFAULT nextval('public.commande_article_id_commande_article_seq'::regclass);


--
-- Name: commande_lot id_commande_lot; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_lot ALTER COLUMN id_commande_lot SET DEFAULT nextval('public.commande_lot_id_commande_lot_seq'::regclass);


--
-- Name: consultation id_consultation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation ALTER COLUMN id_consultation SET DEFAULT nextval('public.consultation_id_consultation_seq'::regclass);


--
-- Name: decision id_decision; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decision ALTER COLUMN id_decision SET DEFAULT nextval('public.decision_id_decision_seq'::regclass);


--
-- Name: demande_d_achat id_da; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande_d_achat ALTER COLUMN id_da SET DEFAULT nextval('public.demande_d_achat_id_da_seq'::regclass);


--
-- Name: evaluation id_eval; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation ALTER COLUMN id_eval SET DEFAULT nextval('public.evaluation_id_eval_seq'::regclass);


--
-- Name: evaluation_article id_evaluation_article; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_article ALTER COLUMN id_evaluation_article SET DEFAULT nextval('public.evaluation_article_id_evaluation_article_seq'::regclass);


--
-- Name: evaluation_lot id_evaluation_lot; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_lot ALTER COLUMN id_evaluation_lot SET DEFAULT nextval('public.evaluation_lot_id_evaluation_lot_seq'::regclass);


--
-- Name: fournisseur id_fournisseur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fournisseur ALTER COLUMN id_fournisseur SET DEFAULT nextval('public.fournisseur_id_fournisseur_seq'::regclass);


--
-- Name: lot id_lot; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lot ALTER COLUMN id_lot SET DEFAULT nextval('public.lot_id_lot_seq'::regclass);


--
-- Name: offre id_offre; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre ALTER COLUMN id_offre SET DEFAULT nextval('public.offre_id_offre_seq'::regclass);


--
-- Name: reception id_reception; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception ALTER COLUMN id_reception SET DEFAULT nextval('public.reception_id_reception_seq'::regclass);


--
-- Name: utilisateur id_utilisateur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id_utilisateur SET DEFAULT nextval('public.utilisateur_id_utilisateur_seq'::regclass);


--
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.article VALUES (173980, 'AN105426', NULL, 'REPARATION PHOTOCOPIEUR XEROX WC 5325', '', 2600, 1);
INSERT INTO public.article VALUES (244418, 'AN101056', '555551', 'SERVEUR DE STOCKAGE EN RESEAU NAS', '', 15000, 1);
INSERT INTO public.article VALUES (248614, 'AN103360', '10021', 'TOURET CABLE ETHERNET CERTIFIE  CAT6A S/FTP LSZH DE 500 METRES', '', 1500, 1);
INSERT INTO public.article VALUES (248611, 'AN103360', '10023', 'DISQUE DUR SSD 512GO', '2.5" Vitesse 530mbps(Lecture),430 mbps(Ecriture)', 100, 50);
INSERT INTO public.article VALUES (248610, 'AN103360', '10022', 'CABLE RCA (JAUNE, ROUGE, BLANC) LONGUEUR 2 METRES', '', 10, 2);
INSERT INTO public.article VALUES (248609, 'AN103360', '10023', 'CABLE JACK 3,5 MM (AUDIO) LONGUEUR 2 METRES', '', 10, 2);
INSERT INTO public.article VALUES (248608, 'AN103360', '10024', 'MODULE WI-FI POUR VIDEOPROJECTEURS EPSON', 'compatible avec EB-E20', 800, 2);
INSERT INTO public.article VALUES (248604, 'AN103360', '10023', 'DAP3711', '', 950, 2);
INSERT INTO public.article VALUES (248603, 'AN103360', '10021', 'CABLE ETHERNET CAT 6 UTP LONGUEUR 3M', '', 3, 100);
INSERT INTO public.article VALUES (248601, 'AN103360', '10022', 'TELEVISEUR LED 32" HD', 'NON SMART,PAS de récepteur intégré ,ports HDMI, ports USB,', 500, 6);
INSERT INTO public.article VALUES (248599, 'AN103360', '10021', 'TONER POUR IMPRIMANTE KYOCERA PA5500X 3410', 'd''origine 15000 pages.', 500, 20);
INSERT INTO public.article VALUES (248591, 'AN103360', '10021', 'CABLES ETHERNET "CAT6 UTP" LONGUEUR: 5 METRES', '', 4.5, 70);
INSERT INTO public.article VALUES (248590, 'AN103360', '10021', 'MODULE HPE X120 1G SFP LC SX TRANSCEIVER PN: JD118B', '', 880, 12);
INSERT INTO public.article VALUES (248589, 'AN103360', '10023', 'KIT DE NETTOYAGE A FIBRE OPTIQUE pour Connecteurs FC SC ST LC MU, Cassette, Stylos, Écouvillons, Lingettes, Bouteille de Pompe, Sac de Transport, 550+ Utilisations', '', 300, 1);
INSERT INTO public.article VALUES (248583, 'AN103360', '10023', 'SERRURE POUR ARMOIRE INFORMATIQUE (METALLIQUE) AVEC CLES', '', 18, 5);
INSERT INTO public.article VALUES (248581, 'AN103360', '10024', 'GUIDE DE CORDONS 19" 2U METALLIQUE 5 ANNEAUX', '', 30, 5);
INSERT INTO public.article VALUES (248580, 'AN103360', '10021', 'PLATINET LABEL REMOVER SPRAY/400ML (POUR IMPRIMANTES)', '', 20, 6);
INSERT INTO public.article VALUES (248579, 'AN103360', '10022', 'SPRAY MULTIFONCTION PLATINET PFSP40 ANTIROUILLE - PROTECTION - NETTOYAGE / 400ML', '', 20, 4);
INSERT INTO public.article VALUES (248577, 'AN103360', '10021', 'PHOTOCONDUCTEUR POUR IMPRIMANTE KYOCERA 3260DN', '', 220, 5);
INSERT INTO public.article VALUES (238344, 'AN103360', '10021', 'BOUTEILLE EPSON 110 (C13T03P14A)', '', 80, 30);
INSERT INTO public.article VALUES (235816, 'AN103360', '10022', 'PHOTOCONDUCTEUR POUR IMPRIMANTE KYOCERA 2040', '', 250, 8);
INSERT INTO public.article VALUES (225960, 'AN103360', '10022', 'ADAPTATEUR HDMI TO VGA', '', 19.9, 10);
INSERT INTO public.article VALUES (225230, 'AN103360', '10024', 'PHOTOCONDUCTEUR  ORIGINE POUR IMPRIMANTE EPSON M300', '', 250, 5);
INSERT INTO public.article VALUES (223636, 'AN103360', '10022', 'ADAPTATEUR VGA VERS HDMI', '', 50, 5);
INSERT INTO public.article VALUES (214042, 'AN103360', '10022', 'CABLE HDMI LONGUEUR 15M', '', 35, 5);
INSERT INTO public.article VALUES (214041, 'AN103360', '10023', 'CABLE HDMI LONGUEUR 5M', '', 14, 5);
INSERT INTO public.article VALUES (214040, 'AN103360', '10023', 'CABLE HDMI LONGUEUR 3M', '', 7, 5);
INSERT INTO public.article VALUES (206011, 'AN103360', '10023', 'TONER NOIR ADAPTABLE POUR IMP.EPSON WORKFORCE AL-M300/AL-MX300', '', 60, 30);
INSERT INTO public.article VALUES (195760, 'AN103360', '10021', 'CLAVIER USB clavier dell azerty francais/arabe 104 touches filiare Interface USB 2.0 couleur noir', '', 45, 20);
INSERT INTO public.article VALUES (175434, 'AN103360', '10021', 'FLASH DISQUE 16 G', 'ADATA', 15, 10);
INSERT INTO public.article VALUES (121838, 'AN103360', '10022', 'SOURIS OPTIQUE USB SOURIS FILAIRE HP usb , 3 boutons , couleur noir', '', 25, 50);


--
-- Data for Name: commande; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.commande VALUES ('90', '2025-08-27', 'livree', 2, '1002', 'equipement');
INSERT INTO public.commande VALUES ('91', '2025-08-27', 'livree', 5, '55555', 'equipement');
INSERT INTO public.commande VALUES ('ddd11', '2025-08-27', 'livree', 4, 'fff44', 'consommable');


--
-- Data for Name: commande_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.commande_article VALUES (142, 'ddd11', 115, 173980, 'AN105426');


--
-- Data for Name: commande_lot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.commande_lot VALUES (45, '90', 113, '10021');
INSERT INTO public.commande_lot VALUES (46, '90', 113, '10022');
INSERT INTO public.commande_lot VALUES (47, '90', 113, '10023');
INSERT INTO public.commande_lot VALUES (48, '91', 114, '555551');


--
-- Data for Name: consultation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.consultation VALUES ('1002', 2, '2025-08-27', 4, 'equipement', 'offre totale', 'évalué');
INSERT INTO public.consultation VALUES ('55555', 2, '2025-08-27', 1, 'equipement', 'offre totale', 'évalué');
INSERT INTO public.consultation VALUES ('fff44', 2, '2025-08-27', 0, 'consommable', 'offre totale', 'évalué');


--
-- Data for Name: consultation_da; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.consultation_da VALUES ('fff44', 'AN105426');


--
-- Data for Name: decision; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: demande_d_achat; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.demande_d_achat VALUES ('AN103360', 2, 'Demande Achat pour la Division Informatique', '2024-12-02', 'TRABELSI HANA', 'Traitée', 46534, 'Investissement', NULL, NULL, 'Demande d''achat/DA AN103360.pdf');
INSERT INTO public.demande_d_achat VALUES ('AN101056', 2, 'Serveur de stockage en réseau NAS', '2024-04-16', 'TRABELSI HANA', 'Traitée', 15000, 'Investissement', 'Acquisition et rénouvellement d''équipements micro-informatiques,Div. Informatique à Gabés du GCT', '3.80.2024.421', 'Demande d''achat/DA Serveur de stockage NAS.pdf');
INSERT INTO public.demande_d_achat VALUES ('AN105426', 2, 'ENTRETIEN POUR MACHINE PHOTOPIEUSE', '2025-07-09', 'HAJJEJ RADHIA', 'Traitée', 2600, 'Exploitation', NULL, NULL, 'Demande d''achat/Requisition_Demandedachatnumrique.pdf');


--
-- Data for Name: evaluation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.evaluation VALUES (87, '2025-08-27', '/Evaluation/1002/DA Serveur de stockage NAS.pdf', NULL, '1002');
INSERT INTO public.evaluation VALUES (88, '2025-08-27', '/Evaluation/55555/Requisition_Demandedachatnumrique.pdf', NULL, '55555');
INSERT INTO public.evaluation VALUES (89, '2025-08-27', '/Evaluation/fff44/Requisition_Demandedachatnumrique.pdf', NULL, 'fff44');


--
-- Data for Name: evaluation_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.evaluation_article VALUES (118, 89, 173980, 'AN105426', 115, 'Conforme');


--
-- Data for Name: evaluation_lot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.evaluation_lot VALUES (74, 87, '10021', 113, 'Conforme');
INSERT INTO public.evaluation_lot VALUES (75, 87, '10022', 113, 'Conforme');
INSERT INTO public.evaluation_lot VALUES (76, 87, '10023', 113, 'Conforme');
INSERT INTO public.evaluation_lot VALUES (77, 87, '10024', 113, 'Non Conforme');
INSERT INTO public.evaluation_lot VALUES (78, 88, '555551', 114, 'Conforme');


--
-- Data for Name: fournisseur; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fournisseur VALUES (1, 'Alpha Industries', 'contact@alpha.com', '21620100101');
INSERT INTO public.fournisseur VALUES (2, 'Beta Supplies', 'info@beta.tn', '21620200202');
INSERT INTO public.fournisseur VALUES (3, 'Gamma Solutions', 'sales@gamma.tn', '21620300303');
INSERT INTO public.fournisseur VALUES (4, 'Delta Corp', 'support@delta.com', '21620400404');
INSERT INTO public.fournisseur VALUES (5, 'Epsilon Services', 'contact@epsilon.tn', '21620500505');
INSERT INTO public.fournisseur VALUES (6, 'Zeta Group', 'zeta@group.com', '21620600606');
INSERT INTO public.fournisseur VALUES (7, 'Eta Traders', 'eta@traders.com', '21620700707');
INSERT INTO public.fournisseur VALUES (8, 'Theta Logistics', 'theta@logistics.tn', '21620800808');
INSERT INTO public.fournisseur VALUES (9, 'Iota Distribution', 'iota@distribution.com', '21620900909');
INSERT INTO public.fournisseur VALUES (10, 'Kappa Commerce', 'contact@kappa.tn', '21621001010');
INSERT INTO public.fournisseur VALUES (11, 'nader', 'nader.ben.salah.78@gmail.com', '94066700');
INSERT INTO public.fournisseur VALUES (12, 'nassim', 'nader.bensalah@ensi-uma.tn', '94066700');


--
-- Data for Name: lot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lot VALUES ('555551', '55555');
INSERT INTO public.lot VALUES ('10021', '1002');
INSERT INTO public.lot VALUES ('10022', '1002');
INSERT INTO public.lot VALUES ('10023', '1002');
INSERT INTO public.lot VALUES ('10024', '1002');


--
-- Data for Name: offre; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.offre VALUES (113, 2, '2025-08-27', 'Offre/1002/Beta_Supplies/113.pdf', '1002');
INSERT INTO public.offre VALUES (114, 5, '2025-08-27', 'Offre/55555/Epsilon_Services/114.pdf', '55555');
INSERT INTO public.offre VALUES (115, 4, '2025-08-27', 'Offre/fff44/Delta_Corp/115.pdf', 'fff44');


--
-- Data for Name: offre_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.offre_article VALUES (115, 173980, 'AN105426', 2000.000);


--
-- Data for Name: offre_lot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.offre_lot VALUES (113, '10021', 2000.000);
INSERT INTO public.offre_lot VALUES (113, '10024', 2000.000);
INSERT INTO public.offre_lot VALUES (113, '10023', 2000.000);
INSERT INTO public.offre_lot VALUES (113, '10022', 2000.000);
INSERT INTO public.offre_lot VALUES (114, '555551', 5999.000);


--
-- Data for Name: reception; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reception VALUES ('42', '2025-08-27', '90', 'equipement');
INSERT INTO public.reception VALUES ('43', '2025-08-27', '91', 'equipement');
INSERT INTO public.reception VALUES ('ffff55', '2025-08-27', 'ddd11', 'consommable');


--
-- Data for Name: reception_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reception_article VALUES ('ffff55', 142, 1);


--
-- Data for Name: reception_lot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reception_lot VALUES ('42', '45', true);
INSERT INTO public.reception_lot VALUES ('42', '46', true);
INSERT INTO public.reception_lot VALUES ('42', '47', true);
INSERT INTO public.reception_lot VALUES ('43', '48', true);


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.utilisateur VALUES (1, 'ahmed ben salah', 'ahmed@gmail.com', '123456', '2003-08-16');
INSERT INTO public.utilisateur VALUES (2, 'nader ben salah', 'nader.ben.salah.78@gmail.com', 'motdepasse1', '2003-08-19');
INSERT INTO public.utilisateur VALUES (4, 'ahmed', 'ahhmed@gmail.com', '0000', '2003-12-08');


--
-- Name: article_id_article_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.article_id_article_seq', 1, false);


--
-- Name: commande_article_id_commande_article_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_article_id_commande_article_seq', 142, true);


--
-- Name: commande_id_commande_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_id_commande_seq', 91, true);


--
-- Name: commande_lot_id_commande_lot_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_lot_id_commande_lot_seq', 48, true);


--
-- Name: consultation_id_consultation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultation_id_consultation_seq', 1, true);


--
-- Name: decision_id_decision_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.decision_id_decision_seq', 1, false);


--
-- Name: demande_d_achat_id_da_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.demande_d_achat_id_da_seq', 1, false);


--
-- Name: evaluation_article_id_evaluation_article_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluation_article_id_evaluation_article_seq', 118, true);


--
-- Name: evaluation_id_eval_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluation_id_eval_seq', 89, true);


--
-- Name: evaluation_lot_id_evaluation_lot_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluation_lot_id_evaluation_lot_seq', 78, true);


--
-- Name: fournisseur_id_fournisseur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fournisseur_id_fournisseur_seq', 12, true);


--
-- Name: lot_id_lot_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lot_id_lot_seq', 1, false);


--
-- Name: offre_id_offre_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offre_id_offre_seq', 115, true);


--
-- Name: reception_id_reception_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reception_id_reception_seq', 43, true);


--
-- Name: utilisateur_id_utilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_id_utilisateur_seq', 4, true);


--
-- Name: article article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_pkey PRIMARY KEY (id_article, id_da);


--
-- Name: commande_article commande_article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_article
    ADD CONSTRAINT commande_article_pkey PRIMARY KEY (id_commande_article);


--
-- Name: commande_lot commande_lot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_lot
    ADD CONSTRAINT commande_lot_pkey PRIMARY KEY (id_commande_lot);


--
-- Name: commande commande_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_pkey PRIMARY KEY (id_commande);


--
-- Name: consultation_da consultation_da_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation_da
    ADD CONSTRAINT consultation_da_pkey PRIMARY KEY (id_consultation, id_da);


--
-- Name: consultation consultation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation
    ADD CONSTRAINT consultation_pkey PRIMARY KEY (id_consultation);


--
-- Name: decision decision_id_lot_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decision
    ADD CONSTRAINT decision_id_lot_key UNIQUE (id_lot);


--
-- Name: decision decision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decision
    ADD CONSTRAINT decision_pkey PRIMARY KEY (id_decision);


--
-- Name: demande_d_achat demande_d_achat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande_d_achat
    ADD CONSTRAINT demande_d_achat_pkey PRIMARY KEY (id_da);


--
-- Name: evaluation_article evaluation_article_id_eval_id_article_id_da_id_offre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_article
    ADD CONSTRAINT evaluation_article_id_eval_id_article_id_da_id_offre_key UNIQUE (id_eval, id_article, id_da, id_offre);


--
-- Name: evaluation_article evaluation_article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_article
    ADD CONSTRAINT evaluation_article_pkey PRIMARY KEY (id_evaluation_article);


--
-- Name: evaluation_lot evaluation_lot_id_eval_id_lot_id_offre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_lot
    ADD CONSTRAINT evaluation_lot_id_eval_id_lot_id_offre_key UNIQUE (id_eval, id_lot, id_offre);


--
-- Name: evaluation_lot evaluation_lot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_lot
    ADD CONSTRAINT evaluation_lot_pkey PRIMARY KEY (id_evaluation_lot);


--
-- Name: evaluation evaluation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_pkey PRIMARY KEY (id_eval);


--
-- Name: fournisseur fournisseur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fournisseur
    ADD CONSTRAINT fournisseur_pkey PRIMARY KEY (id_fournisseur);


--
-- Name: lot lot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lot
    ADD CONSTRAINT lot_pkey PRIMARY KEY (id_lot);


--
-- Name: offre_article offre_article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_article
    ADD CONSTRAINT offre_article_pkey PRIMARY KEY (id_offre, id_article, id_da);


--
-- Name: offre_lot offre_lot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_lot
    ADD CONSTRAINT offre_lot_pkey PRIMARY KEY (id_offre, id_lot);


--
-- Name: offre offre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre
    ADD CONSTRAINT offre_pkey PRIMARY KEY (id_offre);


--
-- Name: reception_article reception_article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_article
    ADD CONSTRAINT reception_article_pkey PRIMARY KEY (id_reception, id_commande_article);


--
-- Name: reception_lot reception_lot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_lot
    ADD CONSTRAINT reception_lot_pkey PRIMARY KEY (id_reception, id_commande_lot);


--
-- Name: reception reception_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception
    ADD CONSTRAINT reception_pkey PRIMARY KEY (id_reception);


--
-- Name: offre_article unique_offre_article; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_article
    ADD CONSTRAINT unique_offre_article UNIQUE (id_offre, id_article, id_da);


--
-- Name: utilisateur utilisateur_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_email_key UNIQUE (email);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id_utilisateur);


--
-- Name: idx_evaluation_article_article; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_evaluation_article_article ON public.evaluation_article USING btree (id_article);


--
-- Name: idx_evaluation_article_evaluation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_evaluation_article_evaluation ON public.evaluation_article USING btree (id_eval);


--
-- Name: idx_evaluation_lot_evaluation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_evaluation_lot_evaluation ON public.evaluation_lot USING btree (id_eval);


--
-- Name: idx_evaluation_lot_lot; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_evaluation_lot_lot ON public.evaluation_lot USING btree (id_lot);


--
-- Name: article article_id_da_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_id_da_fkey FOREIGN KEY (id_da) REFERENCES public.demande_d_achat(id_da);


--
-- Name: commande_article commande_article_id_commande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_article
    ADD CONSTRAINT commande_article_id_commande_fkey FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande);


--
-- Name: commande commande_id_consultation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_id_consultation FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation);


--
-- Name: commande_lot commande_lot_id_commande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_lot
    ADD CONSTRAINT commande_lot_id_commande_fkey FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande);


--
-- Name: commande_lot commande_lot_id_offre_id_lot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_lot
    ADD CONSTRAINT commande_lot_id_offre_id_lot_fkey FOREIGN KEY (id_lot, id_offre) REFERENCES public.offre_lot(id_lot, id_offre);


--
-- Name: consultation_da consultation_da_id_consultation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation_da
    ADD CONSTRAINT consultation_da_id_consultation FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation);


--
-- Name: consultation_da consultation_da_id_da_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation_da
    ADD CONSTRAINT consultation_da_id_da_fkey FOREIGN KEY (id_da) REFERENCES public.demande_d_achat(id_da) ON DELETE CASCADE;


--
-- Name: consultation consultation_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation
    ADD CONSTRAINT consultation_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id_utilisateur);


--
-- Name: decision decision_id_eval_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decision
    ADD CONSTRAINT decision_id_eval_fkey FOREIGN KEY (id_eval) REFERENCES public.evaluation(id_eval);


--
-- Name: decision decision_id_fournisseur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decision
    ADD CONSTRAINT decision_id_fournisseur_fkey FOREIGN KEY (id_fournisseur) REFERENCES public.fournisseur(id_fournisseur);


--
-- Name: decision decision_id_offre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decision
    ADD CONSTRAINT decision_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES public.offre(id_offre);


--
-- Name: demande_d_achat demande_d_achat_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande_d_achat
    ADD CONSTRAINT demande_d_achat_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id_utilisateur);


--
-- Name: evaluation_article evaluation_article_id_article_id_da_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_article
    ADD CONSTRAINT evaluation_article_id_article_id_da_fkey FOREIGN KEY (id_article, id_da) REFERENCES public.article(id_article, id_da) ON DELETE CASCADE;


--
-- Name: evaluation_article evaluation_article_id_eval_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_article
    ADD CONSTRAINT evaluation_article_id_eval_fkey FOREIGN KEY (id_eval) REFERENCES public.evaluation(id_eval) ON DELETE CASCADE;


--
-- Name: evaluation_article evaluation_article_id_offre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_article
    ADD CONSTRAINT evaluation_article_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES public.offre(id_offre) ON DELETE CASCADE;


--
-- Name: evaluation evaluation_id_consultation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_id_consultation FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation);


--
-- Name: evaluation_lot evaluation_lot_id_eval_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_lot
    ADD CONSTRAINT evaluation_lot_id_eval_fkey FOREIGN KEY (id_eval) REFERENCES public.evaluation(id_eval) ON DELETE CASCADE;


--
-- Name: evaluation_lot evaluation_lot_id_offre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_lot
    ADD CONSTRAINT evaluation_lot_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES public.offre(id_offre) ON DELETE CASCADE;


--
-- Name: commande fk_commande_fournisseur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT fk_commande_fournisseur FOREIGN KEY (id_fournisseur) REFERENCES public.fournisseur(id_fournisseur) ON DELETE CASCADE;


--
-- Name: commande_article fk_commande_offre_article; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_article
    ADD CONSTRAINT fk_commande_offre_article FOREIGN KEY (id_offre, id_article, id_da) REFERENCES public.offre_article(id_offre, id_article, id_da) ON DELETE CASCADE;


--
-- Name: evaluation fk_evaluation_fournisseur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT fk_evaluation_fournisseur FOREIGN KEY (id_fournisseur) REFERENCES public.fournisseur(id_fournisseur) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: offre_article fk_offre_article_article; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_article
    ADD CONSTRAINT fk_offre_article_article FOREIGN KEY (id_article, id_da) REFERENCES public.article(id_article, id_da) ON DELETE CASCADE;


--
-- Name: reception fk_reception_commande; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception
    ADD CONSTRAINT fk_reception_commande FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande);


--
-- Name: offre_article offre_article_id_offre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_article
    ADD CONSTRAINT offre_article_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES public.offre(id_offre) ON DELETE CASCADE;


--
-- Name: offre offre_id_consultation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre
    ADD CONSTRAINT offre_id_consultation FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation);


--
-- Name: offre offre_id_fournisseur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre
    ADD CONSTRAINT offre_id_fournisseur_fkey FOREIGN KEY (id_fournisseur) REFERENCES public.fournisseur(id_fournisseur);


--
-- Name: offre_lot offre_lot_id_offre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_lot
    ADD CONSTRAINT offre_lot_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES public.offre(id_offre) ON DELETE CASCADE;


--
-- Name: reception_article reception_article_id_commande_article_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_article
    ADD CONSTRAINT reception_article_id_commande_article_fkey FOREIGN KEY (id_commande_article) REFERENCES public.commande_article(id_commande_article) ON DELETE CASCADE;


--
-- Name: reception_article reception_article_id_reception_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_article
    ADD CONSTRAINT reception_article_id_reception_fkey FOREIGN KEY (id_reception) REFERENCES public.reception(id_reception);


--
-- PostgreSQL database dump complete
--

