// Contenu du site : cours en français (programme officiel tunisien)
// + une explication simplifiée ("bodySimple") pour chaque section, activable par bouton.
// Source : Programme officiel Sciences physiques — Ministère de l'Éducation, edunet.tn (2010)

export const SUBJECTS_DATA = {
  physique: {
    id: "physique",
    labelFr: "Physique",
    accent: "#22D3EE",
    accentDim: "#0E7490",
    chapters: [
      {
        id: "circuits",
        titleFr: "Circuits électriques",
        hours: "22 h",
        iconKey: "CircuitBoard",
        sections: [
          {
            h: "Puissance et énergie électrique",
            body: "La puissance électrique P mesure la rapidité de transfert d'énergie dans un dipôle : P = U×I, où U est la tension en volts et I l'intensité en ampères, l'unité étant le watt (W). L'énergie électrique consommée pendant une durée Δt se calcule par W = P×Δt, exprimée en joules (J) ou en kilowattheures (kWh) sur les factures de la STEG. L'effet Joule est l'échauffement produit par le passage du courant dans un conducteur : il présente des intérêts (chauffage, repassage) et des inconvénients (pertes d'énergie, risque d'incendie).",
            bodySimple: "En gros : plus un appareil consomme de watts, plus vite il utilise de l'énergie. Retiens juste deux formules : P = U × I (la puissance), et W = P × Δt (l'énergie totale utilisée). L'effet Joule, c'est simplement la chaleur dégagée par un fil parcouru par un courant — utile dans un radiateur, dangereux si le fil chauffe trop."
          },
          {
            h: "Conductibilité et résistance électrique",
            body: "La résistance électrique R caractérise un conducteur ohmique et se mesure en ohms (Ω), à l'aide d'un ohmmètre ou en lisant le code des couleurs sur le résistor. La conductibilité varie selon la nature du matériau : le cuivre est un très bon conducteur (d'où son usage dans les fils de connexion), alors que certains matériaux sont semi-conducteurs. La température influence la résistance : plus elle augmente, plus la résistance d'un conducteur ohmique varie.",
            bodySimple: "La résistance (en ohms Ω), c'est ce qui freine le courant dans un fil. Un bon conducteur (comme le cuivre) a une petite résistance ; un mauvais conducteur en a une grande. Elle se mesure directement avec un ohmmètre."
          },
          {
            h: "Caractéristiques des dipôles (I = f(U))",
            body: "Chaque dipôle (résistor, diode, lampe) possède une courbe caractéristique reliant la tension à l'intensité. Le conducteur ohmique donne une droite passant par l'origine, de pente égale à R (loi d'Ohm : U = R×I). La lampe et la diode donnent des courbes non linéaires. Le générateur suit sa propre loi d'Ohm : U = E − r×I, où E est la force électromotrice et r la résistance interne. La loi de Pouillet permet de calculer l'intensité dans un circuit série comportant générateur et récepteurs.",
            bodySimple: "Retiens trois formules clés : pour un résistor, U = R × I (loi d'Ohm). Pour un générateur, U = E − r × I. Pour calculer le courant dans tout le circuit, on utilise la loi de Pouillet qui combine tout ça. Le reste (courbes de diode, lampe) sert juste à voir que tous les composants ne se comportent pas pareil."
          },
          {
            h: "Courant alternatif",
            body: "La tension alternative est une tension variable dont le signe s'inverse régulièrement au cours du temps, caractérisée par une période T et une fréquence f = 1/T. La tension alternative sinusoïdale a une valeur maximale Um et une valeur efficace U liées par Um = U√2. Le secteur tunisien délivre 220 V efficaces à 50 Hz. Le transformateur sert à modifier la valeur d'une tension (élévateur ou abaisseur), et le redressement (par une diode ou un pont de 4 diodes) transforme le courant alternatif en courant continu.",
            bodySimple: "Le courant qui arrive chez toi (220 V, 50 Hz) change de sens 50 fois par seconde — c'est le courant alternatif. Le transformateur change juste sa tension (monte ou descend). Le redressement (avec des diodes) le transforme en courant continu, comme celui d'une pile."
          }
        ]
      },
      {
        id: "mecanique",
        titleFr: "Forces, mouvements et pression",
        hours: "16 h",
        iconKey: "Magnet",
        sections: [
          {
            h: "Équilibre d'un solide soumis à trois forces",
            body: "Lorsqu'un solide est en équilibre sous l'action de trois forces coplanaires et non parallèles, leur somme vectorielle doit être nulle et leurs droites d'action doivent être concourantes en un même point. Ce principe permet de déterminer les forces de frottement et de résoudre des problèmes d'équilibre mécanique du quotidien, comme un objet posé sur un plan incliné.",
            bodySimple: "Si un objet ne bouge pas alors que 3 forces le tirent dans des directions différentes, ces 3 forces s'annulent entre elles et leurs lignes se croisent au même point. C'est ce qui permet de calculer une force de frottement inconnue par exemple."
          },
          {
            h: "Moment d'une force et théorème des moments",
            body: "Le moment d'une force par rapport à un axe fixe mesure sa capacité à provoquer une rotation autour de cet axe : M = F×d, où d est la distance perpendiculaire entre la droite d'action de la force et l'axe. Le théorème des moments énonce que la somme algébrique des moments des forces appliquées à un solide en équilibre de rotation est nulle. Cela explique le fonctionnement des machines simples comme le levier, la poulie à axe fixe et le treuil.",
            bodySimple: "Le moment d'une force (M = F × d), c'est sa capacité à faire tourner un objet autour d'un axe — plus tu appuies loin du point fixe, plus l'effet est grand (comme sur un levier). Si l'objet ne tourne pas, tous les moments s'annulent."
          },
          {
            h: "Mouvement rectiligne uniformément varié et mouvement circulaire uniforme",
            body: "Dans un mouvement rectiligne uniformément varié, la vitesse change proportionnellement au temps (accélération ou décélération constante), comme lors d'une chute libre. Dans un mouvement circulaire uniforme, la vitesse angulaire reste constante ; on calcule la période T et la fréquence à partir de l'angle balayé pendant une durée donnée.",
            bodySimple: "Deux types de mouvement à connaître : un objet qui accélère/ralentit régulièrement en ligne droite (comme une chute), et un objet qui tourne à vitesse constante (comme une roue) — dans ce cas on parle de période T (temps pour un tour complet)."
          },
          {
            h: "Pression dans les liquides et poussée d'Archimède",
            body: "Le principe fondamental de l'hydrostatique énonce que la différence de pression entre deux points d'un liquide homogène au repos est proportionnelle à la différence de niveau et à la masse volumique du liquide ; il s'applique aux vases communicants. La poussée d'Archimède est la force exercée par un liquide sur un corps immergé, égale au poids du liquide déplacé — cela explique la flottaison d'un bateau malgré son poids et l'enfoncement d'un clou malgré sa petite taille. Contrairement aux solides, les liquides transmettent la pression dans toutes les directions (principe de Pascal), à la base du fonctionnement des freins hydrauliques.",
            bodySimple: "Plus tu descends dans un liquide, plus la pression augmente. La poussée d'Archimède, c'est la force qui pousse vers le haut un objet immergé — elle est égale au poids du liquide qu'il déplace. C'est pour ça qu'un bateau (lourd mais qui déplace beaucoup d'eau) flotte, alors qu'un clou (petit) coule."
          }
        ]
      },
      {
        id: "energie",
        titleFr: "Énergie et contrôle",
        hours: "6 h",
        iconKey: "Sparkles",
        sections: [
          {
            h: "Énergie cinétique et énergie potentielle",
            body: "L'énergie cinétique d'un corps dépend de sa masse et de sa vitesse, tandis que l'énergie potentielle de pesanteur dépend de la hauteur du corps par rapport à une référence, et l'énergie potentielle élastique dépend de la déformation d'un corps élastique comme un ressort comprimé ou étiré.",
            bodySimple: "Énergie cinétique = énergie du mouvement (dépend de la masse et de la vitesse). Énergie potentielle de pesanteur = énergie liée à la hauteur (plus c'est haut, plus il y en a). Énergie potentielle élastique = énergie stockée dans un ressort comprimé ou étiré."
          },
          {
            h: "Travail et puissance",
            body: "Le travail est un autre mode de transfert d'énergie ; pour une force constante lors d'un déplacement rectiligne, il se calcule par W = F×AB×cos(θ). Le travail est moteur s'il est positif (la force favorise le mouvement) et résistant s'il est négatif. La puissance moyenne P = W/Δt mesure la rapidité d'exécution du travail, et le rendement compare l'énergie utile à l'énergie totale consommée par une machine.",
            bodySimple: "Le travail (W = F × d × cos θ), c'est l'énergie transférée par une force qui déplace un objet. S'il aide le mouvement, il est positif (moteur) ; s'il le freine, il est négatif (résistant). La puissance, c'est juste la vitesse à laquelle ce travail est fait."
          }
        ]
      },
      {
        id: "lumiere",
        titleFr: "Lumière",
        hours: "6 h",
        iconKey: "Lightbulb",
        sections: [
          {
            h: "Réflexion de la lumière et lois de Descartes",
            body: "Lorsqu'un rayon lumineux frappe un miroir plan, il se réfléchit selon deux lois : l'angle de réflexion est égal à l'angle d'incidence, et les rayons incident et réfléchi sont dans le même plan que la normale. L'image d'un objet réel donnée par un miroir plan est virtuelle, symétrique de l'objet par rapport au miroir.",
            bodySimple: "Face à un miroir, l'angle avec lequel la lumière arrive = l'angle avec lequel elle repart. L'image que tu vois dans le miroir est virtuelle (elle semble être derrière le miroir) et symétrique à toi-même."
          },
          {
            h: "Réfraction de la lumière et réflexion totale",
            body: "Lorsque la lumière passe d'un milieu transparent à un autre, elle se réfracte selon la relation de Descartes : sin(i₁) = n×sin(i₂), où n est l'indice de réfraction. Lorsque l'angle d'incidence dépasse un certain angle (angle limite), une réflexion totale se produit au lieu de la réfraction — ce principe est exploité dans les fibres optiques utilisées en télécommunications et en médecine (endoscopie).",
            bodySimple: "Quand la lumière passe de l'air à l'eau (ou l'inverse), elle change de direction — c'est la réfraction. Si l'angle est trop grand, la lumière ne sort plus du tout et rebondit à l'intérieur : c'est ce qui permet aux fibres optiques de transporter la lumière sur de longues distances."
          },
          {
            h: "Applications : fibres optiques et dispersion de la lumière blanche",
            body: "La dispersion de la lumière blanche par un prisme est due essentiellement au phénomène de réfraction, l'indice de réfraction du prisme variant selon la couleur de la lumière, produisant ainsi un spectre de couleurs.",
            bodySimple: "Un prisme sépare la lumière blanche en couleurs (arc-en-ciel) parce que chaque couleur se réfracte un peu différemment en traversant le verre."
          }
        ]
      },
      {
        id: "terre-univers",
        titleFr: "Terre et Univers",
        hours: "4 h",
        iconKey: "Globe2",
        sections: [
          {
            h: "Gravitation universelle",
            body: "La loi de la gravitation universelle explique ce qui retient la Lune à la Terre et ce qui assure la cohésion du système solaire : deux corps massifs s'attirent avec une force proportionnelle au produit de leurs masses et inversement proportionnelle au carré de la distance qui les sépare.",
            bodySimple: "Tous les objets massifs s'attirent entre eux (c'est la gravité). Plus ils sont lourds, plus ils s'attirent ; plus ils sont loin l'un de l'autre, moins ils s'attirent. C'est ce qui garde la Lune autour de la Terre."
          },
          {
            h: "Pression atmosphérique et prévisions météorologiques",
            body: "La pression atmosphérique se mesure avec un baromètre et s'exprime en pascal ou en unités usuelles (atmosphère, bar, millibar, mm de mercure). La lecture des cartes météorologiques (anticyclones et dépressions) permet de prévoir le temps.",
            bodySimple: "La pression atmosphérique, c'est le poids de l'air au-dessus de nous. On la mesure avec un baromètre. Les cartes météo utilisent ça (zones de haute/basse pression) pour prévoir le temps qu'il va faire."
          }
        ]
      }
    ]
  },
  chimie: {
    id: "chimie",
    labelFr: "Chimie",
    accent: "#84E67A",
    accentDim: "#3F7A38",
    chapters: [
      {
        id: "matiere",
        titleFr: "La matière",
        hours: "13 h",
        iconKey: "Atom",
        sections: [
          {
            h: "Structure de l'atome",
            body: "L'atome est constitué d'un noyau chargé positivement (protons et neutrons) entouré d'électrons chargés négativement. On le représente par le symbole ᴬZX, où Z est le numéro atomique (nombre de protons) et A le nombre de masse (nombre de nucléons = protons + neutrons). Les isotopes sont des atomes ayant le même numéro atomique Z mais des nombres de masse différents ; l'élément chimique se caractérise par son numéro atomique qui reste conservé au cours des transformations chimiques.",
            bodySimple: "Un atome = un noyau (protons + neutrons, chargé +) entouré d'électrons (chargés -). Z = nombre de protons (l'identité de l'élément), A = nombre total de protons + neutrons. Deux atomes avec le même Z mais un A différent sont des isotopes du même élément."
          },
          {
            h: "Répartition des électrons — règles du duet et de l'octet",
            body: "Les électrons d'un atome se répartissent autour du noyau en couches successives (niveaux d'énergie) notées K, L, M... selon un nombre maximal par couche. La règle de l'octet (et du duet pour l'hydrogène et l'hélium) énonce la tendance des atomes à gagner, perdre ou partager des électrons pour atteindre une configuration stable proche du gaz noble le plus proche — c'est la base de la formation des ions monoatomiques et des molécules.",
            bodySimple: "Les électrons se rangent en couches (K, L, M...) autour du noyau. Les atomes \"veulent\" avoir 8 électrons sur leur couche externe (règle de l'octet, ou 2 pour l'hydrogène/hélium) — pour y arriver, ils gagnent, perdent ou partagent des électrons avec d'autres atomes. C'est ça qui crée les liaisons chimiques."
          },
          {
            h: "Liaison covalente et représentation de Lewis",
            body: "La liaison covalente résulte de la mise en commun d'un doublet d'électrons entre deux atomes ; elle peut être symétrique (entre deux atomes identiques) ou dissymétrique. Pour établir la représentation de Lewis d'une molécule, on dénombre les électrons de la couche externe de chaque atome, puis on les répartit en doublets liants (entre atomes) et non liants (autour des atomes), de sorte que chaque atome respecte la règle de l'octet ou du duet.",
            bodySimple: "Une liaison covalente, c'est deux atomes qui partagent une paire d'électrons. Pour dessiner un schéma de Lewis : compte les électrons externes de chaque atome, puis répartis-les en paires — soit entre deux atomes (liaison), soit autour d'un seul (doublet libre) — jusqu'à ce que chaque atome ait ses 8 électrons (ou 2)."
          },
          {
            h: "Liaison ionique et classification périodique",
            body: "Les composés ioniques (comme le chlorure de sodium NaCl) sont constitués d'ions arrangés régulièrement et liés par une liaison ionique. La classification périodique actuelle ordonne les éléments par numéro atomique croissant en lignes et colonnes selon leur structure électronique, et les éléments aux propriétés similaires forment des familles chimiques (alcalins, gaz rares, halogènes).",
            bodySimple: "Un composé ionique (comme le sel NaCl) est fait d'ions + et - qui s'attirent. Le tableau périodique range les éléments par numéro atomique croissant, et les colonnes regroupent des éléments qui se ressemblent chimiquement (comme les gaz rares, tous très stables)."
          }
        ]
      },
      {
        id: "solutions",
        titleFr: "Les solutions",
        hours: "13,5 h",
        iconKey: "TestTube",
        sections: [
          {
            h: "Électrolytes et concentration molaire",
            body: "Un électrolyte est une substance qui, dissoute dans l'eau, rend la solution conductrice d'électricité ; on distingue les électrolytes forts (totalement ionisés) et faibles (partiellement ionisés). La concentration molaire d'une espèce chimique en solution se calcule en divisant la quantité de matière (en moles) par le volume de la solution (en litres).",
            bodySimple: "Un électrolyte rend l'eau conductrice quand on le dissout dedans — fort s'il s'ionise complètement, faible s'il ne s'ionise qu'en partie. La concentration molaire, c'est juste : quantité de matière (mol) divisée par le volume (L)."
          },
          {
            h: "Acides et bases",
            body: "Un acide est un corps composé qui s'ionise dans l'eau en formant des ions hydronium H₃O⁺ (exemple : le chlorure d'hydrogène HCl). Une base est un corps composé qui s'ionise ou se dissocie dans l'eau en formant des ions hydroxyde OH⁻ (exemple : l'hydroxyde de sodium NaOH). L'eau elle-même est un ampholyte (à la fois acide et base) car elle subit une réaction d'ionisation propre très limitée aboutissant à un équilibre.",
            bodySimple: "Un acide libère des ions H₃O⁺ dans l'eau. Une base libère des ions OH⁻. L'eau, elle, peut faire les deux un tout petit peu — c'est pour ça qu'on dit qu'elle est \"ampholyte\"."
          },
          {
            h: "Le pH",
            body: "Le pH est défini par la relation [H₃O⁺] = 10⁻ᵖᴴ, mesuré au papier pH ou au pH-mètre. La mesure du pH permet de distinguer un acide fort d'un acide faible (et une base forte d'une base faible) à concentration égale. La réaction d'un acide fort avec une base forte est exothermique, et s'exploite lors d'un dosage pour déterminer la concentration inconnue d'une solution à l'aide d'un indicateur coloré approprié.",
            bodySimple: "Le pH mesure l'acidité (plus c'est bas, plus c'est acide). On le mesure avec du papier pH ou un pH-mètre. Un acide fort et un acide faible à la même concentration n'ont pas le même pH — ça permet de les distinguer. Le dosage sert à trouver une concentration inconnue en utilisant cette propriété."
          },
          {
            h: "Précipitation et identification des ions",
            body: "Certains ions peuvent être identifiés par des réactions de précipitation spécifiques (comme Fe³⁺, Cu²⁺, Cl⁻, SO₄²⁻), et l'ion sodium Na⁺ est détecté par le test à la flamme. La solubilité est indépendante de la force d'un électrolyte — un composé peut être fortement ionisé mais peu soluble, et inversement.",
            bodySimple: "Chaque ion a son test de reconnaissance : certains forment un précipité coloré avec un réactif précis, le sodium se reconnaît à la flamme (couleur caractéristique). Attention : un composé peut bien s'ioniser mais rester peu soluble — ce sont deux choses différentes."
          }
        ]
      },
      {
        id: "organique",
        titleFr: "Chimie organique",
        hours: "5,5 h",
        iconKey: "Layers",
        sections: [
          {
            h: "Les hydrocarbures aliphatiques",
            body: "Les hydrocarbures aliphatiques (ne dépassant pas 8 atomes de carbone à ce niveau) s'écrivent en formule semi-développée et suivent des règles de nomenclature précises. L'isomérie géométrique (Z et E) ne concerne que les alcènes symétriques à ce niveau.",
            bodySimple: "Les hydrocarbures, ce sont des molécules faites uniquement de carbone et d'hydrogène. Il faut savoir les nommer selon des règles précises, et savoir que certains alcènes ont deux formes différentes (Z et E) pour le même nombre d'atomes."
          },
          {
            h: "Réactions spécifiques : substitution et addition",
            body: "Les hydrocarbures saturés subissent des réactions de substitution (comme la substitution du dichlore sur le méthane), tandis que les hydrocarbures insaturés (alcènes et alcynes) subissent des réactions d'addition (comme l'addition de dichlore ou d'eau).",
            bodySimple: "Règle simple à retenir : les hydrocarbures saturés (que des liaisons simples) réagissent par substitution (un atome remplace un autre). Les hydrocarbures insaturés (avec une double ou triple liaison) réagissent par addition (un atome s'ajoute sans rien remplacer)."
          },
          {
            h: "Polymères et matières plastiques",
            body: "Le polyéthène est un exemple de polymère synthétique obtenu par polymérisation des molécules d'éthène. Il existe d'autres polymères synthétiques (nylon, tergal) et naturels (amidon, glycogène). Les matières plastiques présentent des avantages pratiques mais posent de sérieux défis environnementaux nécessitant une gestion adéquate des déchets.",
            bodySimple: "Un polymère, c'est plein de petites molécules identiques accrochées bout à bout (comme le polyéthène, fait de milliers de molécules d'éthène). Certains sont naturels (amidon), d'autres artificiels (plastique). Le plastique est pratique mais pollue s'il est mal géré."
          }
        ]
      }
    ]
  },
  svt: {
    id: "svt",
    labelFr: "SVT",
    accent: "#FB923C",
    accentDim: "#9A5B22",
    chapters: [
      {
        id: "cellule",
        titleFr: "Structure et fonction de la cellule",
        hours: "—",
        iconKey: "Atom",
        sections: [
          {
            h: "La cellule : unité du vivant",
            body: "Tous les êtres vivants sont constitués de cellules, unité de base de la structure et de la fonction. La cellule végétale se distingue de la cellule animale par la présence d'une paroi cellulaire, de chloroplastes et d'une grande vacuole, alors que les deux partagent la membrane plasmique et le noyau.",
            bodySimple: "Tout être vivant est fait de cellules. La cellule végétale a en plus une paroi rigide, des chloroplastes (pour la photosynthèse) et une grande vacuole — la cellule animale n'a que la membrane et le noyau en commun avec elle."
          },
          {
            h: "Échanges entre la cellule et son milieu",
            body: "Les échanges (gaz, nutriments, déchets) s'effectuent à travers la membrane plasmique qui régule le passage des substances de manière sélective, maintenant ainsi l'équilibre interne de la cellule.",
            bodySimple: "La membrane de la cellule agit comme un filtre intelligent : elle laisse entrer ce dont la cellule a besoin (nutriments, gaz) et laisse sortir les déchets, tout en gardant l'équilibre interne."
          }
        ]
      },
      {
        id: "nutrition",
        titleFr: "Nutrition humaine",
        hours: "—",
        iconKey: "Layers",
        sections: [
          {
            h: "L'appareil digestif",
            body: "La digestion transforme les aliments complexes en nutriments simples absorbables à travers la paroi de l'intestin grêle, grâce à des enzymes digestives sécrétées par les glandes digestives (salivaires, gastriques, pancréatiques).",
            bodySimple: "Digérer, c'est casser les aliments complexes en petites molécules simples que le corps peut absorber. Ce sont des enzymes (salive, estomac, pancréas) qui font ce travail, et l'absorption se fait dans l'intestin grêle."
          },
          {
            h: "Appareil respiratoire et circulation sanguine",
            body: "La respiration assure l'apport d'oxygène au sang et le rejet du dioxyde de carbone à travers les alvéoles pulmonaires, tandis que l'appareil circulatoire (cœur et vaisseaux) assure le transport des gaz et des nutriments vers toutes les cellules du corps.",
            bodySimple: "Les poumons apportent l'oxygène au sang et évacuent le CO₂ (au niveau des alvéoles). Le cœur et les vaisseaux sanguins transportent ensuite cet oxygène (et les nutriments) vers toutes les cellules du corps."
          }
        ]
      }
    ]
  }
};
