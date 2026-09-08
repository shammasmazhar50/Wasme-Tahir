import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    async function loadBlog() {
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API}/api/posts/${slug}`);
        if (!res.ok) {
          navigate('/press', { replace: true });
          return;
        }
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        navigate('/press', { replace: true });
      }
    }
    loadBlog();
  }, [slug, navigate]);

  if (!blog) return null;

  const formattedDate = new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      className="blog-post-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {blog && (
        <SEO 
          title={`${blog.title} | Wasme Tahir`} 
          description={blog.excerpt || blog.content.substring(0, 150)}
          image={blog.coverImage || blog.image}
          url={`https://wasmetahir.com/post/${blog.slug || slug}`}
          type="article"
        />
      )}
      <div className="container">
        <Link to="/press" className="back-link">
          <ArrowLeft size={16} /> Back to Press
        </Link>
        
        <article className="blog-article">
          <header className="blog-header">
            <span className="blog-category">{blog.category || 'EDITORIAL'}</span>
            <h1 className="heading-lg">{blog.title}</h1>
            <span className="blog-date">{formattedDate}</span>
          </header>
          
          {(blog.coverImage || blog.image) && (
            <div className="blog-hero-image">
              <img 
                src={blog.coverImage || blog.image} 
                alt={blog.title} 
                style={{ objectPosition: 'center' }}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          
          <div className="blog-content body-lg">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPost;
