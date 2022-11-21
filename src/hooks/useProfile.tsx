import React from 'react';

export const useProfile = (tim) => {
  const getUserProfile = (userIDList) => tim.getUserProfile({ userIDList });
  return {
    getUserProfile,
  };
};
