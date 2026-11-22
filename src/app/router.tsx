import { createBrowserRouter } from 'react-router'
import { CardPage, NewCardPage } from '../pages/card'
import { CategoriesPage } from '../pages/categories'
import { CategoryPage } from '../pages/category'
import { WallPage } from '../pages/wall'
import { RootLayout } from './layouts/RootLayout'
import { TabsLayout } from './layouts/TabsLayout'

// Data router (createBrowserRouter) instead of <BrowserRouter>: needed for <ScrollRestoration>.
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <TabsLayout />,
        children: [
          { path: '/', element: <WallPage /> },
          { path: '/categories', element: <CategoriesPage /> },
          { path: '/categories/:categoryId', element: <CategoryPage /> },
        ],
      },
      // The card screen has no tab bar (D-9): only a back button.
      { path: '/cards/new', element: <NewCardPage /> },
      { path: '/cards/:cardId', element: <CardPage /> },
    ],
  },
])
