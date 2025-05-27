// src/layouts/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Ici s'affichent les pages enfants */}
      </main>
    </>
  );
};

export default Layout;
