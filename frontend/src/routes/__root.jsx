import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

// __root.tsx is the layout that wraps ALL pages.
// Add your nav, header, footer here.
export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <nav className="sticky top-0 z-50 flex gap-6 px-6 py-3">
        {/* <Link
          to="/"
          activeProps={{ className: 'font-semibold' }}
          className="no-underline text-inherit"
        >
          investIQ
        </Link> */}
        <header className="q-header">
          <div className="q-header-container">
            <Link to="/" className="q-logo">
              InvestIQ
            </Link>
          </div>

          <div className="q-header-links">
            <Link to="/about" className="q-header-link">
              About
            </Link>
            <Link to="/privacy-policy" className="q-header-link">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="q-header-link">
              Terms
            </Link>
          </div>
        </header>
        {/* <Link
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
          Portfolio Dashboard
        </Link>
        <Link
          to="/questionnaire"
          activeProps={{ className: 'font-semibold' }}
          className="no-underline text-inherit"
        >
          Questionnaire
        </Link> */}
      </nav>

      {/* Outlet renders the matched child route */}
      <main className="p-8">
        <Outlet />
      </main>

      {/* Remove TanStackRouterDevtools in production */}
      <TanStackRouterDevtools />
    </>
  )
}
