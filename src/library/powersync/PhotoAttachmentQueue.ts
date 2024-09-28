import RNFS from 'react-native-fs';
import {nanoid} from 'nanoid';
import {AppConfig} from '../supabase/AppConfig';
import {
  AbstractAttachmentQueue,
  AttachmentRecord,
  AttachmentState,
} from '@powersync/attachments';
import {TODO_TABLE} from './AppSchema';

export class PhotoAttachmentQueue extends AbstractAttachmentQueue {
  async init() {
    if (!AppConfig.supabaseBucket) {
      console.debug(
        'No Supabase bucket configured, skip setting up PhotoAttachmentQueue watches',
      );
      // Disable sync interval to prevent errors from trying to sync to a non-existent bucket
      this.options.syncInterval = 0;
      return;
    }

    await super.init();
  }

  onAttachmentIdsChange(onUpdate: (ids: string[]) => void): void {
    this.powersync.watch(
      `SELECT photo_id as id FROM ${TODO_TABLE} WHERE photo_id IS NOT NULL`,
      [],
      {
        onResult: result => onUpdate(result.rows?._array.map(r => r.id) ?? []),
      },
    );
  }

  async newAttachmentRecord(
    record?: Partial<AttachmentRecord>,
  ): Promise<AttachmentRecord> {
    const photoId = record?.id ?? nanoid();
    const filename = record?.filename ?? `${photoId}.jpg`;
    return {
      id: photoId,
      filename,
      media_type: 'image/jpeg',
      state: AttachmentState.QUEUED_UPLOAD,
      ...record,
    };
  }

  async savePhoto(base64Data: string): Promise<AttachmentRecord> {
    const photoAttachment = await this.newAttachmentRecord();
    photoAttachment.local_uri = this.getLocalFilePathSuffix(
      photoAttachment.filename,
    );
    const localUri = this.getLocalUri(photoAttachment.local_uri);

    // Write file using react-native-fs
    await RNFS.writeFile(localUri, base64Data, 'base64');

    // Get file info using react-native-fs
    const fileInfo = await RNFS.stat(localUri);
    if (fileInfo.isFile()) {
      photoAttachment.size = fileInfo.size;
    }

    return this.saveToQueue(photoAttachment);
  }
}
