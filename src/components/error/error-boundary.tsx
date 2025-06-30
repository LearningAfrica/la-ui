'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Home, AlertTriangle, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError && this.state.error) {
			const FallbackComponent = this.props.fallback || DefaultErrorFallback;
			return (
				<FallbackComponent
					error={this.state.error}
					reset={() => this.setState({ hasError: false, error: undefined })}
				/>
			);
		}

		return this.props.children;
	}
}

function DefaultErrorFallback({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	const isDevelopment = process.env.NODE_ENV === 'development';

	return (
		<div className="flex min-h-[400px] items-center justify-center p-4">
			<Card className="w-full max-w-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
						<AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
					</div>
					<CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
						Something went wrong
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="text-center">
						<p className="text-sm text-gray-600 dark:text-gray-300">
							An unexpected error occurred in this component.
						</p>
					</div>

					{isDevelopment && (
						<Alert variant="destructive">
							<Bug className="h-4 w-4" />
							<AlertDescription className="font-mono text-xs">
								{error.message}
							</AlertDescription>
						</Alert>
					)}

					<div className="flex flex-col justify-center gap-2 sm:flex-row">
						<Button onClick={reset} size="sm">
							<RefreshCw className="mr-2 h-3 w-3" />
							Try Again
						</Button>

						<Button variant="outline" size="sm" asChild>
							<Link to="/">
								<Home className="mr-2 h-3 w-3" />
								Go Home
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default ErrorBoundary;
