import React from 'react'

import './styles.css'

export default function Section({
  name,
  children,
  ...rest
}: {
  name: string,
  children: React.ReactNode
}) {
  return (
    <section className="section" id={name} {...rest}>
      {children}
    </section>
  )
}
