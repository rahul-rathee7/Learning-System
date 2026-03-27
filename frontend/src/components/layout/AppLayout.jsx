import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../App.css';

// You can import your layout components here, e.g., Navbar, Sidebar, Footer
// import Navbar from '../common/Navbar';
// import Sidebar from '../common/Sidebar';

const AppLayout = () => {
  return (
    <div className="app-layout">
      {/* <Navbar /> */}
      {/* <Sidebar /> */}
      <main className="main-content">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AppLayout;
