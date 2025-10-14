import AppRoutes from "./routes";
import { UIKitProvider } from '@tencentcloud/chat-uikit-react';
import appConfig from './config/appConfig.json';

function App() {
  return (
    <UIKitProvider appConfig={appConfig}>
      <div className='App'>
        <AppRoutes />
      </div>
    </UIKitProvider>
  );
}

export default App;
