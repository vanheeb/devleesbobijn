import type { InferSelectModel } from 'drizzle-orm';
import type { bookings } from './db/schema';
import { Resend } from 'resend';
import { env } from './env';
import { businessConfig, pricingConfig, formatPrice } from '$lib/config';

type Booking = InferSelectModel<typeof bookings>;

const resend = new Resend(env.RESEND_API_KEY);

async function send(payload: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
	try {
		const result = await resend.emails.send({
			from: env.RESEND_FROM,
			to: payload.to,
			subject: payload.subject,
			html: payload.html,
			replyTo: payload.replyTo
		});
		if (result.error) {
			console.error('Resend error:', result.error);
		}
		return result;
	} catch (err) {
		console.error('Email send failed:', err);
		throw err;
	}
}

// --- Shared HTML layout ----------------------------------------------------

function layout(inner: string, opts: { title: string; preview?: string } = { title: '' }): string {
	const preview = opts.preview
		? `<div style="display:none;max-height:0;overflow:hidden;">${opts.preview}</div>`
		: '';
	return `<!DOCTYPE html>
<html lang="nl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${opts.title}</title></head>
<body style="margin:0;padding:0;background:#FFFDF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a2e;">
${preview}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFDF7;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #f0e8f5;">
<tr><td style="background:#7B2D8E;padding:24px;text-align:center;">
<h1 style="margin:0;color:#F5D06E;font-size:24px;font-weight:800;letter-spacing:0.5px;">DE VLEESBOBIJN</h1>
<p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">${businessConfig.tagline}</p>
</td></tr>
<tr><td style="padding:32px 28px;font-size:15px;line-height:1.6;">
${inner}
</td></tr>
<tr><td style="background:#1a1a2e;padding:20px 28px;color:rgba(255,255,255,0.7);font-size:12px;text-align:center;">
<p style="margin:0 0 4px;"><strong style="color:#F5D06E;">${businessConfig.name}</strong></p>
<p style="margin:0;">${businessConfig.address.full} &bull; ${businessConfig.phone}</p>
<p style="margin:8px 0 0;">${businessConfig.vatStatus}</p>
</td></tr>
</table>
</td></tr></table></body></html>`;
}

