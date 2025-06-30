import { useState } from 'react';
import { CalendarIcon, Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import * as z from 'zod';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Sample data for courses and users
const courses = [
  { id: 'course-1', title: 'Advanced JavaScript' },
  { id: 'course-2', title: 'React Fundamentals' },
  { id: 'course-3', title: 'Modern CSS Techniques' },
  { id: 'course-4', title: 'Backend Development with Node.js' },
  { id: 'course-5', title: 'UI/UX Design Principles' },
  { id: 'course-6', title: 'Python for Data Science' },
  { id: 'course-7', title: 'Mobile App Development with React Native' },
  { id: 'course-8', title: 'Database Design and SQL' },
];

const users = [
  { id: 'student-1', name: 'John Smith', role: 'student' },
  { id: 'student-2', name: 'Emily Johnson', role: 'student' },
  { id: 'student-3', name: 'David Wilson', role: 'student' },
  { id: 'student-4', name: 'Sarah Miller', role: 'student' },
  { id: 'student-5', name: 'Robert Chen', role: 'student' },
  { id: 'instructor-1', name: 'Jane Doe', role: 'instructor' },
  { id: 'instructor-2', name: 'Michael Brown', role: 'instructor' },
  { id: 'instructor-3', name: 'Lisa Wang', role: 'instructor' },
];

// Saved search presets
const savedSearches = [
  {
    id: 'saved-1',
    name: 'Recent Flagged Discussions',
    criteria: {
      status: ['flagged'],
      dateRange: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        to: new Date(),
      },
    },
  },
  {
    id: 'saved-2',
    name: 'Unresolved JavaScript Course Questions',
    criteria: {
      keyword: 'javascript',
      status: ['open'],
      courses: ['course-1'],
    },
  },
  {
    id: 'saved-3',
    name: 'Private Discussions',
    criteria: {
      isPrivate: true,
    },
  },
];

