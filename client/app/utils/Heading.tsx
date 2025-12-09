import { useEffect } from 'react'

interface HeadingProps {
  title: string
  description?: string
  keywords?: string
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  keywords
}) => {
  useEffect(() => {
    // Set document title
    document.title = title

    // Set meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)
    }

    // Set meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords)
    }

    // Cleanup on unmount
    return () => {
      document.title = 'ELearning'
    }
  }, [title, description, keywords])

  return null
}