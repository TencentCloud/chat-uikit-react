/* eslint-disable import/no-extraneous-dependencies */
import TUICore, { TUILogin, TUIConstants } from '@tencentcloud/tui-core';
import TUIChatEngine from '@tencentcloud/chat-uikit-engine';

export default class TUIChatKit {
  constructor() {
    TUICore.registerEvent(
      TUIConstants.TUILogin.EVENT.LOGIN_STATE_CHANGED,
      TUIConstants.TUILogin.EVENT_SUB_KEY.USER_LOGIN_SUCCESS,
      this,
    );
  }

  /**
   * 监听 TUILogin.login 的成功通知
   * @param { TUIInitParam } params 初始化参数
   */
  public onNotifyEvent(eventName: string, subKey: string) {
    if (eventName === TUIConstants.TUILogin.EVENT.LOGIN_STATE_CHANGED) {
      switch (subKey) {
        case TUIConstants.TUILogin.EVENT_SUB_KEY.USER_LOGIN_SUCCESS:
          this.login();
          break;
        default:
          // todo
      }
    }
  }

  /**
   * login 登录
   */
  private login() {
    const {
      chat, SDKAppID, userID, userSig,
    } = TUILogin.getContext();
    TUIChatEngine.login({
      chat,
      SDKAppID,
      userID,
      userSig,
    });
  }
}
