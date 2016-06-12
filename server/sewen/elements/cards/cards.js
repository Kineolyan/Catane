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

export const RawResourcesCards = {
  'Chantier': {
    type: CardType.MATIERE,
    cost: {},
    gains: { [Resources.BOIS]: 1 },
    quantity: [
      { age: 1, range: [3, 4] }
    ]
  },
  'Cavite': {
    type: CardType.MATIERE,
    cost: {},
    gains: { [Resources.PIERRE]: 1 },
    quantity: [
      { age: 1, range: [3, 4] }
    ]
  },
  'Bassin argileux': {
    type: CardType.MATIERE,
    cost: {},
    gains: { [Resources.ARGILE]: 1 },
    quantity: [
      { age: 1, range: [3, 5] }
    ]
  },
  'Filon': {
    type: CardType.MATIERE,
    cost: {},
    gains: { [Resources.MINERAI]: 1 },
    quantity: [
      { age: 1, range: [3, 4] }
    ]
  },
  'Friche': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.BOIS | Resources.ARGILE]: 1 },
    quantity: [
      { age: 1, range: [6] }
    ]
  },
  'Excavation': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.PIERRE | Resources.ARGILE]: 1 },
    quantity: [
      { age: 1, range: [4] }
    ]
  },
  'Fosse argileuse': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.ARGILE | Resources.MINERAI]: 1 },
    quantity: [
      { age: 1, range: [3] }
    ]
  },
  'Exploitation forestiere': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.PIERRE | Resources.BOIS]: 1 },
    quantity: [
      { age: 1, range: [3] }
    ]
  },
  'Gisement': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.BOIS | Resources.MINERAI]: 1 },
    quantity: [
      { age: 1, range: [5] }
    ]
  },
  'Mine': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.MINERAI | Resources.PIERRE]: 1 },
    quantity: [
      { age: 1, range: [6] }
    ]
  },
  'Scierie': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.BOIS]: 2 },
    quantity: [
      { age: 2, range: [3, 4] }
    ]
  },
  'Carriere': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.PIERRE]: 2 },
    quantity: [
      { age: 2, range: [3, 4] }
    ]
  },
  'Briqueterie': {
    type: CardType.MATIERE,
    cost: { [Resources.ARGENT]: 1 },
    gains: { [Resources.ARGILE]: 2 },
    quantity: [
      { age: 2, range: [3, 4] }
    ]
  },
  'Fonderie': {
    type: CardType.MATIERE,
    cost: { [Resources.MINERAI]: 1 },
    gains: { [Resources.BOIS]: 2 },
    quantity: [
      { age: 2, range: [3, 4] }
    ]
  }
};

export const ProcessedResourcesCards = {
  'Metier a tisser': {
    type: CardType.FABRIQUE,
    cost: {},
    gains: { [Resources.TISSU]: 1 },
    quantity: [
      { age: 1, range: [3, 6] },
      { age: 2, range: [3, 5] }
    ]
  },
  'Verrerie': {
    type: CardType.FABRIQUE,
    cost: {},
    gains: { [Resources.VERRE]: 1 },
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
  }
};

