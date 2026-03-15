import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  // return (
  //   <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
  //     <Navbar />

  //     <div className="flex">
  //       <Sidebar />

  //       <main className="flex-1 p-6">
  //         {children || <Outlet />}
  //       </main>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">

      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex">

        {/* Sidebar */}
        <div className="sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
           {children || <Outlet />}
        </main>

      </div>
    </div>
  );
}