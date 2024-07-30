import { getPlatform } from '@tencentcloud/universal-api';

export let isPC = getPlatform() === 'pc';

export let isH5 = getPlatform() === 'h5';

export const setPlatform = (platform: 'pc' | 'h5') => {
  isPC = platform === 'pc';
  isH5 = platform === 'h5';
};