export const CityBuildings = {
  'Preteurs sur gages': {
    type: CardType.CIVIL,
    cost: {},
    prices: { [Resources.POINTS]: 3 },
    quantity: [
      { age: 1, range: [4, 7] }
    ]
  },
  'Bains': {
    type: CardType.CIVIL,
    cost: { [Resources.PIERRE]: 1 },
    prices: { [Resources.POINTS]: 3 },
    quantity: [
      { age: 1, range: [3, 7] }
    ]
  },
  'Autel': {
    type: CardType.CIVIL,
    cost: {},
    prices: { [Resources.POINTS]: 2 },
    quantity: [
      { age: 1, range: [3, 5] }
    ]
  },
  'Theatre': {
    type: CardType.CIVIL,
    cost: {},
    prices: { [Resources.POINTS]: 2 },
    quantity: [
      { age: 1, range: [3, 6] }
    ]
  },
  'Acqueduc': {
    type: CardType.CIVIL,
    cost: { [Resources.PIERRE]: 3 },
    prices: { [Resources.POINTS]: 5 },
	  requires: 'Bains',
    quantity: [
      { age: 2, range: [3, 7] }
    ]
  },
  'Temple': {
    type: CardType.CIVIL,
    cost: { [Resources.BOIS]: 1, [Resources.ARGILE]: 1, [Resources.VERRE]: 1 },
    prices: { [Resources.POINTS]: 3 },
	  requires: 'Autel',
    quantity: [
      { age: 2, range: [3, 6] }
    ]
  },
	'Statue': {
		type: CardType.CIVIL,
		cost: { [Resources.MINERAI]: 2, [Resources.BOIS]: 1 },
		prices: { [Resources.POINTS]: 4 },
		requires: 'Theatre',
		quantity: [
			{ age: 2, range: [3, 7] }
		]
	},
	'Tribunal': {
		type: CardType.CIVIL,
		cost: { [Resources.ARGILE]: 2, [Resources.TISSU]: 1 },
		prices: { [Resources.POINTS]: 4 },
		requires: 'Scriptorium',
		quantity: [
			{ age: 2, range: [3, 5] }
		]
	},
  'Pantheon': {
    type: CardType.CIVIL,
    cost: {
	    [Resources.ARGILE]: 2,
	    [Resources.MINERAI]: 1,
	    [Resources.PAPIER]: 1,
	    [Resources.TISSU]: 1,
	    [Resources.VERRE]: 1
    },
    prices: { [Resources.POINTS]: 7 },
	  requires: 'Temple',
    quantity: [
      { age: 3, range: [3, 6] }
    ]
  },
  'Jardins': {
    type: CardType.CIVIL,
    cost: { [Resources.ARGILE]: 2, [Resources.BOIS]: 1 },
    prices: { [Resources.POINTS]: 5 },
	  requires: 'Statue',
    quantity: [
      { age: 3, range: [3, 4] }
    ]
  },
  'Hotel de ville': {
    type: CardType.CIVIL,
    cost: { [Resources.PIERRE]: 2, [Resources.MINERAI]: 1, [Resources.VERRE]: 1 },
    prices: { [Resources.POINTS]: 6 },
    quantity: [
      { age: 3, range: [3, 5, 6] }
    ]
  },
	'Palace': {
		type: CardType.CIVIL,
		cost: {
			[Resources.ARGILE]: 1,
			[Resources.BOIS]: 1,
			[Resources.MINERAI]: 1,
			[Resources.PIERRE]: 1,
			[Resources.VERRE]: 1,
			[Resources.PAPIER]: 1,
			[Resources.TISSU]: 1
		},
		prices: { [Resources.POINTS]: 8 },
		quantity: [
			{ age: 3, range: [3, 7] }
		]
	},
	'Senat': {
		type: CardType.CIVIL,
		cost: {
			[Resources.BOIS]: 2,
			[Resources.MINERAI]: 1,
			[Resources.PIERRE]: 1
		},
		prices: { [Resources.POINTS]: 6 },
		requires: 'Bibliotheque',
		quantity: [
			{ age: 3, range: [3, 5] }
		]
	}
};

