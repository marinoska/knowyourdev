import crypto from 'crypto';

export const hash = (str: string) => crypto.createHash('md5').update(str).digest('hex')