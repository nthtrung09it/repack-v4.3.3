import { SupabaseClient } from '@supabase/supabase-js';
import { decode as decodeBase64 } from 'base64-arraybuffer';
import RNFS from 'react-native-fs';
import { AppConfig } from '../supabase/AppConfig';
import { StorageAdapter } from '@powersync/attachments';

export interface SupabaseStorageAdapterOptions {
  client: SupabaseClient;
}

export class SupabaseStorageAdapter implements StorageAdapter {
  constructor(private options: SupabaseStorageAdapterOptions) {}

  async uploadFile(
    filename: string,
    data: ArrayBuffer,
    options?: {
      mediaType?: string;
    }
  ): Promise<void> {
    if (!AppConfig.supabaseBucket) {
      throw new Error('Supabase bucket not configured in AppConfig.ts');
    }

    const { mediaType = 'text/plain' } = options ?? {};

    const res = await this.options.client.storage
      .from(AppConfig.supabaseBucket)
      .upload(filename, data, { contentType: mediaType });

    if (res.error) {
      throw res.error;
    }
  }

  async downloadFile(filePath: string) {
    if (!AppConfig.supabaseBucket) {
      throw new Error('Supabase bucket not configured in AppConfig.ts');
    }
    const { data, error } = await this.options.client.storage.from(AppConfig.supabaseBucket).download(filePath);
    if (error) {
      throw error;
    }

    return data as Blob;
  }

  async writeFile(
    fileURI: string,
    base64Data: string,
    options?: {
      encoding?: string;
    }
  ): Promise<void> {
    const { encoding = 'utf8' } = options ?? {};
    await RNFS.writeFile(fileURI, base64Data, encoding);
  }
  async readFile(
    fileURI: string,
    options?: { encoding?: string; mediaType?: string }
  ): Promise<ArrayBuffer> {
    const { encoding = 'utf8' } = options ?? {};
    const exists = await RNFS.exists(fileURI);
    if (!exists) {
      throw new Error(`File does not exist: ${fileURI}`);
    }
    const fileContent = await RNFS.readFile(fileURI, encoding);
    if (encoding === 'base64') {
      return this.base64ToArrayBuffer(fileContent);
    }
    return this.stringToArrayBuffer(fileContent);
  }

  async deleteFile(uri: string, options?: { filename?: string }): Promise<void> {
    if (await this.fileExists(uri)) {
      await RNFS.unlink(uri);
    }

    const { filename } = options ?? {};
    if (!filename) {
      return;
    }

    if (!AppConfig.supabaseBucket) {
      throw new Error('Supabase bucket not configured in AppConfig.ts');
    }

    const { data, error } = await this.options.client.storage.from(AppConfig.supabaseBucket).remove([filename]);
    if (error) {
      console.debug('Failed to delete file from Cloud Storage', error);
      throw error;
    }

    console.debug('Deleted file from storage', data);
  }

  async fileExists(fileURI: string): Promise<boolean> {
    return RNFS.exists(fileURI);
  }

  async makeDir(uri: string): Promise<void> {
    const exists = await RNFS.exists(uri);
    if (!exists) {
      await RNFS.mkdir(uri);
    }
  }

  async copyFile(sourceUri: string, targetUri: string): Promise<void> {
    await RNFS.copyFile(sourceUri, targetUri);
  }

  getUserStorageDirectory(): string {
    return RNFS.DocumentDirectoryPath;
  }

  async stringToArrayBuffer(str: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
  }

  /**
   * Converts a base64 string to an ArrayBuffer
   */
  async base64ToArrayBuffer(base64: string): Promise<ArrayBuffer> {
    return decodeBase64(base64);
  }
}
