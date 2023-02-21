import React, { useRef } from 'react';
import './styles/index.scss';

import { EmojiPicker } from './EmojiPicker';
import { Plugins } from '../Plugins';
import { useUploadElement } from './hooks/useUploadElement';
import { MESSAGE_TYPE_NAME } from '../../constants';
import { useTUIMessageInputContext } from '../../context/TUIMessageInputContext';
import { Icon, IconTypes } from '../Icon';
import { useTUIChatStateContext } from '../../context';

export function InputPluginsDefalut():React.ReactElement {
  const {
    sendUploadMessage,
    pluginConfig: propsPluginConfig,
  } = useTUIMessageInputContext('TUIMessageInputDefault');

  const { TUIMessageInputConfig } = useTUIChatStateContext('TUIMessageInput');

  const propPlugins = propsPluginConfig?.plugins
  || TUIMessageInputConfig?.pluginConfig?.plugins || [];
  const showNumber = propsPluginConfig?.showNumber
  || TUIMessageInputConfig?.pluginConfig?.showNumber || 1;
  const MoreIcon = propsPluginConfig?.MoreIcon || TUIMessageInputConfig?.pluginConfig?.MoreIcon;

  const handlePluginBoolenParams = (
    porpsVal?:boolean | undefined,
    contextVal?:boolean | undefined,
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

  const pluginsRef = useRef(null);

  const ImagePicker = isImagePicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <Icon width={20} height={20} type={IconTypes.IMAGE} />
        <span>Image</span>
      </div>
    ),
    type: 'image',
    accept: 'image/*',
    onChange: (file:HTMLInputElement | File) => {
      pluginsRef.current.closeMore();
      sendUploadMessage({ file }, MESSAGE_TYPE_NAME.IMAGE);
    },
  });

  const VideoPicker = isVideoPicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <Icon width={20} height={20} type={IconTypes.VIDEO} />
        <span>Video</span>
      </div>
    ),
    type: 'video',
    accept: 'video/*',
    onChange: (file:HTMLInputElement | File) => {
      pluginsRef.current.closeMore();
      sendUploadMessage({ file }, MESSAGE_TYPE_NAME.VIDEO);
    },
  });

  const FilePicker = isFilePicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <Icon width={20} height={20} type={IconTypes.DOCUMENT} />
        <span>Document</span>
      </div>
    ),
    type: 'file',
    accept: 'file/*',
    onChange: (file:HTMLInputElement | File) => {
      pluginsRef.current.closeMore();
      sendUploadMessage({ file }, MESSAGE_TYPE_NAME.FILE);
    },
  });
  const plugins = [
    isEmojiPicker && <EmojiPicker />, ImagePicker, VideoPicker, FilePicker, ...propPlugins,
  ].filter((item) => item);

  return <Plugins ref={pluginsRef} plugins={plugins} showNumber={showNumber} MoreIcon={MoreIcon} />;
}
