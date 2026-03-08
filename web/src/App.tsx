import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Translate from './pages/Translate'
import HumanToPet from './pages/HumanToPet'
import Pets from './pages/Pets'
import History from './pages/History'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/speak" element={<HumanToPet />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Layout>
  )
}

export default App
