import type React from 'react';

import { useState } from 'react';

import {
  ArrowLeft,
  Download,
  Edit,
  ExternalLink,
  File,
  FileText,
  ImageIcon,
  Link2,
  MoreHorizontal,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link, useParams } from 'react-router-dom';

// Mock data for resources
const resourcesData = [
  {
    id: '1',
    title: 'Course Syllabus',
    description: 'Complete course syllabus with all topics and assignments',
    type: 'document',
    format: 'pdf',
    size: '245 KB',
    url: '#',
    createdAt: '2023-09-15',
    category: 'syllabus',
  },
  {
    id: '2',
    title: 'Introduction to JavaScript',
    description: 'Slides for the introduction to JavaScript lecture',
    type: 'document',
    format: 'pptx',
    size: '1.2 MB',
    url: '#',
    createdAt: '2023-09-16',
    category: 'slides',
  },
  {
    id: '3',
    title: 'Assignment 1 Instructions',
    description: 'Detailed instructions for completing the first assignment',
    type: 'document',
    format: 'docx',
    size: '320 KB',
    url: '#',
    createdAt: '2023-09-17',
    category: 'assignments',
  },
  {
    id: '4',
    title: 'JavaScript Cheat Sheet',
    description: 'Quick reference guide for JavaScript syntax and methods',
    type: 'document',
    format: 'pdf',
    size: '180 KB',
    url: '#',
    createdAt: '2023-09-18',
    category: 'reference',
  },
  {
    id: '5',
    title: 'Course Logo',
    description: 'Official logo for the course',
    type: 'image',
    format: 'png',
    size: '45 KB',
    url: '#',
    createdAt: '2023-09-10',
    category: 'images',
  },
  {
    id: '6',
    title: 'MDN Web Docs',
    description: 'External resource for JavaScript documentation',
    type: 'link',
    url: 'https://developer.mozilla.org/',
    createdAt: '2023-09-12',
    category: 'external',
  },
];

// Resource categories
const categories = [
  { value: 'all', label: 'All Resources' },
  { value: 'syllabus', label: 'Syllabus' },
  { value: 'slides', label: 'Slides' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'reference', label: 'Reference Materials' },
  { value: 'images', label: 'Images' },
  { value: 'external', label: 'External Links' },
];

export default function CourseResourcesPage() {
  const [resources, setResources] = useState(resourcesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [isEditResourceDialogOpen, setIsEditResourceDialogOpen] =
    useState(false);
  const [currentResource, setCurrentResource] = useState<any>(null);
  const params = useParams<{ id: string }>();
  // Filter resources based on search query and category
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle resource deletion
  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id));
    // toast({
    //   title: "Resource deleted",
    //   description: "The resource has been successfully deleted.",
    // })
    toast.error('Resource deleted', {
      description: 'The resource has been successfully deleted.',
    });
    // In a real app, you would also delete the resource from the database
  };

  // Handle resource edit
  const handleEditResource = (resource: any) => {
    setCurrentResource(resource);
    setIsEditResourceDialogOpen(true);
  };

  // Handle resource update
  const handleUpdateResource = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the resource in the database
    setResources(
      resources.map((r) => (r.id === currentResource.id ? currentResource : r)),
    );
    setIsEditResourceDialogOpen(false);
    // toast({
    //   title: "Resource updated",
    //   description: "The resource has been successfully updated.",
    // })
    toast.success('Resource updated', {
      description: 'The resource has been successfully updated.',
    });
    setCurrentResource(null);
  };

  // Handle adding a new resource
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would add the resource to the database
    const formData = new FormData(e.target as HTMLFormElement);
    const newResource = {
      id: `${resources.length + 1}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      format:
        formData.get('type') === 'document'
          ? (formData.get('format') as string)
          : '',
      size: '0 KB', // This would be determined from the actual file
      url:
        formData.get('type') === 'link' ? (formData.get('url') as string) : '#',
      createdAt: new Date().toISOString().split('T')[0],
      category: formData.get('category') as string,
    };

    setResources([...resources, newResource]);
    setIsAddResourceDialogOpen(false);
    // toast({
    //   title: "Resource added",
    //   description: "The new resource has been successfully added.",
    // })
    toast.success('Resource added', {
      description: 'The new resource has been successfully added.',
    });
  };

  // Get icon based on resource type
  const getResourceIcon = (resource: any) => {
    switch (resource.type) {
      case 'document':
        return resource.format === 'pdf' ? (
          <FileText className="h-6 w-6" />
        ) : (
          <File className="h-6 w-6" />
        );
      case 'image':
        return <ImageIcon className="h-6 w-6" />;
      case 'link':
        return <Link2 className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/dashboard/instructor/courses/${params.id}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Course Resources
          </h1>
          <p className="text-muted-foreground">
            Manage all resources for this course
          </p>
        </div>
        <Dialog
          open={isAddResourceDialogOpen}
          onOpenChange={setIsAddResourceDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>
                Add a new resource to your course. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddResource}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Resource title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the resource"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Resource Type</Label>
                  <Select name="type" defaultValue="document" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="format">Format (for documents)</Label>
                  <Select name="format" defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word Document</SelectItem>
                      <SelectItem value="pptx">PowerPoint</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL (for external links)</Label>
                  <Input
                    id="url"
                    name="url"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="reference" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((cat) => cat.value !== 'all')
                        .map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">
                    Upload File (for documents and images)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input id="file" type="file" className="flex-1" />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddResourceDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Resource</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={
                    selectedCategory === category.value ? 'default' : 'ghost'
                  }
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === 'all'
                  ? 'All Resources'
                  : categories.find((cat) => cat.value === selectedCategory)
                      ?.label}
              </CardTitle>
              <CardDescription>
                {filteredResources.length} resource
                {filteredResources.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-md">
                          {getResourceIcon(resource)}
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            {resource.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">
                              {resource.type === 'document' &&
                                `${resource.format!.toUpperCase()} • ${resource.size}`}
                              {resource.type === 'image' &&
                                `${resource.format!.toUpperCase()} • ${resource.size}`}
                              {resource.type === 'link' && 'External Link'}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              Added on {resource.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {resource.type !== 'link' ? (
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditResource(resource)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteResource(resource.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <File className="text-muted-foreground mb-4 h-12 w-12" />
                    <h3 className="text-lg font-medium">No resources found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? 'No resources match your search criteria.'
                        : 'There are no resources in this category yet.'}
                    </p>
                    <Button onClick={() => setIsAddResourceDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Resource
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Resource Dialog */}
      <Dialog
        open={isEditResourceDialogOpen}
        onOpenChange={setIsEditResourceDialogOpen}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Update the details of this resource.
            </DialogDescription>
          </DialogHeader>
          {currentResource && (
            <form onSubmit={handleUpdateResource}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={currentResource.title}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={currentResource.description}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={currentResource.category}
                    onValueChange={(value) =>
                      setCurrentResource({
                        ...currentResource,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((cat) => cat.value !== 'all')
                        .map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {currentResource.type === 'link' && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-url">URL</Label>
                    <Input
                      id="edit-url"
                      value={currentResource.url}
                      onChange={(e) =>
                        setCurrentResource({
                          ...currentResource,
                          url: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                {currentResource.type !== 'link' && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-file">Replace File</Label>
                    <div className="flex items-center gap-2">
                      <Input id="edit-file" type="file" className="flex-1" />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditResourceDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Resource</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
