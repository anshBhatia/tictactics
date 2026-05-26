import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import './Layout.css';

function Layout() {
  const location = useLocation();
  const hideFooter = /^\/play(\/|$)/.test(location.pathname);

  return (
    <div className="app-layout">
      <main className="main-content">
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default Layout; 
