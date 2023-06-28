import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';

import App from './app/app'
import Admin from './app/pages/admin';
import Room from './app/pages/room';

const oidcConfig: AuthProviderProps = {
  authority: "https://auth.zhr.one/application/o/word-assassins/",
  client_id: "qufnWT5HiAmouqtKejlILrTPQvFYj62nGpoyEp1G",
  redirect_uri: "http://localhost:4200/admin",
	scope: "openid profile",
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
	{
    path: "/:room",
    element: <Room />,
  },
	{
    path: "/admin",
    element: <AuthProvider {...oidcConfig}><Admin /></AuthProvider>,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<StrictMode>
    <RouterProvider router={router} />
	</StrictMode>
)
