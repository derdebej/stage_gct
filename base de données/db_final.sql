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
    id_lot bigint,
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
-- Name: bon_sortie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bon_sortie (
    id_bon_sortie bigint NOT NULL,
    date date NOT NULL,
    id_reception bigint
);


ALTER TABLE public.bon_sortie OWNER TO postgres;

--
-- Name: bon_sortie_id_bon_sortie_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bon_sortie_id_bon_sortie_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bon_sortie_id_bon_sortie_seq OWNER TO postgres;

--
-- Name: bon_sortie_id_bon_sortie_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bon_sortie_id_bon_sortie_seq OWNED BY public.bon_sortie.id_bon_sortie;


--
-- Name: commande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande (
    id_commande bigint NOT NULL,
    date date NOT NULL,
    statut character varying,
    id_fournisseur bigint,
    id_consultation bigint,
    type character varying,
    CONSTRAINT commande_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_cours'::character varying, 'livree'::character varying, 'annulee'::character varying])::text[])))
);


ALTER TABLE public.commande OWNER TO postgres;

--
-- Name: commande_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande_article (
    id_commande_article integer NOT NULL,
    id_commande integer,
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
    id_commande integer,
    id_offre integer NOT NULL,
    id_lot integer NOT NULL
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
    id_consultation bigint NOT NULL,
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
    id_consultation bigint NOT NULL,
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
    id_lot bigint NOT NULL,
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
    id_consultation integer NOT NULL
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
    id_lot integer NOT NULL,
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
    id_lot bigint NOT NULL,
    id_da character varying NOT NULL,
    id_consultation integer NOT NULL
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
    id_consultation bigint
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
    id_lot bigint NOT NULL,
    montant numeric(12,3) DEFAULT 0 NOT NULL
);


ALTER TABLE public.offre_lot OWNER TO postgres;

--
-- Name: reception; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reception (
    id_reception bigint NOT NULL,
    date date NOT NULL,
    id_commande bigint,
    type character varying
);


ALTER TABLE public.reception OWNER TO postgres;