// Form schema
const formSchema = z.object({
  keyword: z.string().optional(),
  status: z.array(z.string()).optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  courses: z.array(z.string()).optional(),
  participants: z.array(z.string()).optional(),
  messageCount: z
    .object({
      min: z.string().optional(),
      max: z.string().optional(),
    })
    .optional(),
  isPrivate: z.boolean().optional(),
  hasAttachments: z.boolean().optional(),
  hasFlaggedContent: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AdvancedSearchDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('criteria');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      status: [],
      courses: [],
      participants: [],
      messageCount: {
        min: '',
        max: '',
      },
      isPrivate: false,
      hasAttachments: false,
      hasFlaggedContent: false,
    },
  });

  // Load a saved search preset
  const loadPreset = (presetId: string) => {
    const preset = savedSearches.find((s) => s.id === presetId);
    if (preset) {
      form.reset(preset.criteria as any);
      setSelectedPreset(presetId);
      setActiveTab('criteria');
      //   toast({
      //     title: "Search preset loaded",
      //     description: `"${preset.name}" has been loaded.`,
      //   })
      toast.success(`"${preset.name}" has been loaded.`);
    }
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log('Search criteria:', data);

    // Build query string for filtering
    const params = new URLSearchParams();

    if (data.keyword) params.append('keyword', data.keyword);
    if (data.status && data.status.length)
      params.append('status', data.status.join(','));
    if (data.courses && data.courses.length)
      params.append('courses', data.courses.join(','));
    if (data.participants && data.participants.length)
      params.append('participants', data.participants.join(','));
    if (data.dateRange?.from)
      params.append('from', data.dateRange.from.toISOString());
    if (data.dateRange?.to)
      params.append('to', data.dateRange.to.toISOString());
    if (data.messageCount?.min)
      params.append('minMessages', data.messageCount.min);
    if (data.messageCount?.max)
      params.append('maxMessages', data.messageCount.max);
    if (data.isPrivate) params.append('isPrivate', 'true');
    if (data.hasAttachments) params.append('hasAttachments', 'true');
    if (data.hasFlaggedContent) params.append('hasFlagged', 'true');

    // Navigate to the discussions page with the search parameters
    navigate(`/dashboard/admin/discussions?${params.toString()}`);

    // toast({
    //   title: "Search applied",
    //   description: "The discussions list has been filtered according to your criteria.",
    // })
    toast.success(
      'The discussions list has been filtered according to your criteria.',
    );

    setOpen(false);
  };

  // Reset the form
  const resetForm = () => {
    form.reset({
      keyword: '',
      status: [],
      courses: [],
      participants: [],
      dateRange: undefined,
      messageCount: {
        min: '',
        max: '',
      },
      isPrivate: false,
      hasAttachments: false,
      hasFlaggedContent: false,
    });
    setSelectedPreset(null);
  };

  // Save current search as a new preset (this would typically save to a database)
  const saveCurrentSearch = () => {
    // toast({
    //   title: "Search preset saved",
    //   description: "Your search criteria have been saved for future use.",
    // })
    toast.success('Your search criteria have been saved for future use.');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Search className="h-4 w-4" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Advanced Discussion Search</DialogTitle>
          <DialogDescription>
            Use the form below to search for specific discussions across the
            platform.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="criteria">Search Criteria</TabsTrigger>
            <TabsTrigger value="saved">Saved Searches</TabsTrigger>
          </TabsList>

          <TabsContent value="criteria" className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Keyword search */}
                  <FormField
                    control={form.control}
                    name="keyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keyword</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Search in title and content..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Search in discussion titles and messages
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Status filter */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange([value])}
                            value={field.value?.[0] || ''}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="all">
                                  All Statuses
                                </SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="resolved">
                                  Resolved
                                </SelectItem>
                                <SelectItem value="flagged">Flagged</SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date range */}
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Range</FormLabel>
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value?.from ? (
                                  format(field.value.from, 'PPP')
                                ) : (
                                  <span>From date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value?.from}
                              onSelect={(date) =>
                                field.onChange({
                                  ...field.value,
                                  from: date,
                                })
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <span>to</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value?.to ? (
                                  format(field.value.to, 'PPP')
                                ) : (
                                  <span>To date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value?.to}
                              onSelect={(date) =>
                                field.onChange({
                                  ...field.value,
                                  to: date,
                                })
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormDescription>
                        Filter discussions by creation date
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Course selection */}
                <FormField
                  control={form.control}
                  name="courses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Courses</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between bg-transparent"
                              >
                                {field.value?.length
                                  ? `${field.value.length} course${field.value.length > 1 ? 's' : ''} selected`
                                  : 'Select courses'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search courses..." />
                              <CommandList>
                                <CommandEmpty>No course found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {courses.map((course) => (
                                    <CommandItem
                                      key={course.id}
                                      value={course.title}
                                      onSelect={() => {
                                        const currentValues = field.value || [];
                                        const newValues =
                                          currentValues.includes(course.id)
                                            ? currentValues.filter(
                                                (id) => id !== course.id,
                                              )
                                            : [...currentValues, course.id];
                                        field.onChange(newValues);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          field.value?.includes(course.id)
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        }`}
                                      />
                                      {course.title}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription>
                        Filter discussions by specific courses
                      </FormDescription>
                      {field.value?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {field.value.map((courseId) => {
                            const course = courses.find(
                              (c) => c.id === courseId,
                            );
                            return course ? (
                              <Badge
                                key={courseId}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {course.title}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => {
                                    field.onChange(
                                      field.value?.filter(
                                        (id) => id !== courseId,
                                      ),
                                    );
                                  }}
                                />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      ) : null}
                    </FormItem>
                  )}
                />

                {/* Participants selection */}
                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Participants</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between bg-transparent"
                              >
                                {field.value?.length
                                  ? `${field.value.length} participant${field.value.length > 1 ? 's' : ''} selected`
                                  : 'Select participants'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search users..." />
                              <CommandList>
                                <CommandEmpty>No user found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {users.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.name}
                                      onSelect={() => {
                                        const currentValues = field.value || [];
                                        const newValues =
                                          currentValues.includes(user.id)
                                            ? currentValues.filter(
                                                (id) => id !== user.id,
                                              )
                                            : [...currentValues, user.id];
                                        field.onChange(newValues);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          field.value?.includes(user.id)
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        }`}
                                      />
                                      {user.name}{' '}
                                      <Badge variant="outline" className="ml-2">
                                        {user.role}
                                      </Badge>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription>
                        Filter by students or instructors involved
                      </FormDescription>
                      {field.value?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {field.value.map((userId) => {
                            const user = users.find((u) => u.id === userId);
                            return user ? (
                              <Badge
                                key={userId}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {user.name}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => {
                                    field.onChange(
                                      field.value?.filter(
                                        (id) => id !== userId,
                                      ),
                                    );
                                  }}
                                />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      ) : null}
                    </FormItem>
                  )}
                />

                {/* Message count range */}
                <FormField
                  control={form.control}
                  name="messageCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Count</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            className="w-24"
                            value={field.value?.min || ''}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                min: e.target.value,
                              })
                            }
                          />
                        </FormControl>
                        <span>to</span>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            className="w-24"
                            value={field.value?.max || ''}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                max: e.target.value,
                              })
                            }
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Filter by number of messages in the discussion
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Private discussions */}
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Private Only</FormLabel>
                          <FormDescription>
                            Show only private discussions
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Has attachments */}
                  <FormField
                    control={form.control}
                    name="hasAttachments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Has Attachments</FormLabel>
                          <FormDescription>
                            With files or images
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Has flagged content */}
                  <FormField
                    control={form.control}
                    name="hasFlaggedContent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Flagged Content</FormLabel>
                          <FormDescription>
                            Contains flagged messages
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <DialogFooter className="gap-2 sm:gap-0">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Reset
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={saveCurrentSearch}
                    >
                      Save Search
                    </Button>
                  </div>
                  <Button type="submit">Search Discussions</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Select a saved search to quickly filter discussions using
                predefined criteria.
              </p>

              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className={`cursor-pointer rounded-md border p-3 transition-colors ${
                      selectedPreset === search.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => loadPreset(search.id)}
                  >
                    <div className="font-medium">{search.name}</div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {search.criteria.status && (
                        <Badge variant="outline" className="mr-1">
                          Status: {search.criteria.status.join(', ')}
                        </Badge>
                      )}
                      {search.criteria.keyword && (
                        <Badge variant="outline" className="mr-1">
                          Keyword: {search.criteria.keyword}
                        </Badge>
                      )}
                      {search.criteria.courses && (
                        <Badge variant="outline" className="mr-1">
                          {search.criteria.courses.length} course(s)
                        </Badge>
                      )}
                      {search.criteria.dateRange && (
                        <Badge variant="outline" className="mr-1">
                          Date range
                        </Badge>
                      )}
                      {search.criteria.isPrivate && (
                        <Badge variant="outline" className="mr-1">
                          Private only
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {savedSearches.length === 0 && (
                <div className="text-muted-foreground py-8 text-center">
                  <p>No saved searches yet.</p>
                  <p className="mt-1 text-sm">
                    Create and save search criteria from the Search Criteria
                    tab.
                  </p>
                </div>
              )}

              <Separator />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('criteria')}
                  disabled={!selectedPreset}
                >
                  Edit Selected
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (selectedPreset) {
                      const preset = savedSearches.find(
                        (s) => s.id === selectedPreset,
                      );
                      if (preset) {
                        form.reset(preset.criteria as any);
                        onSubmit(preset.criteria as any);
                      }
                    }
                  }}
                  disabled={!selectedPreset}
                >
                  Apply Selected
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
