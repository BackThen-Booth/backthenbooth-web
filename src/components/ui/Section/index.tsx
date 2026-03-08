import React from 'react'

import './styles.css'

export default function Section({
    name,
    children
}: {
    name: string,
    children: React.ReactNode
}) {
  return (
    <section className="section" id={name}>
        {children}
    </section>
  )
}