function formatDate(isoDate: string): string {
	const d = new Date(isoDate + 'T00:00:00');
	return d.toLocaleDateString('nl-BE', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}

// --- Templates -------------------------------------------------------------

export async function sendBookingConfirmation(booking: Booking) {
	const html = layout(
		`
<h2 style="margin:0 0 16px;color:#7B2D8E;">Bedankt voor je boeking, ${booking.customerName}!</h2>
<p>We hebben je reservering ontvangen en het voorschot is betaald. Hieronder vind je alle details.</p>

<div style="background:#FFF8E7;border-radius:8px;padding:16px 20px;margin:20px 0;">
<p style="margin:0 0 8px;"><strong>Referentie:</strong> ${booking.reference}</p>
<p style="margin:0 0 8px;"><strong>Datum:</strong> ${formatDate(booking.rentalDate)}</p>
<p style="margin:0;"><strong>Totaal betaald:</strong> ${formatPrice(booking.totalAmount)}</p>
</div>

<h3 style="color:#7B2D8E;margin:24px 0 8px;">📍 Ophaaladres</h3>
<p style="margin:0;">${businessConfig.address.full}</p>

<h3 style="color:#7B2D8E;margin:24px 0 8px;">⚠️ Belangrijk</h3>
<ul style="padding-left:20px;margin:0;">
<li>Breng het toestel <strong>proper gereinigd</strong> terug voor terugstorting van de waarborg (${formatPrice(pricingConfig.depositCents)}).</li>
<li>Reinigingskost ${formatPrice(pricingConfig.cleaningFeeCents)} indien het toestel niet gereinigd wordt teruggebracht.</li>
<li>Vergeet je verse groenten niet!</li>
</ul>

<p style="margin:24px 0 0;">Vragen? Bel ons op <a href="tel:${businessConfig.phone}" style="color:#7B2D8E;">${businessConfig.phone}</a>.</p>
<p style="margin:16px 0 0;">Smakelijk feest!<br/><em>Team de vleesbobijn</em></p>
`,
		{ title: `Bevestiging - ${booking.reference}`, preview: `Je boeking ${booking.reference} is bevestigd.` }
	);

	await send({
		to: booking.customerEmail,
		subject: `✅ Bevestiging - de vleesbobijn #${booking.reference}`,
		html
	});

	// Notify admin
	await send({
		to: env.ADMIN_EMAIL,
		subject: `🎉 Nieuwe boeking ${booking.reference}`,
		html: layout(
			`<h2 style="margin:0 0 16px;color:#7B2D8E;">Nieuwe bevestigde boeking</h2>
<p><strong>${booking.customerName}</strong> heeft ${booking.reference} geboekt voor ${formatDate(booking.rentalDate)}.</p>
<p>Telefoon: ${booking.customerPhone}<br/>E-mail: ${booking.customerEmail}</p>
<p>Totaal betaald: ${formatPrice(booking.totalAmount)}.</p>
<p><a href="${env.PUBLIC_SITE_URL}/admin/boekingen/${booking.id}" style="color:#7B2D8E;">Bekijk boeking in admin</a></p>`,
			{ title: `Nieuwe boeking ${booking.reference}` }
		)
	});
}

export async function sendPickupReminder(booking: Booking) {
	const html = layout(
		`<h2 style="margin:0 0 16px;color:#7B2D8E;">Over 3 dagen is het zover!</h2>
<p>Dag ${booking.customerName},</p>
<p>Een kleine herinnering dat je boeking <strong>${booking.reference}</strong> op <strong>${formatDate(booking.rentalDate)}</strong> gepland staat.</p>
<p>Je kan de grill ophalen op:<br/><strong>${businessConfig.address.full}</strong></p>
<p>Vergeet je verse groenten niet mee te nemen vóór het feest!</p>
<p>Tot dan,<br/><em>Team de vleesbobijn</em></p>`,
		{ title: `Herinnering - ${booking.reference}` }
	);
	await send({
		to: booking.customerEmail,
		subject: `🔔 Herinnering - Je grill wacht op je!`,
		html
	});
}

export async function sendReturnReminder(booking: Booking) {
	const html = layout(
		`<h2 style="margin:0 0 16px;color:#7B2D8E;">Vergeet niet de grill terug te brengen</h2>
<p>Dag ${booking.customerName},</p>
<p>We hopen dat je feest een succes was! Vergeet niet de grill <strong>proper gereinigd</strong> terug te brengen naar ${businessConfig.address.full}.</p>
<p>Dan storten we je waarborg van ${formatPrice(pricingConfig.depositCents)} snel terug.</p>
<p>Bedankt!<br/><em>Team de vleesbobijn</em></p>`,
		{ title: `Teruggave - ${booking.reference}` }
	);
	await send({
		to: booking.customerEmail,
		subject: `🔄 Vergeet niet: grill terugbrengen`,
		html
	});
}

// --- Contact form ----------------------------------------------------------

type ContactPayload = {
	name: string;
	email: string;
	phone?: string | null;
	subject?: string | null;
	message: string;
};

export async function sendContactNotification(payload: ContactPayload) {
	const html = layout(
		`<h2 style="margin:0 0 16px;color:#7B2D8E;">Nieuw contactbericht</h2>
<p><strong>${payload.name}</strong> heeft een bericht gestuurd via het contactformulier.</p>
<p><strong>E-mail:</strong> ${payload.email}<br/>
${payload.phone ? `<strong>Telefoon:</strong> ${payload.phone}<br/>` : ''}
${payload.subject ? `<strong>Onderwerp:</strong> ${payload.subject}<br/>` : ''}
</p>
<div style="background:#FFF8E7;border-radius:8px;padding:16px 20px;margin:20px 0;white-space:pre-wrap;">${escapeHtml(payload.message)}</div>`,
		{ title: 'Nieuw contactbericht' }
	);
	await send({
		to: env.ADMIN_EMAIL,
		subject: `📩 Contact: ${payload.subject || payload.name}`,
		html,
		replyTo: payload.email
	});
}

export async function sendContactAutoReply(payload: { name: string; email: string }) {
	const html = layout(
		`<h2 style="margin:0 0 16px;color:#7B2D8E;">Bedankt voor je bericht, ${payload.name}!</h2>
<p>We hebben je bericht goed ontvangen en nemen binnen 24 uur contact met je op.</p>
<p>Moet het dringender? Bel ons gerust op <a href="tel:${businessConfig.phone}" style="color:#7B2D8E;">${businessConfig.phone}</a>.</p>
<p>Tot snel,<br/><em>Team de vleesbobijn</em></p>`,
		{ title: 'We hebben je bericht ontvangen' }
	);
	await send({
		to: payload.email,
		subject: `Bedankt voor je bericht - de vleesbobijn`,
		html
	});
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
