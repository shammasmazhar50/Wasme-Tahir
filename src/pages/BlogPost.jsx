import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import { getBlogBySlug } from '../utils/blogLoader';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    async function loadBlog() {
      const foundBlog = await getBlogBySlug(slug);
      if (!foundBlog) {
        navigate('/press', { replace: true });
      } else {
        setBlog(foundBlog);
      }
    }
    loadBlog();
  }, [slug, navigate]);

  if (!blog) return null;

  const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
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
      <div className="container">
        <Link to="/press" className="back-link">
          <ArrowLeft size={16} /> Back to Press
        </Link>
        
        <article className="blog-article">
          <header className="blog-header">
            <span className="blog-category">{blog.category}</span>
            <h1 className="heading-lg">{blog.title}</h1>
            <span className="blog-date">{formattedDate}</span>
          </header>
          
          {blog.image && (
            <div className="blog-hero-image">
              <img 
                src={blog.image} 
                alt={blog.title} 
                style={{ objectPosition: blog.imagePosition || 'center' }} 
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
