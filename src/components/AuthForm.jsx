import { useForm } from "react-hook-form"

function AuthForm({
  isRegister,
  onSubmit,
  loading,
  firebaseError,
  onToggle,
  onGoogleLogin
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-indigo-600 mb-1">DevTrack</h1>
          <p className="text-sm text-gray-400">Your personal dev productivity tracker</p>
        </div>

        {/* Firebase error */}
        {firebaseError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {firebaseError}
          </div>
        )}

        {/* Google sign-in */}
        <button
          onClick={onGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors mb-5 disabled:opacity-50"
        >
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

          {isRegister && (
              <div className="flex flex-col gap-1">
               <input
                type="text"
                placeholder="Full name"
                {...register('name', {
                required: 'Please enter your name',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                 })}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 transition
                ${errors.name
                 ? 'border-red-300 focus:ring-red-100'
                : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-400'}`}
              />
            {errors.name && (
            <p className="text-xs text-red-500 px-1">{errors.name.message}</p>
             )}
              </div>
           )}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 transition
                ${errors.email
                  ? "border-red-300 focus:ring-red-100"
                  : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 px-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 transition
                ${errors.password
                  ? "border-red-300 focus:ring-red-100"
                  : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                }`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 px-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          {isRegister && (
            <div className="flex flex-col gap-1">
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value, formValues) =>
                    value === formValues.password || "Passwords do not match",
                })}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 transition
                  ${errors.confirmPassword
                    ? "border-red-300 focus:ring-red-100"
                    : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                  }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 px-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-1"
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-gray-400 mt-5">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
          <button
            onClick={() => {
              onToggle()
              reset()
            }}
            className="ml-1 text-indigo-600 hover:underline font-medium"
          >
            {isRegister ? "Sign in" : "Register"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthForm