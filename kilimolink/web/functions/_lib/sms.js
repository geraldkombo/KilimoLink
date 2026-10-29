// Africa's Talking SMS via REST (the africastalking npm SDK does not run in Workers).
// Configured by env/secrets AT_USERNAME + AT_API_KEY; returns null when unconfigured
// so callers can fall back to the dev-code path (mirrors bei/src/sms.js dry-run).
export async function sendSms(env, phone, message) {
  const username = env.AT_USERNAME;
  const apiKey = env.AT_API_KEY;
  if (!username || !apiKey) return null;
  try {
    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({ username, to: phone, message }),
    });
    const data = await res.json().catch(() => ({}));
    const status = data?.SMSMessageData?.Recipients?.[0]?.status;
    if (!res.ok || (status !== 'success' && status !== 101)) {
      console.error('AT SMS failed', res.status, JSON.stringify(data).slice(0, 300));
      return { status: 'error', detail: status || res.status };
    }
    return { status: 'sent' };
  } catch (e) {
    console.error('AT SMS error', e.message);
    return { status: 'error', detail: e.message };
  }
}
