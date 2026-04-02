import { z } from 'zod';

export const COIN_DENOMINATIONS = [
  { value: 'old_coin', label: 'Old Coin' },
  { value: '1_rupee', label: '1 Rupee' },
  { value: '2_rupees', label: '2 Rupees' },
  { value: '5_rupees', label: '5 Rupees' },
  { value: '10_rupees', label: '10 Rupees' },
  { value: '20_rupees', label: '20 Rupees' },
] as const;

export const coinFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  year: z.number({ required_error: 'Year is required' }),
  denomination: z.enum(['old_coin', '1_rupee', '2_rupees', '5_rupees', '10_rupees', '20_rupees'], {
    required_error: 'Please select a coin value',
  }),
  leader: z.string().max(100).optional(),
  rarity: z.number().min(1).max(5, 'Rarity must be between 1 and 5'),
  dynasty: z.string().max(100).optional(),
  material: z.string().min(1, 'Please select a material'),
  weight: z.number().positive('Weight must be positive').optional(),
  diameter: z.number().positive('Diameter must be positive').optional(),
  mint: z.string().max(100).optional(),
  imageUrl: z.string().optional(),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  historicalContext: z.string().max(5000, 'Historical context must be less than 5000 characters').optional(),
});

export type CoinFormData = z.infer<typeof coinFormSchema>;

export const FORM_STEPS = [
  { id: 1, name: 'Basic Info', fields: ['name', 'year', 'denomination', 'leader', 'rarity', 'material'] as const },
  { id: 2, name: 'Specifications', fields: ['weight', 'diameter', 'mint', 'dynasty'] as const },
  { id: 3, name: 'Media', fields: ['imageUrl'] as const },
  { id: 4, name: 'Description', fields: ['description', 'historicalContext'] as const },
];

export const defaultFormValues: CoinFormData = {
  name: '',
  year: 0,
  denomination: 'old_coin',
  leader: '',
  rarity: 3,
  dynasty: '',
  material: '',
  weight: undefined,
  diameter: undefined,
  mint: '',
  imageUrl: '',
  description: '',
  historicalContext: '',
};
