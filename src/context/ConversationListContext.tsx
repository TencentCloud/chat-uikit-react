import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import TUIChatEngine, { IConversationModel, StoreName, TUIConversationService, TUIStore } from '@tencentcloud/chat-uikit-engine';

interface ConversationListProviderProps {
  /** Specifies a function to filter conversations in the conversation list. */
  filter?: (conversationList: IConversationModel[]) => IConversationModel[];
  /** Specifies a function to sort conversations in the conversation list. */
  sort?: (conversationList: IConversationModel[]) => IConversationModel[];
}
interface ConversationListContextType {
  conversationList: IConversationModel[];
  filteredAndSortedConversationList: IConversationModel[];
  currentConversation: IConversationModel | undefined;
  setCurrentConversation: (conversation: IConversationModel) => void;
  isLoading: boolean;
  isLoadError: boolean;
}

const ConversationListContext = React.createContext<ConversationListContextType | null>(null);

function ConversationListProvider(props: PropsWithChildren<Partial<ConversationListProviderProps>>) {
  const {
    filter,
    sort,
    children,
  } = props;

  const [conversationList, setConversationList] = useState<IConversationModel[]>([]);

  const [currentConversation, _setCurrentConversation] = useState<IConversationModel | undefined>(undefined);

  const [filteredAndSortedConversationList, setFilteredAndSortedConversationList] = useState<IConversationModel[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadError, setIsLoadError] = useState(false);

  useEffect(() => {
    TUIStore.watch(StoreName.CONV, {
      conversationList: onConversationListUpdated,
      currentConversation: onCurrentConversationUpdated,
    });
    TUIStore.watch(StoreName.USER, {
      netStateChange: onNetStateChange,
    });

    return () => {
      TUIStore.unwatch(StoreName.CONV, {
        conversationList: onConversationListUpdated,
        currentConversation: onCurrentConversationUpdated,
      });
      TUIStore.unwatch(StoreName.USER, {
        netStateChange: onNetStateChange,
      });
    };
  }, []);

  useEffect(() => {
    // filter & sort conversationList
    let _conversationList = conversationList;
    filter && (_conversationList = filter(_conversationList));
    sort && (_conversationList = sort(_conversationList));
    setFilteredAndSortedConversationList(_conversationList);
  }, [conversationList, sort, filter]);

  function onConversationListUpdated(list: IConversationModel[]) {
    // original conversationList
    setConversationList(list);
    if (isLoading) {
      setIsLoading(false);
    }
  }

  function onCurrentConversationUpdated(conversation: IConversationModel) {
    _setCurrentConversation(conversation);
  }

  function onNetStateChange(netState: string) {
    if (netState === TUIChatEngine.TYPES.NET_STATE_DISCONNECTED) {
      setIsLoadError(true);
    } else {
      setIsLoadError(false);
    }
  }

  function setCurrentConversation(conversation: IConversationModel) {
    TUIConversationService.switchConversation(conversation?.conversationID);
  }

  const value = {
    conversationList,
    filteredAndSortedConversationList,
    currentConversation,
    setCurrentConversation,
    isLoading,
    isLoadError,
  };

  return (
    <ConversationListContext.Provider value={value}>
      {children}
    </ConversationListContext.Provider>
  );
}

function useConversationList() {
  const context = useContext(ConversationListContext);
  if (!context) {
    throw new Error('useConversationList must be used within a useConversationList');
  }
  return context;
}

export { useConversationList, ConversationListProvider, ConversationListContextType, ConversationListProviderProps };
