import { z } from 'zod'

export const productValidator = z.object({
  name_afterMarket: z.string().min(1),
  name_techDoc: z.string().min(1),
  ref_afterMarket: z.string().min(1),
  ref_techDoc: z.string().min(1),
  image: z.string().min(1),
  categoryId: z.string().min(1),
  quantity: z.number().min(0),
  sell_price: z.number().min(0),
  additional_price: z.object({
    name: z.string().min(1),
    price: z.number().min(0),
  }),
})

export type productRequest = z.infer<typeof productValidator>
