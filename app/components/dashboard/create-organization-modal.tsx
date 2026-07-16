import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  type OrganizationFormData,
  organizationResolver,
} from "@/lib/schema/organization-schema";
import Building2 from "~icons/lucide/building-2";
import Loader2 from "~icons/lucide/loader-2";
import { useEffect, useState } from "react";
import {
  useCreateOrganization,
  useUpdateOrganization,
} from "@/features/organizations/organization-mutations";
import type { MyOrganization } from "@/features/organizations/organization-queries";
import {
  FormTextField,
  FormTextareaField,
  FormImageUploadField,
} from "@/components/form-fields";

interface CreateOrganizationModalProps {
  children?: React.ReactNode;
  // When provided, the modal edits this organization instead of creating one.
  organization?: MyOrganization;
}

export function CreateOrganizationModal({
  children,
  organization,
}: CreateOrganizationModalProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!organization;

  const form = useForm<OrganizationFormData>({
    resolver: organizationResolver,
    defaultValues: {
      name: "",
      description: "",
      logo: undefined,
    },
  });

  // Prefill when editing (logo stays empty — it's a File input, not the URL).
  useEffect(() => {
    if (open && organization) {
      form.reset({
        name: organization.name,
        description: organization.description ?? "",
        logo: undefined,
      });
    }
  }, [open, organization, form]);

  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization(
    organization?.id ?? ""
  );
  const mutation = isEditing
    ? updateOrganizationMutation
    : createOrganizationMutation;

  const handleFormSubmit = form.handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess() {
        setOpen(false);
        form.reset();
      },
    });
  });
  const isLoading =
    mutation.status === "pending" || form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="gradient" size="lg">
            <Building2 className="mr-2 h-4 w-4" />
            {isEditing ? "Edit Organization" : "Create Organization"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {isEditing ? "Edit Organization" : "Create New Organization"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your organization details. Upload a new logo to replace the current one."
              : "Fill in the details to create your organization. Add a logo to make it more recognizable."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <FormImageUploadField
              control={form.control}
              name="logo"
              label="Organization Logo"
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
              disabled={isLoading}
            />

            <FormTextField
              control={form.control}
              name="name"
              label="Organization Name"
              placeholder="Enter organization name"
              required
              disabled={isLoading}
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Describe your organization's mission, vision, and goals..."
              required
              disabled={isLoading}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Organization"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
