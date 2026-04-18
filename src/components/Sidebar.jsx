import { NavLink } from "react-router-dom"
import { useState } from "react"
import LogoutButton from "./LogoutButton"
import { useAuth } from "../context/AuthContext"

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? 'U'

  const displayName = user?.displayName ?? user?.email ?? 'User'

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dsa", label: "DSA" },
    { path: "/goals", label: "Goals" },
    { path: "/timer", label: "Timer" },
  ]

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#0f172a] text-white">
        {/* <h1 className="font-semibold">Navigate</h1> */}
        <button onClick={() => setIsOpen(true)}>☰</button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={` top-0 left-0 h-screen w-64 z-50
        bg-[#0f172a] text-[#e2e8f0]
        p-5 flex flex-col
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex justify-end items-center mb-6">
          {/* <div className="bg-[#0ea5e9] px-4 py-2 rounded-lg flex items-center gap-2">
             <span className="font-medium">Navigate</span>
          </div> */}

          {/* Close button */}
          <button
            className="md:hidden text-xl text-[#94a3b8]"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-[#1e293b] text-white"
                    : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-white"
                }`
              }
            >
               {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-medium text-indigo-700 shrink-0">
            {initials}
          </div>
          <span className="text-sm text-gray-500 truncate">{displayName}</span>
        </div>
        <LogoutButton />
      </div>
      </aside>
    </>
  )
}

export default Sidebar

//to add logo at top userinfo and other stuff later