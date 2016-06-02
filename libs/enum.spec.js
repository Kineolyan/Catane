import { makeEnum, makeMaskEnum } from 'libs/enum';

describe('makeEnum', function() {
	beforeEach(function () {
		this.enum = makeEnum(['A', 'B']);
	});

	it('has all defined enum values', function () {
		expect(this.enum.A).toEqual(0);
		expect(this.enum.B).toEqual(1);
	});

	it('has all values redirecting to enum values', function () {
		expect(this.enum[0]).toEqual('A');
		expect(this.enum[1]).toEqual('B');
	});
});

describe('makeMaskEnum', function() {
	beforeEach(function () {
		this.enum = makeMaskEnum(['A', 'B', 'C', 'D']);
	});

	it('has all defined enum values', function () {
		expect(this.enum.A).toEqual(1);
		expect(this.enum.B).toEqual(2);
		expect(this.enum.C).toEqual(4);
		expect(this.enum.D).toEqual(8);
	});

	it('has all values redirecting to enum values', function () {
		expect(this.enum[1]).toEqual('A');
		expect(this.enum[2]).toEqual('B');
		expect(this.enum[4]).toEqual('C');
		expect(this.enum[8]).toEqual('D');
	});

	describe('#isValue', function () {
		it('decides if a value matches an enum', function () {
			expect(this.enum.isValue(4)).toEqual(true);
			expect(this.enum.isValue(5)).toEqual(false);
		});
	});

	describe('#decompose', function () {
		it('can extract merged values', function () {
			expect(this.enum.decompose(this.enum.A | this.enum.D)).toHaveMembers([this.enum.A, this.enum.D]);
		});
	});
});