--
-- Name: reception_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reception_article (
    id_reception bigint NOT NULL,
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
    id_reception bigint NOT NULL,
    id_commande_lot bigint NOT NULL,
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
-- Name: bon_sortie id_bon_sortie; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bon_sortie ALTER COLUMN id_bon_sortie SET DEFAULT nextval('public.bon_sortie_id_bon_sortie_seq'::regclass);


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

INSERT INTO public.article VALUES (223637, 'AN091260', NULL, 'ADAPTATEUR HDMI VERS VGA', '', 15, 10);
INSERT INTO public.article VALUES (223636, 'AN091260', NULL, 'ADAPTATEUR VGA VERS HDMI', '', 40, 6);
INSERT INTO public.article VALUES (213920, 'AN091260', NULL, 'TONER ADAPTABLE POUR IMPRIMANTE SAMSUNG M2070F', '', 31, 3);
INSERT INTO public.article VALUES (213922, 'AN091260', NULL, 'TONER ADAPTABLE BROTHER MFC 7360N', '', 25, 3);
INSERT INTO public.article VALUES (213921, 'AN091260', NULL, 'TONER ADAPTABLE POUR IMPRIMANTE BROTHER MFC - 1810', '', 20, 3);
INSERT INTO public.article VALUES (217906, 'AN091260', NULL, 'TAMBOUR POUR IMP EPSON ACULASER M2300', '', 1200, 2);
INSERT INTO public.article VALUES (174500, 'AN091260', NULL, 'CONTACT CLEANER WD-40', '', 20, 10);
INSERT INTO public.article VALUES (223587, 'AN091260', NULL, 'CONTACT CLEAR GD-20', '', 12, 10);
INSERT INTO public.article VALUES (223634, 'AN091260', NULL, 'HUB USB 3.0 4 PORTS', '', 20, 5);
INSERT INTO public.article VALUES (175452, 'AN091260', NULL, 'DISQUE DUR SSD Disque dur interne SSD.2.5" ,240 Go(min)SATA III,6GB/s. Marque: ADATA,PNY, ADDLINK', '', 200, 20);
INSERT INTO public.article VALUES (220595, 'AN091260', NULL, 'FLACON 101 ECOTANK CYAN REF: C13T03V24A', 'd''origine', 26, 3);
INSERT INTO public.article VALUES (220594, 'AN091260', NULL, 'FLACON 101 ECOTANK NOIR REF: C13T03V14A', 'd''origine', 26, 3);
INSERT INTO public.article VALUES (220596, 'AN091260', NULL, 'FLACON 101 ECOTANK MAGENTA REF: C13T03V34A', 'd''origine', 26, 3);
INSERT INTO public.article VALUES (220597, 'AN091260', NULL, 'FLACON 101 ECOTANK YELLOW REF: C13T03V44A', 'd''origine', 26, 3);
INSERT INTO public.article VALUES (220598, 'AN091260', NULL, 'FLACON D''ORIGINE NOIR POUR IMP.EPSON L120', '', 25, 15);
INSERT INTO public.article VALUES (220599, 'AN091260', NULL, 'FLACON D''ORIGINE ROUGE POUR IMP.EPSON L120', '', 25, 15);
INSERT INTO public.article VALUES (220600, 'AN091260', NULL, 'FLACON D''ORIGINE JAUNE POUR IMP.EPSON L120', '', 25, 15);
INSERT INTO public.article VALUES (220601, 'AN091260', NULL, 'FLACON D''ORIGINE BLEU POUR IMP.EPSON L120', '', 25, 15);
INSERT INTO public.article VALUES (205968, 'AN091260', NULL, 'CARTOUCHE ADAPTABLE POUR IMPRIMANTE EPSON AL-1400', '', 19.5, 20);
INSERT INTO public.article VALUES (51677, 'AN091260', NULL, 'VENTILATEUR', 'LGA 1150', 20, 15);
INSERT INTO public.article VALUES (188423, 'AN091260', NULL, 'CARTE MERE H81', 'LGA 1150', 175, 15);
INSERT INTO public.article VALUES (164068, 'AN091260', NULL, 'BARETTE DE MEMOIRE DDR3  4GO', '', 68, 50);
INSERT INTO public.article VALUES (121838, 'AN091260', NULL, 'SOURIS OPTIQUE USB', 'HP 1000', 18, 100);
INSERT INTO public.article VALUES (171254, 'AN091260', NULL, 'CLAVIER  USB', 'Azerty 104 touches arabe-francais', 25, 100);
INSERT INTO public.article VALUES (210204, 'AN091260', NULL, 'TONER ADAPTABLE  POUR IMP. KYOCERA P2040DN REF:TK-1160', '', 70, 80);
INSERT INTO public.article VALUES (216609, 'AN091260', NULL, 'TONER POUR IMP. KYOCERA ECOSYS P3260DN RÉF TK-3190', 'd''origine', 550, 5);
INSERT INTO public.article VALUES (217824, 'AN091260', NULL, 'MICROPROCESSEUR I3 LGA 1150', '', 350, 15);
INSERT INTO public.article VALUES (206002, 'AN091260', NULL, 'RUBAN POUR IMPRIMANTE MATRICIELLE LQ 350- 300', '', 8, 15);
INSERT INTO public.article VALUES (213267, 'AN091260', NULL, 'TONER LEXMARK C2425 NOIR', 'd''origine réf C2350 Ko', 250, 2);
INSERT INTO public.article VALUES (216612, 'AN091260', NULL, 'TONER D ORIGINE LEXMARK C2425 YELLOW REF C2350YO', '', 250, 2);
INSERT INTO public.article VALUES (216613, 'AN091260', NULL, 'TONER D ORIGINE MAGENTA LEXMARK C2425 REF C2350MO', '', 250, 2);
INSERT INTO public.article VALUES (216614, 'AN091260', NULL, 'TONER D ORIGINE CYAN  LEXMARK C2425 REF C2350CO', '', 250, 2);
INSERT INTO public.article VALUES (216615, 'AN091260', NULL, 'TONER D ORIGINE LEXMARK MB 2236', 'Ref: B225000', 200, 3);
INSERT INTO public.article VALUES (205633, 'AN091260', NULL, 'TONER  ADAPTABLE  POUR IMPRIMANTE EPSON ACULASER M2300', '', 21, 25);
INSERT INTO public.article VALUES (135971, 'AN091260', NULL, 'CARTOUCHE BROTHER HL 5040 REF TN7600', 'adaptable', 80, 10);
INSERT INTO public.article VALUES (59228, 'AN091260', NULL, 'CARTOUCHE NOIR D ORIGINE POUR IMP. HP DESKJET F2280 REF C9351A(21)', '', 85, 2);
INSERT INTO public.article VALUES (59229, 'AN091260', NULL, 'CARTOUCHE COULEUR D ORIGINE POUR IMP. HP DESKJET F2280 REF. 09352A(22)', '', 85, 2);
INSERT INTO public.article VALUES (214041, 'AN103360', NULL, 'CABLE HDMI LONGUEUR 5M', '', 14, 5);
INSERT INTO public.article VALUES (214042, 'AN103360', NULL, 'CABLE HDMI LONGUEUR 15M', '', 35, 5);
INSERT INTO public.article VALUES (225960, 'AN103360', NULL, 'ADAPTATEUR HDMI TO VGA', '', 19.9, 10);
INSERT INTO public.article VALUES (248577, 'AN103360', NULL, 'PHOTOCONDUCTEUR POUR IMPRIMANTE KYOCERA 3260DN', '', 220, 5);
INSERT INTO public.article VALUES (238344, 'AN103360', NULL, 'BOUTEILLE EPSON 110 (C13T03P14A)', '', 80, 30);
INSERT INTO public.article VALUES (206011, 'AN103360', NULL, 'TONER NOIR ADAPTABLE POUR IMP.EPSON WORKFORCE AL-M300/AL-MX300', '', 60, 30);
INSERT INTO public.article VALUES (195760, 'AN103360', NULL, 'CLAVIER USB clavier dell azerty francais/arabe 104 touches filiare Interface USB 2.0 couleur noir', '', 45, 20);
INSERT INTO public.article VALUES (121838, 'AN103360', NULL, 'SOURIS OPTIQUE USB SOURIS FILAIRE HP usb , 3 boutons , couleur noir', '', 25, 50);
INSERT INTO public.article VALUES (248579, 'AN103360', NULL, 'SPRAY MULTIFONCTION PLATINET PFSP40 ANTIROUILLE - PROTECTION - NETTOYAGE / 400ML', '', 20, 4);
INSERT INTO public.article VALUES (248581, 'AN103360', NULL, 'GUIDE DE CORDONS 19" 2U METALLIQUE 5 ANNEAUX', '', 30, 5);
INSERT INTO public.article VALUES (248580, 'AN103360', NULL, 'PLATINET LABEL REMOVER SPRAY/400ML (POUR IMPRIMANTES)', '', 20, 6);
INSERT INTO public.article VALUES (248590, 'AN103360', NULL, 'MODULE HPE X120 1G SFP LC SX TRANSCEIVER PN: JD118B', '', 880, 12);
INSERT INTO public.article VALUES (248583, 'AN103360', NULL, 'SERRURE POUR ARMOIRE INFORMATIQUE (METALLIQUE) AVEC CLES', '', 18, 5);
INSERT INTO public.article VALUES (248589, 'AN103360', NULL, 'KIT DE NETTOYAGE A FIBRE OPTIQUE pour Connecteurs FC SC ST LC MU, Cassette, Stylos, Écouvillons, Lingettes, Bouteille de Pompe, Sac de Transport, 550+ Utilisations', '', 300, 1);
INSERT INTO public.article VALUES (248591, 'AN103360', NULL, 'CABLES ETHERNET "CAT6 UTP" LONGUEUR: 5 METRES', '', 4.5, 70);
INSERT INTO public.article VALUES (175434, 'AN103360', NULL, 'FLASH DISQUE 16 G', 'ADATA', 15, 10);
INSERT INTO public.article VALUES (248614, 'AN103360', NULL, 'TOURET CABLE ETHERNET CERTIFIE  CAT6A S/FTP LSZH DE 500 METRES', '', 1500, 1);
INSERT INTO public.article VALUES (248603, 'AN103360', NULL, 'CABLE ETHERNET CAT 6 UTP LONGUEUR 3M', '', 3, 100);
INSERT INTO public.article VALUES (248601, 'AN103360', NULL, 'TELEVISEUR LED 32" HD', 'NON SMART,PAS de récepteur intégré ,ports HDMI, ports USB,', 500, 6);
INSERT INTO public.article VALUES (248608, 'AN103360', NULL, 'MODULE WI-FI POUR VIDEOPROJECTEURS EPSON', 'compatible avec EB-E20', 800, 2);
INSERT INTO public.article VALUES (248611, 'AN103360', NULL, 'DISQUE DUR SSD 512GO', '2.5" Vitesse 530mbps(Lecture),430 mbps(Ecriture)', 100, 50);
INSERT INTO public.article VALUES (248609, 'AN103360', NULL, 'CABLE JACK 3,5 MM (AUDIO) LONGUEUR 2 METRES', '', 10, 2);
INSERT INTO public.article VALUES (248610, 'AN103360', NULL, 'CABLE RCA (JAUNE, ROUGE, BLANC) LONGUEUR 2 METRES', '', 10, 2);
INSERT INTO public.article VALUES (248599, 'AN103360', NULL, 'TONER POUR IMPRIMANTE KYOCERA PA5500X 3410', 'd''origine 15000 pages.', 500, 20);
INSERT INTO public.article VALUES (214040, 'AN103360', NULL, 'CABLE HDMI LONGUEUR 3M', '', 7, 5);
INSERT INTO public.article VALUES (223636, 'AN103360', NULL, 'ADAPTATEUR VGA VERS HDMI', '', 50, 5);
INSERT INTO public.article VALUES (225230, 'AN103360', NULL, 'PHOTOCONDUCTEUR  ORIGINE POUR IMPRIMANTE EPSON M300', '', 250, 5);
INSERT INTO public.article VALUES (235816, 'AN103360', NULL, 'PHOTOCONDUCTEUR POUR IMPRIMANTE KYOCERA 2040', '', 250, 8);
INSERT INTO public.article VALUES (248604, 'AN103360', NULL, 'DAP3711', '', 950, 2);
INSERT INTO public.article VALUES (173980, 'AN105426', NULL, 'REPARATION PHOTOCOPIEUR XEROX WC 5325', '', 2600, 1);
INSERT INTO public.article VALUES (244418, 'AN101056', NULL, 'SERVEUR DE STOCKAGE EN RESEAU NAS', '', 15000, 1);


--
-- Data for Name: bon_sortie; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: commande; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.commande VALUES (88, '2025-08-24', 'livree', 3, 1000, 'consommable');


--
-- Data for Name: commande_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.commande_article VALUES (133, 88, 88, 223637, 'AN091260');
INSERT INTO public.commande_article VALUES (134, 88, 88, 223636, 'AN091260');
INSERT INTO public.commande_article VALUES (135, 88, 88, 213920, 'AN091260');
INSERT INTO public.commande_article VALUES (136, 88, 88, 213922, 'AN091260');
INSERT INTO public.commande_article VALUES (137, 88, 88, 174500, 'AN091260');
INSERT INTO public.commande_article VALUES (138, 88, 88, 223587, 'AN091260');
INSERT INTO public.commande_article VALUES (139, 88, 88, 223634, 'AN091260');
INSERT INTO public.commande_article VALUES (140, 88, 88, 121838, 'AN091260');
INSERT INTO public.commande_article VALUES (141, 88, 88, 121838, 'AN103360');


--
-- Data for Name: commande_lot; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: consultation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.consultation VALUES (1000, 2, '2025-08-23', 0, 'consommable', 'offre totale', 'évalué');
INSERT INTO public.consultation VALUES (1002, 2, '2025-08-23', 1, 'equipement', 'offre totale', 'évalué');


--
-- Data for Name: consultation_da; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.consultation_da VALUES (1000, 'AN105426');
INSERT INTO public.consultation_da VALUES (1000, 'AN103360');
INSERT INTO public.consultation_da VALUES (1000, 'AN091260');


--
-- Data for Name: decision; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: demande_d_achat; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.demande_d_achat VALUES ('AN105426', 2, 'ENTRETIEN POUR MACHINE PHOTOPIEUSE', '2025-07-09', 'HAJJEJ RADHIA', 'Traitée', 2600, 'Exploitation', NULL, NULL, '/Demande d''achat/Requisition_Demandedachatnumrique.pdf');
INSERT INTO public.demande_d_achat VALUES ('AN103360', 2, 'Demande Achat pour la Division Informatique', '2024-12-02', 'TRABELSI HANA', 'Traitée', 46534, 'Exploitation', NULL, NULL, '/Demande d''achat/DA AN103360.pdf');
INSERT INTO public.demande_d_achat VALUES ('AN091260', 2, 'Achat cinq (05) lots consommable informatique', '2021-09-08', 'TRABELSI HANA', 'Traitée', 38250, 'Exploitation', NULL, NULL, '/Demande d''achat/DA 091260.pdf');
INSERT INTO public.demande_d_achat VALUES ('AN101056', 2, 'Serveur de stockage en réseau NAS', '2024-04-16', 'TRABELSI HANA', 'Non Traitée', 15000, 'Investissement', 'Acquisition et rénouvellement d''équipements micro-informatiques,Div. Informatique à Gabés du GCT', '3.80.2024.421', '/Demande d''achat/DA Serveur de stockage NAS.pdf');


--
-- Data for Name: evaluation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.evaluation VALUES (75, '2025-08-24', 'fffff', NULL, 1000);
INSERT INTO public.evaluation VALUES (84, '2025-08-24', '/Evaluation/1002/DA AN100862 (2).pdf', NULL, 1002);


--
-- Data for Name: evaluation_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.evaluation_article VALUES (108, 75, 223637, 'AN091260', 88, 'Conforme');
INSERT INTO public.evaluation_article VALUES (109, 75, 223637, 'AN091260', 89, 'Non Conforme');
INSERT INTO public.evaluation_article VALUES (110, 75, 223636, 'AN091260', 88, 'Conforme');
INSERT INTO public.evaluation_article VALUES (111, 75, 213920, 'AN091260', 88, 'Conforme');
INSERT INTO public.evaluation_article VALUES (112, 75, 213922, 'AN091260', 88, 'Conforme');
INSERT INTO public.evaluation_article VALUES (113, 75, 174500, 'AN091260', 88, 'Conforme');
INSERT INTO public.evaluation_article VALUES (114, 75, 223587, 'AN091260', 88, 'Conforme');
INSERT INTO public.evaluation_article VALUES (115, 75, 223634, 'AN091260', 88, 'Conforme');
INSERT INTO public.evaluation_article VALUES (116, 75, 121838, 'AN091260', 88, 'Conforme');
INSERT INTO public.evaluation_article VALUES (117, 75, 121838, 'AN103360', 88, 'Conforme');


--
-- Data for Name: evaluation_lot; Type: TABLE DATA; Schema: public; Owner: postgres
--



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



--
-- Data for Name: offre; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.offre VALUES (107, 2, '2025-08-24', 'Offre/1002/Beta_Supplies/107.pdf', 1002);
INSERT INTO public.offre VALUES (88, 3, '2025-08-23', 'Offre/1000/Gamma_Solutions/88.pdf', 1000);
INSERT INTO public.offre VALUES (89, 10, '2025-08-23', 'Offre/1000/Kappa_Commerce/89.pdf', 1000);
INSERT INTO public.offre VALUES (90, 10, '2025-08-23', 'Offre/1002/Kappa_Commerce/90.pdf', 1002);
INSERT INTO public.offre VALUES (91, 2, '2025-08-23', 'Offre/1002/Beta_Supplies/91.pdf', 1002);
INSERT INTO public.offre VALUES (92, 1, '2025-08-23', 'Offre/1002/Alpha_Industries/92.pdf', 1002);


--
-- Data for Name: offre_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.offre_article VALUES (88, 223637, 'AN091260', 20.000);
INSERT INTO public.offre_article VALUES (88, 223636, 'AN091260', 20.000);
INSERT INTO public.offre_article VALUES (88, 213920, 'AN091260', 10.000);
INSERT INTO public.offre_article VALUES (88, 213922, 'AN091260', 20.000);
INSERT INTO public.offre_article VALUES (88, 174500, 'AN091260', 20.000);
INSERT INTO public.offre_article VALUES (88, 223587, 'AN091260', 20.000);
INSERT INTO public.offre_article VALUES (88, 223634, 'AN091260', 20.000);
INSERT INTO public.offre_article VALUES (88, 121838, 'AN091260', 30.000);
INSERT INTO public.offre_article VALUES (88, 121838, 'AN103360', 50.000);
INSERT INTO public.offre_article VALUES (89, 223637, 'AN091260', 1.000);


--
-- Data for Name: offre_lot; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reception; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reception VALUES (36, '2025-08-24', 88, 'consommable');
INSERT INTO public.reception VALUES (40, '2025-08-24', 88, 'consommable');


--
-- Data for Name: reception_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reception_article VALUES (36, 133, 10);
INSERT INTO public.reception_article VALUES (36, 134, 6);
INSERT INTO public.reception_article VALUES (36, 135, 3);
INSERT INTO public.reception_article VALUES (36, 136, 3);
INSERT INTO public.reception_article VALUES (36, 137, 10);
INSERT INTO public.reception_article VALUES (36, 138, 10);
INSERT INTO public.reception_article VALUES (36, 139, 5);
INSERT INTO public.reception_article VALUES (36, 140, 100);
INSERT INTO public.reception_article VALUES (36, 141, 50);
INSERT INTO public.reception_article VALUES (40, 133, 0);
INSERT INTO public.reception_article VALUES (40, 134, 0);
INSERT INTO public.reception_article VALUES (40, 135, 0);
INSERT INTO public.reception_article VALUES (40, 136, 0);
INSERT INTO public.reception_article VALUES (40, 137, 0);
INSERT INTO public.reception_article VALUES (40, 138, 0);
INSERT INTO public.reception_article VALUES (40, 139, 0);
INSERT INTO public.reception_article VALUES (40, 140, 0);
INSERT INTO public.reception_article VALUES (40, 141, 0);


--
-- Data for Name: reception_lot; Type: TABLE DATA; Schema: public; Owner: postgres
--



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
-- Name: bon_sortie_id_bon_sortie_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bon_sortie_id_bon_sortie_seq', 1, false);


--
-- Name: commande_article_id_commande_article_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_article_id_commande_article_seq', 141, true);


--
-- Name: commande_id_commande_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_id_commande_seq', 88, true);


--
-- Name: commande_lot_id_commande_lot_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_lot_id_commande_lot_seq', 43, true);


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

SELECT pg_catalog.setval('public.evaluation_article_id_evaluation_article_seq', 117, true);


--
-- Name: evaluation_id_eval_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluation_id_eval_seq', 84, true);


--
-- Name: evaluation_lot_id_evaluation_lot_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluation_lot_id_evaluation_lot_seq', 71, true);


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

SELECT pg_catalog.setval('public.offre_id_offre_seq', 111, true);


--
-- Name: reception_id_reception_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reception_id_reception_seq', 40, true);


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
-- Name: bon_sortie bon_sortie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bon_sortie
    ADD CONSTRAINT bon_sortie_pkey PRIMARY KEY (id_bon_sortie);


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
-- Name: article article_id_lot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_id_lot_fkey FOREIGN KEY (id_lot) REFERENCES public.lot(id_lot);


--
-- Name: commande_article commande_article_id_commande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_article
    ADD CONSTRAINT commande_article_id_commande_fkey FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande) ON DELETE CASCADE;


