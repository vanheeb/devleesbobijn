declare global {
	namespace App {
		interface Locals {
			admin?: {
				id: number;
				name: string;
				email: string;
			};
		}
	}
}

export {};
