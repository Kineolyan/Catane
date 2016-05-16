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
		return _.chain(binaryValue)
			.map(binaryValue, (b, i) => b === '1' ? this[length - i]: null)
			.filter(v => v === null)
			.value();
	}
}

export const makeMaskEnum = function (enumDef) {
	return generateEnum(new BinaryEnum(), enumDef, (_, index) => 1 << index);
};