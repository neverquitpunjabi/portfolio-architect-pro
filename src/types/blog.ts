
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
  /**
   * YouTube video URL in one of these formats:
   * - YouTube embed URL: https://www.youtube.com/embed/VIDEO_ID
   * - YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
   * - YouTube short URL: https://youtu.be/VIDEO_ID
   * The application will automatically convert watch and short URLs to embed format.
   */
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
