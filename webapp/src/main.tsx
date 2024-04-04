import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject
} from "react-router-dom";
import AuthWithUserpool from './components/AuthWithUserpool';

import App from './App.tsx'
import './index.css'
import "@cloudscape-design/global-styles/index.css"

import AuditoTranslate from './pages/components/audio_translate/index.tsx'

const routes: RouteObject[] = [
  {
    path: '/',
    element: (<div>aaa</div>),
  },
  {
    path: '/audio_translate',
    element: <AuditoTranslate />,
  },
  
].flatMap((r) => (r !== null ? [r] : []));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthWithUserpool />,
    // element: <App />,
    children: routes,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);