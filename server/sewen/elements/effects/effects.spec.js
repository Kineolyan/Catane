import { EffectRegistry, effects } from 'server/sewen/elements/effects/effects';

describe('Sewen effects', function () {

	describe('EffectRegistry', function () {
		beforeEach(function () {
			this.registry = new EffectRegistry();
		});

		describe('#constructor', function () {
			it('has no registered effects', function () {
				expect(this.registry._effects).toBeEmpty();
			});
		});

		describe('#registerEffect', function () {
			it('records new effects', function () {
				this.registry.registerEffect({ name: 'e1' });
				this.registry.registerEffect({ name: 'e2' });

				expect(Array.from(this.registry._effects.keys())).toHaveMembers(['e1', 'e2']);
			});
		});

		describe('#get', function () {
			describe('for simple effects', function () {
				beforeEach(function () {
					this.effect = { name: 'e' };
					this.registry.registerEffect(this.effect);
				});

				it('returns the registered effect', function () {
					expect(this.registry.get(this.effect.name)).toBe(this.effect);
				});
			});

			describe('for parametric effects', function () {
				class Effect {
					static get name() {
						return 'e';
					}

					constructor(...args) {
						this.args = args;
					}
				}

				beforeEach(function () {
					this.registry.registerEffect(Effect);
					this.effect = this.registry.get('e[1, a]');
				});

				it('creates an instance of the effect', function () {
					expect(this.effect).toBeA(Effect);
				});

				it('initializes the effect with name parameters', function () {
					expect(this.effect.args).toEqual(['1', 'a']);
				});
			});
		});
	});

	it('has predefined effects', function() {
		const effectNames = Array.from(effects._effects.keys());
		expect(effectNames).toHaveMembers([
			'discount',
			'bonus-science',
			'scoreAndCoins',
			'wonder',
			'defeats'
		]);
	});

});