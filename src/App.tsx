import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/templates" element={<div>Templates</div>} />
          <Route path="/templates/:id" element={<div>Template Detail</div>} />
          <Route path="/advisor" element={<div>Advisor</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