--
-- Name: commande_lot commande_lot_id_commande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_lot
    ADD CONSTRAINT commande_lot_id_commande_fkey FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande) ON DELETE CASCADE;


--
-- Name: commande_lot commande_lot_id_offre_id_lot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_lot
    ADD CONSTRAINT commande_lot_id_offre_id_lot_fkey FOREIGN KEY (id_offre, id_lot) REFERENCES public.offre_lot(id_offre, id_lot) ON DELETE CASCADE;


--
-- Name: consultation_da consultation_da_id_consultation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation_da
    ADD CONSTRAINT consultation_da_id_consultation_fkey FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation) ON DELETE CASCADE;


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
-- Name: decision decision_id_lot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decision
    ADD CONSTRAINT decision_id_lot_fkey FOREIGN KEY (id_lot) REFERENCES public.lot(id_lot);


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
-- Name: evaluation_lot evaluation_lot_id_eval_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_lot
    ADD CONSTRAINT evaluation_lot_id_eval_fkey FOREIGN KEY (id_eval) REFERENCES public.evaluation(id_eval) ON DELETE CASCADE;


--
-- Name: evaluation_lot evaluation_lot_id_lot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_lot
    ADD CONSTRAINT evaluation_lot_id_lot_fkey FOREIGN KEY (id_lot) REFERENCES public.lot(id_lot) ON DELETE CASCADE;


