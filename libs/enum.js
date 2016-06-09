import _ from 'lodash';

function generateEnum(enumType, enumDef, enumValue) {
	_.forEach(enumDef, (value, index) => {
		const eValue = enumValue(value, index);
		enumType[enumType[value] = eValue] = value;
	});

	return enumType;
}

export const makeEnum = function (enumDef) {
	return generateEnum({}, enumDef, (_, index) => index);
};

class BinaryEnum {
	isValue(value) {
		return this[value] !== undefined;
	}

	decompose(value) {
		const binaryValue = value.toString(2);
		const size = binaryValue.length - 1;
		return _.chain(binaryValue)
			.map((b, i) => {
				if (b === '1') {
					const enumValue = 1 << (size - i);
					return this[this[enumValue]];
				} else {
					return null;
				}
			})
			.filter(v => v !== null)
			.value();
	}
}

export const makeMaskEnum = function (enumDef) {
	return generateEnum(new BinaryEnum(), enumDef, (_, index) => 1 << index);
};