
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlog } from "../contexts/BlogContext";
import { User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const BlogProfile = () => {
  const { state, updateUser, logout } = useBlog();
  const navigate = useNavigate();
  const { currentUser } = state;
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
  });
  
  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/blog/login');
      return;
    }
    
    // Load user data
    setFormData({
      username: currentUser.username,
      email: currentUser.email,
      avatar: currentUser.avatar || '',
    });
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    updateUser(currentUser.id, {
      username: formData.username,
      email: formData.email,
      avatar: formData.avatar || undefined,
    });
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
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
            {currentUser.role === 'admin' && (
              <Link to="/blog/users" className="text-white hover:text-purple-400 transition-colors">Users</Link>
            )}
            <Button variant="outline" onClick={logout}>Logout</Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="flex justify-center my-4">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.username}
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.username)}&background=8B5CF6&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center">
                      <User size={48} className="text-slate-400" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold">{currentUser.username}</h2>
                <p className="text-purple-400">{currentUser.role}</p>
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={16} className="text-slate-400" />
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar size={16} className="text-slate-400" />
                    <span>Joined {format(currentUser.createdAt, 'MMMM yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL (optional)</Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="text-xs text-slate-400">
                      Leave empty to use a generated avatar based on your username
                    </p>
                  </div>
                  
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Your Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {state.posts.filter(post => post.author.id === currentUser.id).length > 0 ? (
                  <div className="space-y-4">
                    {state.posts
                      .filter(post => post.author.id === currentUser.id)
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map(post => (
                        <div key={post.id} className="border-b border-slate-700 pb-4 last:border-none">
                          <Link to={`/blog/posts/${post.id}`} className="text-lg font-medium hover:text-purple-400">
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                            <Calendar size={14} />
                            {format(post.createdAt, 'MMMM dd, yyyy')}
                            {!post.published && (
                              <span className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-0.5 rounded-full">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">You haven't written any posts yet</p>
                    <Link to="/blog/posts/new">
                      <Button className="mt-4">Create Your First Post</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogProfile;
