import React, { useEffect, useState } from "react"

import './styles.css'

const Section = React.lazy(() => import("../components/ui/Section"))
const Hero = React.lazy(() => import("../components/sections/Hero"))
const Gallery = React.lazy(() => import('../components/sections/Gallery'))
const Contact = React.lazy(() => import('../components/sections/Contact'))
const Locations = React.lazy(() => import('../components/sections/Locations'))

export default function Landing() {
  const [mode, setMode] = useState<"mobile" | "desktop" | null>(null)

  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth <= 800) setMode("mobile");
      else setMode("desktop")
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <>
      <Section name="home" data-mobile={mode == "desktop" ? false : true}>
        <Hero />
      </Section>
      <Section name="gallery">
        <Gallery />
      </Section>
      <Section name="locations">
        <Locations />
      </Section>
      <Section name="contact">
        <Contact />
      </Section>
    </>
  )
}