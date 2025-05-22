
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useElectionContext } from '@/contexts/ElectionContext';
import { Vote } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, currentUser } = useElectionContext();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (currentUser) {
    navigate('/');
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      setIsLoading(false);
      return;
    }
    
    // In a real app, we would authenticate against a backend
    // For demo purposes, we just check if the email is one of our mock users
    const loggedInUser = login(email);
    
    setTimeout(() => {
      setIsLoading(false);
      if (loggedInUser) {
        navigate('/');
      }
    }, 500);
  };
  
  // Demo message for test users
  const demoUsers = [
    { email: 'john@company.com', note: 'Has already voted in one election' },
    { email: 'jane@company.com', note: 'Has not voted yet' },
    { email: 'bob@company.com', note: 'Has already voted in one election' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-election-primary to-election-dark">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Vote className="h-12 w-12 text-election-accent" />
          </div>
          <CardTitle className="text-2xl">Welcome to ElectPro</CardTitle>
          <CardDescription>
            Log in to vote or manage elections
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full bg-election-primary hover:bg-election-secondary text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : 'Log in'}
            </Button>
            
            {/* Demo info */}
            <div className="mt-6 border-t pt-4 text-sm text-gray-500">
              <p className="font-medium mb-2">For Demo Purposes:</p>
              <p className="mb-2">You can use any of these test emails:</p>
              <ul className="space-y-1 list-disc list-inside">
                {demoUsers.map(user => (
                  <li key={user.email}>
                    <button 
                      type="button"
                      className="font-medium text-election-secondary hover:underline"
                      onClick={() => setEmail(user.email)}
                    >
                      {user.email}
                    </button>
                    <span> - {user.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
