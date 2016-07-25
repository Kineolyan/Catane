import DiscountEffect from 'server/sewen/elements/effects/DiscountEffect';
import ScienceBonusEffect from 'server/sewen/elements/effects/ScienceBonusEffect';
import ScoreAndCoins from 'server/sewen/elements/effects/ScoreAndCoinsEffect';
import WonderEffect from 'server/sewen/elements/effects/WonderEffect';
import DefeatsEffect from 'server/sewen/elements/effects/DefeatsEffect';

export class EffectRegistry {
	static get PARAMETER_EXPR() {
		return /([\w\-]+)\[(.+)]/;
	}

	constructor() {
		this._effects = new Map();
	}

	registerEffect(effect) {
		this._effects.set(effect.name, effect);
	}

	get(name) {
		if (!this.isParametric(name)) {
			return this.safeGet(name);
		} else {
			const [, effectName, parameters] = EffectRegistry.PARAMETER_EXPR.exec(name);
			const EffectClass = this.safeGet(effectName);
			return new EffectClass(...parameters.split(/\s*,\s*/));
		}
	}

	safeGet(name) {
		const effect = this._effects.get(name);
		if (effect !== undefined) {
			return effect;
		} else {
			throw new RangeError(`Effect ${name} does not exist`);
		}
	}

	isParametric(name) {
		return EffectRegistry.PARAMETER_EXPR.test(name);
	}
}

export const effects = new EffectRegistry();
effects.registerEffect(DiscountEffect);
effects.registerEffect(ScienceBonusEffect);
effects.registerEffect(ScoreAndCoins);
effects.registerEffect(WonderEffect);
effects.registerEffect(DefeatsEffect);