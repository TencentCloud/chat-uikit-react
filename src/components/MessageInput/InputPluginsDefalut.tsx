import React, { useRef } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import './styles/index.scss';

import { EmojiPicker } from './EmojiPicker';
import { Plugins } from '../Plugins';
import { IPluginsRef } from '../Plugins';
import { useUploadElement } from './hooks/useUploadElement';
import { MESSAGE_TYPE_NAME } from '../../constants';
import { useTUIMessageInputContext } from '../../context/MessageInputContext';
import { Icon, IconTypes } from '../Icon';
import { useTUIChatStateContext } from '../../context';
export function InputPluginsDefalut(): React.ReactElement {
  const {
    sendUploadMessage,
    pluginConfig: propsPluginConfig,
  } = useTUIMessageInputContext('TUIMessageInputDefault');
  const { t } = useUIKit();

  const { TUIMessageInputConfig } = useTUIChatStateContext('TUIMessageInput');

  const propPlugins = propsPluginConfig?.plugins
    || TUIMessageInputConfig?.pluginConfig?.plugins || [];
  const showNumber = propsPluginConfig?.showNumber
    || TUIMessageInputConfig?.pluginConfig?.showNumber || 1;
  const MoreIcon = propsPluginConfig?.MoreIcon || TUIMessageInputConfig?.pluginConfig?.MoreIcon;

  const handlePluginBoolenParams = (
    porpsVal?: boolean | undefined,
    contextVal?: boolean | undefined,
    defaultVal?: boolean,
  ) => {
    if (typeof (porpsVal) === 'boolean') {
      return porpsVal;
    }
    if (typeof (contextVal) === 'boolean') {
      return contextVal;
    }
    return defaultVal;
  };

  const isEmojiPicker = handlePluginBoolenParams(
    propsPluginConfig?.isEmojiPicker,
    TUIMessageInputConfig?.pluginConfig?.isEmojiPicker,
    true,
  );
  const isImagePicker = handlePluginBoolenParams(
    propsPluginConfig?.isImagePicker,
    TUIMessageInputConfig?.pluginConfig?.isImagePicker,
    true,
  );
  const isVideoPicker = handlePluginBoolenParams(
    propsPluginConfig?.isVideoPicker,
    TUIMessageInputConfig?.pluginConfig?.isVideoPicker,
    true,
  );
  const isFilePicker = handlePluginBoolenParams(
    propsPluginConfig?.isFilePicker,
    TUIMessageInputConfig?.pluginConfig?.isFilePicker,
    true,
  );

  const pluginsRef = useRef<IPluginsRef>();

  const ImagePicker = isImagePicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <i className="iconfont input-icon">&#xe604;</i>
        <span>{t('TUIChat.Image')}</span>
      </div>
    ),
    type: 'image',
    accept: 'image/*',
    onChange: (file: HTMLInputElement | File) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
      sendUploadMessage && sendUploadMessage({ file }, MESSAGE_TYPE_NAME.IMAGE);
    },
  });

  const VideoPicker = isVideoPicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <i className="iconfont input-icon">&#xe603;</i>
        <span>{t('TUIChat.Video')}</span>
      </div>
    ),
    type: 'video',
    accept: 'video/*',
    onChange: (file: HTMLInputElement | File) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
      sendUploadMessage && sendUploadMessage({ file }, MESSAGE_TYPE_NAME.VIDEO);
    },
  });

  const FilePicker = isFilePicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <i className="iconfont input-icon">&#xe602;</i>
        <span>{t('TUIChat.File')}</span>
      </div>
    ),
    type: 'file',
    accept: 'file/*',
    onChange: (file: HTMLInputElement | File) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
      sendUploadMessage && sendUploadMessage({ file }, MESSAGE_TYPE_NAME.FILE);
    },
  });
  const plugins = [
    isEmojiPicker && <EmojiPicker />, ImagePicker, VideoPicker, FilePicker, ...propPlugins,
  ].filter(item => item);

  return <Plugins ref={pluginsRef} plugins={plugins} showNumber={showNumber} MoreIcon={MoreIcon} />;
}
