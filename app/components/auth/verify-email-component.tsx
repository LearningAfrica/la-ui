import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  useResendVerificationEmail,
  useVerifyEmail,
} from "@/features/auth/auth-mutations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  Loader2Icon,
} from "lucide-react";

interface VerifyEmailComponentProps {
  token: string | null;
  email: string;
}

export function VerifyEmailComponent({
  token,
  email,
}: VerifyEmailComponentProps) {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");
  const { mutateAsync: resendVerificationEmail, status: resendStatus } =
    useResendVerificationEmail();
  const verifyEmailMutation = useVerifyEmail();

  const verifyEmailEvent = useEffectEvent(async (token: string) => {
    if (!token) {
      setVerificationStatus("error");

      return;
    }

    // Automatically verify email when component mounts
    await verifyEmailMutation.mutateAsync(
      { token },
      {
        onSuccess: () => {
          setVerificationStatus("success");
        },
        onError: () => {
          setVerificationStatus("error");
        },
      }
    );
  });

  useEffect(() => {
    verifyEmailEvent(token!);
  }, [token]);

  const handleContinueToLogin = () => {
    navigate("/sign-in");
  };

  const handleResendVerificationEmail = async () => {
    if (email) {
      await resendVerificationEmail(email, {
        onSuccess: () => {
          navigate(
            "/email-verification-pending" +
              (email ? `?email=${encodeURIComponent(email)}` : "")
          );
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
            {verificationStatus === "verifying" && (
              <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
            )}
            {verificationStatus === "success" && (
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            )}
            {verificationStatus === "error" && (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verificationStatus === "verifying" && "Verifying Your Email"}
            {verificationStatus === "success" && "Email Verified!"}
            {verificationStatus === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {verificationStatus === "verifying" &&
              "Please wait while we verify your email address..."}
            {verificationStatus === "success" &&
              "Your email has been successfully verified. You can now sign in to your account."}
            {verificationStatus === "error" &&
              "We couldn't verify your email. The verification link may be invalid or expired."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {verificationStatus === "error" && !token && (
            <p className="text-muted-foreground text-sm">
              No verification token found in the URL. Please check your email
              for the correct verification link.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {verificationStatus === "success" && (
            <Button
              onClick={handleContinueToLogin}
              variant="gradient"
              className="w-full"
            >
              Continue to Sign In
            </Button>
          )}
          {verificationStatus === "error" && (
            <>
              <Button
                onClick={handleResendVerificationEmail}
                variant="gradient"
                className="w-full"
              >
                {resendStatus === "pending" ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {resendStatus === "pending"
                  ? "Resending..."
                  : "Resend Verification Email"}
              </Button>
              <Link to="/sign-in" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </>
          )}
          {verificationStatus === "verifying" && (
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>This should only take a moment...</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
