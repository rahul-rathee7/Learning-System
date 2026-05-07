import React from "react";
import Header from "./Header";

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#f6f3ea] text-neutral-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout