import { useEffect } from 'react'
import './styles.css'

export default function Loader() {
  useEffect(() => {
      document.documentElement.classList.add("no-scroll")
      document.body.classList.add("no-scroll")

      return () => {
        document.documentElement.classList.remove("no-scroll")
        document.body.classList.remove("no-scroll")
      }
  }, [])

  return (
    <div className='loader' />
  )
}