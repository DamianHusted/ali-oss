import mime from 'mime';
import path from 'path';
import { _objectRequestParams } from '../../common/client/_objectRequestParams';
import { convertMetaToHeaders } from '../../common/utils/convertMetaToHeaders';
import { encodeCallback } from '../../common/utils/encodeCallback';
import { isBlob } from '../../common/utils/isBlob';
import { isBuffer } from '../../common/utils/isBuffer';
import { isFile } from '../../common/utils/isFile';
import { objectName } from '../../common/utils/objectName';
import { objectUrl } from '../../common/utils/objectUrl';
import { BrowserObjectPutOptions, ObjectPutReturnType } from '../../types/object';
import { _createBuffer } from '../client/_createBuffer';
import { OSS } from '../core';
import { getFileSize } from '../utils/getFileSize';
/**
 * put an object from String(file path)/Buffer/ReadableStream
 * @param {String} name the object key
 * @param {Mixed} file String(file path)/Buffer/ReadableStream
 * @param {Object} options
 *        {Object} options.callback The callback parameter is composed of a JSON string encoded in Base64
 *        {String} options.callback.url  the OSS sends a callback request to this URL
 *        {String} options.callback.host  The host header value for initiating callback requests
 *        {String} options.callback.body  The value of the request body when a callback is initiated
 *        {String} options.callback.contentType  The Content-Type of the callback requests initiatiated
 *        {Object} options.callback.customValue  Custom parameters are a map of key-values, e.g:
 *                  customValue = {
 *                    key1: 'value1',
 *                    key2: 'value2'
 *                  }
 * @return {Object}
 */

export async function put(
  this: OSS,
  name: string,
  file: Buffer | Blob | File,
  options: BrowserObjectPutOptions = {}
): Promise<ObjectPutReturnType> {
  let content: Buffer;
  options.disabledMD5 = options.disabledMD5 === undefined ? true : !!options.disabledMD5;
  name = objectName(name);
  if (isBuffer(file)) {
    content = file;
  } else if (isBlob(file) || isFile(file)) {
    if (!options.mime) {
      if (isFile(file)) {
        options.mime = mime.getType(path.extname(file.name));
      } else {
        options.mime = file.type;
      }
    }
    content = await _createBuffer(file, 0, file.size);
    options.contentLength = await getFileSize(file);
  } else {
    throw new TypeError('Must provide Buffer/Blob/File for put.');
  }
  options.headers = options.headers || {};
  convertMetaToHeaders(options.meta, options.headers);

  const method = options.method || 'PUT';
  const params = _objectRequestParams.call(this, method, name, options);
  encodeCallback(params, options);
  params.mime = options.mime;
  params.content = content;
  params.successStatuses = [200];
  params.disabledMD5 = options.disabledMD5;
  const result = await this.request(params);
  const ret: any = {
    name,
    url: objectUrl(name, this.options),
    res: result.res
  };

  if (params.headers && params.headers['x-oss-callback']) {
    ret.data = JSON.parse(result.data.toString());
  }

  return ret;
}
