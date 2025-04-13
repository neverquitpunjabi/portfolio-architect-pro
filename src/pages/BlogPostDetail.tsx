
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useBlog } from "../contexts/BlogContext";
import { format } from 'date-fns';
import { Calendar, Tag, User, Edit, Trash2, ArrowLeft } from 'lucide-react';

const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state, getPost, deletePost } = useBlog();
  const navigate = useNavigate();
  const { currentUser } = state;
  
  // Get the post using the ID from URL params
  const post = getPost(id || '');
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>Go Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const canEdit = currentUser && (currentUser.id === post.author.id || currentUser.role === 'admin');
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
      navigate('/blog');
    }
  };

  // Process video URL to ensure proper embedding format
  const getEmbedUrl = (url: string | undefined) => {
    if (!url) return '';
    
    // Check if it's already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Convert youtube.com or youtu.be URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = new URLSearchParams(url.split('?')[1]).get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // For other services or if already in proper embed format, return as is
    return url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-900 shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/blog" className="text-2xl font-bold text-purple-400">DevBlog</Link>
          <nav className="flex items-center gap-4">
            <Link to="/blog" className="text-white hover:text-purple-400 transition-colors">Home</Link>
            {currentUser && (
              <>
                <Link to="/blog/posts/new" className="text-white hover:text-purple-400 transition-colors">New Post</Link>
                {currentUser.role === 'admin' && (
                  <Link to="/blog/users" className="text-white hover:text-purple-400 transition-colors">Users</Link>
                )}
                <Link to="/blog/profile" className="text-white hover:text-purple-400 transition-colors">Profile</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/blog" className="flex items-center text-purple-400 hover:text-purple-300">
            <ArrowLeft size={16} className="mr-1" />
            Back to Posts
          </Link>
        </div>
        
        {/* Post header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-4">
            <div className="flex items-center gap-2">
              <User size={16} />
              {post.author.username}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {format(post.createdAt, 'MMMM dd, yyyy')}
            </div>
          </div>
          <div className="flex gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-slate-700 text-xs px-2 py-1 rounded-full text-purple-300 flex items-center gap-1">
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Post actions */}
        {canEdit && (
          <div className="flex gap-2 mb-6">
            <Link to={`/blog/posts/edit/${post.id}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit size={16} />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" className="flex items-center gap-2" onClick={handleDelete}>
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        )}
        
        {/* Featured image */}
        {post.coverImage && (
          <div className="aspect-video max-h-96 w-full overflow-hidden rounded-lg mb-8">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Post content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        {/* Embedded video */}
        {post.videoUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Featured Video</h2>
            <div className="aspect-video w-full">
              <iframe 
                className="w-full h-full rounded-lg"
                src={getEmbedUrl(post.videoUrl)} 
                title="Embedded video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogPostDetail;
