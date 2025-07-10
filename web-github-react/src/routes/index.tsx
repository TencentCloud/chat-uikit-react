import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const ChatComponent = lazy(() => import('../pages/ChatGithub'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ChatComponent />} />
    </Routes>
  );
}
