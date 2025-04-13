
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlog } from "../contexts/BlogContext";

const BlogLogin = () => {
  const { state, login } = useBlog();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Redirect if already logged in
    if (state.currentUser) {
      navigate('/blog');
    }
  }, [state.currentUser, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    // For demo purposes, find any user with this email
    const userExists = state.users.some((user) => user.email === email);
    
    if (!userExists) {
      setError('User not found. Please try a different email or sign up.');
      return;
    }
    
    login(email);
    // The redirect will happen automatically in the useEffect
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link to="/blog" className="text-2xl font-bold text-purple-400">DevBlog</Link>
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p>For demo purposes, use one of these emails:</p>
            <ul className="mt-2 space-y-1">
              {state.users.map((user) => (
                <li key={user.id}>
                  <button
                    className="text-purple-400 hover:underline"
                    onClick={() => setEmail(user.email)}
                  >
                    {user.email} ({user.role})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/blog" className="text-sm text-purple-400 hover:underline">
            Back to Blog
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogLogin;
