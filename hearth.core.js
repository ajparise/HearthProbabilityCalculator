// Card Rarity
class CardRarity {
	constructor() {
		this.name = '';
		this.value = 0;
		this.isRare = false;
	}
}

// Decorator for adding functionality
class CardRarityDecorator extends CardRarity {
	constructor(card) {
		super();
		this.card = card;
	}
}

// Rarity Functionality - weird combination of chaining and decorator
class RarityEvaluator extends CardRarityDecorator {
	constructor(card, limit, rarityName, rarityValue) {
		super(card);
		this.limit = limit;
		this.rg = null;
		this.rarityName = rarityName;
		this.rarityValue = rarityValue;
	}

	SetNext(rg) {
		this.rg = rg;
		return this.rg;
	}

	Next() {
		return this.rg;
	}

	Generate(value) {
		if (!this.Next() || (this.rg.limit > this.limit && value <= this.limit)) {
			this.card.name = this.rarityName;
			this.card.value = this.rarityValue;
		} else {
			this.Next().Generate(value);
		}
	}
}

class CommonRarity extends RarityEvaluator {
	constructor(card) {
		super(card, 70.36, "Common", 0)
	}
}

class GoldCommonRarity extends RarityEvaluator {
	constructor(card) {
		super(card, 70.36 + 1.49, "Gold Common", 1)
	}
}

class RareRarity extends RarityEvaluator {
	constructor(card) {
		super(card, 70.36 + 1.49 + 21.6, "Rare", 2);
	}

	// Rare at this level and beyoooooond
	Generate(value) {
		this.card.isRare = true;
		super.Generate(value);
	}
}

class GoldRareRarity extends RarityEvaluator {
	constructor(card) {
		super(card, 70.36 + 1.49 + 21.6 + 1.27, "Gold Rare", 3)
	}
}

class EpicRarity extends RarityEvaluator {
	constructor(card) {
		super(card, 70.36 + 1.49 + 21.6 + 1.27 + 4.08, "Epic", 4)
	}
}

class GoldEpicRarity extends RarityEvaluator {
	constructor(card) {
		super(card, 70.36 + 1.49 + 21.6 + 1.27 + 4.08 + .19, "Gold Epic", 5)
	}
}

class LegendaryRarity extends RarityEvaluator {
	constructor(card) {
		super(card, 70.36 + 1.49 + 21.6 + 1.27 + 4.08 + .19 + .94, "Legendary", 6)
	}
}

class GoldLegendaryRarity extends RarityEvaluator {
	constructor(card) {
		super(card, 70.36 + 1.49 + 21.6 + 1.27 + 4.08 + .19 + .94 + .07, "Gold Legendary", 7)
	}
}

class Pack {
	constructor(generator) {
		this.cards = [];
		this.seed = function () {
			return Number((Math.random() * 100).toFixed(2));
		}
		this.generator = generator;
		for (var i = 0; i < 5; i++) {
			this.cards.push(this.generateCard());
		}
	}

	generateCard() {
		var card = new CardRarity();
		this.generator(card).Generate(this.seed());
		return card;
	}
}

// Card countin' machine
class PackCardCounter {
	constructor(packs) {
		this.packs = packs;
		this.reducefn = function (agr, card) {
			if (card.name in agr) {
				agr[card.name].count++;
			} else {
				agr[card.name] = {
					'value': card.value,
					'count': 1
				};
			}
			return agr;
		};
	}

	CountTypes() {
		var allPacks = Array.isArray(this.packs) ? this.packs.reduce(function (arr, value) {
			return arr.concat(value.cards);
		}, []) : this.packs.cards;

		return allPacks.sort(function (a, b) {
			return a.value - b.value;
		}).reduce(this.reducefn, []); // do some voodoo
	}
}

class PackValidator {
	constructor(match, predicate) {
		this.match = match;
		this.predicate = predicate;
	}

	Ensure(pack) {
		if (!this.match(pack)) {
			this.predicate(pack);
			if (this.match(pack))
				return pack;
			else
				throw Error("Unable to ensure " + this.constructor.name);
		}

		return pack;
	}
}

class AtLeastOneRare extends PackValidator {
	constructor() {
		super(function (pack) {
				return pack.cards.find(function (value) {
					return value.isRare
				}) || false;
			},
			function (pack) {
				var card;
				do {
					card = pack.generateCard();
				} while (!card.isRare);

				pack.cards.splice(pack.cards.length - 1);
				pack.cards.push(card);
			});
	}
}