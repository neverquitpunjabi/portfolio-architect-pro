
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, Post, BlogState } from '../types/blog';
import { useToast } from '@/hooks/use-toast';

// Default user and posts for demo
const defaultUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: new Date(),
};

const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: `
      <p>React is a powerful JavaScript library for building user interfaces.</p>
      <p>This post will guide you through the basics of React and how to get started with your first React application.</p>
      <h2>Why React?</h2>
      <p>React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.</p>
    `,
    excerpt: 'Learn the basics of React and how to create your first application',
    author: defaultUser,
    coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: new Date(),
    updatedAt: new Date(),
    published: true,
  },
  {
    id: '2',
    title: 'Advanced CSS Techniques',
    content: `
      <p>CSS has evolved tremendously over the past few years.</p>
      <p>In this post, we'll explore some advanced CSS techniques that can take your web design skills to the next level.</p>
      <h2>CSS Grid Layout</h2>
      <p>CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay content out in rows and columns.</p>
      <p>Check out this video tutorial:</p>
    `,
    excerpt: 'Discover modern CSS techniques to enhance your web designs',
    author: defaultUser,
    videoUrl: 'https://www.youtube.com/embed/jV8B24rSN5o',
    tags: ['CSS', 'Web Design', 'Frontend'],
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
    published: true,
  },
];

interface BlogContextType {
  state: BlogState;
  login: (email: string) => void;
  logout: () => void;
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: string, user: Partial<User>) => User | null;
  deleteUser: (id: string) => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => Post;
  updatePost: (id: string, post: Partial<Post>) => Post | null;
  deletePost: (id: string) => void;
  getPost: (id: string) => Post | undefined;
  getUser: (id: string) => User | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [state, setState] = useState<BlogState>(() => {
    const savedState = localStorage.getItem('blog-state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Convert string dates back to Date objects
      return {
        ...parsedState,
        posts: parsedState.posts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        })),
        users: parsedState.users.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
        })),
      };
    }
    return {
      users: [defaultUser],
      posts: samplePosts,
      currentUser: null,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('blog-state', JSON.stringify(state));
  }, [state]);

  const login = (email: string) => {
    const user = state.users.find((u) => u.email === email);
    if (user) {
      setState({ ...state, currentUser: user });
      toast({
        title: 'Logged in successfully',
        description: `Welcome back, ${user.username}!`,
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'User not found',
        variant: 'destructive',
      });
    }
  };

  const logout = () => {
    setState({ ...state, currentUser: null });
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    setState({
      ...state,
      users: [...state.users, newUser],
    });
    
    toast({
      title: 'User created',
      description: `User ${newUser.username} has been created successfully`,
    });
    
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    const userIndex = state.users.findIndex((u) => u.id === id);
    
    if (userIndex === -1) {
      toast({
        title: 'Update failed',
        description: 'User not found',
        variant: 'destructive',
      });
      return null;
    }
    
    const updatedUser = {
      ...state.users[userIndex],
      ...userData,
    };
    
    const updatedUsers = [...state.users];
    updatedUsers[userIndex] = updatedUser;
    
    // Update current user if it's the same user
    const updatedCurrentUser = 
      state.currentUser && state.currentUser.id === id 
        ? updatedUser 
        : state.currentUser;
    
    setState({
      ...state,
      users: updatedUsers,
      currentUser: updatedCurrentUser,
    });
    
    toast({
      title: 'User updated',
      description: `User ${updatedUser.username} has been updated successfully`,
    });
    
    return updatedUser;
  };

  const deleteUser = (id: string) => {
    if (state.currentUser && state.currentUser.id === id) {
      toast({
        title: 'Delete failed',
        description: 'Cannot delete currently logged in user',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedUsers = state.users.filter((u) => u.id !== id);
    
    // Remove posts by this user or reassign them to admin
    const adminUser = updatedUsers.find((u) => u.role === 'admin') || updatedUsers[0];
    const updatedPosts = state.posts.map((post) => 
      post.author.id === id ? { ...post, author: adminUser } : post
    );
    
    setState({
      ...state,
      users: updatedUsers,
      posts: updatedPosts,
    });
    
    toast({
      title: 'User deleted',
      description: 'The user has been deleted successfully',
    });
  };

  const createPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
    if (!state.currentUser) {
      toast({
        title: 'Create post failed',
        description: 'You must be logged in to create a post',
        variant: 'destructive',
      });
      throw new Error('User not logged in');
    }
    
    const now = new Date();
    const newPost: Post = {
      ...postData,
      id: uuidv4(),
      author: state.currentUser,
      createdAt: now,
      updatedAt: now,
    };
    
    setState({
      ...state,
      posts: [...state.posts, newPost],
    });
    
    toast({
      title: 'Post created',
      description: `"${newPost.title}" has been created successfully`,
    });
    
    return newPost;
  };

  const updatePost = (id: string, postData: Partial<Post>) => {
    const postIndex = state.posts.findIndex((p) => p.id === id);
    
    if (postIndex === -1) {
      toast({
        title: 'Update failed',
        description: 'Post not found',
        variant: 'destructive',
      });
      return null;
    }
    
    // Check if user has permission (admin or the author)
    const userCanEdit = 
      state.currentUser?.role === 'admin' || 
      state.posts[postIndex].author.id === state.currentUser?.id;
    
    if (!userCanEdit) {
      toast({
        title: 'Update failed',
        description: 'You do not have permission to edit this post',
        variant: 'destructive',
      });
      return null;
    }
    
    const updatedPost = {
      ...state.posts[postIndex],
      ...postData,
      updatedAt: new Date(),
    };
    
    const updatedPosts = [...state.posts];
    updatedPosts[postIndex] = updatedPost;
    
    setState({
      ...state,
      posts: updatedPosts,
    });
    
    toast({
      title: 'Post updated',
      description: `"${updatedPost.title}" has been updated successfully`,
    });
    
    return updatedPost;
  };

  const deletePost = (id: string) => {
    const post = state.posts.find((p) => p.id === id);
    
    if (!post) {
      toast({
        title: 'Delete failed',
        description: 'Post not found',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if user has permission (admin or the author)
    const userCanDelete = 
      state.currentUser?.role === 'admin' || 
      post.author.id === state.currentUser?.id;
    
    if (!userCanDelete) {
      toast({
        title: 'Delete failed',
        description: 'You do not have permission to delete this post',
        variant: 'destructive',
      });
      return;
    }
    
    setState({
      ...state,
      posts: state.posts.filter((p) => p.id !== id),
    });
    
    toast({
      title: 'Post deleted',
      description: `"${post.title}" has been deleted successfully`,
    });
  };

  const getPost = (id: string) => {
    return state.posts.find((p) => p.id === id);
  };

  const getUser = (id: string) => {
    return state.users.find((u) => u.id === id);
  };

  return (
    <BlogContext.Provider
      value={{
        state,
        login,
        logout,
        createUser,
        updateUser,
        deleteUser,
        createPost,
        updatePost,
        deletePost,
        getPost,
        getUser,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
