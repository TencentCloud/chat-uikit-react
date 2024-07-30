import { createHashRouter } from 'react-router-dom';

import InboxPage from '@/pages/InboxPage';
import ChatboxPage from '@/pages/ChatboxPage';
import App from '@/App';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <InboxPage />,
      },
      {
        path: 'inbox',
        element: <InboxPage />,
      },
      {
        path: 'chatbox',
        element: <ChatboxPage />,
      },
    ],
  },
]);