export const TradeCenters = {
  'Taverne': {
    type: CardType.COMMERCE,
    cost: {},
    gains: { [Resources.ARGENT]: 5 },
    quantity: [
      { age: 1, range: [4, 5, 7] }
    ]
  },
	'Comptoir Est': {
		type: CardType.COMMERCE,
		cost: {},
		gains: {},
		effect: 'discount[raw, right, 1]',
		quantity: [
			{ age: 1, range: [3, 7] }
		]
	},
	'Comptoir Ouest': {
		type: CardType.COMMERCE,
		cost: {},
		gains: {},
		effect: 'discount[raw, left, 1]',
		quantity: [
			{ age: 1, range: [3, 7] }
		]
	},
	'Marche': {
		type: CardType.COMMERCE,
		cost: {},
		gains: {},
		effect: 'discount[processed, both, 1]',
		quantity: [
			{ age: 1, range: [3, 6] }
		]
	},
	'Forum': {
		type: CardType.COMMERCE,
		cost: { [Resources.ARGILE]: 2 },
		gains: { [Resources.TISSU | Resources.VERRE | Resources.PAPIER]: 1 },
		requires: ['Comptoir Est', 'Comptoir Ouest'],
		quantity: [
			{ age: 2, range: [3, 6, 7] }
		]
	},
	'Caravanserail': {
		type: CardType.COMMERCE,
		cost: { [Resources.BOIS]: 2 },
		gains: { [Resources.ARGILE | Resources.PIERRE | Resources.MINERAI | Resources.BOIS]: 1 },
		requires: 'marche',
		quantity: [
			{ age: 2, range: [3, 5, 6] }
		]
	},
	'Vignoble': {
		type: CardType.COMMERCE,
		cost: {},
		gains: {},
		effect: 'coins[1, raw, all]',
		quantity: [
			{ age: 2, range: [3, 6] }
		]
	},
	'Bazar': {
		type: CardType.COMMERCE,
		cost: {},
		gains: {},
		effect: 'coins[2, processed, all]',
		quantity: [
			{ age: 2, range: [4, 7] }
		]
	},
	'Port': {
		type: CardType.COMMERCE,
		cost: { [Resources.BOIS]: 1, [Resources.MINERAI]: 1, [Resources.TISSU]: 1 },
		gains: {},
		effect: 'score[1, 1, raw]',
		requires: 'Forum',
		quantity: [
			{ age: 3, range: [3, 4] }
		]
	},
	'Phare': {
		type: CardType.COMMERCE,
		cost: { [Resources.PIERRE]: 1, [Resources.VERRE]: 1 },
		gains: {},
		effect: 'score[1, 1, commerce]',
		requires: 'Caravanserail',
		quantity: [
			{ age: 3, range: [3, 6] }
		]
	},
	'Chambre de commerce': {
		type: CardType.COMMERCE,
		cost: { [Resources.ARGILE]: 2, [Resources.PAPIER]: 1 },
		gains: {},
		effect: 'score[2, 2, processed]',
		quantity: [
			{ age: 3, range: [4, 6] }
		]
	},
	'Arene': {
		type: CardType.COMMERCE,
		cost: { [Resources.PIERRE]: 2, [Resources.MINERAI]: 1 },
		gains: {},
		effect: 'wonder[3, 1]',
		requires: 'Dispensaire',
		quantity: [
			{ age: 3, range: [3, 5, 7] }
		]
	}
};

export const WarOffices = {
	'Palissade': {
		type: CardType.MILITAIRE,
		cost: { [Resources.BOIS]: 1 },
		prices: { [Resources.ARME]: 1 },
		quantity: [
			{ age: 1, range: [3, 7] }
		]
	},
	'Caserne': {
		type: CardType.MILITAIRE,
		cost: { [Resources.MINERAI]: 1 },
		prices: { [Resources.ARME]: 1 },
		quantity: [
			{ age: 1, range: [3, 5] }
		]
	},
	'Tour de garde': {
		type: CardType.MILITAIRE,
		cost: { [Resources.ARGILE]: 1 },
		prices: { [Resources.ARME]: 1 },
		quantity: [
			{ age: 1, range: [3, 4] }
		]
	},
	'Muraille': {
		type: CardType.MILITAIRE,
		cost: { [Resources.PIERRE]: 3 },
		prices: { [Resources.ARME]: 2 },
		quantity: [
			{ age: 2, range: [3, 7] }
		]
	},
	'Place d\'armes': {
		type: CardType.MILITAIRE,
		cost: { [Resources.MINERAI]: 2, [Resources.BOIS]: 1 },
		prices: { [Resources.ARME]: 2 },
		quantity: [
			{ age: 2, range: [4, 6, 7] }
		]
	},
	'Ecuries': {
		type: CardType.MILITAIRE,
		cost: { [Resources.MINERAI]: 1, [Resources.ARGILE]: 1, [Resources.BOIS]: 1 },
		prices: { [Resources.ARME]: 2 },
		requires: 'Officine',
		quantity: [
			{ age: 2, range: [3, 5] }
		]
	},
	'Champs de tir': {
		type: CardType.MILITAIRE,
		cost: { [Resources.BOIS]: 2, [Resources.MINERAI]: 1 },
		prices: { [Resources.ARME]: 2 },
		requires: 'Atelier',
		quantity: [
			{ age: 2, range: [3, 6] }
		]
	},
  'Fortifications': {
    type: CardType.MILITAIRE,
    cost: {
      [Resources.MINERAI]: 3,
      [Resources.PIERRE]: 1
    },
    requires: 'Muraille',
    prices: { [Resources.ARME]: 3 },
    quantity: [
      { age: 3, range: [3, 7] }
    ]
  },
	'Cirque': {
		type: CardType.MILITAIRE,
		cost: {
			[Resources.PIERRE]: 3,
			[Resources.MINERAI]: 1
		},
		requires: 'Place d\'armes',
		prices: { [Resources.ARME]: 3 },
		quantity: [
			{ age: 3, range: [4, 5, 6] }
		]
	},
	'Arsenal': {
		type: CardType.MILITAIRE,
		cost: {
			[Resources.MINERAI]: 1,
			[Resources.BOIS]: 2,
			[Resources.TISSU]: 1
		},
		prices: { [Resources.ARME]: 3 },
		quantity: [
			{ age: 3, range: [3, 4, 7] }
		]
	},
	'Atelier de siege': {
		type: CardType.MILITAIRE,
		cost: {
			[Resources.BOIS]: 1,
			[Resources.ARGILE]: 3
		},
		prices: { [Resources.ARME]: 3 },
		requires: 'Laboratoire',
		quantity: [
			{ age: 3, range: [3, 5] }
		]
	}
};

