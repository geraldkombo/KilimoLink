import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationTransportService {
  async sendSms(phone: string, message: string) {
    const apiKey = process.env.TEXTBEE_API_KEY;
    const sender = process.env.TEXTBEE_SENDER_ID;
    if (!apiKey || !sender) return { ok: true, skipped: true };

    const res = await fetch('https://api.textbee.dev/sms/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ sender, recipient: phone, message })
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, error: `TextBee error: ${res.status} ${body}` };
    }
    return { ok: true };
  }

  async sendPush(externalUserId: string, title: string, body: string) {
    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_API_KEY;
    if (!appId || !apiKey) return { ok: true, skipped: true };

    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Basic ${apiKey}`
      },
      body: JSON.stringify({
        app_id: appId,
        include_external_user_ids: [externalUserId],
        headings: { en: title },
        contents: { en: body }
      })
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      return { ok: false, error: `OneSignal error: ${res.status} ${txt}` };
    }
    return { ok: true };
  }
}

