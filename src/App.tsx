import { lazy, Suspense } from 'react'
import './App.css'
import { AnimatePresence } from 'framer-motion'
import Header from './components/shared/Header'
import MenuProvider from './contexts/MenuContext'
import Footer from './components/shared/Footer'
import Loader from './components/ui/Loader'

const Landing = lazy(() => import("./landing"))

function App() {

  return (
    <Suspense fallback={
      <div style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Loader />
      </div>
    }>
      <MenuProvider>
        <Header />
        <main id="main">
          <AnimatePresence>
            <Landing />
          </AnimatePresence>
          <Footer />
        </main>
      </MenuProvider>
    </Suspense>
  )
}

export default App