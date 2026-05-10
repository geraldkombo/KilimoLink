import { Injectable } from '@nestjs/common';
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

type GcmCiphertext = {
  ivB64: string;
  tagB64: string;
  dataB64: string;
};

@Injectable()
export class CryptoService {
  private readonly masterKey: Buffer;

  constructor() {
    const raw = process.env.DOCUMENTS_MASTER_KEY_BASE64 || '';
    const buf = Buffer.from(raw, 'base64');
    if (buf.length !== 32) {
      throw new Error('DOCUMENTS_MASTER_KEY_BASE64 must be a base64-encoded 32-byte key');
    }
    this.masterKey = buf;
  }

  encryptAes256Gcm(plaintext: Buffer, key: Buffer = this.masterKey): GcmCiphertext {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
      ivB64: iv.toString('base64'),
      tagB64: tag.toString('base64'),
      dataB64: enc.toString('base64')
    };
  }

  decryptAes256Gcm(ciphertext: GcmCiphertext, key: Buffer = this.masterKey): Buffer {
    const iv = Buffer.from(ciphertext.ivB64, 'base64');
    const tag = Buffer.from(ciphertext.tagB64, 'base64');
    const data = Buffer.from(ciphertext.dataB64, 'base64');
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }

  generateDataKey(): Buffer {
    return randomBytes(32);
  }

  wrapKey(dataKey: Buffer): string {
    const wrapped = this.encryptAes256Gcm(dataKey, this.masterKey);
    return Buffer.from(JSON.stringify(wrapped), 'utf-8').toString('base64');
  }

  unwrapKey(wrappedKeyB64: string): Buffer {
    const raw = Buffer.from(wrappedKeyB64, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw) as GcmCiphertext;
    return this.decryptAes256Gcm(parsed, this.masterKey);
  }

  encryptString(plaintext: string): string {
    const enc = this.encryptAes256Gcm(Buffer.from(plaintext, 'utf-8'), this.masterKey);
    return Buffer.from(JSON.stringify(enc), 'utf-8').toString('base64');
  }

  decryptString(ciphertextB64: string): string {
    const raw = Buffer.from(ciphertextB64, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw) as GcmCiphertext;
    return this.decryptAes256Gcm(parsed, this.masterKey).toString('utf-8');
  }
}
