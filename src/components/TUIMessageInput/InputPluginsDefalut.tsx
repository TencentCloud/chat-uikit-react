import React, { useRef } from 'react';
import './styles/index.scss';

import { EmojiPicker } from './EmojiPicker';
import { Plugins } from '../Plugins';
import { useUploadElement } from './hooks/useUploadElement';
import { MESSAGE_TYPE_NAME } from '../../constants';
import { useTUIMessageInputContext } from '../../context/TUIMessageInputContext';
import { Icon, IconTypes } from '../Icon';

export function InputPluginsDefalut():React.ReactElement {
  const {
    sendUploadMessage,
    plugins: propPlugins,
    showNumber,
    MoreIcon,
  } = useTUIMessageInputContext('TUIMessageInputDefault');

  const pluginsRef = useRef(null);

  const ImagePicker = useUploadElement({
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

  const VideoPicker = useUploadElement({
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

  const FilePicker = useUploadElement({
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
  const plugins = propPlugins
  || [<EmojiPicker />, ImagePicker, VideoPicker, FilePicker];

  return <Plugins ref={pluginsRef} plugins={plugins} showNumber={showNumber} MoreIcon={MoreIcon} />;
}
