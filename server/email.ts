import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail
  };
}

export async function sendInquiryNotification(inquiry: {
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  packageType?: string | null;
  quantity?: string | null;
  message: string;
}) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();

    const htmlContent = `
      <h2>Novi upit sa Brain Box sajta</h2>
      <p><strong>Ime:</strong> ${inquiry.name}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Telefon:</strong> ${inquiry.phone}</p>
      ${inquiry.company ? `<p><strong>Kompanija:</strong> ${inquiry.company}</p>` : ''}
      ${inquiry.packageType ? `<p><strong>Tip paketa:</strong> ${inquiry.packageType}</p>` : ''}
      ${inquiry.quantity ? `<p><strong>Količina:</strong> ${inquiry.quantity}</p>` : ''}
      <p><strong>Poruka:</strong></p>
      <p>${inquiry.message}</p>
    `;

    await client.emails.send({
      from: fromEmail,
      to: fromEmail, // Send to admin email (from_email configured in Resend)
      subject: `Novi upit - ${inquiry.name}`,
      html: htmlContent,
    });

    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw error - inquiry should still be saved even if email fails
  }
}
