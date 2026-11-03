import { useEffect } from 'react'
import { company } from '../../shared/company'

const setMeta = (selector, attr, key, value) => {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute(selector.startsWith('link') ? 'href' : 'content', value)
  return el
}

/** Keeps the document title, description, canonical URL and social tags in sync with the page. */
export default function Seo({ title, description, path = '/', noindex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${company.name}` : `${company.name} | Plumbing & Building Management, Barking`
    const url = `${company.url}${path === '/' ? '/' : path}`

    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('link[rel="canonical"]', 'rel', 'canonical', url)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)

    const robots = setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    return () => robots.setAttribute('content', 'index, follow')
  }, [title, description, path, noindex])

  return null
}
