import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="mb-4 text-8xl font-bold text-blue-600 dark:text-blue-400">
              404
            </div>
            <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="mb-2 text-lg text-gray-600 dark:text-gray-300">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full bg-transparent sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="border-t pt-6">
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Looking for something specific? Try these:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/courses">
                  <Search className="mr-1 h-3 w-3" />
                  Browse Courses
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/categories">Categories</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/instructors">Instructors</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/student/support">
                  <HelpCircle className="mr-1 h-3 w-3" />
                  Get Help
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
