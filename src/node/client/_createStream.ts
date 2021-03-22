import fs from 'fs';
import { Readable } from 'stream';
import { isFile } from '../../common/utils/isFile';
import { WebFileReadStream } from '../../common/utils/webFileReadStream';
import { isBuffer } from '../../common/utils/isBuffer';
import { isReadable } from '../../common/utils/isStream';
import { isString } from '../../common/utils/isString';

export function _createStream(file: Readable | File | Buffer | string, start: number, end: number): Readable {
  if (isReadable(file)) {
    return file;
  } else if (isFile(file)) {
    return new WebFileReadStream(file.slice(start, end));
  } else if (isBuffer(file)) {
    const iterable = file.subarray(start, end);
    // we can't use Readable.from() since it is only support in Node v10
    return new Readable({
      read() {
        this.push(iterable);
        this.push(null);
      },
    });
  } else if (isString(file)) {
    return fs.createReadStream(file, {
      start,
      end: end - 1
    });
  }
  throw new Error('_createStream requires File/String.');
}
