// Prepends Vite's BASE_URL to any public asset path stored in JSON data.
// In dev BASE_URL is "/"; in production (GitHub Pages) it is "/storyweaver/".
export function publicUrl(path) {
  if (!path) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
