import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <div className="flex min-h-screen bg-white text-slate-900">

      {/* Sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 bg-slate-100">
        <Outlet />
      </main>

    </div>
  )
}

export default Layout
