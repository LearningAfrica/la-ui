import { useState } from 'react';
import {
  ArrowUpDown,
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link, useNavigate } from 'react-router-dom';
import { InviteInstructorDialog } from '@/components/instructors/invite-instructors-dialog';

// Sample data for instructors
const instructors = [
  {
    id: 'i1',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@example.com',
    image: '/abstract-blue-burst.png',
    specialization: 'Data Science',
    courses: 12,
    students: 1245,
    rating: 4.8,
    status: 'active',
    featured: true,
    location: 'San Francisco, CA',
  },
  {
    id: 'i2',
    name: 'Prof. Michael Johnson',
    email: 'michael.johnson@example.com',
    image: '/abstract-southwest.png',
    specialization: 'Web Development',
    courses: 8,
    students: 876,
    rating: 4.6,
    status: 'active',
    featured: false,
    location: 'New York, NY',
  },
  {
    id: 'i3',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    image: '/stylized-ej-initials.png',
    specialization: 'UX Design',
    courses: 5,
    students: 432,
    rating: 4.9,
    status: 'active',
    featured: true,
    location: 'Seattle, WA',
  },
  {
    id: 'i4',
    name: 'Robert Williams',
    email: 'robert.williams@example.com',
    image: '/javascript-code-abstract.png',
    specialization: 'JavaScript',
    courses: 10,
    students: 987,
    rating: 4.7,
    status: 'active',
    featured: false,
    location: 'Austin, TX',
  },
  {
    id: 'i5',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    image: '/green-tractor-field.png',
    specialization: 'Agriculture Technology',
    courses: 3,
    students: 215,
    rating: 4.5,
    status: 'pending',
    featured: false,
    location: 'Des Moines, IA',
  },
];

export default function InstructorsPage() {
  const navigate = useNavigate();
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter instructors based on search query and status filter
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.specialization
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || instructor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Toggle selection of all instructors
  const toggleSelectAll = () => {
    if (selectedInstructors.length === filteredInstructors.length) {
      setSelectedInstructors([]);
    } else {
      setSelectedInstructors(
        filteredInstructors.map((instructor) => instructor.id),
      );
    }
  };

  // Toggle selection of a single instructor
  const toggleSelectInstructor = (id: string) => {
    if (selectedInstructors.includes(id)) {
      setSelectedInstructors(
        selectedInstructors.filter((instructorId) => instructorId !== id),
      );
    } else {
      setSelectedInstructors([...selectedInstructors, id]);
    }
  };

  // Toggle featured status
  const toggleFeatured = (id: string, currentStatus: boolean) => {
    console.warn(`Toggling featured status for instructor ${id}`);

    toast.success(
      `Instructor ${currentStatus ? 'removed from' : 'marked as'} featured`,
    );
  };

  // Delete selected instructors
  const deleteSelected = () => {
    toast.success(`${selectedInstructors.length} instructors deleted`);
    setSelectedInstructors([]);
  };

  // Export selected instructors
  const exportSelected = () => {
    toast.success(`Exported ${selectedInstructors.length} instructors`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instructors</h2>
          <p className="text-muted-foreground">
            Manage instructor accounts and permissions
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <InviteInstructorDialog >
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Invite
          </Button>
          </InviteInstructorDialog>
          <Button disabled onClick={() => navigate('/dashboard/admin/instructors/add')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Instructor
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Instructors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructors.length}</div>
            <p className="text-muted-foreground text-xs">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Instructors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                instructors.filter(
                  (instructor) => instructor.status === 'active',
                ).length
              }
            </div>
            <p className="text-muted-foreground text-xs">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                instructors.reduce(
                  (acc, instructor) => acc + instructor.rating,
                  0,
                ) / instructors.length
              ).toFixed(1)}
            </div>
            <p className="text-muted-foreground text-xs">
              +0.2 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Instructors</CardTitle>
          <CardDescription>
            View and manage all instructors on the platform. You can add, edit,
            or remove instructors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search instructors..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {selectedInstructors.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={exportSelected}>
                    <Download className="mr-2 h-4 w-4" />
                    Export ({selectedInstructors.length})
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelected}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedInstructors.length})
                  </Button>
                </>
              )}
              <InviteInstructorDialog>
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              </InviteInstructorDialog>
              <Button disabled variant="outline" size="sm" className='hidden sm:inline-flex'>
                <Link  to="/dashboard/admin/instructors/add" className='flex items-center gap-1'>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredInstructors.length > 0 &&
                        selectedInstructors.length ===
                          filteredInstructors.length
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Specialization
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" className="p-0 font-medium">
                      Courses
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" className="p-0 font-medium">
                      Students
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" className="p-0 font-medium">
                      Rating
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No instructors found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstructors.map((instructor) => (
                    <TableRow key={instructor.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedInstructors.includes(instructor.id)}
                          onCheckedChange={() =>
                            toggleSelectInstructor(instructor.id)
                          }
                          aria-label={`Select ${instructor.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={instructor.image || '/placeholder.svg'}
                              alt={instructor.name}
                            />
                            <AvatarFallback>
                              {instructor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <Link
                              to={`/dashboard/admin/instructors/${instructor.id}`}
                              className="font-medium hover:underline"
                            >
                              {instructor.name}
                            </Link>
                            <span className="text-muted-foreground text-sm">
                              {instructor.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {instructor.specialization}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {instructor.courses}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {instructor.students}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Star className="fill-primary text-primary mr-1 h-4 w-4" />
                          {instructor.rating}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            instructor.status === 'active'
                              ? 'default'
                              : instructor.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {instructor.status.charAt(0).toUpperCase() +
                            instructor.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/admin/instructors/${instructor.id}`,
                                )
                              }
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toggleFeatured(
                                  instructor.id,
                                  instructor.featured,
                                )
                              }
                            >
                              {instructor.featured ? (
                                <>
                                  <StarOff className="mr-2 h-4 w-4" /> Remove
                                  featured
                                </>
                              ) : (
                                <>
                                  <Star className="mr-2 h-4 w-4" /> Mark as
                                  featured
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                toast.success(
                                  `Instructor ${instructor.name} deleted`,
                                );
                              }}
                            >
                              Delete instructor
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
