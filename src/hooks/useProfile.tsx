import React from 'react';

export const useProfile = (chat) => {
  const getUserProfile = (userIDList) => chat.getUserProfile({ userIDList });
  return {
    getUserProfile,
  };
};
