import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  client: z.string({required_error:"Client is Required"}).min(1, 'Client is Required'),
  employees: z.array(z.string()).min(1, 'At least one employee must be selected'),
  status: z.enum(['Not Started', 'In Progress', 'Completed'])
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
