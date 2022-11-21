import React, { PropsWithChildren, useMemo } from 'react';

interface PluginsElementProps {
  plugins?: Array<any>,
  showNumber?: number,
}

export function usePluginsElement <T extends PluginsElementProps>(
  props: PropsWithChildren<T>,
) {
  const { plugins, showNumber } = props;
  return useMemo(() => ({
    showPicker: plugins?.slice(0, showNumber),
    elements: plugins?.slice(showNumber),
  }), [plugins]);
}
