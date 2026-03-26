export type EmailTemplateData = {
  key: string;
  subject: string;
  html: string;
  updatedAt?: string | null;
};

export type EmailTemplateResponse = {
  message: string;
  response: { data: EmailTemplateData } | null;
  error: any;
};

const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

function assertBaseUrl() {
  if (!serverBaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_BACKEND_SERVER_URL');
  }
}

export async function getEmailTemplateAdmin(token: string, key: string): Promise<EmailTemplateData> {
  assertBaseUrl();
  const params = new URLSearchParams({ key });
  const res = await fetch(`${serverBaseUrl}/admin/email-template?${params}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  const data: EmailTemplateResponse = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch email template');
  if (!data?.response?.data) throw new Error('Invalid email template response');
  return data.response.data;
}

export async function upsertEmailTemplateAdmin(
  token: string,
  payload: { key: string; subject: string; html: string }
): Promise<EmailTemplateData> {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/admin/email-template`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data: EmailTemplateResponse = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to save email template');
  if (!data?.response?.data) throw new Error('Invalid email template response');
  return data.response.data;
}

export async function subscribeNewsletter(payload: { key?: string; fullName: string; email: string }) {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/user/newsletter/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || 'Failed to subscribe');
  }
  return data;
}
