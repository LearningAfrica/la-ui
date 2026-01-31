// Inquiry Query and Mutation Keys
export const inquiryQueryKeys = {
  // Query Keys
  inquiries: () => ["inquiries"] as const,
  inquiry: (id: string) => ["inquiry", id] as const,
  myInquiries: () => ["myInquiries"] as const,
};

// Mutation Keys
export const inquiryMutationKeys = {
  createInquiry: () => ["createInquiry"] as const,
  updateInquiry: () => ["updateInquiry"] as const,
  deleteInquiry: () => ["deleteInquiry"] as const,
};
