/// <reference types="node" />
import { BrowserMultipartUploadOptions } from '../../types/params';
import { ObjectCompleteMultipartUploadReturnType } from '../../types/object';
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
export declare function multipartUpload(this: OSS, name: string, file: Blob | File | Buffer, options?: BrowserMultipartUploadOptions): Promise<ObjectCompleteMultipartUploadReturnType>;
