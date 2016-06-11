export function takeFirstDefined(...values) {
	for (const value of values) {
		if (value !== undefined) {
			return value;
		}
	}
	return undefined;
}