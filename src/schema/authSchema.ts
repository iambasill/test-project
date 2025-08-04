import * as z from "zod";

export const paymentPlanSchema = z.object({
    plan: z.string(),
    description: z.string(),
    price: z.number()
})

