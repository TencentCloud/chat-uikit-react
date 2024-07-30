import Aegis from 'aegis-web-sdk';
import { SDKAppID } from '@/api';
import { REPORT_KEY } from '@/utils/aegis/reportKey';

interface IAegisReportParams {
  actionKey?: string;
  fromPath?: string;
}

const SDKAppIDStr = SDKAppID.toString();

const aegis = new Aegis({
  id: 'O5KekHQpgwQ39maDKk',
  hostUrl: 'https://rumt-sg.com',
  reportApiSpeed: false,
  reportAssetSpeed: false,
  spa: false,
  websocketHack: false,
  pagePerformance: false,
  webVitals: false,
  onError: false,
  speedSample: false,
  repeat: 1,
  pvUrl: '',
  whiteListUrl: '',
  offlineUrl: '',
  speedUrl: '',
  webVitalsUrl: '',
  api: {
    apiDetail: false,
  },
});

const reportEvent = (params: IAegisReportParams): void => {
  const { actionKey, fromPath } = params;
  try {
    aegis?.report({
      msg: actionKey,
      level: Aegis.logType.REPORT,
      ext1: SDKAppIDStr,
      ext2: fromPath,
      ext3: 'chat-react',
    });
  } catch (error) {
    console.log('aegis', error);
  }
};

export {
  reportEvent,
  REPORT_KEY,
};
