"use client";
import React, { useState } from 'react'
import { AlignLeft } from 'lucide-react'
import SideBar from "./Sidebar"

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft 
          className="hover:text-darkColor hoverEffect md:hidden" 
          onClick={() => setIsSidebarOpen(true)}
        />
     </button>
      <div className="md:hidden">
        <SideBar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
};

export default MobileMenu;
