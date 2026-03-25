import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import ScanHistory from './pages/ScanHistory.jsx';
import ScanLink from './pages/ScanLink.jsx';
import Reports from './pages/Reports.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import EmailScanner from './pages/Emailscanner.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/api/auth',
    element:<Login/>
  },
  {
    path:'/api/register',
    element:<Register/>
  },
  {
    path:'/api/dashboard',
    element:<Dashboard/>
  },
  {
    path:'/api/scanhistory',
    element:<ScanHistory/>
  },
  {
    path:'/api/scanlink',
    element:<ScanLink/>
  },
  {
    path:'/api/reports',
    element:<Reports/>
  },
  {
    path:'/api/sidebar',
    element:<Sidebar/>
  },
  {
    path:'/api/header',
    element:<Header/>
  },
  {
    path:'/api/emailscan',
    element:<EmailScanner/>
  },
  {
    path:'/api/dashboardpage',
    element:<DashboardPage/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
