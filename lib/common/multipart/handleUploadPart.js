"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadPart = void 0;
const copy_to_1 = __importDefault(require("copy-to"));
const _objectRequestParams_1 = require("../client/_objectRequestParams");
/**
 * Upload a part in a multipart upload transaction
 * @param {String} name the object name
 * @param {String} uploadId the upload id
 * @param {Integer} partNo the part number
 * @param {Object} data the body data
 * @param {Object} options
 */
async function handleUploadPart(name, uploadId, partNo, data, options = {}) {
    const opt = {};
    copy_to_1.default(options, false).to(opt);
    opt.headers = opt.headers || {};
    opt.headers['Content-Length'] = data.size;
    delete opt.headers['x-oss-server-side-encryption'];
    opt.subres = {
        partNumber: partNo,
        uploadId
    };
    const params = _objectRequestParams_1._objectRequestParams.call(this, 'PUT', name, opt);
    params.mime = opt.mime;
    const { size } = data, body = __rest(data, ["size"]);
    Object.assign(params, body);
    params.successStatuses = [200];
    const result = await this.request(params);
    if (!result.res.headers.etag) {
        throw new Error('Please set the etag of expose-headers in OSS \n https://help.aliyun.com/document_detail/32069.html');
    }
    if ('stream' in data) {
        data.stream = null;
        params.stream = null;
    }
    return {
        name,
        etag: result.res.headers.etag,
        res: result.res
    };
}
exports.handleUploadPart = handleUploadPart;