--
-- Name: evaluation_lot evaluation_lot_id_offre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_lot
    ADD CONSTRAINT evaluation_lot_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES public.offre(id_offre) ON DELETE CASCADE;


--
-- Name: bon_sortie fk_bon_sortie_reception; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bon_sortie
    ADD CONSTRAINT fk_bon_sortie_reception FOREIGN KEY (id_reception) REFERENCES public.reception(id_reception) ON DELETE CASCADE;


--
-- Name: commande fk_commande_consultation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT fk_commande_consultation FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation) ON DELETE CASCADE;


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
-- Name: evaluation fk_evaluation_consultation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT fk_evaluation_consultation FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation) ON DELETE CASCADE;


--
-- Name: evaluation fk_evaluation_fournisseur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT fk_evaluation_fournisseur FOREIGN KEY (id_fournisseur) REFERENCES public.fournisseur(id_fournisseur) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: lot fk_lot_consultation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lot
    ADD CONSTRAINT fk_lot_consultation FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation) ON DELETE CASCADE;


--
-- Name: offre_article fk_offre_article_article; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_article
    ADD CONSTRAINT fk_offre_article_article FOREIGN KEY (id_article, id_da) REFERENCES public.article(id_article, id_da) ON DELETE CASCADE;


--
-- Name: offre fk_offre_consultation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre
    ADD CONSTRAINT fk_offre_consultation FOREIGN KEY (id_consultation) REFERENCES public.consultation(id_consultation) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reception fk_reception_commande; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception
    ADD CONSTRAINT fk_reception_commande FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande) ON DELETE CASCADE;


