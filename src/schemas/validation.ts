import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const raffleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  minNumber: z.number().int().min(0, 'El número mínimo debe ser al menos 0'),
  maxNumber: z.number().int().min(1, 'El número máximo debe ser al menos 1'),
  prize: z.string().min(1, 'El premio es requerida'),
  ticketPrice: z.number().int().min(1, 'El precio del ticket debe ser al menos 1'),
  coverUrl: z.string()
    .url('La URL de la imagen debe ser válida')
/*     .refine(
      (url) => {
        const extension = url.toLowerCase().split('.').pop();
        return ['png', 'jpg', 'jpeg', 'webp'].includes(extension || '');
      },
      'La imagen debe ser de formato PNG, JPG, JPEG o WEBP'
    ) */
    .optional(),
  themeColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'El color debe ser un valor hexadecimal válido').default('#4f46e5'),
}).refine(data => data.maxNumber > data.minNumber, {
  message: "El número máximo debe ser mayor que el número mínimo",
  path: ["maxNumber"],
});

export const participantSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Dirección de correo electrónico inválida'),
  phone: z.string().min(10, 'El número de teléfono debe tener al menos 10 dígitos'),
  quantity: z.number().int().min(1, 'Debe comprar al menos 1 boleto'),
}).refine(data => /^\+?[\d\s-]+$/.test(data.phone), {
  message: "Formato de número de teléfono inválido",
  path: ["phone"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RaffleInput = z.infer<typeof raffleSchema>;
export type ParticipantInput = z.infer<typeof participantSchema>;
