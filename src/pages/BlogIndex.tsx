
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlog } from "../contexts/BlogContext";
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Tag, User } from 'lucide-react';

const BlogIndex = () => {
  const { state, login, logout } = useBlog();
  const { posts, currentUser } = state;

  // Sort posts by date (newest first)
  const sortedPosts = [...posts]
    .filter(post => post.published || currentUser?.role === 'admin')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const handleLoginDemo = () => {
    login('admin@example.com');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-900 shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/blog" className="text-2xl font-bold text-purple-400">DevBlog</Link>
          <nav className="flex items-center gap-4">
            <Link to="/blog" className="text-white hover:text-purple-400 transition-colors">Home</Link>
            {currentUser ? (
              <>
                <Link to="/blog/posts/new" className="text-white hover:text-purple-400 transition-colors">New Post</Link>
                {currentUser.role === 'admin' && (
                  <Link to="/blog/users" className="text-white hover:text-purple-400 transition-colors">Users</Link>
                )}
                <Link to="/blog/profile" className="text-white hover:text-purple-400 transition-colors">Profile</Link>
                <Button variant="outline" onClick={logout} className="ml-2">Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleLoginDemo} className="ml-2">Demo Login</Button>
                <Link to="/blog/login">
                  <Button className="ml-2">Login</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Latest Posts</h1>
          {currentUser && (
            <Link to="/blog/posts/new">
              <Button>Create New Post</Button>
            </Link>
          )}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all hover-scale">
              <CardHeader className="pb-2">
                {post.coverImage && (
                  <div className="aspect-video w-full overflow-hidden rounded-md mb-2">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-xl text-white">
                  <Link to={`/blog/posts/${post.id}`} className="hover:text-purple-400 transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 line-clamp-3">{post.excerpt}</p>
                <div className="flex gap-2 mt-3">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-slate-700 text-xs px-2 py-1 rounded-full text-purple-300 flex items-center gap-1">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-400">{post.author.username}</span>
                </div>
                <Link to={`/blog/posts/${post.id}`}>
                  <Button variant="link" className="text-purple-400 p-0">
                    Read more
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl text-slate-400">No posts found</h2>
            {currentUser && (
              <Link to="/blog/posts/new">
                <Button className="mt-4">Create your first post</Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogIndex;
