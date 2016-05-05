export function idGenerator() {
	var id = 0;
	return function() {
		id += 1;
		return id;
	};
}