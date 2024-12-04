import { programsDataType } from 'types/global';

export const programsData: programsDataType[] = [
  {
    id: 1,
    title: 'Explosivité',
    description:
      "L’explosivité est un élément crucial des qualités d’un footballeur.\nC’est une des qualités qui permet à des joueurs comme Vinicius, Mbappé, Doku et Yamal d’éliminer les défenseurs.\nDans ce programme, vous allez développer la vitesse à laquelle votre corps se déplace ? Concrètement, cela veut dire soulever des charges le plus rapidement possible. Car lorsqu’on cherche à accélérer, on exerce rapidement de la force au sol pour changer de direction, ou pour accélérer sur les premiers mètres.\nC’est exactement cette qualité qu’on va chercher à travailler.\nCe programme est spécialement conçu pour les footballeurs, les volumes de travail sont adaptés à vos séances d'entraînement et vous permettront d’être performant le week-end lors de vos matchs.",
    image: 'explosivite.jpg',
    priceTiers: [
      {
        duration: '1 mois',
        price: 29.99,
        options: [
          {
            location: 'à la maison',
            programId: '66bd85cc092b98f60e8b2d92',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
          {
            location: 'à la salle',
            programId: '66c1da5b411c1348903f3d28',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
        ],
      },
      {
        duration: '3 mois',
        price: 24.99,
        options: [
          {
            location: 'à la maison',
            programId: '669ff450d36aa333924353ff',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
          {
            location: 'à la salle',
            programId: '66dd2924375a1edd0123cbf3',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
        ],
      },
      {
        duration: '6 mois',
        price: 14.99,
        isCombo: true,
        options: [
          {
            location: 'à la maison',
            programId: '669ff450d36aa333924353ff',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
          {
            location: 'à la salle',
            programId: '66dd2924375a1edd0123cbf3',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Perte de poids',
    description:
      "Notre programme de perte de poids est spécialement conçu pour les footballeurs, car il permet non seulement de perdre du poids, mais aussi de développer et tonifier les muscles. Il se distingue des autres programmes de perte de poids en mettant l'accent sur la préservation et le renforcement de la masse musculaire, élément essentiel pour les performances sur le terrain. Il est important de rester vigilant avec d'autres programmes de perte de poids, car la plupart d'entre eux ne conviennent pas aux sportifs. Beaucoup de ces programmes entraînent une perte significative de masse musculaire, ce qui n'est pas l'objectif pour un footballeur. Notre approche garantit une perte de poids tout en préservant la masse musculaire, assurant ainsi des performances optimales lors des matchs.",
    image: 'perte_de_poids',
    priceTiers: [
      {
        duration: '1 mois',
        price: 29.99,
        options: [
          {
            location: 'à la maison',
            programId: '67171185a6db6a943692e747',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
          {
            location: 'à la salle',
            programId: '67171160a6db6a943692e746',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
        ],
      },
      {
        duration: '3 mois',
        price: 24.99,
        options: [
          {
            location: 'à la maison',
            programId: '671711a4a6db6a943692e749',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
          {
            location: 'à la salle',
            programId: '6717119ba6db6a943692e748',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
        ],
      },
      {
        duration: '6 mois',
        price: 14.99,
        isCombo: true,
        options: [
          {
            location: 'à la maison',
            programId: '671711a4a6db6a943692e749',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
          {
            location: 'à la salle',
            programId: '6717119ba6db6a943692e748',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Puissance',
    description:
      "La puissance intègre à la fois la force et la vitesse sur la durée, permettant aux athlètes d'accomplir des performances dynamiques et efficaces. Comme les passes longues et la résistance physique face aux adversaires.",
    image: 'puissance',
    priceTiers: [
      {
        duration: '1 mois',
        price: 29.99,
        options: [
          {
            location: 'à la maison',
            programId: '671711cda6db6a943692e74b',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
          {
            location: 'à la salle',
            programId: '671711b7a6db6a943692e74a',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
        ],
      },
      {
        duration: '3 mois',
        price: 24.99,
        options: [
          {
            location: 'à la maison',
            programId: '6717125fa6db6a943692e74d',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
          {
            location: 'à la salle',
            programId: '67171257a6db6a943692e74c',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
        ],
      },
      {
        duration: '6 mois',
        price: 14.99,
        isCombo: true,
        options: [
          {
            location: 'à la maison',
            programId: '6717125fa6db6a943692e74d',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
          {
            location: 'à la salle',
            programId: '67171257a6db6a943692e74c',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Prise de masse',
    description:
      'Prendre du poids peut être problématique pour certains joueurs. Surtout si on ne le fait pas de la bonne façon, vous devez faire de l’hypertrophie certes, mais toujours en vous entraînant comme un athlète. Le but est de vous permettre de prendre du poids, d’être plus lourd et résistant au contact, mais cela sans vous faire perdre votre vitesse ou votre agilité. En faisant une prise de poids contrôlée, l’objectif est de prendre du muscle, pas juste de prendre du poids. Notre programme de prise de masse est créé pour les footballeurs. Avec des charges adaptées à vos matchs et à vos entraînements.',
    image: 'prise_de_masse',
    priceTiers: [
      {
        duration: '1 mois',
        price: 29.99,
        options: [
          {
            location: 'à la maison',
            programId: '67171278a6db6a943692e74f',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
          {
            location: 'à la salle',
            programId: '6717126da6db6a943692e74e',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
        ],
      },
      {
        duration: '3 mois',
        price: 24.99,
        options: [
          {
            location: 'à la maison',
            programId: '67171296a6db6a943692e751',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
          {
            location: 'à la salle',
            programId: '6717128ca6db6a943692e750',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
        ],
      },
      {
        duration: '6 mois',
        price: 14.99,
        isCombo: true,
        options: [
          {
            location: 'à la maison',
            programId: '67171296a6db6a943692e751',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
          {
            location: 'à la salle',
            programId: '6717128ca6db6a943692e750',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Progression Générale',
    description:
      "La préparation physique générale (PPG) pour les footballeurs comprend des exercices variés tels que la musculation et le cardio. Elle renforce les muscles, améliore l'endurance et prépare les joueurs à des mouvements spécifiques au football. C'est essentiel pour optimiser les performances sur le terrain.",
    image: 'ppg',
    priceTiers: [
      {
        duration: '1 mois',
        price: 29.99,
        options: [
          {
            location: 'à la maison',
            programId: '67171363a6db6a943692e753',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
          {
            location: 'à la salle',
            programId: '6717134ba6db6a943692e752',
            stripePriceId: 'price_1PpN1xCxUCRYh4RPdZ6jCgLM',
          },
        ],
      },
      {
        duration: '3 mois',
        price: 24.99,
        options: [
          {
            location: 'à la maison',
            programId: '67171375a6db6a943692e755',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
          {
            location: 'à la salle',
            programId: '6717136ea6db6a943692e754',
            stripePriceId: 'price_1PpMxyCxUCRYh4RPs2YYkloK',
          },
        ],
      },
      {
        duration: '6 mois',
        price: 14.99,
        isCombo: true,
        options: [
          {
            location: 'à la maison',
            programId: '67171375a6db6a943692e755',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
          {
            location: 'à la salle',
            programId: '6717136ea6db6a943692e754',
            stripePriceId: 'price_1PpN01CxUCRYh4RPpEgV79Di',
          },
        ],
      },
    ],
  },
];
