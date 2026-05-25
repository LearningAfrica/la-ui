import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  GraduationCap,
  Home,
  Layers,
  Mail,
  MessageSquare,
  Settings,
  Users,
  Video,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { orgRoutes, personalRoutes } from "@/lib/utils/org-routes";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { selectedOrganization } = useOrganizationStore();
  const orgId = selectedOrganization?.id;

  const go = useCallback(
    (to: string) => {
      onOpenChange(false);
      navigate(to);
    },
    [navigate, onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go(personalRoutes.home())}>
            <Home className="mr-2 size-4" />
            Home
          </CommandItem>
          <CommandItem onSelect={() => go(personalRoutes.invitations())}>
            <Mail className="mr-2 size-4" />
            My invitations
          </CommandItem>
          <CommandItem onSelect={() => go(personalRoutes.inquiries())}>
            <MessageSquare className="mr-2 size-4" />
            My inquiries
          </CommandItem>
        </CommandGroup>

        {orgId && (
          <>
            <CommandSeparator />
            <CommandGroup heading={selectedOrganization?.name ?? "Workspace"}>
              <CommandItem onSelect={() => go(orgRoutes.overview(orgId))}>
                <Home className="mr-2 size-4" />
                Overview
              </CommandItem>
              <CommandItem onSelect={() => go(orgRoutes.courses(orgId))}>
                <GraduationCap className="mr-2 size-4" />
                Courses
              </CommandItem>
              <CommandItem onSelect={() => go(orgRoutes.categories(orgId))}>
                <Layers className="mr-2 size-4" />
                Categories
              </CommandItem>
              <CommandItem onSelect={() => go(orgRoutes.members(orgId))}>
                <Users className="mr-2 size-4" />
                Members
              </CommandItem>
              <CommandItem onSelect={() => go(orgRoutes.myCourses(orgId))}>
                <BookOpen className="mr-2 size-4" />
                My courses
              </CommandItem>
              <CommandItem onSelect={() => go(orgRoutes.liveSessions(orgId))}>
                <Video className="mr-2 size-4" />
                Live sessions
              </CommandItem>
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem onSelect={() => go(personalRoutes.profile())}>
            <Settings className="mr-2 size-4" />
            Profile & Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, []);

  return { open, setOpen };
}
