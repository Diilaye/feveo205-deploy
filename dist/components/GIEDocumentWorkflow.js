import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, CheckCircle, ArrowRight, ArrowLeft, CreditCard, AlertCircle, Clock, Shield } from 'lucide-react';
import { SENEGAL_GEOGRAPHIC_DATA, getRegions, getDepartements, getArrondissements, getCommunes } from '../data/senegalGeography';
import { gieService } from '../services/gieService';
import jsPDF from 'jspdf';
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3051/api';
const GIEDocumentWorkflow = ({ initialData = {}, onComplete, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [gieData, setGieData] = useState({
        nomGIE: '',
        presidenteNom: '',
        presidentePrenom: '',
        presidenteCIN: '',
        presidenteAdresse: '',
        presidenteTelephone: '',
        presidenteEmail: '',
        secretaireNom: '',
        secretairePrenom: '',
        secretaireCIN: '',
        secretaireTelephone: '',
        tresoriereNom: '',
        tresorierePrenom: '',
        tresoriereCIN: '',
        tresoriereTelephone: '',
        region: '',
        departement: '',
        arrondissement: '',
        commune: '',
        codeRegion: '',
        codeDepartement: '',
        codeArrondissement: '',
        codeCommune: '',
        membres: [],
        secteurPrincipal: '',
        activites: [],
        objectifs: '',
        identifiantGIE: '',
        numeroGIE: '', // Numéro séquentiel du GIE dans la commune
        dateConstitution: new Date().toISOString().split('T')[0],
        ...initialData
    });
    const fetchNextNumeroProtocole = async (codeCommune, codeRegion, codeDepartement, codeArrondissement) => {
        if (!codeCommune)
            return '';
        try {
            console.log('🔢 Récupération du prochain numéro de protocole...', `${API_BASE_URL}/gie/next-protocol?codeCommune=${codeCommune}&codeRegion=${codeRegion}&codeDepartement=${codeDepartement}&codeArrondissement=${codeArrondissement}`);
            const res = await axios.get(`${API_BASE_URL}/gie/next-protocol?codeCommune=${codeCommune}&codeRegion=${codeRegion}&codeDepartement=${codeDepartement}&codeArrondissement=${codeArrondissement}`);
            console.log('🔢 Prochain numéro de protocole:', res.data);
            if (res.data && res.data.success && res.data.data && res.data.data.prochainProtocole) {
                return res.data.data.prochainProtocole;
            }
            return '';
        }
        catch (err) {
            return '';
        }
    };
    // Génération du nom du GIE avec le nouveau format (utilise le numéro de protocole fourni)
    const generateGIEName = (codeRegion, codeDepartement, codeArrondissement, codeCommune, numeroProtocole) => {
        if (!codeRegion || !codeDepartement || !codeArrondissement || !codeCommune || !numeroProtocole)
            return '';
        return `FEVEO-${codeRegion}-${codeDepartement}-${codeArrondissement}-${codeCommune}-${numeroProtocole}`;
    };
    // Met à jour automatiquement le numéro de protocole et l'identifiant GIE à chaque changement de codeCommune
    useEffect(() => {
        const updateNumeroAndIdentifiant = async () => {
            if (gieData.codeRegion &&
                gieData.codeDepartement &&
                gieData.codeArrondissement &&
                gieData.codeCommune) {
                const numeroProtocole = await fetchNextNumeroProtocole(gieData.codeCommune, gieData.codeRegion, gieData.codeDepartement, gieData.codeArrondissement);
                const identifiant = generateGIEName(gieData.codeRegion, gieData.codeDepartement, gieData.codeArrondissement, gieData.codeCommune, numeroProtocole);
                setGieData(prev => ({
                    ...prev,
                    numeroGIE: numeroProtocole,
                    identifiantGIE: identifiant,
                    nomGIE: identifiant
                }));
            }
        };
        updateNumeroAndIdentifiant();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gieData.codeRegion, gieData.codeDepartement, gieData.codeArrondissement, gieData.codeCommune]);
    // (supprimé : déclaration en double de currentStep)
    const [generatedDocuments, setGeneratedDocuments] = useState({
        statuts: false,
        reglementInterieur: false,
        procesVerbal: false,
        demandeAdhesion: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Utilisation des données géographiques officielles du Sénégal
    const regions = getRegions();
    const secteurs = [
        'Agriculture', 'Élevage', 'Transformation', 'Commerce & Distribution',
    ];
    const activitesPossibles = [
        'Production agricole bio',
        'Maraîchage organique',
        'Élevage de volailles',
        'Élevage de petits ruminants',
        'Pisciculture',
        'Transformation de céréales',
        'Transformation de fruits',
        'Artisanat traditionnel',
        'Textile et couture',
        'Commerce de produits locaux',
        'Écotourisme communautaire'
    ];
    // const steps = [
    //   {
    //     number: 1,
    //     title: 'Statuts du GIE',
    //     description: 'Renseigner les statuts et générer l\'identifiant'
    //   },
    //   {
    //     number: 2,
    //     title: 'Demande d\'Adhésion',
    //     description: 'Finalisation et paiement Wave'
    //   }
    // ];
    // Génération de l'identifiant GIE
    // La génération d'identifiant est désormais gérée par useEffect
    // Génération des documents
    const generateDocument = (type) => {
        switch (type) {
            case 'statuts':
                return generateStatuts();
            case 'reglement':
                return generateReglementInterieur();
            case 'procesVerbal':
                return generateProcesVerbal();
            case 'demande':
                return generateDemandeAdhesion();
            default:
                return '';
        }
    };
    const generateStatuts = () => {
        // Convertir les codes en noms
        const getNomRegion = () => {
            const region = regions.find(r => r.code === gieData.region);
            return region ? region.nom : gieData.region;
        };
        const getNomDepartement = () => {
            if (!gieData.region || !gieData.departement)
                return gieData.departement;
            const departements = getDepartements(gieData.region);
            const dept = departements.find(d => d.code === gieData.departement);
            return dept ? dept.nom : gieData.departement;
        };
        const getNomArrondissement = () => {
            if (!gieData.region || !gieData.departement || !gieData.arrondissement)
                return gieData.arrondissement;
            const arrondissements = getArrondissements(gieData.region, gieData.departement);
            const arr = arrondissements.find(a => a.code === gieData.arrondissement);
            return arr ? arr.nom : gieData.arrondissement;
        };
        const [currentStep, setCurrentStep] = useState(1);
        // Met à jour automatiquement le numéro de protocole et l'identifiant GIE à chaque changement de codeCommune
        useEffect(() => {
            const updateNumeroAndIdentifiant = async () => {
                if (gieData.codeRegion &&
                    gieData.codeDepartement &&
                    gieData.codeArrondissement &&
                    gieData.codeCommune) {
                    const numeroProtocole = await fetchNextNumeroProtocole(gieData.codeCommune, gieData.codeRegion, gieData.codeDepartement, gieData.codeArrondissement);
                    const identifiant = generateGIEName(gieData.codeRegion, gieData.codeDepartement, gieData.codeArrondissement, gieData.codeCommune, numeroProtocole);
                    setGieData(prev => ({
                        ...prev,
                        numeroGIE: numeroProtocole,
                        identifiantGIE: identifiant,
                        nomGIE: identifiant
                    }));
                }
            };
            updateNumeroAndIdentifiant();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [gieData.codeRegion, gieData.codeDepartement, gieData.codeArrondissement, gieData.codeCommune]);
        const getNomCommune = () => {
            if (!gieData.region || !gieData.departement || !gieData.arrondissement || !gieData.commune)
                return gieData.commune;
            const communes = getCommunes(gieData.region, gieData.departement, gieData.arrondissement);
            const commune = communes.find(c => c.code === gieData.commune);
            return commune ? commune.nom : gieData.commune;
        };
        // Créer le tableau des membres avec formatage professionnel
        const creerTableauMembres = () => {
            let tableau = '';
            const allMembers = [
                { nom: gieData.presidenteNom, prenom: gieData.presidentePrenom, fonction: 'Présidente', cin: gieData.presidenteCIN, telephone: gieData.presidenteTelephone, genre: 'Femme' },
                ...gieData.membres.map(m => ({
                    nom: m.nom,
                    prenom: m.prenom,
                    fonction: m.fonction === 'Secrétaire' ? 'Secrétaire Générale' : m.fonction === 'Trésorière' ? 'Trésorière' : 'Membre',
                    cin: m.cin,
                    telephone: m.telephone,
                    genre: m.genre === 'femme' ? 'Femme' : m.genre === 'jeune' ? 'Jeune' : 'Homme'
                }))
            ];
            // Compléter jusqu'à 40 membres si nécessaire
            for (let i = allMembers.length; i < 40; i++) {
                allMembers.push({ nom: '', prenom: '', fonction: 'Membre', cin: '', telephone: '', genre: 'Femme' });
            }
            // Créer le tableau formaté
            allMembers.forEach((membre, index) => {
                const num = (index + 1).toString().padStart(2, '0');
                tableau += `${num}\t${membre.prenom}\t${membre.nom}\t${membre.fonction}\t${membre.genre}\t${membre.cin}\t${membre.telephone}\t_______________\n`;
            });
            return tableau;
        };
        return `STATUTS DU GIE ${gieData.identifiantGIE}

Aujourd'hui,
${new Date().toLocaleDateString('fr-FR')}

Dans la région de : ${getNomRegion()}
département de : ${getNomDepartement()}
arrondissement de : ${getNomArrondissement()}
commune de : ${getNomCommune()}

Les soussignés,

N°\tPrénom\tNom\tTitre\tIdentité\tCIN N°\tTéléphone\tSignature
${creerTableauMembres()}

Ont établi ainsi les statuts d'un GROUPEMENT D'INTERET ECONOMIQUE qu'elles(qu'ils) proposent de constituer.

ARTICLE 1- FORME :
Il est formé entre les soussignés, un GROUPEMENT D'INTERET ECONOMIQUE qui sera régi par les lois en vigueur et par les présents statuts.

ARTICLE 2- OBJET :
Le GROUPEMENT D'INTERET ECONOMIQUE a pour objet :
- commerce et distribution de produits agroalimentaires et autres en détail, au niveau territorial (affilié de la grande distribution « AVEC FEVEO DISTRIBUTION »)
- exploitation des ressources du secteur primaire
- transformation des ressources du secteur primaire et/ou secondaire
- multiservices
- restauration et services traiteur
- cadre de vie
- divers

ARTICLE 3- DENOMINATION SOCIALE :
La dénomination sociale du groupement est FEMMES VISION ECONOMIE ORGANIQUE + code région + code département + code arrondissement + code commune + n° de protocole d'adhésion à la plateforme FEVEO 2050 dans la commune « ${gieData.nomGIE} »

Dans tous les actes et documents émanant du groupement d'intérêt Economique cette dénomination devra toujours être mentionnée suivie du mot "Groupement d'Intérêt Economique" régi par l'Acte Uniforme OHADA relatif au droit des sociétés Commerciales et du Groupement d'intérêt Economique.

ARTICLE 4 - SIEGE SOCIAL
Le siège social du groupement est établi au quartier ${gieData.presidenteAdresse}, commune de ${getNomCommune()}.
Il pourra être transféré en tout autre endroit de la même ville ou de la même région ou en tout autre endroit du Sénégal en vertu d'une délibération de l'assemblée Générale des membres.

ARTICLE 5 – DUREE
La durée du Groupement Economique est fixée à 99 ans à compter du jour de sa constitution définitive sauf les cas de dissolution prévus aux articles 883 et suivants de l'Acte Uniforme OHADA relatif au droit des sociétés commerciales et du Groupement d'intérêt Economique.

ARTICLE 6 – APPORTS
Chaque membre du GIE doit apporter la somme de 273 900 f.cfa (deux cent soixante-treize mille neuf cents) à libérer par une somme minimale mensuelle de 4 500 f au 05 de chaque mois jusqu'à la libération totale du montant, ne dépassant pas la date limite du 05 avril 2030.

ARTICLE 7 – CAPITAL SOCIAL
Le capital social : 10 956 000 F.CFA dont 60 000 (soixante mille francs) entièrement libérés à la date de constitution (à raison de 1 500 f.cfa par membre). Le reste du capital se libèrera par appel de capitaux, mensuellement.

ARTICLE 8 – DROITS ET OBLIGATIONS DES MEMBRES
Les membres du Groupement d'Intérêt Economique sont tenus des dettes de celui-ci sur leur patrimoine propre. Ils sont solidaires, sauf convention contraire, avec les tiers. Les apports ne déterminent ni la majorité, ni la répartition des voix au sein du Groupement.

ARTICLE 9 – ADMINISTRATION DU GROUPE D'INTERET ECONOMIQUE
Le groupement est administré par un conseil de gestion constitué par :
1- La Présidente : ${gieData.presidentePrenom} ${gieData.presidenteNom}
2- La secrétaire générale : ${gieData.membres.find(m => m.fonction === 'Secrétaire')?.prenom || ''} ${gieData.membres.find(m => m.fonction === 'Secrétaire')?.nom || ''}
3- La trésorière générale : ${gieData.membres.find(m => m.fonction === 'Trésorière')?.prenom || ''} ${gieData.membres.find(m => m.fonction === 'Trésorière')?.nom || ''}

ARTICLE 10 –ADMISSION ET RETRAIT DES MEMBRES
Le Groupement, au cours de son existence, peut accepter de nouveaux membres dans les conditions fixées par le contrat constitutif, tout membre du Groupement peut se retirer dans les conditions prévues dans le contrat, sous réserve qu'il ait exécuté ses obligations.

Article 11- DECISIONS COLLECTIVES DU GROUPEMENT
Les décisions collectives du Groupement sont prises par l'Assemblée Générale. L'assemblée générale des membres du groupement d'Intérêt Economique est habilitée à prendre toute décision y compris de dissolution anticipée ou de prorogation dans les conditions déterminées par le contrat.

Celui-ci peut prévoir que toutes les décisions ou certaines d'entre elles seront prises aux conditions de quorum et de majorité qu'il fixe.

Dans le silence du contrat, les décisions sont prises à l'unanimité.

Le contrat peut également attribuer à chaque membre du Groupement d'Intérêt Economique un nombre de voix différent de celui attribué aux autres.

A défaut, chaque membre dispose d'une voix.

ARTICLE 12 – DISSOLUTION DU GROUPEMENT
Le Groupement est dissout dans les cas prévus aux articles 883 et suivant de l'Acte Uniforme OHADA relatif au droit des sociétés Commerciales et du Groupement d'Intérêt Economique.

La dissolution du Groupement d'Intérêt Economique entraîne sa liquidation.

Après paiement des dettes, l'excédent d'actifs est reparti entre les membres dans les conditions prévues par le contrat, à défaut, la répartition est faite par parts égales.

Fait à ${getNomCommune()}, le ${new Date().toLocaleDateString('fr-FR')}

                                                                                        Statuts GIE FEVEO`;
    };
    const generateReglementInterieur = () => {
        return `
RÈGLEMENT INTÉRIEUR DU GIE FEVEO
"${gieData.nomGIE}"

Identifiant : ${gieData.identifiantGIE}

CHAPITRE I - DISPOSITIONS GÉNÉRALES

Article 1 : Objet
Le présent règlement intérieur a pour objet de préciser les conditions d'application des statuts du Groupement d'Intérêt Économique FEVEO "${gieData.nomGIE}" et de déterminer les règles de fonctionnement interne du groupement.

Article 2 : Champ d'application
Le présent règlement s'applique à tous les membres du GIE sans exception. Il complète les statuts et ne peut en aucun cas s'y substituer ou les contredire.

CHAPITRE II - ORGANISATION ET FONCTIONNEMENT

Article 3 : Assemblée Générale
3.1 - Assemblée générale ordinaire
L'assemblée générale ordinaire se réunit au moins une fois par trimestre sur convocation de la Présidente ou à la demande du tiers des membres.

3.2 - Assemblée générale extraordinaire
L'assemblée générale extraordinaire se réunit chaque fois que les intérêts du groupement l'exigent, sur convocation de la Présidente ou à la demande du quart des membres.

3.3 - Convocation
Les convocations sont adressées aux membres au moins huit (8) jours avant la date prévue, par tout moyen laissant trace écrite, accompagnées de l'ordre du jour.

3.4 - Quorum et majorité
Le quorum est atteint lorsque les deux tiers (2/3) des membres sont présents ou représentés. Les décisions sont prises à la majorité simple des membres présents ou représentés.

Article 4 : Bureau exécutif
4.1 - Composition
Le bureau exécutif comprend :
- La Présidente : ${gieData.presidentePrenom} ${gieData.presidenteNom}
- La Secrétaire Générale : ${gieData.membres.find(m => m.fonction === 'Secrétaire')?.prenom || ''} ${gieData.membres.find(m => m.fonction === 'Secrétaire')?.nom || ''}
- La Trésorière Générale : ${gieData.membres.find(m => m.fonction === 'Trésorière')?.prenom || ''} ${gieData.membres.find(m => m.fonction === 'Trésorière')?.nom || ''}

4.2 - Rôle de la Présidente
- Représentation légale du GIE
- Gestion courante et administration
- Coordination avec la plateforme FEVEO 2050
- Convocation et présidence des assemblées

4.3 - Rôle de la Secrétaire Générale
- Tenue des procès-verbaux et registres
- Gestion de la correspondance
- Conservation des archives

4.4 - Rôle de la Trésorière Générale
- Gestion de la caisse et des comptes
- Établissement des bilans financiers
- Recouvrement des cotisations

CHAPITRE III - DROITS ET OBLIGATIONS DES MEMBRES

Article 5 : Droits des membres
Chaque membre a le droit de :
- Participer aux assemblées générales
- Être informé de la marche du groupement
- Accéder aux documents comptables
- Bénéficier des avantages du groupement
- Participer aux formations FEVEO

Article 6 : Obligations des membres
Chaque membre a l'obligation de :
- Respecter les statuts et le présent règlement
- S'acquitter de ses cotisations dans les délais
- Participer activement aux activités du groupement
- Préserver l'image et les intérêts du GIE
- Respecter les engagements pris envers FEVEO 2050

Article 7 : Cotisations et contributions
7.1 - Montant des apports
Conformément aux statuts, chaque membre doit apporter la somme de 273 900 F.CFA à libérer par versements mensuels de 4 500 F.CFA minimum au 05 de chaque mois.

7.2 - Sanctions
Le non-respect des échéances de paiement peut entraîner :
- Un rappel à l'ordre pour le premier retard
- Une pénalité de 500 F.CFA par mois de retard
- L'exclusion du groupement en cas de retard supérieur à trois (3) mois

CHAPITRE IV - ACTIVITÉS ET PROJETS

Article 8 : Domaines d'activité
Le groupement intervient dans les secteurs suivants :
- Commerce et distribution de produits agroalimentaires
- Exploitation des ressources du secteur primaire
- Transformation des ressources
- Multiservices
- Restauration et services traiteur
- Amélioration du cadre de vie

Article 9 : Standards FEVEO
Toutes les activités du groupement doivent respecter :
- Les normes de qualité FEVEO 2050
- Les pratiques de l'agriculture biologique
- Les principes du commerce équitable
- Les standards environnementaux

CHAPITRE V - GESTION FINANCIÈRE

Article 10 : Comptabilité
10.1 - Tenue des comptes
Le groupement tient une comptabilité simplifiée conformément à la réglementation en vigueur.

10.2 - Exercice comptable
L'exercice comptable court du 1er janvier au 31 décembre de chaque année.

10.3 - Contrôle
Les comptes sont vérifiés trimestriellement par un membre désigné par l'assemblée générale.

Article 11 : Rapports financiers
Un rapport financier trimestriel est transmis à :
- Tous les membres du groupement
- La coordination FEVEO 2050
- Les autorités compétentes si requis

CHAPITRE VI - PARTENARIAT FEVEO 2050

Article 12 : Engagements
Le groupement s'engage à :
- Respecter la charte FEVEO 2050
- Participer aux programmes de formation
- Utiliser les circuits de distribution FEVEO
- Promouvoir les valeurs de l'économie verte

Article 13 : Avantages
Le partenariat FEVEO 2050 donne accès à :
- Un réseau de distribution élargi
- Des formations techniques spécialisées
- Un accompagnement personnalisé
- Des facilités de financement

CHAPITRE VII - DISCIPLINE ET SANCTIONS

Article 14 : Procédure disciplinaire
Tout manquement aux obligations peut faire l'objet d'une procédure disciplinaire incluant :
- Une convocation du membre concerné
- Son audition devant le bureau exécutif
- Une décision motivée
- Un délai de recours de quinze (15) jours

Article 15 : Sanctions
Les sanctions applicables sont :
- L'avertissement
- Le blâme
- La suspension temporaire
- L'exclusion définitive

CHAPITRE VIII - DISPOSITIONS FINALES

Article 16 : Modification
Le présent règlement peut être modifié par l'assemblée générale à la majorité des deux tiers (2/3) des membres.

Article 17 : Entrée en vigueur
Le présent règlement entre en vigueur à compter de son adoption par l'assemblée générale constitutive.

Article 18 : Règlement des litiges
Les litiges entre membres ou entre un membre et le groupement sont soumis en premier lieu à une procédure de conciliation interne. En cas d'échec, ils relèvent des juridictions compétentes.

Fait à ${gieData.commune}, le ${new Date().toLocaleDateString('fr-FR')}

La Présidente,
${gieData.presidentePrenom} ${gieData.presidenteNom}

Approuvé par l'Assemblée Générale Constitutive
    `;
    };
    const generateProcesVerbal = () => {
        return `
PROCÈS-VERBAL DE CONSTITUTION ET DE NOMINATION
GIE "${gieData.nomGIE}"

Date de constitution : ${new Date(gieData.dateConstitution).toLocaleDateString('fr-FR')}
Lieu : ${gieData.commune}, ${gieData.region}
Identifiant FEVEO : ${gieData.identifiantGIE}

MEMBRES FONDATEURS :
${gieData.membres.map((m, i) => `
${i + 1}. ${m.prenom} ${m.nom}
   Fonction : ${m.fonction}
   CIN : ${m.cin}
   Téléphone : ${m.telephone}
`).join('')}

DÉCISIONS PRISES :

1. CONSTITUTION
Il est décidé à l'unanimité la constitution du GIE "${gieData.nomGIE}".

2. ADOPTION DES STATUTS
Les statuts présentés sont adoptés à l'unanimité.

3. NOMINATION DU BUREAU
- Présidente : Mme ${gieData.presidentePrenom} ${gieData.presidenteNom}
- Acceptation : Oui

4. AFFILIATION FEVEO 2050
Le GIE décide d'adhérer à la plateforme FEVEO 2050 sous le protocole n° ${gieData.numeroGIE}.

5. POUVOIRS
Tous pouvoirs sont donnés à la Présidente pour accomplir les formalités 
d'immatriculation et d'affiliation à FEVEO 2050.

Signatures des membres :
${gieData.membres.map(m => `${m.prenom} ${m.nom} : _______________`).join('\n')}

Fait à ${gieData.commune}, le ${new Date().toLocaleDateString('fr-FR')}
    `;
    };
    const generateDemandeAdhesion = () => {
        return `
DEMANDE D'ADHÉSION ET D'AFFILIATION À LA PLATEFORME FEVEO 2050

IDENTIFIANT GIE : ${gieData.identifiantGIE}
PROTOCOLE N° : ${gieData.numeroGIE}

INFORMATIONS DU GIE :
- Dénomination : ${gieData.nomGIE}
- Secteur d'activité : ${gieData.secteurPrincipal}
- Localisation : ${gieData.commune}, ${gieData.arrondissement}, ${gieData.departement}, ${gieData.region}
- Nombre de membres : ${gieData.membres.length}

PRÉSIDENTE :
- Nom complet : ${gieData.presidentePrenom} ${gieData.presidenteNom}
- CIN : ${gieData.presidenteCIN}
- Téléphone : ${gieData.presidenteTelephone}
- Email : ${gieData.presidenteEmail}
- Adresse : ${gieData.presidenteAdresse}

ACTIVITÉS DÉCLARÉES :
${gieData.activites.map(a => `- ${a}`).join('\n')}

OBJECTIFS :
${gieData.objectifs}

ENGAGEMENT :
Le GIE "${gieData.nomGIE}" s'engage à respecter :
- Les valeurs et principes de FEVEO 2050
- Les standards de qualité en agriculture biologique
- Les règles de transparence et de gouvernance
- La participation active aux programmes de formation

TYPE D'ADHÉSION DEMANDÉE :
☐ Standard (20 000 FCFA)
☐ Premium (50 000 FCFA)

PIÈCES JOINTES :
☐ Statuts du GIE
☐ Règlement intérieur
☐ Procès-verbal de constitution
☐ Copies CIN des membres
☐ Justificatifs de domicile

Fait à ${gieData.commune}, le ${new Date().toLocaleDateString('fr-FR')}

Signature de la Présidente,
${gieData.presidentePrenom} ${gieData.presidenteNom}
    `;
    };
    const updateGIEData = (field, value) => {
        console.log(`🔄 Mise à jour: ${field} = ${value}`);
        const updatedData = { ...gieData, [field]: value };
        setGieData(updatedData);
        console.log('📊 État mis à jour:', updatedData);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const addMember = () => {
        const newMember = {
            nom: '',
            prenom: '',
            fonction: 'Membre',
            cin: '',
            telephone: '',
            genre: 'femme',
            age: undefined
        };
        setGieData(prev => ({
            ...prev,
            membres: [...prev.membres, newMember]
        }));
    };
    const updateMember = (index, field, value) => {
        setGieData(prev => ({
            ...prev,
            membres: prev.membres.map((member, i) => i === index ? { ...member, [field]: value } : member)
        }));
    };
    const removeMember = (index) => {
        setGieData(prev => ({
            ...prev,
            membres: prev.membres.filter((_, i) => i !== index)
        }));
    };
    const validateStep1 = () => {
        const newErrors = {};
        // Le nom du GIE est généré automatiquement, pas besoin de validation
        if (!gieData.presidenteNom.trim())
            newErrors.presidenteNom = 'Nom de la présidente requis';
        if (!gieData.presidentePrenom.trim())
            newErrors.presidentePrenom = 'Prénom requis';
        if (!gieData.presidenteCIN.trim())
            newErrors.presidenteCIN = 'CIN requis';
        // Validation de la secrétaire
        if (!gieData.secretaireNom.trim())
            newErrors.secretaireNom = 'Nom de la secrétaire requis';
        if (!gieData.secretairePrenom.trim())
            newErrors.secretairePrenom = 'Prénom de la secrétaire requis';
        if (!gieData.secretaireCIN.trim())
            newErrors.secretaireCIN = 'CIN de la secrétaire requis';
        if (!gieData.secretaireTelephone.trim())
            newErrors.secretaireTelephone = 'Téléphone de la secrétaire requis';
        // Validation de la trésorière
        if (!gieData.tresoriereNom.trim())
            newErrors.tresoriereNom = 'Nom de la trésorière requis';
        if (!gieData.tresorierePrenom.trim())
            newErrors.tresorierePrenom = 'Prénom de la trésorière requis';
        if (!gieData.tresoriereCIN.trim())
            newErrors.tresoriereCIN = 'CIN de la trésorière requis';
        if (!gieData.tresoriereTelephone.trim())
            newErrors.tresoriereTelephone = 'Téléphone de la trésorière requis';
        if (!gieData.region)
            newErrors.region = 'Région requise';
        if (!gieData.departement)
            newErrors.departement = 'Département requis';
        if (!gieData.arrondissement)
            newErrors.arrondissement = 'Arrondissement requis';
        if (!gieData.commune)
            newErrors.commune = 'Commune requise';
        // Validation de la composition des membres (minimum 3 avec rôles obligatoires)
        const totalMembers = gieData.membres.length + 3; // +3 pour la présidente, secrétaire et trésorière
        if (totalMembers < 3) {
            newErrors.membres = `Le GIE doit avoir au minimum 3 membres (actuellement ${totalMembers})`;
        }
        else {
            // Les rôles obligatoires (présidente, secrétaire, trésorière) sont déjà dans des champs séparés
            if (totalMembers > 3) {
                // Si plus de 3 membres, vérifier les règles FEVEO 2050 pour la composition de genre
                const femmes = gieData.membres.filter(m => m.genre === 'femme').length + 3; // +3 présidente, secrétaire, trésorière
                const jeunes = gieData.membres.filter(m => m.genre === 'jeune').length;
                const hommes = gieData.membres.filter(m => m.genre === 'homme').length;
                // Option 1: 100% femmes OU Option 2: composition mixte proportionnelle
                const isOption1Valid = femmes === totalMembers;
                const minFemmes = Math.ceil(totalMembers * 0.625); // 62.5%
                const minJeunes = Math.ceil(totalMembers * 0.3); // 30%
                const maxHommes = Math.floor(totalMembers * 0.075); // 7.5%
                // Limite stricte à 12 jeunes pour l'option mixte
                const isOption2Valid = jeunes <= 12 && hommes <= maxHommes;
                if (!isOption1Valid && !isOption2Valid) {
                    if (jeunes > 12) {
                        newErrors.membres = `Maximum 12 jeunes autorisés (actuellement ${jeunes})`;
                    }
                    else if (hommes > maxHommes) {
                        newErrors.membres = `Maximum ${maxHommes} hommes adultes autorisés (actuellement ${hommes})`;
                    }
                    else {
                        newErrors.membres = 'Composition non conforme aux règles FEVEO 2050: soit 100% femmes, soit 62.5% femmes + 30% jeunes (max 12) + max 7.5% hommes';
                    }
                }
            }
        }
        setErrors(newErrors);
        console.log('🔍 Erreurs de validation:', newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // (supprimé : la génération d'identifiant est automatique via useEffect)
    const downloadDocument = (type, filename) => {
        if (type === 'statuts') {
            generateStatutsPDF();
        }
        else if (type === 'reglement') {
            generateReglementInterieurPDF();
        }
        else if (type === 'procesVerbal') {
            generateProcesVerbalPDF();
        }
        else if (type === 'demande') {
            generateDemandeAdhesionPDF();
        }
        else {
            // Pour les autres documents, garder le format texte pour l'instant
            const content = generateDocument(type);
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }
    };
    const generateStatutsPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        // Convertir les codes en noms
        const getNomRegion = () => {
            const region = regions.find(r => r.code === gieData.region);
            return region ? region.nom : gieData.region;
        };
        const getNomDepartement = () => {
            if (!gieData.region || !gieData.departement)
                return gieData.departement;
            const departements = getDepartements(gieData.region);
            const dept = departements.find(d => d.code === gieData.departement);
            return dept ? dept.nom : gieData.departement;
        };
        const getNomArrondissement = () => {
            if (!gieData.region || !gieData.departement || !gieData.arrondissement)
                return gieData.arrondissement;
            const arrondissements = getArrondissements(gieData.region, gieData.departement);
            const arr = arrondissements.find(a => a.code === gieData.arrondissement);
            return arr ? arr.nom : gieData.arrondissement;
        };
        const getNomCommune = () => {
            if (!gieData.region || !gieData.departement || !gieData.arrondissement || !gieData.commune)
                return gieData.commune;
            const communes = getCommunes(gieData.region, gieData.departement, gieData.arrondissement);
            const commune = communes.find(c => c.code === gieData.commune);
            return commune ? commune.nom : gieData.commune;
        };
        let yPosition = margin;
        // En-tête centré et stylé
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        const title = 'STATUTS DU GIE FEVEO';
        const titleWidth = pdf.getTextWidth(title);
        pdf.text(title, (pageWidth - titleWidth) / 2, yPosition);
        // Ligne décorative
        yPosition += 5;
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;
        // Date
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Aujourd'hui, ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition);
        yPosition += 10;
        // Localisation
        pdf.setFont('helvetica', 'bold');
        pdf.text('Localisation géographique :', margin, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Dans la région de : ${getNomRegion()}`, margin + 5, yPosition);
        yPosition += 6;
        pdf.text(`département de : ${getNomDepartement()}`, margin + 5, yPosition);
        yPosition += 6;
        pdf.text(`arrondissement de : ${getNomArrondissement()}`, margin + 5, yPosition);
        yPosition += 6;
        pdf.text(`commune de : ${getNomCommune()}`, margin + 5, yPosition);
        yPosition += 15;
        // Préambule
        pdf.setFont('helvetica', 'bold');
        pdf.text('Les soussignés,', margin, yPosition);
        yPosition += 10;
        // Tableau des membres
        const allMembers = [
            {
                nom: gieData.presidenteNom,
                prenom: gieData.presidentePrenom,
                fonction: 'Présidente',
                cin: gieData.presidenteCIN,
                genre: 'Femme'
            },
            {
                nom: gieData.secretaireNom,
                prenom: gieData.secretairePrenom,
                fonction: 'Secrétaire Générale',
                cin: gieData.secretaireCIN,
                genre: 'Femme'
            },
            {
                nom: gieData.tresoriereNom,
                prenom: gieData.tresorierePrenom,
                fonction: 'Trésorière',
                cin: gieData.tresoriereCIN,
                genre: 'Femme'
            },
            ...gieData.membres.map(m => ({
                nom: m.nom,
                prenom: m.prenom,
                fonction: m.fonction === 'Secrétaire' ? 'Secrétaire Générale' : m.fonction === 'Trésorière' ? 'Trésorière' : 'Membre',
                cin: m.cin,
                genre: m.genre === 'femme' ? 'Femme' : m.genre === 'jeune' ? 'Jeune' : 'Homme'
            }))
        ];
        // En-têtes du tableau
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        const colWidths = [15, 35, 35, 35, 25, 40];
        const headers = ['N°', 'Prénom', 'Nom', 'Fonction', 'Genre', 'CIN'];
        let xPos = margin;
        headers.forEach((header, i) => {
            pdf.text(header, xPos, yPosition);
            xPos += colWidths[i];
        });
        yPosition += 2;
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
        // Données du tableau
        pdf.setFont('helvetica', 'normal');
        allMembers.forEach((membre, index) => {
            if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = margin;
            }
            xPos = margin;
            const rowData = [
                (index + 1).toString().padStart(2, '0'),
                membre.prenom || '',
                membre.nom || '',
                membre.fonction || '',
                membre.genre || '',
                membre.cin || ''
            ];
            rowData.forEach((data, i) => {
                const text = pdf.splitTextToSize(data, colWidths[i] - 2);
                pdf.text(text, xPos, yPosition);
                xPos += colWidths[i];
            });
            yPosition += 8;
        });
        yPosition += 10;
        // Articles des statuts
        const articles = [
            {
                titre: 'ARTICLE 1 - FORME',
                contenu: 'Il est formé entre les soussignés, un GROUPEMENT D\'INTERET ECONOMIQUE qui sera régi par les lois en vigueur et par les présents statuts.'
            },
            {
                titre: 'ARTICLE 2 - OBJET',
                contenu: `Le GROUPEMENT D'INTERET ECONOMIQUE a pour objet :
- commerce et distribution de produits agroalimentaires et autres en détail, au niveau territorial (affilié de la grande distribution « AVEC FEVEO DISTRIBUTION »)
- exploitation des ressources du secteur primaire
- transformation des ressources du secteur primaire et/ou secondaire
- multiservices
- restauration et services traiteur
- cadre de vie
- divers`
            },
            {
                titre: 'ARTICLE 3 - DENOMINATION SOCIALE',
                contenu: `La dénomination sociale du groupement est FEMMES VISION ECONOMIE ORGANIQUE + code région + code département + code arrondissement + code commune + n° de protocole d'adhésion à la plateforme FEVEO 2050 dans la commune « ${gieData.nomGIE} ».

Dans tous les actes et documents émanant du groupement d'intérêt Economique cette dénomination devra toujours être mentionnée suivie du mot "Groupement d'Intérêt Economique" régi par l'Acte Uniforme OHADA relatif au droit des sociétés Commerciales et du Groupement d'intérêt Economique.`
            },
            {
                titre: 'ARTICLE 4 - SIEGE SOCIAL',
                contenu: `Le siège social du groupement est établi au quartier ${gieData.presidenteAdresse || '.....................'}, commune de ${getNomCommune()}.
Il pourra être transféré en tout autre endroit de la même ville ou de la même région ou en tout autre endroit du Sénégal en vertu d'une délibération de l'assemblée Générale des membres.`
            },
            {
                titre: 'ARTICLE 5 - DUREE',
                contenu: 'La durée du Groupement Economique est fixée à 99 ans à compter du jour de sa constitution définitive sauf les cas de dissolution prévus aux articles 883 et suivants de l\'Acte Uniforme OHADA relatif au droit des sociétés commerciales et du Groupement d\'intérêt Economique.'
            },
            {
                titre: 'ARTICLE 6 - APPORTS',
                contenu: 'Chaque membre du GIE doit apporter la somme de 273 900 f.cfa (deux cent soixante-treize mille neuf cents) à libérer par une somme minimale mensuelle de 4 500 f au 05 de chaque mois jusqu\'à la libération totale du montant, ne dépassant pas la date limite du 05 avril 2030.'
            },
            {
                titre: 'ARTICLE 7 - CAPITAL SOCIAL',
                contenu: 'Le capital social : 10 956 000 F.CFA dont 60 000 (soixante mille francs) entièrement libérés à la date de constitution (à raison de 1 500 f.cfa par membre). Le reste du capital se libèrera par appel de capitaux, mensuellement.'
            },
            {
                titre: 'ARTICLE 8 - DROITS ET OBLIGATIONS DES MEMBRES',
                contenu: 'Les membres du Groupement d\'Intérêt Economique sont tenus des dettes de celui-ci sur leur patrimoine propre. Ils sont solidaires, sauf convention contraire, avec les tiers. Les apports ne déterminent ni la majorité, ni la répartition des voix au sein du Groupement.'
            },
            {
                titre: 'ARTICLE 9 - ADMINISTRATION DU GROUPE D\'INTERET ECONOMIQUE',
                contenu: `Le groupement est administré par un conseil de gestion constitué par :
1- La Présidente : ${gieData.presidentePrenom} ${gieData.presidenteNom}
2- La secrétaire générale : ${gieData.membres.find(m => m.fonction === 'Secrétaire')?.prenom || ''} ${gieData.membres.find(m => m.fonction === 'Secrétaire')?.nom || ''}
3- La trésorière générale : ${gieData.membres.find(m => m.fonction === 'Trésorière')?.prenom || ''} ${gieData.membres.find(m => m.fonction === 'Trésorière')?.nom || ''}`
            },
            {
                titre: 'ARTICLE 10 - ADMISSION ET RETRAIT DES MEMBRES',
                contenu: `Le Groupement, au cours de son existence, peut accepter de nouveaux membres dans les conditions fixées par le contrat constitutif, tout membre du Groupement peut se retirer dans les conditions prévues dans le contrat, sous réserve qu'il ait exécuté ses obligations.`
            },
            {
                titre: 'ARTICLE 11 - DECISIONS COLLECTIVES DU GROUPEMENT  ',
                contenu: `Les décisions collectives du Groupement sont prises par l'Assemblée Générale. L'assemblée générale des membres du groupement d'Intérêt Economique est habilitée à prendre toute décision y compris de dissolution anticipée ou de prorogation dans les conditions déterminées par le contrat.`
            },
            {
                titre: 'ARTICLE 12 - DISSOLUTION DU GROUPEMENT',
                contenu: `Le Groupement est dissout dans les cas prévus aux articles 883 et suivant de l'Acte Uniforme OHADA relatif au droit des sociétés Commerciales et du Groupement d'Intérêt Economique.`
            }
        ];
        articles.forEach(article => {
            if (yPosition > pageHeight - 50) {
                pdf.addPage();
                yPosition = margin;
            }
            // Titre de l'article
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(11);
            pdf.text(article.titre, margin, yPosition);
            yPosition += 8;
            // Contenu de l'article
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            const lines = pdf.splitTextToSize(article.contenu, contentWidth);
            pdf.text(lines, margin, yPosition);
            yPosition += lines.length * 5 + 10;
        });
        // Pied de page
        if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
        }
        yPosition += 10;
        pdf.setFont('helvetica', 'italic');
        pdf.text(`Fait à ${getNomCommune()}, le ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition);
        yPosition += 20;
        pdf.setFont('helvetica', 'normal');
        pdf.text('Statuts GIE FEVEO', pageWidth - margin - 40, yPosition);
        // Télécharger le PDF
        const fileName = `Statuts_${gieData.nomGIE || 'GIE_FEVEO'}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        // Notification de succès
        alert(`✅ Document PDF généré avec succès !\n\n📁 Fichier : ${fileName}\n📄 ${allMembers.length} membres inclus\n📋 12 articles des statuts OHADA\n🏢 Localisation : ${getNomCommune()}, ${getNomRegion()}`);
    };
    const generateProcesVerbalPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        let yPosition = margin;
        // En-tête centré
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const headerTitle = 'GIE FEVEO';
        const headerTitleWidth = pdf.getTextWidth(headerTitle);
        pdf.text(headerTitle, (pageWidth - headerTitleWidth) / 2, yPosition);
        yPosition += 10;
        pdf.setFontSize(12);
        const pvTitle = 'PROCES VERBAL DE CONSTITUTION ET DE NOMINATION';
        const pvTitleWidth = pdf.getTextWidth(pvTitle);
        pdf.text(pvTitle, (pageWidth - pvTitleWidth) / 2, yPosition);
        yPosition += 15;
        // Date
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        pdf.text(`L'an deux mille vingt cinq`, margin, yPosition);
        yPosition += 6;
        pdf.text(`En leur séance du ..../..../ ${year}`, margin, yPosition);
        yPosition += 10;
        // Texte principal
        const mainText = `Les membres fondateurs du Groupement dénommé FEVEO .......... se sont réunis en Assemblée Générale constitutive au siège`;
        const lines1 = pdf.splitTextToSize(mainText, contentWidth);
        pdf.text(lines1, margin, yPosition);
        yPosition += lines1.length * 6 + 5;
        const text2 = `Etaient présents à cette AG, tous les membres adhérents audit GIE.`;
        pdf.text(text2, margin, yPosition);
        yPosition += 8;
        const text3 = `Après avoir vérifié que chaque membre du GIE est présent, par conséquent, le quorum étant atteint, l'assemblée peut valablement délibérer.`;
        const lines3 = pdf.splitTextToSize(text3, contentWidth);
        pdf.text(lines3, margin, yPosition);
        yPosition += lines3.length * 6 + 15;
        // Section NOMINATIONS
        pdf.setFont('helvetica', 'bold');
        pdf.text('NOMINATIONS', margin, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        const nominationText = `Conformément aux dispositions légales et réglementaires relatives aux incompatibilités, à l'unanimité :`;
        const nominationLines = pdf.splitTextToSize(nominationText, contentWidth);
        pdf.text(nominationLines, margin, yPosition);
        yPosition += nominationLines.length * 6 + 8;
        // Nomination des membres du bureau
        const presidenteNom = `Madame ${gieData.presidentePrenom} ${gieData.presidenteNom}`;
        pdf.text(`${presidenteNom} a été nommée PRESIDENTE du GIE, et à cet effet, a déclaré accepter cette fonction ;`, margin, yPosition);
        yPosition += 12;
        // Secrétaire (données depuis gieData)
        if (gieData.secretairePrenom && gieData.secretaireNom) {
            const secretaireNom = `Madame ${gieData.secretairePrenom} ${gieData.secretaireNom}`;
            pdf.text(`${secretaireNom} a été nommée Secrétaire Général du GIE qui a accepté cette fonction ;`, margin, yPosition);
            yPosition += 12;
        }
        // Trésorière (données depuis gieData)
        if (gieData.tresorierePrenom && gieData.tresoriereNom) {
            const tresoriereNom = `Madame ${gieData.tresorierePrenom} ${gieData.tresoriereNom}`;
            pdf.text(`${tresoriereNom} a été nommée Trésorière Générale du GIE, qui, à cet effet, a déclaré accepter cette fonction ;`, margin, yPosition);
            yPosition += 15;
        }
        // Section DÉLÉGATION DE POUVOIRS
        pdf.setFont('helvetica', 'bold');
        pdf.text('DELÉGATION DE POUVOIRS', margin, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        const delegationText = `En conséquence, l'assemblée délègue à la Présidente tous pouvoirs à l'effet de :`;
        pdf.text(delegationText, margin, yPosition);
        yPosition += 10;
        const pouvoirs = [
            'De représentation pour les intérêts supérieurs du GIE',
            'De présidence des AG ;',
            'De contrôle de la gérance ;',
            'De remplir toutes les formalités de constitution notamment :'
        ];
        pouvoirs.forEach(pouvoir => {
            pdf.text(pouvoir, margin + 5, yPosition);
            yPosition += 8;
        });
        // Sous-points avec puces
        yPosition += 5;
        const subPoints = [
            '• Effectuer les dépôts et pièces ;',
            '• Faire toutes déclarations d\'existence exigées par les administrations ;',
            '• Faire immatriculer le G.I.E au Registre de Commerce et du crédit mobilier, au NINEA.'
        ];
        subPoints.forEach(point => {
            if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = margin;
            }
            pdf.text(point, margin + 15, yPosition);
            yPosition += 8;
        });
        yPosition += 10;
        // Section POUVOIRS DE PRESIDENT
        pdf.setFont('helvetica', 'bold');
        pdf.text('POUVOIRS DE PRESIDENT', margin, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        const presidentPouvoirs = [
            `La Présidente a tous les pouvoirs pour agir au nom du GIE.`,
            `Cependant, le retrait des fonds au niveau des Banques ou de tout autre établissement pour le compte du Groupement d'Intérêt Economique ne peut être effectué que par signature conjointe de la Présidente et de la Trésorière.`,
            `A ce niveau, en cas d'absence de la présidente, elle peut déléguer par écrit, à tout membre fondateur du GIE désigné à cet effet.`,
            `Considérant l'ordre du jour clos, la séance a été levée à 18h 45`
        ];
        presidentPouvoirs.forEach(pouvoir => {
            if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = margin;
            }
            const lines = pdf.splitTextToSize(pouvoir, contentWidth);
            pdf.text(lines, margin, yPosition);
            yPosition += lines.length * 6 + 8;
        });
        yPosition += 10;
        // Texte final
        const finalText = `De tout ce qui précède, il a été dressé ce procès-verbal devant être porté à la connaissance de toute personne physique ou morale susceptible d'être intéressé par ledit groupement d'Intérêt Economique.`;
        if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = margin;
        }
        const finalLines = pdf.splitTextToSize(finalText, contentWidth);
        pdf.text(finalLines, margin, yPosition);
        yPosition += finalLines.length * 6 + 15;
        // Signatures
        if (yPosition > pageHeight - 80) {
            pdf.addPage();
            yPosition = margin;
        }
        const signatureY = yPosition;
        // Trois colonnes de signatures
        pdf.setFont('helvetica', 'italic');
        pdf.text('"Bon pour acceptation"', margin, signatureY);
        pdf.text('"Bon pour acceptation"', margin + 60, signatureY);
        pdf.text('"Bon pour acceptation"', margin + 120, signatureY);
        yPosition += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text('La Présidente', margin + 5, yPosition);
        if (gieData.secretairePrenom && gieData.secretaireNom) {
            pdf.text('La secrétaire générale', margin + 55, yPosition);
        }
        if (gieData.tresorierePrenom && gieData.tresoriereNom) {
            pdf.text('La Trésorière', margin + 125, yPosition);
        }
        // Pied de page
        yPosition = pageHeight - 30;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text('PV GIE FEVO', margin, yPosition);
        pdf.text('Page 1 sur 1', pageWidth - margin - 30, yPosition);
        // Télécharger le PDF
        const fileName = `PV_Constitution_${gieData.nomGIE || 'GIE_FEVEO'}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        // Notification de succès
        alert(`✅ Procès-Verbal PDF généré avec succès !\n\n📁 Fichier : ${fileName}\n� Format identique au modèle FEVEO\n🏢 GIE : ${gieData.nomGIE}`);
    };
    const generateReglementInterieurPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        let yPosition = margin;
        // En-tête centré et stylé
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        const title = 'RÈGLEMENT INTÉRIEUR DU GIE FEVEO';
        const titleWidth = pdf.getTextWidth(title);
        pdf.text(title, (pageWidth - titleWidth) / 2, yPosition);
        yPosition += 8;
        pdf.setFontSize(14);
        const subtitle = `"${gieData.nomGIE}"`;
        const subtitleWidth = pdf.getTextWidth(subtitle);
        pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, yPosition);
        // Ligne décorative
        yPosition += 5;
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;
        // Identifiant
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Identifiant : ${gieData.identifiantGIE}`, margin, yPosition);
        yPosition += 15;
        // Chapitres du règlement intérieur
        const chapitres = [
            {
                titre: 'CHAPITRE I - DISPOSITIONS GÉNÉRALES',
                articles: [
                    {
                        numero: 'Article 1 : Objet',
                        contenu: `Le présent règlement intérieur a pour objet de préciser les conditions d'application des statuts du Groupement d'Intérêt Économique FEVEO "${gieData.nomGIE}" et de déterminer les règles de fonctionnement interne du groupement.`
                    },
                    {
                        numero: 'Article 2 : Champ d\'application',
                        contenu: 'Le présent règlement s\'applique à tous les membres du GIE sans exception. Il complète les statuts et ne peut en aucun cas s\'y substituer ou les contredire.'
                    }
                ]
            },
            {
                titre: 'CHAPITRE II - ORGANISATION ET FONCTIONNEMENT',
                articles: [
                    {
                        numero: 'Article 3 : Assemblée Générale',
                        contenu: `3.1 - Assemblée générale ordinaire
L'assemblée générale ordinaire se réunit au moins une fois par trimestre sur convocation de la Présidente ou à la demande du tiers des membres.

3.2 - Assemblée générale extraordinaire
L'assemblée générale extraordinaire se réunit chaque fois que les intérêts du groupement l'exigent, sur convocation de la Présidente ou à la demande du quart des membres.

3.3 - Convocation
Les convocations sont adressées aux membres au moins huit (8) jours avant la date prévue, par tout moyen laissant trace écrite, accompagnées de l'ordre du jour.

3.4 - Quorum et majorité
Le quorum est atteint lorsque les deux tiers (2/3) des membres sont présents ou représentés. Les décisions sont prises à la majorité simple des membres présents ou représentés.`
                    },
                    {
                        numero: 'Article 4 : Bureau exécutif',
                        contenu: `4.1 - Composition
Le bureau exécutif comprend :
- La Présidente : ${gieData.presidentePrenom} ${gieData.presidenteNom}
- La Secrétaire Générale : ${gieData.membres.find(m => m.fonction === 'Secrétaire')?.prenom || ''} ${gieData.membres.find(m => m.fonction === 'Secrétaire')?.nom || ''}
- La Trésorière Générale : ${gieData.membres.find(m => m.fonction === 'Trésorière')?.prenom || ''} ${gieData.membres.find(m => m.fonction === 'Trésorière')?.nom || ''}

4.2 - Rôle de la Présidente
- Représentation légale du GIE
- Gestion courante et administration
- Coordination avec la plateforme FEVEO 2050
- Convocation et présidence des assemblées

4.3 - Rôle de la Secrétaire Générale
- Tenue des procès-verbaux et registres
- Gestion de la correspondance
- Conservation des archives

4.4 - Rôle de la Trésorière Générale
- Gestion de la caisse et des comptes
- Établissement des bilans financiers
- Recouvrement des cotisations`
                    }
                ]
            },
            {
                titre: 'CHAPITRE III - DROITS ET OBLIGATIONS DES MEMBRES',
                articles: [
                    {
                        numero: 'Article 5 : Droits des membres',
                        contenu: `Chaque membre a le droit de :
- Participer aux assemblées générales
- Être informé de la marche du groupement
- Accéder aux documents comptables
- Bénéficier des avantages du groupement
- Participer aux formations FEVEO`
                    },
                    {
                        numero: 'Article 6 : Obligations des membres',
                        contenu: `Chaque membre a l'obligation de :
- Respecter les statuts et le présent règlement
- S'acquitter de ses cotisations dans les délais
- Participer activement aux activités du groupement
- Préserver l'image et les intérêts du GIE
- Respecter les engagements pris envers FEVEO 2050`
                    },
                    {
                        numero: 'Article 7 : Cotisations et contributions',
                        contenu: `7.1 - Montant des apports
Conformément aux statuts, chaque membre doit apporter la somme de 273 900 F.CFA à libérer par versements mensuels de 4 500 F.CFA minimum au 05 de chaque mois.

7.2 - Sanctions
Le non-respect des échéances de paiement peut entraîner :
- Un rappel à l'ordre pour le premier retard
- Une pénalité de 500 F.CFA par mois de retard
- L'exclusion du groupement en cas de retard supérieur à trois (3) mois`
                    }
                ]
            },
            {
                titre: 'CHAPITRE IV - ACTIVITÉS ET PROJETS',
                articles: [
                    {
                        numero: 'Article 8 : Domaines d\'activité',
                        contenu: `Le groupement intervient dans les secteurs suivants :
- Commerce et distribution de produits agroalimentaires
- Exploitation des ressources du secteur primaire
- Transformation des ressources
- Multiservices
- Restauration et services traiteur
- Amélioration du cadre de vie`
                    },
                    {
                        numero: 'Article 9 : Standards FEVEO',
                        contenu: `Toutes les activités du groupement doivent respecter :
- Les normes de qualité FEVEO 2050
- Les pratiques de l'agriculture biologique
- Les principes du commerce équitable
- Les standards environnementaux`
                    }
                ]
            },
            {
                titre: 'CHAPITRE V - GESTION FINANCIÈRE',
                articles: [
                    {
                        numero: 'Article 10 : Comptabilité',
                        contenu: `10.1 - Tenue des comptes
Le groupement tient une comptabilité simplifiée conformément à la réglementation en vigueur.

10.2 - Exercice comptable
L'exercice comptable court du 1er janvier au 31 décembre de chaque année.

10.3 - Contrôle
Les comptes sont vérifiés trimestriellement par un membre désigné par l'assemblée générale.`
                    },
                    {
                        numero: 'Article 11 : Rapports financiers',
                        contenu: `Un rapport financier trimestriel est transmis à :
- Tous les membres du groupement
- La coordination FEVEO 2050
- Les autorités compétentes si requis`
                    }
                ]
            },
            {
                titre: 'CHAPITRE VI - PARTENARIAT FEVEO 2050',
                articles: [
                    {
                        numero: 'Article 12 : Engagements',
                        contenu: `Le groupement s'engage à :
- Respecter la charte FEVEO 2050
- Participer aux programmes de formation
- Utiliser les circuits de distribution FEVEO
- Promouvoir les valeurs de l'économie verte`
                    },
                    {
                        numero: 'Article 13 : Avantages',
                        contenu: `Le partenariat FEVEO 2050 donne accès à :
- Un réseau de distribution élargi
- Des formations techniques spécialisées
- Un accompagnement personnalisé
- Des facilités de financement`
                    }
                ]
            },
            {
                titre: 'CHAPITRE VII - DISCIPLINE ET SANCTIONS',
                articles: [
                    {
                        numero: 'Article 14 : Procédure disciplinaire',
                        contenu: `Tout manquement aux obligations peut faire l'objet d'une procédure disciplinaire incluant :
- Une convocation du membre concerné
- Son audition devant le bureau exécutif
- Une décision motivée
- Un délai de recours de quinze (15) jours`
                    },
                    {
                        numero: 'Article 15 : Sanctions',
                        contenu: `Les sanctions applicables sont :
- L'avertissement
- Le blâme
- La suspension temporaire
- L'exclusion définitive`
                    }
                ]
            },
            {
                titre: 'CHAPITRE VIII - DISPOSITIONS FINALES',
                articles: [
                    {
                        numero: 'Article 16 : Modification',
                        contenu: 'Le présent règlement peut être modifié par l\'assemblée générale à la majorité des deux tiers (2/3) des membres.'
                    },
                    {
                        numero: 'Article 17 : Entrée en vigueur',
                        contenu: 'Le présent règlement entre en vigueur à compter de son adoption par l\'assemblée générale constitutive.'
                    },
                    {
                        numero: 'Article 18 : Règlement des litiges',
                        contenu: 'Les litiges entre membres ou entre un membre et le groupement sont soumis en premier lieu à une procédure de conciliation interne. En cas d\'échec, ils relèvent des juridictions compétentes.'
                    }
                ]
            }
        ];
        // Générer le contenu du PDF
        chapitres.forEach((chapitre, chapIndex) => {
            // Vérifier si on a besoin d'une nouvelle page
            if (yPosition > pageHeight - 60) {
                pdf.addPage();
                yPosition = margin;
            }
            // Titre du chapitre
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(14);
            pdf.text(chapitre.titre, margin, yPosition);
            yPosition += 12;
            // Articles du chapitre
            chapitre.articles.forEach((article) => {
                // Vérifier si on a besoin d'une nouvelle page
                if (yPosition > pageHeight - 40) {
                    pdf.addPage();
                    yPosition = margin;
                }
                // Numéro de l'article
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(11);
                pdf.text(article.numero, margin, yPosition);
                yPosition += 8;
                // Contenu de l'article
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);
                const lines = pdf.splitTextToSize(article.contenu, contentWidth);
                pdf.text(lines, margin, yPosition);
                yPosition += lines.length * 5 + 8;
            });
            yPosition += 5; // Espace entre les chapitres
        });
        // Pied de page avec signatures
        if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = margin;
        }
        yPosition += 15;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.text(`Fait à ${gieData.commune}, le ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition);
        yPosition += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.text('La Présidente,', margin, yPosition);
        yPosition += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${gieData.presidentePrenom} ${gieData.presidenteNom}`, margin, yPosition);
        yPosition += 15;
        pdf.setFont('helvetica', 'italic');
        pdf.text('Approuvé par l\'Assemblée Générale Constitutive', margin, yPosition);
        // Télécharger le PDF
        const fileName = `Reglement_Interieur_${gieData.nomGIE || 'GIE_FEVEO'}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        // Notification de succès
        alert(`✅ Règlement Intérieur PDF généré avec succès !\n\n📁 Fichier : ${fileName}\n📋 8 chapitres complets\n📄 18 articles détaillés\n🏢 GIE : ${gieData.nomGIE}`);
    };
    const generateDemandeAdhesionPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        let yPosition = margin;
        // En-tête principal officiel FEVEO 2050
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const title1 = 'Demande d\'Adhésion et d\'Affiliation';
        const titleWidth1 = pdf.getTextWidth(title1);
        pdf.text(title1, (pageWidth - titleWidth1) / 2, yPosition);
        yPosition += 8;
        const title2 = 'à la Plateforme d’investissement économie organique « Femmes Vision économie organique 2050 » FEVEO 2050 SAS';
        const titleWidth2 = pdf.getTextWidth(title2);
        pdf.text(title2, (pageWidth - titleWidth2) / 2, yPosition);
        yPosition += 8;
        const title3 = '« Femmes Vision économie organique 2050 » FEVEO 2050 SAS';
        const titleWidth3 = pdf.getTextWidth(title3);
        pdf.text(title3, (pageWidth - titleWidth3) / 2, yPosition);
        yPosition += 15;
        // Numéro de protocole
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`N° ${gieData.numeroGIE || '________'}`, margin, yPosition);
        yPosition += 15;
        // Corps principal du document
        pdf.setFontSize(11);
        const corpsText1 = `Nous soussigné, GIE ${gieData.identifiantGIE || '______________'} non encore immatriculé au registre de commerce et du crédit immobilier ; représenté par sa Présidente ${gieData.presidenteCIN || '________________'}`;
        const corpsLines1 = pdf.splitTextToSize(corpsText1, contentWidth);
        pdf.text(corpsLines1, margin, yPosition);
        yPosition += corpsLines1.length * 6 + 5;
        // Activités en gras
        pdf.setFont('helvetica', 'bold');
        pdf.text('agriculture élevage transformation commerce et distribution', margin, yPosition);
        yPosition += 15;
        // Droits d'adhésion
        pdf.setFont('helvetica', 'normal');
        const droitsText = `Les droits d'adhésion du GIE sont fixés à une somme globale 20 000 F.CFA (représentant 500 f. par membre)`;
        const droitsLines = pdf.splitTextToSize(droitsText, contentWidth);
        pdf.text(droitsLines, margin, yPosition);
        yPosition += droitsLines.length * 6 + 10;
        // Section engagement
        const engagementText = `En cet effet, nous souscrivons aux apports de parts sociales d'investissement individuelles des membres du GIE dans le Fonds d'investissement international « FEVEO 2050 » par l'engagement sans équivoque de verser :`;
        const engagementLines = pdf.splitTextToSize(engagementText, contentWidth);
        pdf.text(engagementLines, margin, yPosition);
        yPosition += engagementLines.length * 6 + 8;
        // Points de versement avec puces
        const versementText = `➢ 262 parts nominales de 1 000 f + des frais de gestion pour la Plateforme s'élevant à 11 900 f.cfa couvrant une période de 5 ans (1 826 jours, partant du 1er avril 2025) à libérer comme suit :`;
        const versementLines = pdf.splitTextToSize(versementText, contentWidth);
        pdf.text(versementLines, margin, yPosition);
        yPosition += versementLines.length * 6 + 8;
        // Options de paiement
        const optionsPaiement = [
            `Mensuellement, en un montant de 180 000 f.cfa au 05 de chaque mois (représentant une somme de 4 500 f. par membre, à raison de 150 f par jour)`,
            `Par 15 jours en un montant de 90 000 f.cfa au 05 et au 20 de chaque mois (représentant une somme de 2 250 f. par membre, à raison de 150 f par jour)`,
            `Par 10 jours en un montant de 60 000 f.cfa au 05, au 15 et au 25 de chaque mois (représentant une somme de 1 500 f. par membre, à raison de 150 f par jour)`,
            `Par jour, en un montant de 6 000 f.cfa (représentant une somme de 150 f. par membre et par jour)`
        ];
        optionsPaiement.forEach(option => {
            if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = margin;
            }
            const optionLines = pdf.splitTextToSize(option, contentWidth - 10);
            pdf.text(optionLines, margin + 5, yPosition);
            yPosition += optionLines.length * 6 + 5;
        });
        yPosition += 5;
        // Engagement final du GIE
        const engagementFinalText = `Le GIE FEVEO ${gieData.identifiantGIE || '..............'} s'engage à verser les parts sociales d'investissement souscrites de tous les membres constituant du GIE associé et les frais de gestion dans la Plateforme d'Investissement Economique Organique « Femmes Vision 2050 », aux dates indiquées pour attester notre crédibilité dans le projet et pour servir et valoir ce que de droit.`;
        if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = margin;
        }
        const engagementFinalLines = pdf.splitTextToSize(engagementFinalText, contentWidth);
        pdf.text(engagementFinalLines, margin, yPosition);
        yPosition += engagementFinalLines.length * 6 + 20;
        // Accord-cadre
        if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Accord-cadre entre FEVEO – GIE FEVEO ${gieData.identifiantGIE || '...............'}`, margin, yPosition);
        yPosition += 15;
        // Article 1
        pdf.setFont('helvetica', 'bold');
        pdf.text('Article 1 : services à assurer par FEVEO 2050 SAS au GIE affilié', margin, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        pdf.text('La FEVEO 2050 SAS assure :', margin, yPosition);
        yPosition += 8;
        const servicesListe = [
            `➢ La viabilité des entreprises du GIE en le plaçant comme bras opérationnel dans les initiatives économiques territoriales à côtés des entreprises du partenaire Nexus group ;`,
            `➢ La comptabilité générale des activités du GIE et la détermination des charges fiscales à payer périodiquement ;`,
            `➢ Le renforcement de capacité organisationnelle, managériale et la mise à niveau du GIE dans le fonctionnement réglementaire`,
            `➢ Un accompagnement du GIE à disposer du foncier, en solitaire ou en copropriété avec les autres GIEs de sa commune, affiliés dans la plateforme.`
        ];
        servicesListe.forEach(service => {
            if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = margin;
            }
            const serviceLines = pdf.splitTextToSize(service, contentWidth - 5);
            pdf.text(serviceLines, margin, yPosition);
            yPosition += serviceLines.length * 6 + 5;
        });
        yPosition += 10;
        // Article 2
        if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Article 2 : rémunération du GIE FEVEO ${gieData.identifiantGIE || '..............'}`, margin, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Le GIE FEVEO ${gieData.identifiantGIE || '..............'} est rémunéré sur :`, margin, yPosition);
        yPosition += 8;
        const remunerationListe = [
            `▪ les activités agricoles et dans le secteur primaire en général (en fonction du nombre de personnel fourni) ;`,
            `▪ les activités industrielles artisanales et dans le secteur secondaire en général (en fonction du nombre de personnel fourni) ;`,
            `▪ les activités de commerce grande distribution et dans le secteur tertiaire en général (en fonction des marges accordées sur les différents produits à distribuer) ;`
        ];
        remunerationListe.forEach(remuneration => {
            if (yPosition > pageHeight - 25) {
                pdf.addPage();
                yPosition = margin;
            }
            const remunerationLines = pdf.splitTextToSize(remuneration, contentWidth - 5);
            pdf.text(remunerationLines, margin, yPosition);
            yPosition += remunerationLines.length * 6 + 5;
        });
        yPosition += 10;
        // Article 3
        if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = margin;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text('Article 3 : répartition de la rémunération de la force de travail des GIEs', margin, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        const repartitionText1 = `Les entreprises du groupe Nexus qui assurent la direction des différentes activités économiques, rémunèrent les travailleurs des différents GIEs impliqués.`;
        const repartitionLines1 = pdf.splitTextToSize(repartitionText1, contentWidth);
        pdf.text(repartitionLines1, margin, yPosition);
        yPosition += repartitionLines1.length * 6 + 8;
        const repartitionText2 = `Et à cet effet, la rémunération est partagée comme suit :`;
        pdf.text(repartitionText2, margin, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.text('- 3% à FEVEO 2050 SAS - 7% au GIE FEVEO - 90% au travailleur du GIE FEVEO', margin, yPosition);
        yPosition += 15;
        // Note importante
        pdf.setFont('helvetica', 'bold');
        pdf.text('NB:', margin, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        const noteText = `Le montant total initial, minimum, à verser par membre du GIE associé est de 2 000 f.cfa, représentant un apport initial des parts sociales d'investissement et des frais de gestion de 10 jours (1 500 f) et de (500 f) de droits d'adhésion.`;
        if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
        }
        const noteLines = pdf.splitTextToSize(noteText, contentWidth);
        pdf.text(noteLines, margin, yPosition);
        yPosition += noteLines.length * 6 + 8;
        const note2Text = `Toutefois, il est libre à tout membre du GIE associé qui le souhaite de verser un montant, supérieur, d'investissement selon sa convenance et ses possibilités (n'excédant pas le montant limite des 273 900).`;
        const note2Lines = pdf.splitTextToSize(note2Text, contentWidth);
        pdf.text(note2Lines, margin, yPosition);
        yPosition += note2Lines.length * 6 + 10;
        // Instructions de paiement
        if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = margin;
        }
        const paiementText = `Les versements de la valeur des actions nominales sont à effectuer par transferts numériques dans le compte finance numérique Wave de la FEVEO 2050 S.A.S, identifié sous le numéro 76 901 80 80, administré par la Trésorière Générale Haby DIENG. Ce numéro est connecté au compte bancaire de ladite société « Femmes Vision Economie Organique 2050 S.A.S» logé à la BANQUE ATLANTIQUE pour une traçabilité des opérations et de la documentation comptable.`;
        const paiementLines = pdf.splitTextToSize(paiementText, contentWidth);
        pdf.text(paiementLines, margin, yPosition);
        yPosition += paiementLines.length * 6 + 10;
        // Attestation des parts
        const attestationText = `Les titres d'attestation des parts d'investissement des GIEs membres de la Plateforme d'Investissement Economie Organique « PLATEFORME FEMME VISION ECONOMIE ORGANIQUE 2050 » sont établis, à chaque date périodique indiquée (en fin décembre de chaque année) par la notaire de la société.`;
        const attestationLines = pdf.splitTextToSize(attestationText, contentWidth);
        pdf.text(attestationLines, margin, yPosition);
        yPosition += attestationLines.length * 6 + 20;
        // Date et signatures
        if (yPosition > pageHeight - 80) {
            pdf.addPage();
            yPosition = margin;
        }
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Date : le ____ ____________ 2025`, margin, yPosition);
        yPosition += 20;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Signatures', margin, yPosition);
        yPosition += 15;
        // Trois colonnes de signatures
        pdf.setFont('helvetica', 'normal');
        pdf.text('Présidente', margin, yPosition);
        pdf.text('Secrétaire Générale', margin + 60, yPosition);
        pdf.text('Trésorière', margin + 120, yPosition);
        yPosition += 15;
        // Lignes de signature
        pdf.text('___________________ ____________', margin - 5, yPosition);
        pdf.text('___________________ ____________', margin + 55, yPosition);
        pdf.text('___________________ ____________', margin + 115, yPosition);
        // Télécharger le PDF
        const fileName = `Demande_Adhesion_Affiliation_FEVEO_${gieData.identifiantGIE}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        // Notification de succès
        alert(`✅ Demande d'Adhésion et d'Affiliation PDF générée avec succès !\n\n📁 Fichier : ${fileName}\n📋 Format officiel FEVEO 2050 SAS\n🏢 GIE : ${gieData.nomGIE}\n💰 Accord-cadre détaillé inclus\n📊 Parts sociales : 262 parts de 1 000 FCFA + 11 900 FCFA frais`);
    };
    const proceedToNextStep = () => {
        if (currentStep < 2) {
            setCurrentStep(prev => prev + 1);
            // Auto-génération des documents suivants
            if (currentStep === 1) {
                setGeneratedDocuments(prev => ({
                    ...prev,
                    reglementInterieur: true,
                    procesVerbal: true,
                    demandeAdhesion: true
                }));
            }
        }
    };
    const handleFinalSubmission = async () => {
        setIsSubmitting(true);
        console.log('🚀 Envoi des données pour l\'enregistrement du GIE:', gieData);
        try {
            // Validation finale avant soumission
            if (!gieData.nomGIE || !gieData.presidenteNom || !gieData.presidenteTelephone) {
                throw new Error('Informations manquantes pour l\'enregistrement du GIE');
            }
            if (gieData.membres.length + 3 < 3) {
                throw new Error('Le GIE doit avoir au minimum 3 membres (incluant la présidente, la secrétaire et la trésorière)');
            }
            // Préparer les données pour l'enregistrement avec tous les champs requis
            const enregistrementData = {
                nomGIE: gieData.nomGIE,
                identifiantGIE: gieData.identifiantGIE,
                numeroProtocole: gieData.numeroGIE,
                presidenteNom: gieData.presidenteNom,
                presidentePrenom: gieData.presidentePrenom,
                presidenteCIN: gieData.presidenteCIN,
                presidenteTelephone: gieData.presidenteTelephone,
                presidenteEmail: gieData.presidenteEmail || '',
                presidenteAdresse: gieData.presidenteAdresse,
                region: gieData.region,
                departement: gieData.departement,
                arrondissement: gieData.arrondissement,
                commune: gieData.commune,
                codeRegion: gieData.codeRegion,
                codeDepartement: gieData.codeDepartement,
                codeArrondissement: gieData.codeArrondissement,
                codeCommune: gieData.codeCommune,
                secteurPrincipal: gieData.secteurPrincipal,
                objectifs: gieData.objectifs || `GIE ${gieData.nomGIE} spécialisé dans ${gieData.secteurPrincipal}`,
                activites: gieData.activites.length > 0 ? gieData.activites : ['Production', 'Commerce', 'Formation'],
                dateConstitution: gieData.dateConstitution || new Date().toISOString().split('T')[0],
                nombreMembres: gieData.membres.length + 3, // +3 pour inclure la présidente, secrétaire et trésorière
                membres: [
                    { nom: gieData.secretaireNom, prenom: gieData.secretairePrenom, fonction: 'Secrétaire', cin: gieData.secretaireCIN, telephone: gieData.secretaireTelephone, genre: 'femme' },
                    { nom: gieData.tresoriereNom, prenom: gieData.tresorierePrenom, fonction: 'Trésorière', cin: gieData.tresoriereCIN, telephone: gieData.tresoriereTelephone, genre: 'femme' },
                    ...gieData.membres
                ],
                secteurActivite: gieData.secteurPrincipal || 'Agriculture',
                description: gieData.objectifs || `GIE ${gieData.nomGIE} spécialisé dans ${gieData.secteurPrincipal}`,
                besoinsFinancement: 20000, // Montant par défaut pour un GIE FEVEO 2050
                adresse: gieData.presidenteAdresse // Ajout de la propriété 'adresse'
            };
            console.log('🚀 Envoi des données d\'enregistrement:', enregistrementData);
            // Enregistrer le GIE via l'API
            const response = await gieService.enregistrerGIE(enregistrementData);
            console.log('✅ Réponse de l\'API d\'enregistrement GIE:', response);
            if (response.success) {
                const gieEnregistre = response.data;
                // Créer une transaction d'adhésion via l'API transactions
                try {
                    // Récupérer l'identifiant du GIE en fonction de la structure de la réponse
                    let gieId = enregistrementData.identifiantGIE;
                    // Vérifier la structure de la réponse et extraire l'ID du GIE
                    if (gieEnregistre && typeof gieEnregistre === 'object') {
                        if ('gie' in gieEnregistre && gieEnregistre.gie && typeof gieEnregistre.gie === 'object' && 'identifiantGIE' in gieEnregistre.gie) {
                            gieId = gieEnregistre.gie.identifiantGIE;
                        }
                        else if ('identifiantGIE' in gieEnregistre) {
                            gieId = gieEnregistre.identifiantGIE;
                        }
                    }
                    console.log('🔄 Création de la transaction d\'adhésion pour le GIE:', gieId);
                    console.log('🔄 Envoi de la requête de transaction d\'adhésion...');
                    console.log('🔄 Données de la transaction:', {
                        amount: 20200,
                        method: 'WAVE',
                        gieCode: gieId,
                        operationType: 'ADHESION'
                    });
                    const transactionResponse = await fetch(`${API_BASE_URL}/transactions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            amount: 20200, // Montant d'adhésion standard
                            method: 'WAVE', // Méthode de paiement par défaut
                            gieCode: gieId,
                            operationType: 'ADHESION' // Type spécifique pour les adhésions
                        }),
                    });
                    const transactionData = await transactionResponse.json();
                    console.log('✅ Réponse transaction créée:', transactionData);
                    const fallbackUrl = transactionData.data.urlWave;
                    window.open(fallbackUrl, '_blank');
                }
                catch (error) {
                    // console.error('❌ Erreur lors de la création de la transaction:', error);
                    // Fallback au lien statique en cas d'erreur
                    // const fallbackUrl = 'https://pay.wave.com/m/M_sn_t3V8_2xeRR6Z/c/sn/?amount=20000';
                    //  window.open(fallbackUrl, '_blank');
                    alert('Erreur de communication avec le serveur. Utilisation du lien de paiement de secours.');
                }
                // Mettre à jour les données avec les informations du serveur
                const updatedGieData = {
                    ...gieData,
                    statutEnregistrement: 'en_attente_paiement',
                    dateEnregistrement: new Date().toISOString()
                };
                // Callback de succès
                if (onComplete) {
                    onComplete(updatedGieData);
                }
            }
            else {
                throw new Error(response.message || 'Erreur lors de l\'enregistrement du GIE');
            }
        }
        catch (error) {
            console.error('❌ Erreur enregistrement GIE:', error);
            const errorMessage = error.message || 'Erreur inconnue lors de l\'enregistrement';
            alert(`❌ Erreur lors de l'enregistrement du GIE:\n\n${errorMessage}\n\nVeuillez vérifier vos informations et réessayer.`);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-neutral-900 mb-4", children: "Parcours d'Adh\u00E9sion GIE FEVEO 2050" }), _jsx("p", { className: "text-sm sm:text-base text-neutral-600", children: "Processus complet de constitution et d'adh\u00E9sion avec g\u00E9n\u00E9ration automatique des documents" })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-neutral-200 p-4 sm:p-6 lg:p-8", children: [currentStep === 1 && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx(FileText, { className: "w-16 h-16 text-accent-500 mx-auto mb-4" }), _jsx("h2", { className: "text-xl sm:text-2xl font-bold text-neutral-900 mb-2", children: "Statuts du GIE FEVEO" }), _jsx("p", { className: "text-sm sm:text-base text-neutral-600", children: "Renseignez les informations pour g\u00E9n\u00E9rer l'identifiant et les statuts" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom du GIE (g\u00E9n\u00E9r\u00E9 automatiquement)" }), _jsx("input", { type: "text", value: gieData.nomGIE || 'FEVEO-', disabled: true, className: "w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-500 font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Secteur principal *" }), _jsxs("select", { value: gieData.secteurPrincipal, onChange: (e) => updateGIEData('secteurPrincipal', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez le secteur" }), secteurs.map(secteur => (_jsx("option", { value: secteur, children: secteur }, secteur)))] })] }), _jsx("div", { className: "col-span-1 lg:col-span-2", children: _jsx("h3", { className: "text-lg font-semibold text-neutral-900 mb-4 mt-6 pb-2 border-b border-neutral-300", children: "Informations de la Pr\u00E9sidente" }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Pr\u00E9nom de la Pr\u00E9sidente *" }), _jsx("input", { type: "text", value: gieData.presidentePrenom, onChange: (e) => updateGIEData('presidentePrenom', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.presidentePrenom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.presidentePrenom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom de la Pr\u00E9sidente *" }), _jsx("input", { type: "text", value: gieData.presidenteNom, onChange: (e) => updateGIEData('presidenteNom', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.presidenteNom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.presidenteNom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "CIN de la Pr\u00E9sidente *" }), _jsx("input", { type: "text", value: gieData.presidenteCIN, onChange: (e) => updateGIEData('presidenteCIN', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.presidenteCIN && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.presidenteCIN })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "T\u00E9l\u00E9phone Pr\u00E9sidente (PayMaster) *" }), _jsx("input", { type: "tel", value: gieData.presidenteTelephone, onChange: (e) => updateGIEData('presidenteTelephone', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500", placeholder: "+221 XX XXX XX XX" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Email" }), _jsx("input", { type: "email", value: gieData.presidenteEmail, onChange: (e) => updateGIEData('presidenteEmail', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Adresse compl\u00E8te de la Pr\u00E9sidente" }), _jsx("input", { value: gieData.presidenteAdresse, onChange: (e) => updateGIEData('presidenteAdresse', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500", placeholder: "Adresse compl\u00E8te..." })] }), _jsx("div", { className: "col-span-1 lg:col-span-2", children: _jsx("h3", { className: "text-lg font-semibold text-neutral-900 mb-4 mt-6 pb-2 border-b border-neutral-300", children: "Informations de la Secr\u00E9taire" }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Pr\u00E9nom de la Secr\u00E9taire *" }), _jsx("input", { type: "text", value: gieData.secretairePrenom, onChange: (e) => updateGIEData('secretairePrenom', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.secretairePrenom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.secretairePrenom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom de la Secr\u00E9taire *" }), _jsx("input", { type: "text", value: gieData.secretaireNom, onChange: (e) => updateGIEData('secretaireNom', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.secretaireNom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.secretaireNom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "CIN de la Secr\u00E9taire *" }), _jsx("input", { type: "text", value: gieData.secretaireCIN, onChange: (e) => updateGIEData('secretaireCIN', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.secretaireCIN && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.secretaireCIN })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "T\u00E9l\u00E9phone de la Secr\u00E9taire *" }), _jsx("input", { type: "tel", value: gieData.secretaireTelephone, onChange: (e) => updateGIEData('secretaireTelephone', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500", placeholder: "+221 XX XXX XX XX" }), errors.secretaireTelephone && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.secretaireTelephone })] }), _jsx("div", { className: "col-span-1 lg:col-span-2", children: _jsx("h3", { className: "text-lg font-semibold text-neutral-900 mb-4 mt-6 pb-2 border-b border-neutral-300", children: "Informations de la Tr\u00E9sori\u00E8re" }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Pr\u00E9nom de la Tr\u00E9sori\u00E8re *" }), _jsx("input", { type: "text", value: gieData.tresorierePrenom, onChange: (e) => updateGIEData('tresorierePrenom', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.tresorierePrenom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.tresorierePrenom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom de la Tr\u00E9sori\u00E8re *" }), _jsx("input", { type: "text", value: gieData.tresoriereNom, onChange: (e) => updateGIEData('tresoriereNom', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.tresoriereNom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.tresoriereNom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "CIN de la Tr\u00E9sori\u00E8re *" }), _jsx("input", { type: "text", value: gieData.tresoriereCIN, onChange: (e) => updateGIEData('tresoriereCIN', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500" }), errors.tresoriereCIN && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.tresoriereCIN })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "T\u00E9l\u00E9phone de la Tr\u00E9sori\u00E8re *" }), _jsx("input", { type: "tel", value: gieData.tresoriereTelephone, onChange: (e) => updateGIEData('tresoriereTelephone', e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500", placeholder: "+221 XX XXX XX XX" }), errors.tresoriereTelephone && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.tresoriereTelephone })] }), _jsx("div", { className: "col-span-1 lg:col-span-2", children: _jsx("h3", { className: "text-lg font-semibold text-neutral-900 mb-4 mt-6 pb-2 border-b border-neutral-300", children: "Informations sur la Localisation du GIE" }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "R\u00E9gion *" }), _jsxs("select", { value: gieData.region, onChange: (e) => {
                                                    const selectedRegion = e.target.value;
                                                    console.log('🌍 Région sélectionnée:', selectedRegion);
                                                    if (selectedRegion) {
                                                        const regionData = SENEGAL_GEOGRAPHIC_DATA[selectedRegion];
                                                        const regionCode = regionData?.code || '';
                                                        console.log('🔑 Code région:', regionCode);
                                                        // Mettre à jour tous les champs géographiques en une seule fois
                                                        const updatedData = {
                                                            ...gieData,
                                                            region: selectedRegion,
                                                            codeRegion: regionCode,
                                                            // Reset des niveaux inférieurs
                                                            departement: '',
                                                            codeDepartement: '',
                                                            arrondissement: '',
                                                            codeArrondissement: '',
                                                            commune: '',
                                                            codeCommune: ''
                                                        };
                                                        setGieData(updatedData);
                                                        console.log('📊 Données mises à jour:', updatedData);
                                                    }
                                                    else {
                                                        updateGIEData('region', '');
                                                    }
                                                }, className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez la r\u00E9gion" }), regions.map(region => (_jsx("option", { value: region.code, children: region.nom }, region.code)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "D\u00E9partement *" }), _jsxs("select", { value: gieData.departement, disabled: !gieData.region, onChange: (e) => {
                                                    const selectedDepartementCode = e.target.value;
                                                    console.log('🏢 Code département sélectionné:', selectedDepartementCode);
                                                    if (selectedDepartementCode) {
                                                        // Trouver les données du département par son code
                                                        const departements = getDepartements(gieData.region);
                                                        const deptData = departements.find(dept => dept.code === selectedDepartementCode);
                                                        console.log('🔑 Département trouvé:', deptData);
                                                        console.log('🔑 Code département:', selectedDepartementCode);
                                                        // Mettre à jour le département et reset les niveaux inférieurs
                                                        const updatedData = {
                                                            ...gieData,
                                                            departement: selectedDepartementCode,
                                                            codeDepartement: selectedDepartementCode,
                                                            // Reset des niveaux inférieurs
                                                            arrondissement: '',
                                                            codeArrondissement: '',
                                                            commune: '',
                                                            codeCommune: ''
                                                        };
                                                        setGieData(updatedData);
                                                        console.log('📊 Données département mises à jour:', updatedData);
                                                    }
                                                    else {
                                                        updateGIEData('departement', '');
                                                    }
                                                }, className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 disabled:bg-neutral-100", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez le d\u00E9partement" }), gieData.region && getDepartements(gieData.region).map(dept => (_jsx("option", { value: dept.code, children: dept.nom }, dept.code)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Arrondissement *" }), _jsxs("select", { value: gieData.arrondissement, disabled: !gieData.departement, onChange: (e) => {
                                                    const selectedArrondissement = e.target.value;
                                                    console.log('🏘️ Arrondissement sélectionné:', selectedArrondissement);
                                                    if (selectedArrondissement) {
                                                        // Utiliser directement le code de l'arrondissement sélectionné
                                                        console.log('🔑 Code arrondissement:', selectedArrondissement);
                                                        // Mettre à jour l'arrondissement et reset les niveaux inférieurs
                                                        const updatedData = {
                                                            ...gieData,
                                                            arrondissement: selectedArrondissement,
                                                            codeArrondissement: selectedArrondissement,
                                                            // Reset des niveaux inférieurs
                                                            commune: '',
                                                            codeCommune: ''
                                                        };
                                                        setGieData(updatedData);
                                                        console.log('📊 Données arrondissement mises à jour:', updatedData);
                                                    }
                                                    else {
                                                        updateGIEData('arrondissement', '');
                                                    }
                                                }, className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 disabled:bg-neutral-100", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez l'arrondissement" }), gieData.departement && getArrondissements(gieData.region, gieData.codeDepartement).map(arr => (_jsx("option", { value: arr.code, children: arr.nom }, arr.code)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Commune *" }), _jsxs("select", { value: gieData.commune, disabled: !gieData.arrondissement, onChange: async (e) => {
                                                    const selectedCommune = e.target.value;
                                                    console.log('🏘️ Commune sélectionnée:', selectedCommune);
                                                    if (selectedCommune) {
                                                        // Utiliser directement le code de la commune sélectionnée
                                                        console.log('🔑 Code commune:', selectedCommune);
                                                        // Mettre à jour la commune et son code (stocker le code dans commune pour la sélection)
                                                        const updatedData = {
                                                            ...gieData,
                                                            commune: selectedCommune,
                                                            codeCommune: selectedCommune
                                                        };
                                                        // Appeler l'API pour obtenir le prochain numéro de protocole
                                                        if (updatedData.codeRegion && updatedData.codeDepartement && updatedData.codeArrondissement && updatedData.codeCommune) {
                                                            const nextNumero = await fetchNextNumeroProtocole(updatedData.codeCommune, updatedData.codeRegion, updatedData.codeDepartement, updatedData.codeArrondissement);
                                                            console.log('🔢 Prochain numéro de protocole:', nextNumero);
                                                            const newName = generateGIEName(updatedData.codeRegion, updatedData.codeDepartement, updatedData.codeArrondissement, updatedData.codeCommune, nextNumero);
                                                            updatedData.nomGIE = newName;
                                                            updatedData.numeroGIE = nextNumero;
                                                            updatedData.identifiantGIE = newName;
                                                            console.log(`✅ Nom GIE complet généré: ${newName}`);
                                                        }
                                                        setGieData(updatedData);
                                                        console.log('📊 Données commune mises à jour:', updatedData);
                                                    }
                                                    else {
                                                        updateGIEData('commune', '');
                                                    }
                                                }, className: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 disabled:bg-neutral-100", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez la commune" }), gieData.arrondissement && getCommunes(gieData.region, gieData.departement, gieData.arrondissement).map(commune => (_jsx("option", { value: commune.code, children: commune.nom }, commune.code)))] }), errors.commune && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.commune })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "bg-gradient-to-r from-accent-50 to-primary-50 p-6 rounded-lg mb-6 border border-accent-200", children: [_jsxs("h4", { className: "font-bold text-neutral-900 mb-4 flex items-center gap-2", children: [_jsx(Shield, { className: "w-5 h-5 text-accent-500" }), "R\u00E8gles de composition FEVEO 2050"] }), _jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("p", { className: "text-sm font-semibold text-neutral-700 mb-3", children: "Structure minimale requise pour l'enregistrement du GIE :" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-purple-500 rounded" }), _jsx("span", { className: "text-sm", children: "1 Pr\u00E9sidente (automatique)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-blue-500 rounded" }), _jsx("span", { className: "text-sm", children: "1 Secr\u00E9taire (obligatoire)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-green-500 rounded" }), _jsx("span", { className: "text-sm", children: "1 Tr\u00E9sori\u00E8re (obligatoire)" })] })] }), _jsx("p", { className: "text-xs text-red-600 mt-3", children: " NB : Les autres membres non encore enregistr\u00E9s doivent etre compl\u00E9t\u00E9s dans une seconde phase, pour conformit\u00E9." })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("p", { className: "text-sm font-semibold text-neutral-700 mb-3", children: "R\u00E8gles Compositions FEVEO :" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-neutral-800 mb-3", children: "Option 1 : 100% Femmes" }), _jsx("div", { className: "space-y-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-pink-500 rounded" }), _jsx("span", { className: "text-sm", children: "40 femmes (incluant pr\u00E9sidente)" })] }) })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-neutral-800 mb-3", children: "Option 2 : Composition mixte " }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: "text-sm", children: "( bureau exclusivement femmes )" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-pink-500 rounded" }), _jsx("span", { className: "text-sm", children: "25 femmes minimum (incluant pr\u00E9sidente)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-blue-500 rounded" }), _jsx("span", { className: "text-sm", children: "12 jeunes (18-35 ans)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-green-500 rounded" }), _jsx("span", { className: "text-sm", children: "3 adultes hommes (maximum) " })] })] })] })] })] })] }), _jsxs("div", { className: "mt-4 p-4 bg-white rounded-lg border", children: [_jsx("p", { className: "text-sm font-medium text-neutral-700 mb-3", children: "Composition actuelle :" }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [_jsxs("span", { className: "text-pink-600 font-medium", children: ["\uD83D\uDC69 Femmes : ", gieData.membres.filter(m => m.genre === 'femme').length + 3, "(incluant pr\u00E9sidente, secr\u00E9taire et tr\u00E9sori\u00E8re)"] }), _jsxs("span", { className: "text-blue-600 font-medium", children: ["\uD83D\uDC68\u200D\uD83D\uDCBC Jeunes : ", gieData.membres.filter(m => m.genre === 'jeune').length] }), _jsxs("span", { className: "text-green-600 font-medium", children: ["\uD83D\uDC68 Hommes adultes : ", gieData.membres.filter(m => m.genre === 'homme').length] }), _jsxs("span", { className: "text-neutral-600 font-bold", children: ["Total : ", gieData.membres.length + 3, " membres"] })] }), gieData.membres.length + 3 >= 3 &&
                                                        gieData.secretaireNom && gieData.tresoriereNom && (_jsxs("div", { className: "mt-2 p-2 bg-success-50 text-success-700 rounded text-sm flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Structure minimale compl\u00E8te ! Le GIE peut \u00EAtre constitu\u00E9."] }))] }), _jsxs("div", { className: "mt-4 p-4 bg-accent-50 rounded-lg border border-accent-200", children: [_jsxs("h5", { className: "font-semibold text-accent-800 mb-2 flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4" }), "Cycle d'investissement FEVEO 2050"] }), _jsxs("div", { className: "text-sm text-accent-700 space-y-1", children: [_jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Dur\u00E9e :" }), " 1 826 jours d'investissement"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "D\u00E9but :" }), " 1er avril 2025"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Montant journalier :" }), " 6 000 FCFA par jour"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Suivi :" }), " Tableau de bord avec jours investis (vert) et restants (rouge)"] })] })] })] }), gieData.membres.map((member, index) => (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 p-4 border rounded-lg mb-4", children: [_jsx("input", { type: "text", placeholder: "Pr\u00E9nom", value: member.prenom, onChange: (e) => updateMember(index, 'prenom', e.target.value), className: "px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500" }), _jsx("input", { type: "text", placeholder: "Nom", value: member.nom, onChange: (e) => updateMember(index, 'nom', e.target.value), className: "px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500" }), _jsxs("select", { value: member.fonction, onChange: (e) => {
                                                    const newFonction = e.target.value;
                                                    updateMember(index, 'fonction', newFonction);
                                                    // Si Secrétaire ou Trésorière, forcer le genre à "femme"
                                                    if (newFonction === 'Secrétaire' || newFonction === 'Trésorière') {
                                                        updateMember(index, 'genre', 'femme');
                                                    }
                                                }, className: "px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500", children: [_jsx("option", { value: "Membre", children: "Membre" }), _jsx("option", { value: "Secr\u00E9taire", children: "Secr\u00E9taire" }), _jsx("option", { value: "Tr\u00E9sori\u00E8re", children: "Tr\u00E9sori\u00E8re" })] }), _jsxs("select", { value: member.genre, onChange: (e) => updateMember(index, 'genre', e.target.value), disabled: member.fonction === 'Secrétaire' || member.fonction === 'Trésorière', className: `px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500 ${member.fonction === 'Secrétaire' || member.fonction === 'Trésorière'
                                                    ? 'bg-pink-50 border-pink-300 cursor-not-allowed'
                                                    : ''}`, title: member.fonction === 'Secrétaire' || member.fonction === 'Trésorière'
                                                    ? 'Les fonctions Secrétaire et Trésorière sont réservées aux femmes'
                                                    : '', children: [_jsx("option", { value: "femme", children: "\uD83D\uDC69 Femme" }), _jsx("option", { value: "jeune", children: "\uD83D\uDC68\u200D\uD83D\uDCBC Jeune (18-35)" }), _jsx("option", { value: "homme", children: "\uD83D\uDC68 Homme adulte" })] }), member.genre === 'jeune' && (_jsx("input", { type: "number", placeholder: "\u00C2ge", min: "18", max: "35", value: member.age || '', onChange: (e) => updateMember(index, 'age', parseInt(e.target.value) || undefined), className: "px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500" })), _jsx("input", { type: "text", placeholder: "CIN", value: member.cin, onChange: (e) => updateMember(index, 'cin', e.target.value), className: "px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "tel", placeholder: "T\u00E9l\u00E9phone", value: member.telephone, onChange: (e) => updateMember(index, 'telephone', e.target.value), className: "flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500" }), _jsx("button", { onClick: () => removeMember(index), className: "text-red-500 hover:text-red-700 p-1", children: "\u2715" })] })] }, index))), errors.membres && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.membres })] }), gieData.region && gieData.departement && gieData.arrondissement && gieData.commune && (_jsxs("div", { className: "bg-accent-50 p-6 rounded-lg border border-accent-200", children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 mb-4", children: "G\u00E9n\u00E9ration de l'identifiant GIE" }), _jsxs("div", { className: "mb-4 p-3 bg-white rounded border", children: [_jsx("p", { className: "text-sm text-neutral-600 mb-2", children: "Localisation administrative :" }), _jsxs("p", { className: "font-medium text-neutral-900", children: [gieData.commune, " \u2192 ", gieData.arrondissement, " \u2192 ", gieData.departement, " \u2192 ", gieData.region] }), _jsxs("p", { className: "text-sm text-neutral-500 mt-1", children: ["Codes : ", gieData.codeRegion, "-", gieData.codeDepartement, "-", gieData.codeArrondissement, "-", gieData.codeCommune] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-neutral-600 mb-2", children: "Identifiant g\u00E9n\u00E9r\u00E9 :" }), _jsx("p", { className: "font-mono text-lg font-bold text-accent-600 mb-4 p-2 bg-white rounded border", children: gieData.identifiantGIE }), _jsxs("div", { className: "mb-6 p-4 bg-white rounded-lg border border-neutral-200", children: [_jsxs("h4", { className: "font-semibold text-neutral-900 mb-3 flex items-center gap-2", children: [_jsx(FileText, { className: "w-5 h-5 text-accent-500" }), "Aper\u00E7u du document PDF"] }), _jsxs("div", { className: "bg-neutral-50 p-4 rounded border text-sm font-mono max-h-40 overflow-y-auto", children: [_jsx("div", { className: "text-center font-bold text-lg mb-2", children: "STATUTS DU GIE FEVEO" }), _jsx("div", { className: "border-b border-neutral-300 mb-3" }), _jsxs("div", { className: "mb-2", children: ["Aujourd'hui, ", new Date().toLocaleDateString('fr-FR')] }), _jsxs("div", { className: "mb-2", children: ["Dans la r\u00E9gion de : ", regions.find(r => r.code === gieData.region)?.nom || gieData.region] }), _jsxs("div", { className: "mb-2", children: ["d\u00E9partement de : ", getDepartements(gieData.region).find(d => d.code === gieData.departement)?.nom || gieData.departement] }), _jsxs("div", { className: "mb-3", children: ["commune de : ", getCommunes(gieData.region, gieData.departement, gieData.arrondissement).find(c => c.code === gieData.commune)?.nom || gieData.commune] }), _jsx("div", { className: "font-bold mb-2", children: "Les soussign\u00E9s," }), _jsxs("div", { className: "text-xs", children: [_jsxs("div", { className: "grid grid-cols-6 gap-1 mb-1 font-bold", children: [_jsx("span", { children: "N\u00B0" }), _jsx("span", { children: "Pr\u00E9nom" }), _jsx("span", { children: "Nom" }), _jsx("span", { children: "Fonction" }), _jsx("span", { children: "Genre" }), _jsx("span", { children: "CIN" })] }), _jsxs("div", { className: "grid grid-cols-6 gap-1 mb-1", children: [_jsx("span", { children: "01" }), _jsx("span", { children: gieData.presidentePrenom }), _jsx("span", { children: gieData.presidenteNom }), _jsx("span", { children: "Pr\u00E9sidente" }), _jsx("span", { children: "Femme" }), _jsx("span", { children: gieData.presidenteCIN })] }), _jsxs("div", { className: "grid grid-cols-6 gap-1 mb-1", children: [_jsx("span", { children: "02" }), _jsx("span", { children: gieData.secretairePrenom }), _jsx("span", { children: gieData.secretaireNom }), _jsx("span", { children: "Secr\u00E9taire" }), _jsx("span", { children: "Femme" }), _jsx("span", { children: gieData.secretaireCIN })] }), _jsxs("div", { className: "grid grid-cols-6 gap-1 mb-1", children: [_jsx("span", { children: "03" }), _jsx("span", { children: gieData.tresorierePrenom }), _jsx("span", { children: gieData.tresoriereNom }), _jsx("span", { children: "Tr\u00E9sori\u00E8re" }), _jsx("span", { children: "Femme" }), _jsx("span", { children: gieData.tresoriereCIN })] }), gieData.membres.slice(0, 2).map((membre, index) => (_jsxs("div", { className: "grid grid-cols-6 gap-1 mb-1", children: [_jsx("span", { children: (index + 4).toString().padStart(2, '0') }), _jsx("span", { children: membre.prenom }), _jsx("span", { children: membre.nom }), _jsx("span", { children: membre.fonction }), _jsx("span", { children: membre.genre === 'femme' ? 'Femme' : membre.genre === 'jeune' ? 'Jeune' : 'Homme' }), _jsx("span", { children: membre.cin })] }, index))), gieData.membres.length > 2 && (_jsxs("div", { className: "text-neutral-500", children: ["... et ", gieData.membres.length - 2, " autres membres"] }))] }), _jsx("div", { className: "mt-3 text-xs text-neutral-600", children: "\uD83D\uDCC4 Le PDF complet contient tous les 12 articles des statuts OHADA" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center", children: [_jsxs("button", { onClick: () => downloadDocument('statuts', `Statuts_${gieData.nomGIE.replace(/\s+/g, '_')}.pdf`), className: "btn-primary flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg w-full sm:w-auto", children: [_jsx(Download, { className: "w-5 h-5" }), "\uD83D\uDCC4 Statuts PDF"] }), generatedDocuments.statuts && (_jsx(CheckCircle, { className: "w-6 h-6 text-success-500" })), _jsxs("button", { onClick: () => downloadDocument('reglement', `Reglement_Interieur_${gieData.nomGIE.replace(/\s+/g, '_')}.pdf`), className: "btn-primary flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg w-full sm:w-auto", children: [_jsx(Download, { className: "w-5 h-5" }), "\uD83D\uDCCB R\u00E8glement Int\u00E9rieur PDF"] }), generatedDocuments.reglement && (_jsx(CheckCircle, { className: "w-6 h-6 text-success-500" })), _jsxs("button", { onClick: () => downloadDocument('pv', `PV_Assemblee_Generale_${gieData.nomGIE.replace(/\s+/g, '_')}.pdf`), className: "btn-primary flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg w-full sm:w-auto", children: [_jsx(Download, { className: "w-5 h-5" }), "\uD83D\uDCDD  Proc\u00E8s-Verbal PDF"] }), generatedDocuments.pv && (_jsx(CheckCircle, { className: "w-6 h-6 text-success-500" }))] })] })] })), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-4 pt-6", children: [onCancel && (_jsx("button", { onClick: onCancel, className: "btn-secondary w-full sm:w-auto", children: "Annuler" })), _jsxs("button", { onClick: () => {
                                            if (validateStep1() && gieData.identifiantGIE) {
                                                proceedToNextStep();
                                            }
                                        }, disabled: !gieData.identifiantGIE, className: `btn-accent flex items-center justify-center gap-2 w-full sm:w-auto ${!gieData.identifiantGIE ? 'opacity-50 cursor-not-allowed' : ''}`, children: ["Continuer", _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] })), currentStep === 2 && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx(CreditCard, { className: "w-16 h-16 text-accent-500 mx-auto mb-4" }), _jsx("h2", { className: "text-xl sm:text-2xl font-bold text-neutral-900 mb-2", children: "Demande d'Adh\u00E9sion FEVEO 2050" }), _jsx("p", { className: "text-neutral-600", children: "Finalisation et soumission \u00E0 la validation" })] }), _jsxs("div", { className: "bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200", children: [_jsx("h3", { className: "text-lg font-bold text-neutral-900 mb-6", children: "Dossier complet" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0", children: [_jsx("span", { className: "text-neutral-600", children: "GIE :" }), _jsx("span", { className: "font-medium", children: gieData.nomGIE })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0", children: [_jsx("span", { className: "text-neutral-600", children: "Identifiant :" }), _jsx("span", { className: "font-mono font-bold", children: gieData.identifiantGIE })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0", children: [_jsx("span", { className: "text-neutral-600", children: "Protocole :" }), _jsx("span", { className: "font-mono font-bold", children: gieData.numeroGIE })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0", children: [_jsx("span", { className: "text-neutral-600", children: "Pr\u00E9sidente :" }), _jsxs("span", { className: "font-medium", children: [gieData.presidentePrenom, " ", gieData.presidenteNom] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0", children: [_jsx("span", { className: "text-neutral-600", children: "Secteur :" }), _jsx("span", { className: "font-medium", children: gieData.secteurPrincipal })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0", children: [_jsx("span", { className: "text-neutral-600", children: "Localisation :" }), _jsxs("span", { className: "font-medium", children: [gieData.commune, ", ", gieData.region] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0", children: [_jsx("span", { className: "text-neutral-600", children: "Membres :" }), _jsx("span", { className: "font-medium", children: gieData.membres.length + 3 })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0", children: [_jsx("span", { className: "text-neutral-600", children: "Activit\u00E9s :" }), _jsx("span", { className: "font-medium", children: gieData.activites.length })] })] })] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-accent-200", children: [_jsx("h4", { className: "text-lg font-semibold text-neutral-900 mb-4", children: "R\u00E9capitulatif des membres du bureau" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "p-3 bg-accent-100 rounded-lg", children: [_jsxs("div", { className: "font-semibold text-accent-800", children: ["Pr\u00E9sidente : ", gieData.presidentePrenom, " ", gieData.presidenteNom] }), _jsxs("div", { className: "text-sm text-accent-600", children: ["CIN : ", gieData.presidenteCIN, " \u2022 T\u00E9l : ", gieData.presidenteTelephone] })] }), _jsxs("div", { className: "p-3 bg-blue-50 rounded-lg", children: [_jsxs("div", { className: "font-semibold text-blue-800", children: ["Secr\u00E9taire : ", gieData.secretairePrenom, " ", gieData.secretaireNom] }), _jsxs("div", { className: "text-sm text-blue-600", children: ["CIN : ", gieData.secretaireCIN, " \u2022 T\u00E9l : ", gieData.secretaireTelephone] })] }), _jsxs("div", { className: "p-3 bg-green-50 rounded-lg", children: [_jsxs("div", { className: "font-semibold text-green-800", children: ["Tr\u00E9sori\u00E8re : ", gieData.tresorierePrenom, " ", gieData.tresoriereNom] }), _jsxs("div", { className: "text-sm text-green-600", children: ["CIN : ", gieData.tresoriereCIN, " \u2022 T\u00E9l : ", gieData.tresoriereTelephone] })] }), gieData.membres.length > 0 && (_jsxs("div", { className: "p-3 bg-neutral-50 rounded-lg", children: [_jsxs("div", { className: "font-medium text-neutral-800", children: ["Autres membres : ", gieData.membres.length, " personne", gieData.membres.length > 1 ? 's' : ''] }), _jsxs("div", { className: "text-sm text-neutral-600 mt-1", children: ["Total du GIE : ", gieData.membres.length + 3, " membres"] })] }))] })] })] }), _jsxs("div", { className: "bg-success-50 p-6 rounded-lg border border-success-200", children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 mb-4", children: "Documents g\u00E9n\u00E9r\u00E9s" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-success-500" }), _jsx("span", { className: "text-success-700", children: "Statuts du GIE" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-success-500" }), _jsx("span", { className: "text-success-700", children: "R\u00E8glement Int\u00E9rieur" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-success-500" }), _jsx("span", { className: "text-success-700", children: "Proc\u00E8s-Verbal" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Clock, { className: "w-5 h-5 text-accent-500" }), _jsx("span", { className: "text-accent-700", children: "Demande d'Adh\u00E9sion" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 mb-4", children: "Droits d'adh\u00E9sion" }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: _jsxs("div", { className: "border-2 border-accent-200 rounded-lg p-6 hover:border-accent-500 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h4", { className: "text-xl font-bold", children: "Abilitation du GIE" }), _jsx("div", { className: "text-2xl font-bold text-accent-600", children: "20 000 FCFA" })] }), _jsxs("ul", { className: "space-y-2 text-sm text-neutral-600", children: [_jsx("li", { children: "\u2022 Bras op\u00E9rationnel de l'initiative au niveau territorial" }), _jsx("li", { children: "\u2022 Acc\u00E8s aux formations certifiantes pour les productions" }), _jsx("li", { children: "\u2022 Supports techniques du Groupe Nexus avec FEVEO " }), _jsx("li", { children: "\u2022 Gestion administrative et fiscale du GIE au niveau de FEVEO 2050 SAS" }), _jsx("li", { children: "\u2022 Acc\u00E8s s\u00E9curis\u00E9 et libre du GIE dans son \"Wallet GIE\" pour une administration de ses diff\u00E9rentes activit\u00E9s" })] })] }) })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200", children: [_jsxs("h3", { className: "text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2", children: [_jsx(CreditCard, { className: "w-5 h-5 text-green-600" }), "Wallet GIE - Suivis activit\u00E9s economiques et financi\u00E8res du GIE"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-neutral-800", children: "Cycle d'investissement" }), _jsx("p", { className: "text-sm text-neutral-600", children: "1 826 jours \u00E0 partir du 1er avril 2025" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-neutral-800", children: "Montant quotidien" }), _jsx("p", { className: "text-sm text-neutral-600", children: "6 000 FCFA par jour d'investissement" })] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-neutral-800", children: "Suivi visuel" }), _jsx("p", { className: "text-sm text-neutral-600", children: "Jours investis en vert, restants en rouge" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-neutral-800", children: "Tableau de bord" }), _jsx("p", { className: "text-sm text-neutral-600", children: "Acc\u00E8s wallet apr\u00E8s validation adh\u00E9sion" })] })] })] })] }), _jsx("div", { className: "mt-4 p-3 bg-white rounded border border-green-200", children: _jsxs("p", { className: "text-sm text-green-700", children: [_jsx("strong", { children: "Total investissement :" }), " 6 000 \u00D7 1 826 = 10 956 000 FCFA sur la dur\u00E9e compl\u00E8te du cycle"] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("button", { onClick: () => downloadDocument('demande', `Demande_Adhesion_${gieData.nomGIE.replace(/\s+/g, '_')}.pdf`), className: "w-full btn-secondary flex items-center justify-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "T\u00E9l\u00E9charger la Demande d'Adh\u00E9sion PDF"] }), _jsx("div", { className: "bg-accent-50 p-4 rounded-lg border border-accent-200", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "text-sm text-accent-700", children: [_jsx("p", { className: "font-medium mb-1", children: "Prochaines \u00E9tapes :" }), _jsx("p", { children: "1. T\u00E9l\u00E9chargez tous les documents g\u00E9n\u00E9r\u00E9s" }), _jsx("p", { children: "2. Proc\u00E9dez au paiement de l'adh\u00E9sion via Wave" }), _jsx("p", { children: "3. Votre dossier sera soumis \u00E0 validation FEVEO" }), _jsx("p", { children: "4. Vous recevrez votre confirmation par WhatsApp sur le num\u00E9ro de t\u00E9l\u00E9phone Paymaster" })] })] }) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-4 pt-6", children: [_jsxs("button", { onClick: () => setCurrentStep(1), className: "btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-1", disabled: isSubmitting, children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Retour"] }), _jsx("button", { onClick: handleFinalSubmission, disabled: isSubmitting, className: `btn-success text-base sm:text-lg px-6 sm:px-8 py-3 flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }), _jsx("span", { className: "hidden sm:inline", children: "Enregistrement en cours..." }), _jsx("span", { className: "sm:hidden", children: "Enregistrement..." })] })) : (_jsxs(_Fragment, { children: [_jsx(CreditCard, { className: "w-5 h-5" }), _jsx("span", { className: "hidden sm:inline", children: "Finaliser et Payer (20 000 FCFA)" }), _jsx("span", { className: "sm:hidden", children: "Payer 20 000 FCFA" })] })) })] })] }))] })] }));
};
export default GIEDocumentWorkflow;
//# sourceMappingURL=GIEDocumentWorkflow.js.map