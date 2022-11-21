import React from 'react';
import { Conversation } from 'tim-js-sdk';
import {
  ConversationPreview,
  ConversationPreviewUIComponentProps,
} from '../ConversationPreview';
import { Icon, IconTypes } from '../Icon';

export interface ConversationSearchResultProps {
  result: Array<Conversation>
  searchValue?: string,
  Preview?: React.ComponentType<ConversationPreviewUIComponentProps>
}
export function ConversationSearchResult(props:ConversationSearchResultProps):React.ReactElement {
  const { result, searchValue, Preview } = props;
  return (
    <div>
      {result?.length === 0 ? (
        <div className="conversation-search-result no-result">
          <Icon className="no-result-icon" type={IconTypes.CRY} width={42} height={42} />
          <span className="no-result-message">{`No results for "${searchValue}"`}</span>
        </div>
      )
        : result.map((item) => {
          const previewProps = {
            conversation: item,
            Preview,
          };
          return (
            <ConversationPreview
              searchValue={searchValue}
              key={item.conversationID}
              {...previewProps}
            />
          );
        })}
    </div>
  );
}
