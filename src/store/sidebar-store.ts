import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  // Sidebar collapse state
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;

  // Mobile sidebar state
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;

  // Expanded sections for collapsible navigation
  expandedSections: string[];
  toggleSection: (sectionLabel: string) => void;
  addExpandedSection: (sectionLabel: string) => void;
  removeExpandedSection: (sectionLabel: string) => void;
  clearExpandedSections: () => void;

  // Auto-expand sections with active children
  autoExpandActiveSections: (sections: Array<{ label: string; items?: { href: string }[] }>, currentPath: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // Sidebar collapse state
      isCollapsed: false,
      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),

      // Mobile sidebar state
      isMobileOpen: false,
      setMobileOpen: (open: boolean) => set({ isMobileOpen: open }),
      toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),

      // Expanded sections
      expandedSections: [],
      toggleSection: (sectionLabel: string) =>
        set((state) => ({
          expandedSections: state.expandedSections.includes(sectionLabel)
            ? state.expandedSections.filter((item) => item !== sectionLabel)
            : [...state.expandedSections, sectionLabel],
        })),
      addExpandedSection: (sectionLabel: string) =>
        set((state) => ({
          expandedSections: state.expandedSections.includes(sectionLabel)
            ? state.expandedSections
            : [...state.expandedSections, sectionLabel],
        })),
      removeExpandedSection: (sectionLabel: string) =>
        set((state) => ({
          expandedSections: state.expandedSections.filter((item) => item !== sectionLabel),
        })),
      clearExpandedSections: () => set({ expandedSections: [] }),

      // Auto-expand sections with active children
      autoExpandActiveSections: (sections, currentPath) => {
        const { expandedSections, addExpandedSection } = get();

        // Find sections that have active children and aren't already expanded
        const sectionsToExpand = sections.filter(section =>
          section.items &&
          section.items.some(item => item.href === currentPath) &&
          !expandedSections.includes(section.label)
        );

        // Only update state if there are sections to expand
        if (sectionsToExpand.length > 0) {
          sectionsToExpand.forEach(section => {
            addExpandedSection(section.label);
          });
        }
      },
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        expandedSections: state.expandedSections,
      }),
    }
  )
);
