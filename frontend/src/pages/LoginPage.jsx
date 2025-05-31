import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigationTarget) {
      console.log(`Effect: Navigating to ${navigationTarget}`);
      navigate(navigationTarget, { replace: true });
    }
  }, [navigationTarget, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting login with:', { email, password });
    try {
      const response = await login({ email, password });
      console.log('API Response:', response);
      const token = response.data.token;
      if (!token) {
        throw new Error('No token received from server');
      }
      localStorage.setItem('token', token);
      console.log('Stored token:', token);
      localStorage.setItem('username', response.data.username || 'John Smith');
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      try {
        const payload = jwtDecode(token);
        console.log('Decoded Token Payload:', payload);
        console.log('Role in payload:', payload.role);
        if (payload.role && payload.role.toLowerCase() === 'admin') {
          console.log('Navigating to /admin');
          setNavigationTarget('/admin');
        } else {
          console.log('Role is not admin, navigating to /profile');
          setNavigationTarget('/profile');
        }
      } catch (decodeError) {
        console.error('Token decoding error:', decodeError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid token format. Redirecting to profile as fallback.",
        });
        setNavigationTarget('/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";
      
      alert(errorMessage.includes('password') ? 'Incorrect password. Please try again.' : errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary/10 min-h-[calc(100vh-64px)] flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md border border-secondary/30 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary rounded-full p-3">
            <Book className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-center mb-6 text-primary">Sign in to your account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <a href="/forgot-password" className="text-sm text-primary hover:text-accent">
              Forgot your password?
            </a>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-accent font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;