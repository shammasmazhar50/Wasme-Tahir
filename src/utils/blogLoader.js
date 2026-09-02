import blogIndex from '../content/blog-index.json';

export function getBlogs() {
  return blogIndex;
}

export async function getBlogBySlug(slug) {
  const metadata = blogIndex.find(blog => blog.slug === slug || blog.fileSlug === slug);
  if (!metadata) return null;
  
  try {
    // Dynamically fetch only the specific markdown file
    const markdownModules = import.meta.glob('../content/blogs/*.md', { query: '?raw', import: 'default' });
    const fetchMarkdown = markdownModules[`../content/blogs/${metadata.fileSlug}.md`];
    
    if (!fetchMarkdown) return null;
    
    const rawText = await fetchMarkdown();
    const { content } = parseMarkdown(rawText);
    
    return {
      ...metadata,
      content
    };
  } catch (error) {
    console.error("Error loading blog:", error);
    return null;
  }
}

function parseMarkdown(rawText) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawText.match(frontmatterRegex);
  
  if (!match) return { frontmatter: {}, content: rawText };
  
  return { content: match[2] };
}
