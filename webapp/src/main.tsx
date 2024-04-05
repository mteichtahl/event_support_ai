import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject
} from "react-router-dom";
import AuthWithUserpool from './components/AuthWithUserpool';

import './index.css'
import "@cloudscape-design/global-styles/index.css"

import LandingPage from './pages/components/landing_page/index.tsx'
import AuditoTranslate from './pages/components/audio_translate/index.tsx'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage/>
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
    children: routes,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);