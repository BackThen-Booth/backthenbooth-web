import React from "react"

import './styles.css'

const Section = React.lazy(() => import("../components/ui/Section"))
const Hero = React.lazy(() => import("../components/sections/Hero"))
const Gallery = React.lazy(() => import('../components/sections/Gallery'))
const Contact = React.lazy(() => import('../components/sections/Contact'))
const Locations = React.lazy(() => import('../components/sections/Locations'))

export default function Landing() {
  return (
    <>
      <Section name="home" data-speed={1}>
        <Hero />
      </Section>
      <Section name="gallery" data-speed={2}>
        <Gallery />
      </Section>
      <Section name="locations" data-speed={2}>
        <Locations />
      </Section>
      <Section name="contact" data-speed={2}>
        <Contact />
      </Section>
    </>
  )
}