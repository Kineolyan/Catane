import { makeEnum, makeMaskEnum } from 'libs/enum';

/**
 * Enum of 7 wonders resources
 * @typedef {Resources}
 * @property {string} ARGILE
 * @property {string} PIERRE
 * @property {string} BOIS
 * @property {string} MINERAI
 * @property {string} VERRE
 * @property {string} TISSU
 * @property {string} PAPIER
 * @property {string} ARGENT
 * @property {string} POINT
 * @property {string} ARME
 */
export const Resources = makeMaskEnum([
  'ARGILE',
  'PIERRE',
  'BOIS',
  'MINERAI',
  'VERRE',
  'TISSU',
  'PAPIER',
  'ARGENT',
  'POINT',
  'ARME'
]);

/**
 * Enum of 7 wonders card type
 * @typedef {CardType}
 * @property {string} MATIERE
 * @property {string} FABRIQUE
 * @property {string} COMMERCE
 * @property {string} CIVIL
 * @property {string} SCIENCE
 * @property {string} MILITAIRE
 * @property {string} GUILDE
 */
export const CardType = makeEnum([
  'MATIERE',
  'FABRIQUE',
  'COMMERCE',
  'CIVIL',
  'SCIENCE',
  'MILITAIRE',
  'GUILDE'
]);

export const ScienceType = makeEnum([
  'ROUE', 'SEXTAN', 'TABLETTE'
]);

export const Cards = {
  // Matières premières
  'Friche': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.BOIS | Resources.ARGILE]: 1 },
    quantity: [
      { age: 1, range: [6] }
    ]
  },
  // Produits manufacturés
  'Verrerie': {
    type: CardType.FABRIQUE,
    cost: {},
    gains: { [Resources.VERRE]: 1 },
    quantity: [
      { age: 1, range: [3, 6] },
      { age: 2, range: [3, 5] }
    ]
  },
  'Métier à tisser': {
    type: CardType.FABRIQUE,
    cost: {},
    gains: { [Resources.TISSU]: 1 },
    quantity: [
      { age: 1, range: [3, 6] },
      { age: 2, range: [3, 5] }
    ]
  },
  'Presse': {
    type: CardType.FABRIQUE,
    cost: {},
    gains: { [Resources.TISSU]: 1 },
    quantity: [
      { age: 1, range: [3, 6] },
      { age: 2, range: [3, 5] }
    ]
  },
  // Bâtiments civils
  'Aqueduc': {
    type: CardType.CIVIL,
    cost: { [Resources.PIERRE]: 3 },
    gains: { [Resources.POINTS]: 5 },
    quantity: [
      { age: 2, range: [3, 7] }
    ]
  },
  // Bâtiments scientifiques
  'Dispensaire': {
    type: CardType.MILITAIRE,
    subtype: ScienceType.SEXTAN,
    cost: {
      [Resources.MINERAI]: 2,
      [Resources.VERRE]: 1
    },
    requires: 'Officine',
    gains: {},
    quantity: [
      { age: 2, range: [3, 4] }
    ]
  },
  // Bâtiments commerciaux
  'Comptoir Ouest': {
    type: CardType.COMMERCE,
    cost: {},
    gains: {},
    effect: 'discount[raw, left, 1]',
    quantity: [
      { age: 1, range: [3, 7] }
    ]
  },
  // Bâtiments militaires
  'Fortifications': {
    type: CardType.MILITAIRE,
    cost: {
      [Resources.MINERAI]: 3,
      [Resources.PIERRE]: 1
    },
    requires: 'Muraille',
    gains: { [Resources.ARME]: 3 },
    quantity: [
      { age: 3, range: [3, 7] }
    ]
  }
};

export const Guildes = {
  'Guilde des scientifiques': {
    type: CardType.GUILDE,
    cost: {
      [Resources.MINERAI]: 2,
      [Resources.BOIS]: 2,
      [Resources.PAPIER]: 1
    },
    effect: 'bonus-science'
  }
};
