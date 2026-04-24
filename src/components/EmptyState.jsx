import { Link } from 'react-router-dom'

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="text-4xl mb-3">{icon}</div>
      )}
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      {subtitle && (
        <p className="text-xs text-gray-400 mb-4 max-w-xs">{subtitle}</p>
      )}
      {action && (
        action.to ? (
          <Link
            to={action.to}
            className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  )
}

export default EmptyState