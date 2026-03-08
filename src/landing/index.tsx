import React from "react"

const Section = React.lazy(() => import("../components/ui/Section"))
const Hero = React.lazy(() => import("../components/sections/Hero"))
const Gallery = React.lazy(() => import("../components/sections/Gallery"))

export default function Landing() {

  return (
    <>
      <Section name="hero">
        <Hero />
      </Section>
      <Section name="gallery">
        <Gallery />
      </Section>
    </>
  )
}