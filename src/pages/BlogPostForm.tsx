
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBlog } from "../contexts/BlogContext";
import { ArrowLeft, X } from 'lucide-react';
import { Post } from '../types/blog';

const BlogPostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, createPost, updatePost, getPost } = useBlog();
  const { currentUser } = state;
  
  const isEditing = !!id;
  const existingPost = isEditing ? getPost(id) : undefined;
  
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    videoUrl: string;
    tags: string[];
    published: boolean;
  }>({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    videoUrl: '',
    tags: [],
    published: true,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/blog/login');
      return;
    }
    
    // Load existing post data if editing
    if (isEditing && existingPost) {
      setFormData({
        title: existingPost.title,
        content: existingPost.content,
        excerpt: existingPost.excerpt,
        coverImage: existingPost.coverImage || '',
        videoUrl: existingPost.videoUrl || '',
        tags: [...existingPost.tags],
        published: existingPost.published,
      });
    }
  }, [isEditing, existingPost, currentUser, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      if (isEditing && existingPost) {
        updatePost(existingPost.id, formData);
        navigate(`/blog/posts/${existingPost.id}`);
      } else {
        const newPost = createPost(formData);
        navigate(`/blog/posts/${newPost.id}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (isEditing && !existingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-6">The post you're trying to edit doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>Go Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-900 shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/blog" className="text-2xl font-bold text-purple-400">DevBlog</Link>
          <nav className="flex items-center gap-4">
            <Link to="/blog" className="text-white hover:text-purple-400 transition-colors">Home</Link>
            <Link to="/blog/posts/new" className="text-white hover:text-purple-400 transition-colors">New Post</Link>
            {currentUser?.role === 'admin' && (
              <Link to="/blog/users" className="text-white hover:text-purple-400 transition-colors">Users</Link>
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
        
        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (Short description)</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className={errors.excerpt ? 'border-red-500' : ''}
                  rows={2}
                />
                {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML supported)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className={errors.content ? 'border-red-500' : ''}
                  rows={10}
                />
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.coverImage && (
                  <div className="mt-2 aspect-video w-full max-h-40 overflow-hidden rounded-md">
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video Embed URL (YouTube, Vimeo, etc.)</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/embed/video-id"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-slate-700 text-sm px-2 py-1 rounded-full text-purple-300 flex items-center gap-1"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">{isEditing ? 'Update Post' : 'Create Post'}</Button>
                <Button type="button" variant="outline" onClick={() => navigate('/blog')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BlogPostForm;
