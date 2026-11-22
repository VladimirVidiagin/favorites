import { Outlet, ScrollRestoration } from 'react-router'

/**
 * ScrollRestoration remembers the window scroll position per history entry, so the grid
 * keeps its place after returning from a card (D-9). It works only because pages scroll
 * the window itself; an inner scroll container would not be restored.
 */
export function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