export const ScienceOffices = {
	'Officine': {
		type: CardType.SCIENCE,
		subtype: ScienceType.SEXTAN,
		cost: { [Resources.TISSU]: 1 },
		gains: {},
		quantity: [
			{ age: 1, range: [3, 5] }
		]
	},
	'Atelier': {
		type: CardType.SCIENCE,
		subtype: ScienceType.ROUE,
		cost: { [Resources.VERRE]: 1 },
		gains: {},
		quantity: [
			{ age: 1, range: [3, 7] }
		]
	},
	'Scriptorium': {
		type: CardType.SCIENCE,
		subtype: ScienceType.TABLETTE,
		cost: { [Resources.PAPIER]: 1 },
		gains: {},
		quantity: [
			{ age: 1, range: [3, 4] }
		]
	},
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
	'Laboratoire': {
		type: CardType.MILITAIRE,
		subtype: ScienceType.ROUE,
		cost: {
			[Resources.ARGILE]: 2,
			[Resources.PAPIER]: 1
		},
		requires: 'Atelier',
		gains: {},
		quantity: [
			{ age: 2, range: [3, 5] }
		]
	},
	'Bibliotheque': {
		type: CardType.MILITAIRE,
		subtype: ScienceType.TABLETTE,
		cost: {
			[Resources.PIERRE]: 2,
			[Resources.TISSU]: 1
		},
		requires: 'Scriptorium',
		gains: {},
		quantity: [
			{ age: 2, range: [3, 6] }
		]
	},
	'Ecole': {
		type: CardType.MILITAIRE,
		subtype: ScienceType.TABLETTE,
		cost: {
			[Resources.BOIS]: 1,
			[Resources.PAPIER]: 1
		},
		gains: {},
		quantity: [
			{ age: 2, range: [3, 7] }
		]
	},
	'Loge': {
		type: CardType.SCIENCE,
		subtype: ScienceType.SEXTAN,
		cost: {
			[Resources.ARGILE]: 2,
			[Resources.TISSU]: 1,
			[Resources.PAPIER]: 1
		},
		requires: 'Dispensaire',
		gains: {},
		quantity: [
			{ age: 2, range: [3, 6] }
		]
	},
	'Observatoire': {
		type: CardType.SCIENCE,
		subtype: ScienceType.ROUE,
		cost: {
			[Resources.MINERAI]: 2,
			[Resources.VERRE]: 1,
			[Resources.TISSU]: 1
		},
		requires: 'Laboratoire',
		gains: {},
		quantity: [
			{ age: 2, range: [3, 7] }
		]
	},
	'Universite': {
		type: CardType.SCIENCE,
		subtype: ScienceType.TABLETTE,
		cost: {
			[Resources.BOIS]: 2,
			[Resources.PAPIER]: 1,
			[Resources.VERRE]: 1
		},
		requires: 'Bibliotheque',
		gains: {},
		quantity: [
			{ age: 2, range: [3, 4] }
		]
	},
	'Academie': {
		type: CardType.SCIENCE,
		subtype: ScienceType.SEXTAN,
		cost: {
			[Resources.PIERRE]: 3,
			[Resources.VERRE]: 1
		},
		requires: 'Ecole',
		gains: {},
		quantity: [
			{ age: 3, range: [3, 7] }
		]
	},
	'Etude': {
		type: CardType.SCIENCE,
		subtype: ScienceType.ROUE,
		cost: {
			[Resources.BOIS]: 1,
			[Resources.PAPIER]: 1,
			[Resources.TISSU]: 1
		},
		requires: 'Ecole',
		gains: {},
		quantity: [
			{ age: 3, range: [3, 5] }
		]
	}
};

export const Cards = Object.assign({},
  RawResourcesCards,
  ProcessedResourcesCards,
  CityBuildings,
  TradeCenters,
  WarOffices,
  ScienceOffices
);

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
