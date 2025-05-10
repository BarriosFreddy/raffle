import { useEffect, useState } from "react";
import { ColorPickerInput } from "./ColorPickerInput";
import type { Raffle } from "../../types";
import { saveRaffle, updateRaffle } from "@/services/raffle.service";
import { useRaffleStore } from "@/store/raffleStore";
import { raffleSchema } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { PaymentGateway } from "@/enums/PaymentGateway.enum";
import type { z } from "zod";

type CreateRaffleFormProps = {
  onSave: () => void;
  selectedRaffle: Raffle | undefined;
};

type FormData = z.infer<typeof raffleSchema>;

export function CreateRaffleForm({
  onSave,
  selectedRaffle,
}: CreateRaffleFormProps) {
  const { raffles, setRaffles } = useRaffleStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(raffleSchema) as never,
    defaultValues: {
      name: "",
      description: "",
      minNumber: 0,
      maxNumber: 100,
      prize: "",
      ticketPrice: 0,
      maxTicketsPerUser: 100,
      paymentGateway: PaymentGateway.BOLD,
      coverUrl: "",
      slug: "",
      lotteryName: "",
      supportPhoneNumber: "",
      themeColor: "#4f46e5", // Default theme color (indigo-600)
    },
  });

  // Generate slug from the name
  const watchName = watch("name");
  useEffect(() => {
    if (watchName && !selectedRaffle) {
      const generatedSlug = watchName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug);
    }
  }, [watchName, setValue, selectedRaffle]);

  useEffect(() => {
    if (!selectedRaffle) return;
    reset({
      name: selectedRaffle.title,
      description: selectedRaffle.description,
      minNumber: selectedRaffle.minNumber,
      maxNumber: selectedRaffle.maxNumber,
      prize: selectedRaffle.prize,
      ticketPrice: selectedRaffle.ticketPrice,
      maxTicketsPerUser: selectedRaffle.maxTicketsPerUser || 100,
      paymentGateway:
        (selectedRaffle.paymentGateway as PaymentGateway) ||
        PaymentGateway.BOLD,
      coverUrl: selectedRaffle.coverUrl || "",
      lotteryName: selectedRaffle.lotteryName || "",
      supportPhoneNumber: selectedRaffle.supportPhoneNumber || "",
      themeColor: selectedRaffle.themeColor || "#4f46e5",
      slug: selectedRaffle.slug || "",
    });
  }, [reset, selectedRaffle]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsLoading(true);
      const newRaffle = {
        title: data.name,
        description: data.description,
        minNumber: data.minNumber,
        maxNumber: data.maxNumber,
        prize: data.prize,
        ticketPrice: data.ticketPrice,
        maxTicketsPerUser: data.maxTicketsPerUser,
        paymentGateway: data.paymentGateway,
        coverUrl: data.coverUrl || "",
        lotteryName: data.lotteryName || "",
        supportPhoneNumber: data.supportPhoneNumber || "",
        themeColor: data.themeColor || "#4f46e5",
        slug: data.slug,
        id: crypto.randomUUID(),
        status: "active",
      };

      if (selectedRaffle) {
        await updateRaffle(selectedRaffle._id, newRaffle as Raffle);
      } else {
        const savedRaffle = await saveRaffle(newRaffle as Raffle);
        setRaffles([...raffles, savedRaffle]);
      }

      // Reset form
      reset();
      if (onSave) onSave();
    } catch (error) {
      console.error("Error creating raffle:", error);
      // Here you could add a toast notification for error handling
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Crear Nueva Rifa</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Título de la Rifa
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className={`block w-full px-2 py-2 rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            {...register("description")}
            className={`block w-full px-2 py-2 rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="prize"
            className="block text-sm font-medium text-gray-700"
          >
            Premio
          </label>
          <textarea
            id="prize"
            {...register("prize")}
            className={`block w-full px-2 py-2 rounded-lg border ${
              errors.prize ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            rows={2}
          />
          {errors.prize && (
            <p className="mt-1 text-sm text-red-600">{errors.prize.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="minNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Número Mínimo
            </label>
            <input
              type="number"
              id="minNumber"
              {...register("minNumber", { valueAsNumber: true })}
              className={`block w-full px-2 py-2 rounded-lg border ${
                errors.minNumber ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.minNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.minNumber.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="maxNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Número Máximo
            </label>
            <input
              type="number"
              id="maxNumber"
              {...register("maxNumber", { valueAsNumber: true })}
              className={`block w-full px-2 py-2 rounded-lg border ${
                errors.maxNumber ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.maxNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.maxNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ticketPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Precio del Ticket
            </label>
            <input
              type="number"
              id="ticketPrice"
              {...register("ticketPrice", { valueAsNumber: true })}
              className={`block w-full px-2 py-2 rounded-lg border ${
                errors.ticketPrice ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.ticketPrice && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ticketPrice.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="maxTicketsPerUser"
              className="block text-sm font-medium text-gray-700"
            >
              Máximo tickets por usuario
            </label>
            <input
              type="number"
              id="maxTicketsPerUser"
              min="1"
              {...register("maxTicketsPerUser", { valueAsNumber: true })}
              className={`block w-full px-2 py-2 rounded-lg border ${
                errors.maxTicketsPerUser ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.maxTicketsPerUser && (
              <p className="mt-1 text-sm text-red-600">
                {errors.maxTicketsPerUser.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug (URL amigable)
          </label>
          <input
            type="text"
            id="slug"
            {...register("slug")}
            className={`block w-full px-2 py-2 rounded-lg border ${
              errors.slug ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Solo letras, números y guiones. Debe ser único.
          </p>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="paymentGateway"
              className="block text-sm font-medium text-gray-700"
            >
              Pasarela de Pago
            </label>
            <select
              id="paymentGateway"
              {...register("paymentGateway")}
              className={`block w-full px-2 py-2 rounded-lg border ${
                errors.paymentGateway ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value={PaymentGateway.BOLD}>BOLD</option>
              <option value={PaymentGateway.NONE}>NINGUNA</option>
            </select>
            {errors.paymentGateway && (
              <p className="mt-1 text-sm text-red-600">
                {errors.paymentGateway.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lotteryName"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de Lotería
            </label>
            <input
              type="text"
              id="lotteryName"
              {...register("lotteryName")}
              className={`block w-full px-2 py-2 rounded-lg border ${
                errors.lotteryName ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Ej: Sinuano noche"
            />
            {errors.lotteryName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lotteryName.message}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label
            htmlFor="supportPhoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Teléfono de Soporte (WhatsApp)
          </label>
          <input
            type="tel"
            id="supportPhoneNumber"
            {...register("supportPhoneNumber")}
            className={`block w-full px-2 py-2 rounded-lg border ${
              errors.supportPhoneNumber ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="+573XXXXXXXXX"
          />
          <p className="mt-1 text-xs text-gray-500">
            Número de teléfono con código de país (Ej: +573XXXXXXXXX)
          </p>
          {errors.supportPhoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.supportPhoneNumber.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="coverUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL de la imagen de portada
          </label>
          <input
            type="url"
            id="coverUrl"
            {...register("coverUrl")}
            className={`block w-full px-2 py-2 rounded-lg border ${
              errors.coverUrl ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            Formatos aceptados: PNG, JPG, JPEG, WEBP
          </p>
          {errors.coverUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.coverUrl.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center">
          {watch("coverUrl") && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={watch("coverUrl")}
                alt="Vista previa de la portada"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/600x400?text=Error+al+cargar+imagen";
                }}
              />
            </div>
          )}
          {!watch("coverUrl") && (
            <div className="w-full aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">Vista previa de la imagen</span>
            </div>
          )}
        </div>
        <div>
          <ColorPickerInput
            value={watch("themeColor") || "#4f46e5"}
            onChange={(color) => {
              // Use register's onChange handler
              register("themeColor").onChange({
                target: { value: color, name: "themeColor" },
              });
            }}
            error={errors.themeColor?.message as string | undefined}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {selectedRaffle
            ? isLoading
              ? "EDITANDO..."
              : "EDITAR RIFA"
            : isLoading
            ? "CREANDO..."
            : "CREAR RIFA"}
        </button>
      </form>
    </div>
  );
}
