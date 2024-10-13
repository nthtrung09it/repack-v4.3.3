import {customAlphabet} from 'nanoid/non-secure';

const nanoid = customAlphabet('abcdef0123456789', 32);

export const generateUUID = (): string => {
  return `${nanoid(8)}-${nanoid(4)}-${nanoid(4)}-${nanoid(4)}-${nanoid(12)}`;
};
