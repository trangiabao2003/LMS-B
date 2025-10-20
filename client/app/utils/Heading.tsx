import React from 'react'

interface Props {
  title: string
  description?: string
  keywords?: string
}

export default function Heading({ title, description, keywords }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {keywords && <p>{keywords}</p>}
    </div>
  )
}