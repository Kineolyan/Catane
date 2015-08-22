import LocalStorage from 'client/js/components/libs/localStorage';

describe('LocalStorage', function() {
	beforeAll(function() {
		this.localStorage = new LocalStorage();
		this._storage = global.window.localStorage;
	});

	describe('#get', function() {
		beforeEach(function() {
			this._storage.key = JSON.stringify('value');
			this._storage.obj = JSON.stringify({ id: 1 });
		});

		afterEach(function() {
			this._storage.removeItem('key');
			this._storage.removeItem('obj');
		});

		it('can read value', function() {
			expect(this.localStorage.get('key')).toEqual('value');
		});

		it('can read objects', function() {
			expect(this.localStorage.get('obj')).toEqual({ id: 1 });
		});
	});

	describe('#set', function() {
		afterEach(function() {
			this._storage.removeItem('key');
			this._storage.removeItem('obj');
		});

		it('can write value', function() {
			this.localStorage.set('key', 'value');
			expect(this._storage.key).toEqual('"value"');
		});

		it('can write objects', function() {
			this.localStorage.set('obj', { id: 1 });
			expect(this._storage.obj).toMatch(/\{ *"id" *: *1 *\}/);
		});
	});

	describe('#remove', function() {
		beforeEach(function() {
			this._storage.key = JSON.stringify('value');
		});

		afterEach(function() {
			this._storage.removeItem('key');
		});

		it('removes existing values', function() {
			this.localStorage.remove('key');
			expect(this._storage.key).toBeUndefined();
		});

		it('supports removing unexisting entries', function() {
			this.localStorage.remove('obj');
		});
	});
});