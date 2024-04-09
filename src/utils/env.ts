import { getPlatform } from '@tencentcloud/universal-api';

export const isPC = getPlatform() === 'pc';

export const isH5 = getPlatform() === 'h5';
