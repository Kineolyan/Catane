import DiscountEffect from 'server/sewen/elements/effects/DiscountEffect';

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
			const [effectName, parameters] = EffectRegistry.PARAMETER_EXPR.match(name);
			const EffectClass = this.safeGet(effectName);
			return new EffectClass(...parameters.split(/\s*,/));
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