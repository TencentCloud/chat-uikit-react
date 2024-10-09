import React, { PropsWithChildren, useMemo } from 'react';
import { UnknowPorps } from '../../../context';

interface PluginsElementProps {
  plugin?: Array<React.ComponentType<UnknowPorps>>,
  showNumber?: number,
}

export function usePluginsElement <T extends PluginsElementProps>(
  props: PropsWithChildren<T>,
) {
  const { plugin, showNumber = 1 } = props;

  return useMemo(() => {
    const elements = plugin?.map((Item: any, index:number) => {
      const key = `${JSON.stringify(Item)}${index}`;
      return (<Item key={key} />);
    });
    return {
      showPicker: elements?.splice(0, showNumber),
      elements,
    };
  }, [plugin]);
}
