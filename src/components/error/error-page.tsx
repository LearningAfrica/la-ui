'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Home, AlertTriangle, Bug, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Application Error:', error);
	}, [error]);

	const isDevelopment = process.env.NODE_ENV === 'development';

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4 dark:from-gray-900 dark:to-gray-800">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
						<AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
						Something went wrong!
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Error Description */}
					<div className="text-center">
						<p className="mb-2 text-gray-600 dark:text-gray-300">
							We encountered an unexpected error while processing your request.
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Our team has been notified and is working to fix this issue.
						</p>
					</div>

					{/* Error Details (Development Only) */}
					{isDevelopment && (
						<Alert variant="destructive">
							<Bug className="h-4 w-4" />
							<AlertDescription className="font-mono text-xs">
								<strong>Error:</strong> {error.message}
								{error.digest && (
									<>
										<br />
										<strong>Digest:</strong> {error.digest}
									</>
								)}
							</AlertDescription>
						</Alert>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Button onClick={reset} size="lg" className="w-full sm:w-auto">
							<RefreshCw className="mr-2 h-4 w-4" />
							Try Again
						</Button>

						<Button
							variant="outline"
							size="lg"
							className="w-full bg-transparent sm:w-auto"
							asChild
						>
							<Link to="/">
								<Home className="mr-2 h-4 w-4" />
								Go Home
							</Link>
						</Button>
					</div>

					{/* Additional Help */}
					<div className="border-t pt-6 text-center">
						<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
							If this problem persists, please contact our support team:
						</p>
						<div className="flex flex-col justify-center gap-2 sm:flex-row">
							<Button variant="ghost" size="sm" asChild>
								<Link to="/dashboard/student/support">Get Support</Link>
							</Button>
							<Button variant="ghost" size="sm" asChild>
								<a href="mailto:support@lms.com">
									<Mail className="mr-1 h-3 w-3" />
									Email Support
								</a>
							</Button>
						</div>

						{error.digest && (
							<p className="mt-4 text-xs text-gray-400">
								Error ID: {error.digest}
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
