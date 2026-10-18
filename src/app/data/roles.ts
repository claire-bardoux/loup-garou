import { Role } from "../models /role.model";


export const ROLES: Role[] = [

  {

    id: 'simple-villageois',

    name: 'Simple villageois',

    image: '/assets/roles/Simple-villageois.webp',

    team: 'village',

    description: [

      'Le villageois fait partie du village.',

      'Il ne possède aucun pouvoir spécial et doit aider le village à découvrir l’identité des loups-garous.'

    ],

    generalInfo: [

      'Le villageois fait partie du camp du village.',

      'Il ne possède aucun pouvoir spécial.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Le villageois ne se réveille pas pendant la nuit.',

      'Pendant les débats du village, il participe aux discussions et vote pour éliminer les joueurs qu’il soupçonne d’être des loups-garous.'

    ],

    strategies: [

      'Écouter attentivement les discussions et observer les comportements suspects.',

      'Analyser les votes et les alliances entre les joueurs.',

      'Éviter les accusations sans arguments et expliquer clairement ses soupçons.'

    ]

  },

  {

    id: 'voyante',

    name: 'Voyante',

    image: '/assets/roles/Voyante.webp',

    team: 'village',

    description: [

      'La Voyante fait partie du village. Chaque nuit, elle peut découvrir le rôle d’un joueur de son choix.'

    ],

    generalInfo: [

      'La Voyante fait partie du camp du village.',

      'Chaque nuit, elle se réveille pour regarder la carte du joueur de son choix.',

      'Elle gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Lorsque le Maître du Jeu (MJ) appelle la Voyante, elle désigne silencieusement le joueur dont elle souhaite connaître le rôle.',

      'Le MJ lui révèle la carte du joueur désigné.'

    ],

    strategies: [

      'Rester discrète pour éviter d’être repérée par les loups.',

      'Partager progressivement ses informations avec le village sans révéler trop ouvertement son identité.',

      'Collaborer avec les joueurs qu’elle sait être des villageois pour démasquer les loups.',

      'Conserver une trace mentale des rôles découverts afin de confronter les informations aux votes et aux comportements.'

    ]

  },

  {

    id: 'chasseur',

    name: 'Chasseur',

    image: '/assets/roles/Chasseur.webp',

    team: 'village',

    description: [

      'Le Chasseur fait partie du village.',

      'Lorsqu’il meurt, il peut éliminer un joueur avec sa dernière balle.'

    ],

    generalInfo: [

      'Le Chasseur fait partie du camp du village.',

      'À sa mort, il peut désigner un joueur qui mourra également.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Quelle que soit la cause de sa mort, le Chasseur peut désigner un joueur qui sera également éliminé.',

      'Selon la variante utilisée, il peut choisir de ne pas utiliser sa dernière balle et de ne tuer personne.'

    ],

    strategies: [

      'Observer les comportements et les votes afin de pouvoir choisir une cible pertinente.',

      'Éviter de tirer sur un joueur sans avoir suffisamment d’indices.',

      'Prendre en compte les conséquences possibles de son tir sur le reste de la partie.'

    ]

  },

  {

    id: 'cupidon',

    name: 'Cupidon',

    image: '/assets/roles/Cupidon.webp',

    team: 'village',

    description: [

      'Cupidon fait partie du village.',

      'Lors de la première nuit, il désigne deux amoureux dont les destins seront liés.'

    ],

    generalInfo: [

      'Cupidon fait partie du camp du village.',

      'Lors de la première nuit, il désigne deux joueurs qui deviennent amoureux.',

      'Si l’un des amoureux meurt, l’autre meurt également.',

      'Les amoureux doivent survivre ensemble.',

      'Cupidon gagne si tous les loups sont éliminés, conformément à la règle de base du rôle.'

    ],

    howToPlay: [

      'Lorsque le MJ appelle Cupidon pendant la première nuit, celui-ci désigne deux joueurs.',

      'Le MJ réveille ensuite les amoureux afin qu’ils se reconnaissent.',

      'Les amoureux doivent alors protéger leur couple jusqu’à la fin de la partie.'

    ],

    strategies: [

      'Choisir les amoureux en tenant compte des conséquences que leur alliance pourrait avoir sur la partie.',

      'Anticiper le risque qu’un couple composé d’un villageois et d’un loup doive se retourner contre les deux camps.',

      'Éviter de créer un couple dont la survie dépend uniquement d’une stratégie trop risquée.'

    ]

  },

  {

    id: 'sorciere',

    name: 'Sorcière',

    image: '/assets/roles/Sorciere.webp',

    team: 'village',

    description: [

      'La Sorcière fait partie du village.',

      'Elle dispose généralement de deux potions : une pour sauver une victime et une pour éliminer un joueur.'

    ],

    generalInfo: [

      'La Sorcière appartient habituellement au camp du village.',

      'Dans les règles classiques, elle dispose d’une potion de vie et d’une potion de mort.',

      'Les règles exactes de ses potions dépendent de la variante utilisée.',

      'Elle gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Lorsque le MJ appelle la Sorcière, il lui indique la victime des loups.',

      'Elle peut décider d’utiliser sa potion de vie pour sauver cette victime.',

      'Elle peut également utiliser sa potion de mort pour éliminer un joueur.',

      'Chaque potion ne peut généralement être utilisée qu’une seule fois.'

    ],

    strategies: [

      'Évaluer soigneusement le moment où utiliser chaque potion.',

      'Éviter de gaspiller la potion de vie sur un joueur dont l’identité ou l’utilité reste incertaine.',

      'Utiliser la potion de mort lorsqu’il existe des indices suffisamment solides contre un joueur.'

    ]

  },

  {

    id: 'petite-fille',

    name: 'Petite Fille',

    image: '/assets/roles/Petite-fille.webp',

    team: 'village',

    description: [

      'La Petite Fille fait partie du village.',

      'Elle peut tenter d’observer les loups pendant leur réveil nocturne, selon les règles utilisées.'

    ],

    generalInfo: [

      'La Petite Fille appartient au camp du village.',

      'Son pouvoir consiste à essayer de repérer les loups pendant la nuit.',

      'Elle gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Pendant le réveil des loups, la Petite Fille peut tenter de les observer discrètement.',

      'Les modalités exactes de cette observation dépendent des règles retenues par le MJ.'

    ],

    strategies: [

      'Rester extrêmement discrète afin de ne pas devenir une cible prioritaire des loups.',

      'Ne partager que les informations dont elle est suffisamment sûre.',

      'Utiliser ses observations pour orienter les débats sans révéler immédiatement son rôle.'

    ]

  },

  {

    id: 'capitaine',

    name: 'Capitaine',

    image: '/assets/roles/Capitaine.webp',

    team: 'village',

    description: [

      'Le Capitaine est un rôle de leadership du village.',

      'Son vote peut avoir une influence particulière sur les décisions collectives.'

    ],

    generalInfo: [

      'Le Capitaine est généralement élu par les joueurs.',

      'Selon les règles classiques, son vote compte double.',

      'En cas d’égalité, il peut également départager les joueurs, selon la variante utilisée.'

    ],

    howToPlay: [

      'Le Capitaine est élu par les joueurs selon les modalités définies par le MJ.',

      'Il utilise son influence lors des votes du village.'

    ],

    strategies: [

      'Écouter les arguments de chaque joueur avant de prendre position.',

      'Utiliser son influence pour favoriser les décisions les mieux étayées.',

      'Éviter de transformer son rôle de leadership en domination des débats.'

    ]

  },

  {

    id: 'villageois-villageois',

    name: 'Villageois-Villageois',

    image: '/assets/roles/Villageois-Villageois.webp',

    team: 'village',

    description: [

      'Le Villageois-Villageois fait partie du village.',

      'Sa carte est connue publiquement comme étant celle d’un villageois, selon les règles classiques de ce rôle.'

    ],

    generalInfo: [

      'Le Villageois-Villageois appartient au camp du village.',

      'Il ne possède pas de pouvoir nocturne particulier.',

      'Sa carte permet aux autres joueurs de connaître son identité dès le début de la partie, selon la variante utilisée.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Le MJ présente publiquement la carte du Villageois-Villageois lorsque les règles de la partie le prévoient.',

      'Le joueur participe ensuite aux débats et aux votes comme un villageois.'

    ],

    strategies: [

      'Profiter de son identité connue pour aider le village à établir des repères fiables.',

      'Analyser les réactions des autres joueurs face à son identité révélée.',

      'Participer activement aux débats sans considérer que son identité connue lui donne automatiquement raison.'

    ]

  },

  {

    id: 'deux-soeurs',

    name: 'Les Deux Sœurs',

    image: '/assets/roles/Deux-soeurs.webp',

    team: 'village',

    description: [

      'Les Deux Sœurs font partie du village.',

      'Elles se connaissent et peuvent donc se faire confiance.'

    ],

    generalInfo: [

      'Les Deux Sœurs appartiennent au camp du village.',

      'Elles gagnent si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Lors de la première nuit, le MJ appelle les Deux Sœurs.',

      'Elles prennent connaissance de l’identité l’une de l’autre et peuvent se concerter silencieusement.'

    ],

    strategies: [

      'Comparer leurs observations afin de repérer les incohérences.',

      'Se coordonner discrètement pendant les débats.',

      'Éviter de révéler trop rapidement leur lien si cela risque de les exposer aux loups.'

    ]

  },

  {

    id: 'trois-freres',

    name: 'Les Trois Frères',

    image: '/assets/roles/Trois-freres.webp',

    team: 'village',

    description: [

      'Les Trois Frères font partie du village.',

      'Ils se connaissent et peuvent donc se faire confiance.'

    ],

    generalInfo: [

      'Les Trois Frères appartiennent au camp du village.',

      'Ils gagnent si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Lors de la première nuit, le MJ appelle les Trois Frères.',

      'Ils prennent connaissance de l’identité des deux autres et peuvent se concerter silencieusement.'

    ],

    strategies: [

      'Mettre en commun leurs observations pour confronter les versions des autres joueurs.',

      'Éviter de révéler trop tôt leur identité commune.',

      'Utiliser leur confiance mutuelle pour structurer les débats sans créer un bloc de vote trop évident.'

    ]

  },

  {

    id: 'ange',

    name: 'Ange',

    image: '/assets/roles/Ange.webp',

    team: 'solitaire',

    description: [

      'L’Ange est un rôle solitaire.',

      'Il cherche à se faire éliminer par le village dès le premier vote.'

    ],

    generalInfo: [

      'L’Ange appartient au camp des solitaires.',

      'Il gagne s’il réussit à se faire éliminer par les villageois lors du premier débat.',

      'S’il échoue, il devient un simple villageois.'

    ],

    howToPlay: [

      'Lors du débat suivant la première nuit, l’Ange tente de convaincre le village de voter contre lui.',

      'S’il est éliminé lors de ce premier vote, il remporte la partie selon les règles classiques.',

      'S’il survit, il devient un simple villageois.'

    ],

    strategies: [

      'Adopter un comportement suffisamment suspect pour attirer les votes.',

      'Éviter d’être trop évident, car les autres joueurs pourraient comprendre son objectif.',

      'Trouver un équilibre entre provoquer les soupçons et rester crédible.'

    ]

  },

  {

    id: 'juge-begue',

    name: 'Juge Bègue',

    image: '/assets/roles/Juge-Begue.webp',

    team: 'village',

    description: [

      'Le Juge Bègue fait partie du village.',

      'Une fois par partie, il peut déclencher un nouveau vote.'

    ],

    generalInfo: [

      'Le Juge Bègue appartient au camp du village.',

      'Il peut déclencher instantanément un vote supplémentaire une seule fois par partie.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Lors de la première nuit, le MJ appelle le Juge Bègue.',

      'Le Juge Bègue choisit un signe ou un geste secret qu’il communique au MJ.',

      'À tout moment de la partie, il peut effectuer ce signe pour déclencher un nouveau vote.',

      'Le vote en cours est alors interrompu selon les règles de la variante utilisée.'

    ],

    strategies: [

      'Utiliser son pouvoir pour provoquer un vote lorsque des éléments nouveaux justifient une décision.',

      'Défendre un rôle clé ou tenter de condamner un joueur suspect.',

      'Éviter de déclencher un vote sans raison claire, car cela peut profiter aux loups.'

    ]

  },

  {

    id: 'chevalier-epee-rouillee',

    name: 'Chevalier à l’Épée Rouillée',

    image: '/assets/roles/Chevalier-epee-rouillee.webp',

    team: 'village',

    description: [

      'Le Chevalier à l’Épée Rouillée fait partie du village.',

      'S’il est tué par les loups, il infecte le premier loup situé à sa gauche.'

    ],

    generalInfo: [

      'Le Chevalier à l’Épée Rouillée appartient au camp du village.',

      'S’il est éliminé par les loups pendant la nuit, le premier loup situé à sa gauche est infecté.',

      'Le loup infecté meurt la nuit suivante avant de pouvoir tuer de nouveau.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Le Chevalier ne réalise aucune action spécifique.',

      'Le MJ applique son pouvoir si le Chevalier est tué par les loups pendant la nuit.',

      'Le premier loup situé à sa gauche est alors désigné comme infecté.'

    ],

    strategies: [

      'Profiter de son pouvoir passif pour constituer une menace dissuasive pour les loups.',

      'Le MJ peut utiliser la mort du loup infecté pour innocenter les joueurs situés entre le Chevalier et ce loup, conformément aux règles fournies.'

    ]

  },

  {

    id: 'comedien',

    name: 'Comédien',

    image: '/assets/roles/Comedien.webp',

    team: 'village',

    description: [

      'Le Comédien fait partie du village.',

      'Pendant les trois premières nuits, il peut emprunter un pouvoir spécial différent chaque nuit.'

    ],

    generalInfo: [

      'Le Comédien appartient au camp du village.',

      'Il choisit chaque nuit, pendant les trois premières nuits, un pouvoir parmi trois cartes spéciales.',

      'Chaque pouvoir choisi est ensuite écarté et ne peut plus être utilisé.',

      'À partir de la quatrième nuit, il devient un simple villageois.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Avant la partie, le MJ met de côté trois cartes de rôles spéciaux non-loups.',

      'Après la distribution des cartes, ces trois cartes sont placées face visible au centre de la table.',

      'Chaque nuit, lorsque le MJ appelle le Comédien, celui-ci choisit un rôle parmi les cartes disponibles.',

      'Il effectue les actions correspondant au rôle choisi, puis la carte est retirée.'

    ],

    strategies: [

      'Choisir le pouvoir le plus utile en fonction des informations déjà recueillies.',

      'Privilégier les rôles capables de fournir des informations fiables ou de protéger le village.',

      'Se rappeler que chaque pouvoir ne peut être utilisé qu’une seule fois.'

    ]

  },

  {

    id: 'servante-devouee',

    name: 'Servante Dévouée',

    image: '/assets/roles/Servante-devouee.webp',

    team: 'ambigu',

    description: [

      'La Servante Dévouée peut prendre le rôle de la victime des loups.'

    ],

    generalInfo: [

      'La Servante Dévouée est un rôle ambigu.',

      'Elle peut récupérer la carte de la victime des loups et incarner ce rôle jusqu’à sa mort ou jusqu’à la fin de la partie.',

      'Elle gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'La Servante doit lever sa carte avant que celle de la victime soit révélée.',

      'Si elle utilise son pouvoir, elle récupère la carte de la victime et devient ce rôle pour les prochaines nuits.',

      'Si elle fait partie du couple désigné par Cupidon, elle ne peut pas utiliser son pouvoir et devient un simple villageois.'

    ],

    strategies: [

      'Évaluer l’intérêt du rôle de la victime avant de décider de le récupérer.',

      'Anticiper les conséquences du changement de rôle sur les objectifs de victoire.',

      'Éviter de prendre un rôle dont les contraintes pourraient compromettre ses chances de survie.'

    ]

  },

  {

    id: 'renard',

    name: 'Renard',

    image: '/assets/roles/Renard.webp',

    team: 'village',

    description: [

      'Le Renard fait partie du village.',

      'Son flair lui permet de détecter la présence éventuelle d’un loup parmi trois joueurs.'

    ],

    generalInfo: [

      'Le Renard appartient au camp du village.',

      'Il peut désigner trois joueurs et demander au MJ si au moins un loup se trouve parmi eux.',

      'Si aucun loup n’est présent, il perd son pouvoir.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Lors de la première nuit, le Renard désigne trois joueurs.',

      'Le MJ lui indique si au moins un loup est présent parmi ces joueurs.',

      'S’il détecte un loup, il peut réutiliser son pouvoir la nuit suivante.',

      'Sinon, il devient un simple villageois.'

    ],

    strategies: [

      'Cibler les joueurs dont les comportements paraissent suspects.',

      'Comparer les résultats du flair avec les votes et les alliances observées.',

      'Si aucun loup n’est détecté, utiliser cette information pour innocenter les trois joueurs concernés, en tenant compte des éventuelles variantes.'

    ]

  },

  {

    id: 'montreur-ours',

    name: 'Montreur d’Ours',

    image: '/assets/roles/Montreur-ours.webp',

    team: 'village',

    description: [

      'Le Montreur d’Ours fait partie du village.',

      'Chaque matin, l’ours grogne si un loup se trouve à sa gauche ou à sa droite.'

    ],

    generalInfo: [

      'Le Montreur d’Ours appartient au camp du village.',

      'Chaque matin, le MJ annonce si l’ours grogne.',

      'L’ours grogne si un loup se trouve immédiatement à gauche ou à droite du Montreur.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Le Montreur d’Ours est identifié par le MJ lors de la première nuit.',

      'Il n’est ensuite plus appelé pendant la nuit.',

      'Chaque matin, le MJ annonce si l’ours grogne ou non.'

    ],

    strategies: [

      'Utiliser les annonces successives pour repérer les zones où des loups pourraient se trouver.',

      'Croiser les grognements avec les éliminations et les changements de position éventuels.',

      'Ne pas conclure trop rapidement qu’un joueur est un loup sur la seule base d’un grognement.'

    ]

  },

  {

    id: 'abominable-sectaire',

    name: 'Abominable Sectaire',

    image: '/assets/roles/Abominable-sectaire.webp',

    team: 'solitaire',

    description: [

      'L’Abominable Sectaire est un solitaire qui doit éliminer tous les joueurs du groupe opposé au sien.'

    ],

    generalInfo: [

      'L’Abominable Sectaire appartient au camp des solitaires.',

      'Le MJ définit deux groupes au début de la partie.',

      'Il gagne s’il élimine tous les joueurs du groupe opposé au sien tout en restant en vie.'

    ],

    howToPlay: [

      'Au début de la partie, le MJ définit deux groupes selon un critère commun.',

      'L’Abominable Sectaire doit influencer les votes et survivre suffisamment longtemps pour éliminer le groupe opposé.',

      'Ce rôle n’est pas appelé pendant la partie.'

    ],

    strategies: [

      'Rester discret pour éviter d’être éliminé par les loups.',

      'Influencer les débats de manière à favoriser l’élimination du groupe opposé.',

      'Profiter du fait que les autres joueurs peuvent oublier sa présence dans la partie.'

    ]

  },

  {

    id: 'enfant-sauvage',

    name: 'Enfant Sauvage',

    image: '/assets/roles/Enfant-sauvage.webp',

    team: 'ambigu',

    description: [

      'L’Enfant Sauvage commence dans le camp du village, mais peut rejoindre les loups si son mentor meurt.'

    ],

    generalInfo: [

      'L’Enfant Sauvage est un rôle ambigu.',

      'Il appartient au camp du village jusqu’à la mort de son mentor.',

      'Si son mentor est éliminé, il rejoint le camp des loups-garous.',

      'Il gagne selon le camp auquel il appartient à la fin de la partie.'

    ],

    howToPlay: [

      'Lors de la première nuit, l’Enfant Sauvage choisit un joueur qui devient son mentor.',

      'Le mentor n’est pas informé de ce choix.',

      'Si le mentor meurt, l’Enfant Sauvage devient un loup-garou.'

    ],

    strategies: [

      'Choisir un mentor susceptible de survivre longtemps si l’objectif est de rester du côté du village.',

      'Si l’objectif est de rejoindre les loups, choisir un mentor susceptible d’être éliminé rapidement peut être pertinent.',

      'Adapter sa stratégie aux intérêts de son camp actuel.'

    ]

  },

  {

    id: 'chien-loup',

    name: 'Chien-Loup',

    image: '/assets/roles/chien-loup.webp',

    team: 'ambigu',

    description: [

      'Le Chien-Loup choisit au début de la partie s’il rejoint le camp du village ou celui des loups-garous.'

    ],

    generalInfo: [

      'Le Chien-Loup est un rôle ambigu.',

      'Lors de la première nuit, il choisit d’être un chien ou un loup.',

      'S’il choisit le chien, il rejoint le camp du village.',

      'S’il choisit le loup, il rejoint le camp des loups-garous.'

    ],

    howToPlay: [

      'Lors de la première nuit, le MJ appelle le Chien-Loup.',

      'Il choisit secrètement son camp.',

      'S’il choisit le chien, il devient un simple villageois.',

      'S’il choisit le loup, il rejoint les réunions nocturnes des loups-garous.'

    ],

    strategies: [

      'Choisir le camp en fonction de la composition de la partie et de son style de jeu.',

      'Si le camp du village est choisi, se concentrer sur la recherche des loups.',

      'Si le camp des loups est choisi, participer aux décisions nocturnes sans attirer les soupçons.'

    ]

  },

  {

    id: 'loup-garou',

    name: 'Loup-Garou',

    image: '/assets/roles/Simple-loup-garou.webp',

    team: 'loup',

    description: [

      'Le Loup-Garou fait partie du camp des loups-garous.',

      'Chaque nuit, il participe avec les autres loups au choix d’un villageois à éliminer.'

    ],

    generalInfo: [

      'Le Loup-Garou appartient au camp des loups-garous.',

      'Chaque nuit, il se réveille avec les autres loups pour choisir une victime.',

      'Il gagne si tout le village est éliminé.'

    ],

    howToPlay: [

      'Lorsque le MJ appelle les loups-garous, le joueur se réveille.',

      'Il décide avec ses compères de la personne à éliminer.',

      'Les loups doivent désigner la même personne pour valider leur choix auprès du MJ.'

    ],

    strategies: [

      'Se défendre entre loups tant que cela reste crédible.',

      'Si un compère est fortement soupçonné, envisager de voter contre lui pour détourner les soupçons.',

      'Repérer et éliminer les rôles particulièrement dangereux pour les loups, comme la Voyante ou la Sorcière.',

      'Éviter de tuer un villageois déjà fortement soupçonné par le reste du village, car cela pourrait innocenter ce joueur.',

      'Envisager les sacrifices stratégiques uniquement si leur bénéfice probable est supérieur au risque.'

    ]

  },

  {

    id: 'loup-garou-blanc',

    name: 'Loup-Garou Blanc',

    image: '/assets/roles/Loup-Blanc.webp',

    team: 'solitaire',

    description: [

      'Le Loup Blanc est un solitaire infiltré parmi les loups-garous.',

      'Il doit éliminer tous les autres joueurs pour rester le seul survivant.'

    ],

    generalInfo: [

      'Le Loup Blanc appartient au camp des solitaires.',

      'Il participe aux votes nocturnes des loups-garous.',

      'Une nuit sur deux, il peut également éliminer un loup-garou.',

      'Il gagne s’il est le seul survivant de la partie.'

    ],

    howToPlay: [

      'Le Loup Blanc se réveille avec les autres loups et participe au vote.',

      'Une nuit sur deux, le MJ l’appelle individuellement après le vote des loups.',

      'Il peut alors désigner un loup-garou à éliminer.'

    ],

    strategies: [

      'Éviter de se faire repérer par les autres loups.',

      'Éliminer les rôles capables de compromettre sa survie.',

      'Profiter des tensions entre les camps pour avancer vers son objectif solitaire.',

      'Choisir soigneusement les moments où éliminer un loup-garou.'

    ]

  },

  {

    id: 'grand-mechant-loup',

    name: 'Grand Méchant Loup',

    image: '/assets/roles/Grand-mechant-loup.webp',

    team: 'loup',

    description: [

      'Le Grand Méchant Loup fait partie du camp des loups-garous.',

      'Tant qu’aucun autre loup n’est mort, il peut dévorer un villageois supplémentaire chaque nuit.'

    ],

    generalInfo: [

      'Le Grand Méchant Loup appartient au camp des loups-garous.',

      'Tant qu’aucun autre loup n’est mort, il peut éliminer une victime supplémentaire chaque nuit.',

      'Il perd ce pouvoir à la mort du premier loup, sauf si une variante prévoit le contraire.',

      'Il gagne si tout le village est éliminé.'

    ],

    howToPlay: [

      'Chaque nuit, le Grand Méchant Loup est appelé après le vote des loups.',

      'Il désigne une seconde victime.',

      'Si un autre loup meurt, il perd généralement ce pouvoir et devient un simple Loup-Garou.'

    ],

    strategies: [

      'Profiter de son pouvoir supplémentaire tant que les conditions sont réunies.',

      'Évaluer les menaces que représentent les rôles spéciaux du village.',

      'Éviter d’attirer l’attention sur le fait que plusieurs victimes sont éliminées pendant la même nuit.'

    ]

  },

  {

    id: 'infect-pere-des-loups',

    name: 'Infect Père des Loups',

    image: '/assets/roles/Infect-pere-des-loups.webp',

    team: 'loup',

    description: [

      'L’Infect Père des Loups fait partie du camp des loups-garous.',

      'Il peut transformer la victime des loups en un nouveau membre de leur camp.'

    ],

    generalInfo: [

      'L’Infect Père des Loups appartient au camp des loups-garous.',

      'Il peut choisir d’infecter la victime des loups au lieu de la laisser mourir.',

      'La victime infectée rejoint alors le camp des loups-garous.',

      'Il gagne si tout le village est éliminé.'

    ],

    howToPlay: [

      'Après le vote des loups, le MJ appelle l’Infect Père des Loups.',

      'Celui-ci décide s’il souhaite infecter la victime.',

      'Si la victime est infectée, elle rejoint le camp des loups et se réveillera avec eux lors de la prochaine nuit.'

    ],

    strategies: [

      'Privilégier les villageois dont l’innocence est déjà reconnue par les autres joueurs.',

      'Utiliser l’infection pour modifier le rapport de force entre les deux camps.',

      'Évaluer le moment optimal pour utiliser ce pouvoir, qui peut être limité à une seule utilisation.'

    ]

  },

  {

    id: 'voleur',

    name: 'Voleur',

    image: '/assets/roles/Voleur.webp',

    team: 'village',

    description: [

      'Le Voleur peut modifier son rôle au début de la partie en fonction des cartes disponibles.'

    ],

    generalInfo: [

      'Le Voleur appartient au camp du village dans la variante décrite.',

      'Ses modalités exactes dépendent des règles retenues pour la partie.',

      'Il gagne si tous les loups sont éliminés.'

    ],

    howToPlay: [

      'Le MJ applique les règles de la variante du Voleur choisie pour la partie.',

      'Le fonctionnement précis doit être défini avant le début de la partie.'

    ],

    strategies: [

      'Évaluer les conséquences du rôle obtenu avant de prendre des décisions.',

      'Adapter sa stratégie au camp et aux capacités finalement attribués.'

    ]

  }

];