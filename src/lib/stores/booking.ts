import { writable } from 'svelte/store';

export interface BookingExtra {
	extraId: number;
	name: string;
	quantity: number;
	unitPrice: number;
	unit: string;
}

export interface BookingState {
	step: number;
	packageId: number | null;
	packageName: string;
	packagePrice: number;
	rentalDate: string;
	extras: BookingExtra[];
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	customerAddress: string;
	customerCity: string;
	eventType: string;
	guestCount: number | null;
	notes: string;
}

const initial: BookingState = {
	step: 1,
	packageId: null,
	packageName: '',
	packagePrice: 0,
	rentalDate: '',
	extras: [],
	customerName: '',
	customerEmail: '',
	customerPhone: '',
	customerAddress: '',
	customerCity: '',
	eventType: '',
	guestCount: null,
	notes: ''
};

export const bookingStore = writable<BookingState>({ ...initial });

export function resetBooking() {
	bookingStore.set({ ...initial });
}

export function getExtrasTotal(extras: BookingExtra[]): number {
	return extras.reduce((sum, e) => sum + e.quantity * e.unitPrice, 0);
}
