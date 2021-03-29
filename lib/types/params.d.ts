export interface IOptions {
    /** access key you create on aliyun console website */
    accessKeyId: string;
    /** access secret you create */
    accessKeySecret: string;
    /** used by temporary authorization */
    stsToken?: string;
    /** used by auto set stsToken、accessKeyId、accessKeySecret when sts info expires. */
    refreshSTSToken?: () => {
        stsToken: string;
        accessKeyId: string;
        accessKeySecret: string;
    };
    /** the default bucket you want to access If you don't have any bucket, please use putBucket() create one first. */
    bucket?: string | null;
    /** oss region domain. It takes priority over region. */
    endpoint?: string | null;
    /** the bucket data region location, please see Data Regions, default is oss-cn-hangzhou. */
    region?: string;
    /** access OSS with aliyun internal network or not, default is false. If your servers are running on aliyun too, you can set true to save lot of money. */
    internal?: boolean;
    /** instruct OSS client to use HTTPS (secure: true) or HTTP (secure: false) protocol. */
    secure?: boolean;
    /** instance level timeout for all operations, default is 60s */
    timeout?: string | number;
    /** use custom domain name */
    cname?: boolean;
    /** default false, whether request payer function of the bucket is open, if true, will send headers 'x-oss-request-payer': 'requester' to oss server. */
    isRequestPay?: boolean;
    /** default false, it just work in Browser, if true,it means upload object with fetch mode ,else XMLHttpRequest */
    useFetch?: boolean;
    /** Enable proxy request, default is false. */
    enableProxy?: boolean;
    /** proxy agent uri or options, default is null. */
    proxy?: string | {
        [key: string]: any;
    };
    /** used by auto retry send request count when request error is net error or timeout. */
    retryMax?: number;
}
export declare type ACLType = 'public-read-write' | 'public-read' | 'private';
export declare type SSEAlgorithm = 'KMS' | 'AES256' | 'SM4';
export declare type RuleStatusType = 'Enabled' | 'Disabled';
export declare type StorageType = 'Standard' | 'IA' | 'Archive';
export declare type ObjectType = 'Normal' | 'Symlink';
export declare type DataRedundancyType = 'LRS' | 'ZRS';
export declare type Versioning = 'Enabled' | 'Suspended';
export declare type Protocol = 'http' | 'https';
export declare type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'HEAD';
export declare type BucketRequestPayer = 'BucketOwner' | 'Requester';
export interface Subres {
    [propsName: string]: string | undefined;
    versionId?: string;
}
export interface DoneParts {
    number: number;
    etag: string;
}
export interface Tag {
    [propsName: string]: string;
}
export interface RequestOptions {
    timeout?: number;
    headers?: object;
    subres?: Subres;
    ctx?: string;
}
export interface NormalSuccessResponse {
    /** response info */
    res: {
        /** response status */
        status: number;
        /** response headers */
        headers: {
            server: string;
            date: string;
            'content-length': string;
            connection: string;
            'x-oss-request-id': string;
            vary: string;
            etag?: string;
            'x-oss-hash-crc64ecma'?: string;
            'content-md5'?: string;
            'x-oss-server-time': string;
        };
        /** response size */
        size: number;
        /** request total use time (ms) */
        rt: number;
        /** request urls */
        requestUrls: string[];
        data?: any;
    };
}
export interface NormalSuccessResponseWithStatus extends NormalSuccessResponse {
    status: number;
}
export interface UserMeta {
    [propsName: string]: string;
}
export interface Checkpoint {
    file: any;
    name: string;
    fileSize: number;
    partSize: number;
    uploadId: string;
    doneParts: DoneParts[];
}
export interface ObjectCallback {
    url: string;
    host?: string;
    body: string;
    contentType?: string;
    customValue?: object;
    headers?: object;
}
export interface MultipartUploadOptions extends RequestOptions {
    parallel?: number;
    partSize?: number;
    progress?: (...args: any[]) => any;
    checkpoint?: Checkpoint;
    meta?: UserMeta;
    mime?: string;
    callback?: ObjectCallback;
    copyheaders?: object;
    contentLength?: number;
}
export interface BrowserMultipartUploadOptions extends MultipartUploadOptions {
    /** default true. if false,it means that MD5 is automatically calculated for uploaded files. */
    disabledMD5?: boolean;
}
export interface UploadPartOptions extends RequestOptions {
    disabledMD5?: boolean;
}
export interface CompleteMultipartUploadOptions extends RequestOptions {
    callback?: ObjectCallback;
}
export interface InitMultipartUploadOptions extends RequestOptions {
    mime?: string;
    meta?: UserMeta;
}
export interface ListUploadsQuery {
    delimiter?: string;
    'max-uploads'?: string;
    'key-marker'?: string;
    prefix?: string;
    'upload-id-marker'?: string;
    'encoding-type'?: string;
}
export interface MultipartUploadCopySourceData {
    sourceKey: string;
    sourceBucketName: string;
    startOffset?: number;
    endOffset?: number;
}
export interface MultiVersionCommonOptions extends RequestOptions {
    versionId?: string;
}
export interface postAsyncFetchOptions extends RequestOptions {
    host?: string;
    contentMD5?: string;
    callback?: string;
    storageClass?: StorageType;
    ignoreSameKey?: boolean;
}
export interface signatureUrlOptions extends RequestOptions {
    expires?: number;
    method?: HttpMethod;
}
export declare type Container<T> = T | T[];
export declare type PartialKeys<T, K extends keyof T> = Omit<T, K> & {
    [k in K]?: T[k];
};
export interface MultipartDownload {
    parallel?: number;
    partSize?: number;
    versionId?: string;
    enableCRC64?: boolean;
    progress?: (doneParts: number, totalParts: number, info: {
        status: number;
        headers: object;
        size: number;
        rt: number;
    }) => any;
    checkpoint?: true | string;
    meta?: UserMeta;
    callback?: ObjectCallback;
    headers?: object;
    ref?: (ref: {
        cancel: (needDestoryed: boolean) => void;
    }) => void;
    /** Disable warning. A warning will be printed when the environment does not support BigInt */
    disabledWarning?: boolean;
}
export interface MultipartDownloadRuntime extends MultipartDownload {
    parallel: number;
    partSize: number;
    enableCRC64: boolean;
}
