import ReactDOM from 'react-dom/client';
import { initializeIcons, ThemeProvider } from '@fluentui/react';
import { StudioStoreProvider } from './stores/studioStore';
import { Main } from './pages/Main';
import './index.css';
import { ColorPickerProvider } from './components/ColorPicker';

initializeIcons();

const entryPoint = (
  <StudioStoreProvider>
    <ColorPickerProvider>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </ColorPickerProvider>
  </StudioStoreProvider>
);

//eslint-disable-next-line
ReactDOM.createRoot(document.getElementById('root')!).render(entryPoint);
