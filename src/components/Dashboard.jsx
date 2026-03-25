import React, { useState } from 'react';
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ScanLink from "../pages/ScanLink.jsx";
import EmailScanner from "../pages/Emailscanner.jsx";
import Reports from "../pages/Reports.jsx";
import ScanHistory from "../pages/ScanHistory.jsx";
import Settings from "../pages/Settings.jsx";

export default function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboardpage': return <DashboardPage />;
      case 'scan-link': return <ScanLink />;
      case 'email-scanner': return <EmailScanner />;
      case 'reports': return <Reports />;
      case 'scan-history': return <ScanHistory />;
      case 'settings': return <Settings />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-wrapper">
        <Header />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}