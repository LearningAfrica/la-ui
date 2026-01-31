import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useVerifyEmail } from "@/features/auth/auth-mutations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

interface VerifyEmailComponentProps {
  token: string | null;
}

export function VerifyEmailComponent({ token }: VerifyEmailComponentProps) {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");
  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");

      return;
    }

    // Automatically verify email when component mounts
    verifyEmailMutation.mutate(
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
  }, [token]);

  const handleContinueToLogin = () => {
    navigate("/sign-in");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
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
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Continue to Sign In
            </Button>
          )}
          {verificationStatus === "error" && (
            <>
              <Button
                onClick={() => navigate("/sign-up")}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Register Again
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
