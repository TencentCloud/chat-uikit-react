import Aegis from 'aegis-web-sdk';
import { SDKAppID } from '../debug/GenerateTestUserSig';

interface IAegisReportParams {
  actionKey?: string;
}

const REPORT_KEY = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  SEND_FIRST_MESSAGE: 'SEND_FIRST_MESSAGE',
};


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
  const { actionKey } = params;
  try {
    aegis?.report({
      msg: actionKey,
      level: Aegis.logType.REPORT,
      ext1: SDKAppID.toString(),
      ext2: 'live-chat',
      ext3: 'github-react-demo',
    });
  } catch (error) {
    console.log('aegis', error);
  }
};

export {
  reportEvent,
  REPORT_KEY,
};
