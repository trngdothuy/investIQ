import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      {/* <nav className="sticky top-0 z-50 flex gap-6 px-6 py-3 border-b border-border">
        <Link
          to="/"
          activeProps={{ className: 'font-semibold' }}
          className="no-underline text-inherit"
        >
          investIQ
        </Link>

        <Link
          to="/about"
          activeProps={{ className: 'font-semibold' }}
          className="no-underline text-inherit"
        >
          About
        </Link>

        <Link
          to="/users"
          activeProps={{ className: 'font-semibold' }}
          className="no-underline text-inherit"
        >
          Users
        </Link>

        <Link
          to="/questionnaire"
          activeProps={{ className: 'font-semibold' }}
          className="no-underline text-inherit"
        >
          Questionnaire
        </Link>
      </nav> */}

      {/* Renders the matched child route */}
      <main className="p-8">
        <Outlet />
      </main>

      {/* Remove in production */}
      <TanStackRouterDevtools />
    </>
  )
}