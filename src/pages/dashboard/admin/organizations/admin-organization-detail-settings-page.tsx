import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useParams } from 'react-router-dom';
import { useOrganization } from '@/hooks/use-organizations';
import type { UserRole } from '@/lib/types/auth';

export default function OrganizationSettingsPage() {
  const params = useParams<{ id: string }>();
  const { organizations: availableOrganizations, getCurrentUserRole } =
    useOrganization();
  const [isSaving, setIsSaving] = useState(false);

  // Find organization
  const organization = availableOrganizations.find(
    (org) => org.id === params.id,
  );
  const userRole = getCurrentUserRole();
  const canManageSettings = userRole === 'superAdmin' || userRole === 'admin';

  // Form state
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    description: organization?.description || '',
    domain: organization?.domain || '',
    logo: organization?.logo || '',
    allowSelfRegistration:
      organization?.settings.allowSelfRegistration || false,
    defaultRole: organization?.settings.defaultRole || ('student' as UserRole),
    features: organization?.settings.features || [],
  });

  if (!organization) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/organizations">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Organizations
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-xl font-semibold">
              Organization Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The requested organization could not be found.
            </p>
            <Button asChild>
              <Link to="/dashboard/admin/organizations">
                Return to Organizations
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canManageSettings) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/dashboard/admin/organizations/${organization.id}`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Organization
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to manage organization settings.
            </p>
            <Button asChild>
              <Link to={`/dashboard/admin/organizations/${organization.id}`}>
                Return to Organization
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Organization settings updated successfully');
    } catch (error) {
      toast.error('Failed to update organization settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: enabled
        ? [...prev.features, feature]
        : prev.features.filter((f) => f !== feature),
    }));
  };

  const availableFeatures = [
    {
      id: 'courses',
      name: 'Courses',
      description: 'Enable course creation and management',
    },
    {
      id: 'certificates',
      name: 'Certificates',
      description: 'Allow certificate generation and management',
    },
    {
      id: 'discussions',
      name: 'Discussions',
      description: 'Enable discussion forums and Q&A',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Provide detailed analytics and reporting',
    },
    {
      id: 'custom-branding',
      name: 'Custom Branding',
      description: 'Allow custom logos, colors, and themes',
    },
    {
      id: 'portfolios',
      name: 'Portfolios',
      description: 'Enable student portfolio creation',
    },
    {
      id: 'peer-review',
      name: 'Peer Review',
      description: 'Allow peer-to-peer assignment reviews',
    },
    {
      id: 'mentorship',
      name: 'Mentorship',
      description: 'Enable mentorship programs',
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/dashboard/admin/organizations/${organization.id}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Organization
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Organization Settings
          </h1>
          <p className="text-muted-foreground">
            Manage settings and configuration for {organization.name}
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your organization's basic details and branding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={formData.logo || '/placeholder.svg'}
                alt={formData.name}
              />
              <AvatarFallback className="text-xl">
                {formData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <p className="text-muted-foreground mt-1 text-sm">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-domain">Domain (optional)</Label>
              <Input
                id="org-domain"
                placeholder="example.com"
                value={formData.domain}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, domain: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-description">Description</Label>
            <Textarea
              id="org-description"
              placeholder="Describe your organization..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Member Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Member Settings</CardTitle>
          <CardDescription>
            Configure how users can join and interact with your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Self Registration</Label>
              <p className="text-muted-foreground text-sm">
                Allow users to join your organization without an invitation
              </p>
            </div>
            <Switch
              checked={formData.allowSelfRegistration}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  allowSelfRegistration: checked,
                }))
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="default-role">Default Role for New Members</Label>
            <Select
              value={formData.defaultRole}
              onValueChange={(value: UserRole) =>
                setFormData((prev) => ({ ...prev, defaultRole: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-sm">
              Role automatically assigned to new members who join via
              self-registration
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Enable or disable features for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {availableFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">{feature.name}</Label>
                    {formData.features.includes(feature.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Enabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
                <Switch
                  checked={formData.features.includes(feature.id)}
                  onCheckedChange={(checked) =>
                    handleFeatureToggle(feature.id, checked)
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-destructive flex items-center justify-between rounded-lg border p-4">
            <div>
              <h4 className="font-medium">Delete Organization</h4>
              <p className="text-muted-foreground text-sm">
                Permanently delete this organization and all associated data.
                This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Organization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
