import { lazy, Suspense } from 'react'
import './App.css'
import { AnimatePresence } from 'framer-motion'
import Header from './components/shared/Header'
import MenuProvider from './contexts/MenuContext'
import Footer from './components/shared/Footer'

const Landing = lazy(() => import("./landing"))

function App() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuProvider>
        <Header />
        <main id="main">
          <AnimatePresence>
            <Landing />
          </AnimatePresence>
        </main>
        <Footer />
      </MenuProvider>
    </Suspense>
  )
}

export default App