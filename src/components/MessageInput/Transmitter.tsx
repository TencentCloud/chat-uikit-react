import React, { useState } from 'react';
import { useTUIMessageInputContext } from '../../context/MessageInputContext';
import { Icon, IconTypes } from '../Icon';

export function Transmitter(): React.ReactElement {
  const {
    handleSubmit,
  } = useTUIMessageInputContext('Transmitter');

  return (
    <div className="transmitter">
      <Icon className="icon-send" type={IconTypes.SEND} onClick={handleSubmit} />
    </div>
  );
}
