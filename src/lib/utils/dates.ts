export function formatDateNL(isoDate: string): string {
	const d = new Date(isoDate + 'T00:00:00');
	return d.toLocaleDateString('nl-BE', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}

export function formatDateShort(isoDate: string): string {
	const d = new Date(isoDate + 'T00:00:00');
	return d.toLocaleDateString('nl-BE', {
		day: 'numeric',
		month: 'short'
	});
}

export function toISODate(date: Date): string {
	return date.toISOString().split('T')[0];
}

export function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
	// 0=Sunday, adjust to Monday=0
	const day = new Date(year, month, 1).getDay();
	return day === 0 ? 6 : day - 1;
}

export const MONTH_NAMES = [
	'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
	'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
];

export const DAY_NAMES = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
