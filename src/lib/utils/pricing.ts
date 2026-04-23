export function formatPrice(cents: number): string {
	return `€${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export function formatPriceShort(cents: number): string {
	const euros = cents / 100;
	if (euros % 1 === 0) return `€${euros}`;
	return `€${euros.toFixed(2).replace('.', ',')}`;
}
