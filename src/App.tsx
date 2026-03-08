import { lazy, Suspense } from 'react'
import './App.css'
import { AnimatePresence } from 'framer-motion'
import Header from './components/shared/Header'

const Landing = lazy(() => import("./landing"))

function App() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <main id="main">
        <AnimatePresence>
          <Landing />
        </AnimatePresence>
      </main>
    </Suspense>
  )
}

export default App