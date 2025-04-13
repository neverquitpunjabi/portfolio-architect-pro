
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Blog Pages
import BlogIndex from "./pages/BlogIndex";
import BlogPostDetail from "./pages/BlogPostDetail";
import BlogPostForm from "./pages/BlogPostForm";
import BlogUsers from "./pages/BlogUsers";
import BlogLogin from "./pages/BlogLogin";
import BlogProfile from "./pages/BlogProfile";
import { BlogProvider } from "./contexts/BlogContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BlogProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/posts/:id" element={<BlogPostDetail />} />
            <Route path="/blog/posts/new" element={<BlogPostForm />} />
            <Route path="/blog/posts/edit/:id" element={<BlogPostForm />} />
            <Route path="/blog/users" element={<BlogUsers />} />
            <Route path="/blog/login" element={<BlogLogin />} />
            <Route path="/blog/profile" element={<BlogProfile />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BlogProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
