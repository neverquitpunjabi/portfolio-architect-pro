
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'author' | 'reader';
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  coverImage?: string;
  videoUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

// For simulating our backend in this React app
export interface BlogState {
  users: User[];
  posts: Post[];
  currentUser: User | null;
}
