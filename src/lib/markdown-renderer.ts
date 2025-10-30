/**
 * Markdown Renderer Utility
 * Converts markdown to HTML and extracts plain text for search
 */

/**
 * Renders markdown to safe HTML
 * Simple implementation - can be enhanced with markdown-it or similar
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return ''

  let html = markdown

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')

  // Italic: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')

  // Headers: # H1, ## H2, ### H3, etc.
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')

  // Lists: - item or * item
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
  html = html.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc ml-6 my-2">$&</ul>')

  // Code blocks: ```code```
  html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-3 rounded my-2 overflow-x-auto"><code>$1</code></pre>')

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')

  // Line breaks
  html = html.replace(/\n/g, '<br/>')

  // Blockquotes: > text
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">$1</blockquote>')

  return html
}

/**
 * Extracts plain text from markdown (for search functionality)
 */
export function extractPlainText(markdown: string): string {
  if (!markdown) return ''

  let text = markdown

  // Remove markdown syntax
  text = text.replace(/\*\*(.*?)\*\*/g, '$1') // Bold
  text = text.replace(/__(.*?)__/g, '$1')
  text = text.replace(/\*(.*?)\*/g, '$1') // Italic
  text = text.replace(/_(.*?)_/g, '$1')
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
  text = text.replace(/^#{1,6}\s+/gim, '') // Headers
  text = text.replace(/```[^`]+```/g, '') // Code blocks
  text = text.replace(/`([^`]+)`/g, '$1') // Inline code
  text = text.replace(/^[\-\*]\s+/gim, '') // Lists
  text = text.replace(/^&gt;\s+/gim, '') // Blockquotes
  text = text.replace(/\n+/g, ' ') // Newlines to spaces
  text = text.replace(/\s+/g, ' ') // Multiple spaces to single

  return text.trim()
}
