import React from 'react';

export const useProfile = (chat: any) => {
  const getUserProfile = (userIDList: Array<string>) => chat.getUserProfile({ userIDList });
  return {
    getUserProfile,
  };
};
