import path from 'path';
import mime from 'mime';
import { initMultipartUpload } from '../../common/multipart/initMultipartUpload';
import { resumeMultipart } from './resumeMultipart';
import { isFile } from '../../common/utils/isFile';
import { isBlob } from '../../common/utils/isBlob';
import { getPartSize } from '../../common/utils/getPartSize';
import { convertMetaToHeaders } from '../../common/utils/convertMetaToHeaders';
import { getFileSize } from '../utils/getFileSize';
import { isBuffer } from '../../common/utils/isBuffer';
import { BrowserMultipartUploadOptions } from '../../types/params';
import { ObjectCompleteMultipartUploadReturnType } from '../../types/object';
import { resetCancelFlag } from '../../common/client';
import { put } from '../object';
import OSS from '../';
/**
 * Upload a file to OSS using multipart uploads
 * @param {String} name
 * @param {String|File|Buffer} file
 * @param {Object} options
 *        {Object} options.callback The callback parameter is composed of a JSON string encoded in Base64
 *        {String} options.callback.url the OSS sends a callback request to this URL
 *        {String} options.callback.host The host header value for initiating callback requests
 *        {String} options.callback.body The value of the request body when a callback is initiated
 *        {String} options.callback.contentType The Content-Type of the callback requests initiatiated
 *        {Object} options.callback.customValue Custom parameters are a map of key-values, e.g:
 *                  customValue = {
 *                    key1: 'value1',
 *                    key2: 'value2'
 *                  }
 */
export async function multipartUpload(this: OSS, name: string, file: Blob | File | Buffer, options: BrowserMultipartUploadOptions = {}) {
  resetCancelFlag.call(this);
  options.disabledMD5 = options.disabledMD5 === undefined ? true : !!options.disabledMD5;
  if (options.checkpoint && options.checkpoint.uploadId) {
    return await resumeMultipart.call(this, options.checkpoint, options);
  }

  const minPartSize = 100 * 1024;

  if (!options.mime) {
    if (isFile(file)) {
      options.mime = mime.getType(path.extname(file.name));
    } else if (isBlob(file)) {
      options.mime = file.type;
    } else if (isBuffer(file)) {
      options.mime = '';
    } else {
      options.mime = mime.getType(path.extname(file));
    }
  }

  options.headers = options.headers || {};
  convertMetaToHeaders(options.meta, options.headers);

  const fileSize = await getFileSize(file);
  if (fileSize < minPartSize) {
    options.contentLength = fileSize;
    const result = await put.call(this, name, file, options);
    if (options && options.progress) {
      await options.progress(1);
    }

    const ret: ObjectCompleteMultipartUploadReturnType = {
      res: result.res,
      bucket: this.options.bucket,
      name,
      etag: result.res.headers.etag as string
    };

    if ((options.headers && options.headers['x-oss-callback']) || options.callback) {
      ret.data = result.data;
    }

    return ret;
  }
  if (options.partSize && !(parseInt(options.partSize.toString(), 10) === options.partSize)) {
    throw new Error('partSize must be int number');
  }

  if (options.partSize && options.partSize < minPartSize) {
    throw new Error(`partSize must not be smaller than ${minPartSize}`);
  }

  const initResult = await initMultipartUpload.call(this, name, options);
  const { uploadId } = initResult;
  const partSize = getPartSize(fileSize, options.partSize);

  const checkpoint = {
    file,
    name,
    fileSize,
    partSize,
    uploadId,
    doneParts: []
  };

  if (options && options.progress) {
    await options.progress(0, checkpoint, initResult.res);
  }

  return await resumeMultipart.call(this, checkpoint, options);
}
