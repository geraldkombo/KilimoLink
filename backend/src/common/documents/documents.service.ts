import { Injectable } from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { PassThrough } from 'node:stream';
import { join } from 'node:path';
import { createDecipheriv, randomBytes } from 'node:crypto';
import { CryptoService } from '../crypto/crypto.service';

export type StoredEncryptedFile = {
  storagePath: string;
  aesIvB64: string;
  aesAuthTagB64: string;
  wrappedKeyB64: string;
  sizeBytes: number;
};

@Injectable()
export class DocumentsService {
  constructor(private readonly crypto: CryptoService) {}

  private async ensureDir(dir: string) {
    await mkdir(dir, { recursive: true });
  }

  async encryptAndStore(original: Buffer): Promise<StoredEncryptedFile> {
    const docsDir = process.env.DOCUMENTS_DIR || join(process.cwd(), 'data', 'documents');
    await this.ensureDir(docsDir);

    const dataKey = this.crypto.generateDataKey();
    const wrappedKeyB64 = this.crypto.wrapKey(dataKey);
    const encrypted = this.crypto.encryptAes256Gcm(original, dataKey);

    const id = randomBytes(12).toString('hex');
    const storagePath = join(docsDir, `${id}.bin`);
    await writeFile(storagePath, Buffer.from(encrypted.dataB64, 'base64'));

    return {
      storagePath,
      aesIvB64: encrypted.ivB64,
      aesAuthTagB64: encrypted.tagB64,
      wrappedKeyB64,
      sizeBytes: original.byteLength
    };
  }

  decryptToStream(input: { storagePath: string; aesIvB64: string; aesAuthTagB64: string; wrappedKeyB64: string }) {
    const dataKey = this.crypto.unwrapKey(input.wrappedKeyB64);
    const iv = Buffer.from(input.aesIvB64, 'base64');
    const tag = Buffer.from(input.aesAuthTagB64, 'base64');
    const decipher = createDecipheriv('aes-256-gcm', dataKey, iv);
    decipher.setAuthTag(tag);
    const out = new PassThrough();
    createReadStream(input.storagePath).pipe(decipher).pipe(out);
    return out;
  }
}
