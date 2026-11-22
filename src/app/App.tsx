import { Route, Routes } from 'react-router'
import { WallPage } from '../pages/wall'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WallPage />} />
    </Routes>
  )
}

export default App
