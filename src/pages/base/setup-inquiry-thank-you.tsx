import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, Home, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SetupInquiryThankYou() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="text-primary h-8 w-8" />
              <span className="text-foreground text-xl font-bold">
                LearnCraft
              </span>
            </Link>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground flex items-center transition-colors"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="rounded-full bg-primary/10 p-6">
                <CheckCircle className="text-primary h-20 w-20" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-foreground mb-4 text-3xl font-bold lg:text-4xl"
            >
              Thank You for Your Inquiry!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty"
            >
              We've received your partnership inquiry and our team will review it promptly.
              Expect to hear back from us within 24 hours.
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Card className="bg-card/50 border shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-2 mt-1">
                      <Mail className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">Check your email</h3>
                      <p className="text-muted-foreground text-sm">
                        We've sent a confirmation of your inquiry to your email address.
                        Please check your inbox and spam folder.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-2 mt-1">
                      <CheckCircle className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">Next steps</h3>
                      <p className="text-muted-foreground text-sm">
                        A member of our partnerships team will review your submission and contact you
                        to discuss how we can best support your learning needs.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Button asChild size="lg" className="flex-1">
                      <Link to="/">
                        Return to Home
                      </Link>
                    </Button>
                    {/* <Button asChild variant="outline" size="lg" className="flex-1">
                      <Link to="/courses">
                        Explore Courses
                      </Link>
                    </Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
