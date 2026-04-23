import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
	from: process.env.RESEND_FROM!,
	to: 'brecht.vanhee@gmail.com',
	subject: 'Test e-mail - De Vleesbobijn',
	html: `
		<h2>Test e-mail werkt!</h2>
		<p>Als je dit ziet, is Resend correct geconfigureerd voor <strong>devleesbobijn.be</strong>.</p>
		<p>Boeking VB-2026-TEST zou er zo uitzien.</p>
	`
});

if (result.error) {
	console.error('Fout:', result.error);
} else {
	console.log('Verstuurd! ID:', result.data?.id);
}
