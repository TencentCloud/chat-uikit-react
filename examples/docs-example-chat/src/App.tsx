import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TUILogin } from '@tencentcloud/tui-core';
import { loginOverseas, SDKAppID } from '@/api';
import { reportEvent, REPORT_KEY } from '@/utils/aegis';

import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import '@/styles/index.scss';
import { StoreName, TUIStore } from '@tencentcloud/chat-uikit-engine';

interface loginInfoParams {
  SDKAppID: number;
  userID: string;
  userSig: string;
  useUploadPlugin?: boolean;
}

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    (async () => {
      const res = await loginOverseas();
      const { userID, userSig } = res.data;
      init(userID, userSig);
    })();
    TUIStore.watch(StoreName.APP, {
      tasks: onTasksUpdated,
    });
  }, []);

  function init(userID: string, userSig: string) {
    const loginInfo: loginInfoParams = {
      SDKAppID,
      userID,
      userSig,
      useUploadPlugin: true,
    };
    TUILogin.login(loginInfo).then(() => {
      reportEvent({ actionKey: REPORT_KEY.LOGIN_SUCCESS, fromPath: pathname });
    }).catch(() => {
      reportEvent({ actionKey: REPORT_KEY.LOGIN_FAIL, fromPath: pathname });
    });
  }

  function onTasksUpdated(tasks: Record<string, boolean>) {
    if (tasks.sendMessage) {
      reportEvent({ actionKey: REPORT_KEY.SEND_FIRST_MESSAGE, fromPath: pathname });
    }
  }

  return (
    <Outlet />
  );
}
