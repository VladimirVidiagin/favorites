import { QueryClientProvider } from '@tanstack/react-query'
import { Route, Routes } from 'react-router'
import { queryClient } from '../shared/api'
import { WallPage } from '../pages/wall'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<WallPage />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
