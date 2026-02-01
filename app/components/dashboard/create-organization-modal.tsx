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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type OrganizationFormData,
  organizationResolver,
} from "@/lib/schema/organization-schema";
import { Building2, ImageIcon, Loader2, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreateOrganization } from "@/features/organizations/organization-mutations";

interface CreateOrganizationModalProps {
  children?: React.ReactNode;
}

export function CreateOrganizationModal({
  children,
}: CreateOrganizationModalProps) {
  const [open, setOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<OrganizationFormData>({
    resolver: organizationResolver,
    defaultValues: {
      name: "",
      description: "",
      logo: undefined,
    },
  });

  const createOrganizationMutation = useCreateOrganization();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("logo", file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    form.setValue("logo", undefined);
    setLogoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    createOrganizationMutation.mutateAsync(data, {
      onSuccess() {
        setOpen(false);
        form.reset();
        setLogoPreview(null);
      },
    });
  });
  const isLoading =
    createOrganizationMutation.status === "pending" ||
    form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="gradient" size="lg">
            <Building2 className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create New Organization
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create your organization. Add a logo to make
            it more recognizable.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Logo Upload */}
            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel>Organization Logo</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        {logoPreview ? (
                          <AvatarImage src={logoPreview} alt="Logo preview" />
                        ) : (
                          <AvatarFallback className="bg-muted">
                            <ImageIcon className="text-muted-foreground h-8 w-8" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {logoPreview ? "Change Logo" : "Upload Logo"}
                        </Button>
                        {logoPreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveLogo}
                            className="text-destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your organization's mission, vision, and goals..."
                      className="min-h-32 resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createOrganizationMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createOrganizationMutation.isPending}
              >
                {createOrganizationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Organization
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
