// Client-side encryption utilities (for sensitive local data)
import { Buffer } from 'buffer';

export const encodeBase64 = (data) => Buffer.from(data).toString('base64');
export const decodeBase64 = (data) => Buffer.from(data, 'base64').toString('utf-8');
