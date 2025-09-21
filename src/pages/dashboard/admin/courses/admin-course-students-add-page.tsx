import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2, Plus, Search, X } from 'lucide-react';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Define the Student type
type Student = {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
};

// Define the Course type
type Course = {
  id: string;
  title: string;
  instructor: {
    id: string;
    name: string;
  };
};

// Define the form schema
const formSchema = z.object({
  students: z.array(z.string()).min(1, 'Please select at least one student'),
  sendEmail: z.boolean().default(true),
  emailSubject: z.string().optional(),
  emailMessage: z.string().optional(),
});

export default function AddStudentsPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch course data
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', params.id],
    queryFn: async () => {
      // In a real app, this would be an API call
      return new Promise<Course>((resolve) => {
        setTimeout(() => {
          // Generate mock data
          const mockCourse: Course = {
            id: params.id!,
            title: 'JavaScript Fundamentals',
            instructor: {
              id: 'i1',
              name: 'Jane Doe',
            },
          };
          resolve(mockCourse);
        }, 500);
      });
    },
  });

  // Fetch available students data
  const { data: availableStudents = [], isLoading: isLoadingStudents } =
    useQuery({
      queryKey: ['available-students', params.id],
      queryFn: async () => {
        // In a real app, this would be an API call
        return new Promise<Student[]>((resolve) => {
          setTimeout(() => {
            // Generate mock data
            const mockStudents: Student[] = Array.from(
              { length: 20 },
              (_, i) => ({
                id: `STU${2000 + i}`,
                name: `Available Student ${i + 1}`,
                email: `student${2000 + i}@example.com`,
                enrolledCourses: Math.floor(Math.random() * 5),
              }),
            );
            resolve(mockStudents);
          }, 500);
        });
      },
    });

  // Filter students based on search query
  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      students: [],
      sendEmail: true,
      emailSubject: `You've been enrolled in ${course?.title || 'our course'}`,
      emailMessage: `Hello,\n\nYou have been enrolled in ${
        course?.title || 'our course'
      }. You can now access all course materials and start learning.\n\nBest regards,\nThe Admin Team`,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // toast({
      // 	title: 'Students Added',
      // 	description: `${values.students.length} students have been successfully enrolled in the course.`,
      // });
      toast.success(
        `${values.students.length} students have been successfully enrolled in the course.`,
      );

      navigate(`/dashboard/admin/courses/${params.id}/students`);
    } catch (error) {
      // toast({
      // 	title: 'Error',
      // 	description: 'There was an error adding students to the course.',
      // 	variant: 'destructive',
      // });
      toast.error('There was an error adding students to the course.');
      console.error('Error adding students:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle student selection
  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) => {
      const isSelected = prev.includes(studentId);
      const newSelection = isSelected
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId];

      form.setValue('students', newSelection);
      return newSelection;
    });
  };

  // Select all filtered students
  const selectAllFiltered = () => {
    const filteredIds = filteredStudents.map((student) => student.id);
    setSelectedStudents((prev) => {
      const newSelection = [...new Set([...prev, ...filteredIds])];
      form.setValue('students', newSelection);
      return newSelection;
    });
  };

  // Deselect all filtered students
  const deselectAllFiltered = () => {
    const filteredIds = filteredStudents.map((student) => student.id);
    setSelectedStudents((prev) => {
      const newSelection = prev.filter((id) => !filteredIds.includes(id));
      form.setValue('students', newSelection);
      return newSelection;
    });
  };

  const isLoading = isLoadingCourse || isLoadingStudents;

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/dashboard/admin/courses/${params.id}/students`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Students
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isLoading ? 'Loading...' : `Add Students to ${course?.title}`}
          </h2>
          <p className="text-muted-foreground">
            Enroll new students in this course and optionally send them a
            notification email.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Students</CardTitle>
              <CardDescription>
                Select students to enroll in this course. You can select
                multiple students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                      placeholder="Search students by name or email..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllFiltered}
                      disabled={filteredStudents.length === 0}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAllFiltered}
                      disabled={selectedStudents.length === 0}
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>

                <Separator />

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Search className="text-muted-foreground/50 h-12 w-12" />
                    <h3 className="mt-4 text-lg font-medium">
                      No Students Found
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {searchQuery
                        ? 'No students match your search criteria.'
                        : 'There are no available students to enroll.'}
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[400px] space-y-2 overflow-y-auto pr-2">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between rounded-md border p-3 ${
                          selectedStudents.includes(student.id)
                            ? 'bg-muted'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                            id={`student-${student.id}`}
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`/abstract-geometric-shapes.png?height=32&width=32&query=${student.name}`}
                              alt={student.name}
                            />
                            <AvatarFallback>
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <label
                              htmlFor={`student-${student.id}`}
                              className="cursor-pointer font-medium"
                            >
                              {student.name}
                            </label>
                            <p className="text-muted-foreground text-sm">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {student.enrolledCourses} course
                          {student.enrolledCourses !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-muted-foreground text-sm">
                {selectedStudents.length} student
                {selectedStudents.length !== 1 ? 's' : ''} selected
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Options</CardTitle>
              <CardDescription>
                Configure additional options for the enrollment process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="students"
                    render={() => (
                      <FormItem>
                        <FormLabel>Selected Students</FormLabel>
                        <FormControl>
                          <div className="max-h-[200px] min-h-[100px] overflow-y-auto rounded-md border p-2">
                            {selectedStudents.length === 0 ? (
                              <p className="text-muted-foreground p-2 text-sm">
                                No students selected. Please select students
                                from the list.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2 p-1">
                                {selectedStudents.map((studentId) => {
                                  const student = availableStudents.find(
                                    (s) => s.id === studentId,
                                  );
                                  if (!student) return null;
                                  return (
                                    <Badge
                                      key={studentId}
                                      variant="secondary"
                                      className="flex items-center gap-1"
                                    >
                                      {student.name}
                                      <button
                                        type="button"
                                        className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                        onClick={() => toggleStudent(studentId)}
                                      >
                                        <X className="h-3 w-3" />
                                        <span className="sr-only">Remove</span>
                                      </button>
                                    </Badge>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Send notification email</FormLabel>
                          <FormDescription>
                            Send an email to notify students about their
                            enrollment.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch('sendEmail') && (
                    <>
                      <FormField
                        control={form.control}
                        name="emailSubject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Email subject" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emailMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter the email message..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/dashboard/admin/courses/${params.id}/students`,
                        )
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={selectedStudents.length === 0 || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding Students...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add {selectedStudents.length} Student
                          {selectedStudents.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
