import { Route, Routes } from 'react-router'

// Placeholder route. Page structure is a separate key decision (UX scenarios, folders).
function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Favorites</h1>} />
    </Routes>
  )
}

export default App
