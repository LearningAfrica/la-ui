import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useResendVerificationEmail } from "@/features/auth/auth-mutations";

interface EmailVerificationPendingProps {
  email?: string;
}

export function EmailVerificationPending({
  email,
}: EmailVerificationPendingProps) {
  // const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);
  const { mutateAsync: resendVerificationEmail, status: resendStatus } =
    useResendVerificationEmail();
  const handleResendVerificationEmail = async () => {
    if (email) {
      await resendVerificationEmail(email, {
        onSuccess: () => {
          // navigate(
          //   "/email-verification-pending" +
          //     (email ? `?email=${encodeURIComponent(email)}` : "")
          // );
          setIsSent(true);
        },
      });
      // Optionally, you can show a toast notification here
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
            <Mail className="h-10 w-10 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email Address</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {email && (
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-sm font-medium">{email}</p>
            </div>
          )}
          <div className="text-muted-foreground space-y-2 text-sm">
            <p>To complete your registration, please:</p>
            <ol className="ml-4 list-decimal space-y-1">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>You'll be redirected to sign in</li>
            </ol>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950/20">
            <p className="text-xs text-orange-800 dark:text-orange-300">
              <strong>Note:</strong> The verification link will expire in 24
              hours. If you don't see the email, check your spam folder or
              request a new link.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {!isSent && (
            <Button
              onClick={handleResendVerificationEmail}
              disabled={resendStatus === "pending" || !email}
              variant="gradient"
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resendStatus === "pending" ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          )}
          <Link to="/sign-in" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
