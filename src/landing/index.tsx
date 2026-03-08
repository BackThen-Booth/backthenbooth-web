import React from "react"

const Section = React.lazy(() => import("../components/ui/Section"))
const Hero = React.lazy(() => import("../components/sections/Hero"))

export default function Landing() {

  return (
    <>
      <Section name="hero">
        <Hero />
      </Section>
    </>
  )
}