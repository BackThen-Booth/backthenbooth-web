import React from "react"

import './styles.css'

const Section = React.lazy(() => import("../components/ui/Section"))
const Hero = React.lazy(() => import("../components/sections/Hero"))
const Gallery = React.lazy(() => import("../components/sections/Gallery"))

export default function Landing() {

  return (
    <>
      <Section name="home">
        <Hero />
      </Section>
      <Section name="gallery">
        <Gallery />
      </Section>
    </>
  )
}