--
-- Name: lot lot_id_da_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lot
    ADD CONSTRAINT lot_id_da_fkey FOREIGN KEY (id_da) REFERENCES public.demande_d_achat(id_da);


--
-- Name: offre_article offre_article_id_offre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_article
    ADD CONSTRAINT offre_article_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES public.offre(id_offre) ON DELETE CASCADE;


--
-- Name: offre offre_id_fournisseur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre
    ADD CONSTRAINT offre_id_fournisseur_fkey FOREIGN KEY (id_fournisseur) REFERENCES public.fournisseur(id_fournisseur);


--
-- Name: offre_lot offre_lot_id_lot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offre_lot
    ADD CONSTRAINT offre_lot_id_lot_fkey FOREIGN KEY (id_lot) REFERENCES public.lot(id_lot) ON DELETE CASCADE;


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
    ADD CONSTRAINT reception_article_id_reception_fkey FOREIGN KEY (id_reception) REFERENCES public.reception(id_reception) ON DELETE CASCADE;


--
-- Name: reception_lot reception_lot_id_commande_lot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_lot
    ADD CONSTRAINT reception_lot_id_commande_lot_fkey FOREIGN KEY (id_commande_lot) REFERENCES public.commande_lot(id_commande_lot) ON DELETE CASCADE;


--
-- Name: reception_lot reception_lot_id_reception_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_lot
    ADD CONSTRAINT reception_lot_id_reception_fkey FOREIGN KEY (id_reception) REFERENCES public.reception(id_reception) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

