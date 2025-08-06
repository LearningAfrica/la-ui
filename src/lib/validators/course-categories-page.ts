import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * ================= Schema ===============
 */
export const courseCategoriesSchema = z.object({
  organization: z.string().min(2).max(100),
  category_name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters' })
    .max(50),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(500),
  category_image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      },
      {
        message: 'Image must be a valid JPEG, PNG, or WebP file',
      },
    ),
});

/**
 * ===================== Types =====================
 */
export type CreateCourseCategoryInput = z.infer<typeof courseCategoriesSchema>;

/**
 * ===================== Resolvers =====================
 */
export const createCourseCategoryResolver = zodResolver(courseCategoriesSchema);
