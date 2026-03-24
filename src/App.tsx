import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Advisor } from '@/pages/Advisor'
import { Templates } from '@/pages/Templates'
import { TemplateDetail } from '@/pages/TemplateDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:id" element={<TemplateDetail />} />
          <Route path="/advisor" element={<Advisor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
