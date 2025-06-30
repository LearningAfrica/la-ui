import type React from 'react';

import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate } from 'react-router-dom';

// Form schema
const instructorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  image: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  specialization: z.string().optional(),
  status: z.enum(['active', 'pending', 'inactive']),
  featured: z.boolean().default(false),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  sendWelcomeEmail: z.boolean().default(true),
});

export default function AddInstructorPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    bio: '',
    location: '',
    website: '',
    specialization: '',
    status: 'pending',
    featured: false,
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const result = instructorSchema.safeParse(formData);

      if (!result.success) {
        const errors = result.error.format();
        console.error('Validation errors:', errors);
        toast.error('Please fix the form errors before submitting');
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(`Instructor ${formData.name} created successfully`);
      navigate('/dashboard/admin/instructors');
    } catch (error) {
      console.error('Error creating instructor:', error);
      toast.error('Failed to create instructor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/instructors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Instructors
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" form="instructor-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Instructor'
            )}
          </Button>
        </div>
      </div>

      <form id="instructor-form" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-7">
          {/* Instructor Profile */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Instructor Profile</CardTitle>
              <CardDescription>
                Add a new instructor to the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={formData.image || '/placeholder.svg'}
                  alt="Instructor avatar"
                />
                <AvatarFallback>
                  {formData.name ? formData.name.charAt(0) : '?'}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 w-full space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="image">Profile Image URL</Label>
                  <Input
                    id="image"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => handleChange('image', e.target.value)}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    placeholder="Web Development"
                    value={formData.specialization}
                    onChange={(e) =>
                      handleChange('specialization', e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="grid w-full gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="status">Status</Label>
                    <p className="text-muted-foreground text-sm">
                      Set the initial status of this instructor
                    </p>
                  </div>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleChange('featured', checked)
                    }
                  />
                  <Label htmlFor="featured">Featured Instructor</Label>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Instructor Details */}
          <Card className="md:col-span-4">
            <CardHeader>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                          handleChange('password', e.target.value)
                        }
                      />
                      <p className="text-muted-foreground text-sm">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="confirmPassword">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleChange('confirmPassword', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sendWelcomeEmail"
                        checked={formData.sendWelcomeEmail}
                        onCheckedChange={(checked) =>
                          handleChange('sendWelcomeEmail', checked)
                        }
                      />
                      <Label htmlFor="sendWelcomeEmail">
                        Send welcome email with login details
                      </Label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="profile" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea
                        id="bio"
                        placeholder="Write a short bio about the instructor..."
                        className="min-h-[150px]"
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="social" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </form>
    </div>
  );
}
