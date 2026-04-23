import { pgTable, serial, text, integer, boolean, timestamp, date, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const grills = pgTable('grills', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type', { enum: ['chicken', 'kebab', 'both'] }).notNull(),
	active: boolean('active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const packages = pgTable('packages', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type', { enum: ['chicken', 'kebab'] }).notNull(),
	weightKg: integer('weight_kg').notNull(),
	price: integer('price').notNull(), // in cents
	servesMin: integer('serves_min').notNull(),
	servesMax: integer('serves_max').notNull(),
	includes: text('includes').notNull(),
	description: text('description'),
	sortOrder: integer('sort_order').notNull().default(0),
	active: boolean('active').notNull().default(true)
});

export const extras = pgTable('extras', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	category: text('category', { enum: ['sauce', 'equipment', 'other'] }).notNull(),
	unit: text('unit').notNull(), // 'liter', 'stuk'
	pricePerUnit: integer('price_per_unit').notNull(),
	description: text('description'),
	active: boolean('active').notNull().default(true)
});

export const bookings = pgTable(
	'bookings',
	{
		id: serial('id').primaryKey(),
		reference: text('reference').notNull().unique(),
		grillId: integer('grill_id').references(() => grills.id),
		packageId: integer('package_id')
			.references(() => packages.id)
			.notNull(),
		rentalDate: date('rental_date').notNull(), // ISO date "2026-05-15"

		// Customer
		customerName: text('customer_name').notNull(),
		customerEmail: text('customer_email').notNull(),
		customerPhone: text('customer_phone').notNull(),
		customerAddress: text('customer_address'),
		customerCity: text('customer_city'),
		eventType: text('event_type'),
		guestCount: integer('guest_count'),
		notes: text('notes'),

		// Consent
		acceptedTerms: boolean('accepted_terms').notNull().default(false),
		acceptedPrivacy: boolean('accepted_privacy').notNull().default(false),

		// Pricing (in cents)
		packagePrice: integer('package_price').notNull(),
		extrasTotal: integer('extras_total').notNull().default(0),
		deposit: integer('deposit').notNull().default(25000),
		totalAmount: integer('total_amount').notNull(),

		// Payment
		stripeSessionId: text('stripe_session_id'),
		stripePaymentIntentId: text('stripe_payment_intent_id'),
		paymentStatus: text('payment_status', {
			enum: ['pending', 'paid', 'refunded', 'failed']
		})
			.notNull()
			.default('pending'),
		depositRefunded: boolean('deposit_refunded').notNull().default(false),

		// Status
		status: text('status', {
			enum: ['pending', 'reserved', 'confirmed', 'picked_up', 'returned', 'completed', 'cancelled', 'payment_failed']
		})
			.notNull()
			.default('pending'),
		cleanedOnReturn: boolean('cleaned_on_return'),

		// Email tracking (idempotency)
		confirmationEmailSentAt: timestamp('confirmation_email_sent_at', { withTimezone: true }),
		pickupReminderSentAt: timestamp('pickup_reminder_sent_at', { withTimezone: true }),
		returnReminderSentAt: timestamp('return_reminder_sent_at', { withTimezone: true }),

		// Reservation TTL (pending bookings expire after 30 min)
		reservedUntil: timestamp('reserved_until', { withTimezone: true }),

		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
	},
	(t) => ({
		rentalDateIdx: index('bookings_rental_date_idx').on(t.rentalDate),
		statusIdx: index('bookings_status_idx').on(t.status),
		sessionIdx: uniqueIndex('bookings_stripe_session_idx').on(t.stripeSessionId)
	})
);

export const bookingExtras = pgTable('booking_extras', {
	id: serial('id').primaryKey(),
	bookingId: integer('booking_id')
		.references(() => bookings.id, { onDelete: 'cascade' })
		.notNull(),
	extraId: integer('extra_id')
		.references(() => extras.id)
		.notNull(),
	quantity: integer('quantity').notNull(),
	unitPrice: integer('unit_price').notNull() // snapshot at booking time
});

export const blockedDates = pgTable(
	'blocked_dates',
	{
		id: serial('id').primaryKey(),
		date: date('date').notNull(),
		grillId: integer('grill_id').references(() => grills.id), // null = all grills
		reason: text('reason')
	},
	(t) => ({
		dateIdx: index('blocked_dates_date_idx').on(t.date)
	})
);

export const adminUsers = pgTable('admin_users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	adminUserId: integer('admin_user_id')
		.references(() => adminUsers.id, { onDelete: 'cascade' })
		.notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Stripe webhook event log (idempotency)
export const stripeEvents = pgTable('stripe_events', {
	id: text('id').primaryKey(), // Stripe event ID
	type: text('type').notNull(),
	processedAt: timestamp('processed_at', { withTimezone: true }).defaultNow()
});

// Contact form messages
export const contactMessages = pgTable(
	'contact_messages',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull(),
		phone: text('phone'),
		subject: text('subject'),
		message: text('message').notNull(),
		status: text('status', { enum: ['new', 'read', 'replied', 'archived'] })
			.notNull()
			.default('new'),
		adminNotes: text('admin_notes'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
	},
	(t) => ({
		statusIdx: index('contact_messages_status_idx').on(t.status)
	})
);

// FAQ items (admin-editable)
export const faqItems = pgTable('faq_items', {
	id: serial('id').primaryKey(),
	question: text('question').notNull(),
	answer: text('answer').notNull(),
	sortOrder: integer('sort_order').notNull().default(0),
	active: boolean('active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// Password reset tokens
export const passwordResets = pgTable('password_resets', {
	id: serial('id').primaryKey(),
	adminUserId: integer('admin_user_id')
		.references(() => adminUsers.id, { onDelete: 'cascade' })
		.notNull(),
	token: text('token').notNull().unique(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	usedAt: timestamp('used_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Business config (admin-editable)
export const appConfig = pgTable('app_config', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	description: text('description'),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});
