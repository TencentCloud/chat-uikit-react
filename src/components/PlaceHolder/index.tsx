import { Icon, IconTypes } from '../Icon';
import cs from 'classnames';

import './styles/index.scss';

export const PlaceHolderTypes = {
  LOADING: 'LOADING',
  NO_CONVERSATIONS: 'NO_CONVERSATIONS',
  NO_MESSAGES: 'NO_MESSAGES',
  WRONG: 'WRONG',
  NO_RESULTS: 'NO_RESULTS',
} as const;

export const PlaceHolderIconTypes = {
  [PlaceHolderTypes.LOADING]: IconTypes.LOADING,
  [PlaceHolderTypes.NO_CONVERSATIONS]: IconTypes.EFFORT,
  [PlaceHolderTypes.NO_MESSAGES]: IconTypes.EFFORT,
  [PlaceHolderTypes.WRONG]: IconTypes.CRY,
  [PlaceHolderTypes.NO_RESULTS]: IconTypes.CRY,
} as const;

export const PlaceHolderStringTypes = {
  [PlaceHolderTypes.LOADING]: '',
  [PlaceHolderTypes.NO_CONVERSATIONS]: 'No conversation',
  [PlaceHolderTypes.NO_MESSAGES]: 'No message',
  [PlaceHolderTypes.WRONG]: 'Something was wrong',
  [PlaceHolderTypes.NO_RESULTS]: 'No results',
} as const;

export interface PlaceHolderProps {
  className?: string;
  type: keyof typeof PlaceHolderTypes;
  iconSize?: number;
  searchString?: string;
  retry?: () => void;
}

export function PlaceHolder({
  className = '',
  type,
  iconSize = 42,
  searchString = '',
  retry,
}: PlaceHolderProps) {
  return (
    <div
      className={cs(
        className,
        'tui-place-holder',
      )}
    >
      {
        PlaceHolderIconTypes[type] && (
          <Icon
            className="tui-place-holder__icon"
            type={PlaceHolderIconTypes[type]}
            width={iconSize}
            height={iconSize}
          />
        )
      }
      {
        PlaceHolderStringTypes[type]
        && (
          <div className="tui-place-holder__label">
            {searchString
              ? `${PlaceHolderStringTypes[type]}  '${searchString}' `
              : PlaceHolderStringTypes[type]}
          </div>
        )
      }
      {type === PlaceHolderTypes.WRONG && retry && (
        <div className="tui-place-holder__button">
          <button onClick={retry}>Retry</button>
        </div>
      )}
    </div>
  );
}
