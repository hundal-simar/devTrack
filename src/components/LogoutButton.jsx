import { useNavigate } from "react-router-dom"

function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-6 w-full flex items-center gap-3 px-4 py-2 rounded-lg
      text-[#94a3b8] transition-all duration-200
      hover:bg-[#1e293b] hover:text-red-400"
    >
      ⏻ Logout
    </button>
  )
}

export default LogoutButton
//add logout confirmation dialog later