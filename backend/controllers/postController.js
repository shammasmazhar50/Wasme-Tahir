const Post = require('../models/Post');
const { clearCache } = require('../middleware/cacheMiddleware');

const ALLOWED_CATEGORIES = ['EDITORIAL', 'LIFESTYLE', 'FASHION', 'BEAUTY', 'TRAVEL'];

/* Sanitize user input — pick only known safe fields */
const sanitizePostInput = (body) => {
  const { title, slug, content, excerpt, coverImage, category, published } = body;
  return {
    title:      typeof title      === 'string' ? title.trim().slice(0, 500)   : undefined,
    slug:       typeof slug       === 'string' ? slug.trim().toLowerCase().slice(0, 200).replace(/[^a-z0-9-]/g, '') : undefined,
    content:    typeof content    === 'string' ? content.trim()               : undefined,
    excerpt:    typeof excerpt    === 'string' ? excerpt.trim().slice(0, 1000): '',
    coverImage: typeof coverImage === 'string' ? coverImage.trim().slice(0, 500) : '',
    category:   ALLOWED_CATEGORIES.includes(category) ? category : 'EDITORIAL',
    published:  typeof published  === 'boolean' ? published : false,
    ...(published ? { publishedAt: new Date() } : {}),
  };
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
    res.json(posts);
  } catch (err) {
    console.error('[POST] getPosts error:', err.message);
    next(err);
  }
};

exports.getPostBySlug = async (req, res, next) => {
  try {
    const slug = String(req.params.slug).toLowerCase().replace(/[^a-z0-9-]/g, '');
    const post = await Post.findOne({ where: { slug, published: true } });
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const data = sanitizePostInput(req.body);
    if (!data.title || !data.slug || !data.content) {
      return res.status(400).json({ message: 'Title, slug and content are required.' });
    }
    const post = await Post.create(data);
    clearCache('/api/posts');
    res.status(201).json(post);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'A post with that slug already exists.' });
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid post ID.' });

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const data = sanitizePostInput(req.body);
    await post.update(data);
    clearCache('/api/posts');
    res.json(post);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'A post with that slug already exists.' });
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid post ID.' });

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    await post.destroy();
    clearCache('/api/posts');
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    next(err);
  }
};
