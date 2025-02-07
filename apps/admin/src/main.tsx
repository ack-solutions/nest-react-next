import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';

import App from './app/app';


// editor

import 'react-quill/dist/quill.snow.css';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <StrictMode>
        <HelmetProvider>
            <HashRouter>
                <App />
            </HashRouter>
        </HelmetProvider>
    </StrictMode>,
);
