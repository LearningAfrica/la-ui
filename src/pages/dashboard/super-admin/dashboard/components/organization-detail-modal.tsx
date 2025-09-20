import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Eye, ImageIcon } from 'lucide-react';

import type { Organization } from '../types';

interface OrganizationDetailModalProps {
  organization: Organization;
}

export function OrganizationDetailModal({ organization }: OrganizationDetailModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`View details for ${organization.name}`}>
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {organization.logo_url ? (
              <img
                src={organization.logo_url}
                alt={`${organization.name} logo`}
                className="h-10 w-10 rounded-md border object-cover"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold">
                {organization.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span>{organization.name}</span>
          </DialogTitle>
          <DialogDescription>Organization ID: {organization.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {organization.description || 'No description provided for this organization.'}
              </p>
            </CardContent>
          </Card>

          {organization.logo_url && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Logo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <img
                  src={organization.logo_url}
                  alt={`${organization.name} logo`}
                  className="h-32 w-32 rounded-md border object-contain"
                />
                <a
                  href={organization.logo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Open original
                </a>
              </CardContent>
            </Card>
          )}

          {!organization.logo_url && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-4 w-4" />
                  Branding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No logo has been uploaded for this organization yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
