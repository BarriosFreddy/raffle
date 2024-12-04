import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ShoppingCart,
  UserSquare2,
  Smartphone,
  User,
  Mail,
  AtSign,
} from "lucide-react";
import { PaymentButton } from "./PaymentButton";
import { createPreference } from "@/services/mercadopago";
import { createPayment } from "@/services/payments.service";
import { formatMoney } from "@/utils/formatNumber";
import type { ParticipantFormData } from "../types/forms";

interface ParticipantDetailsFormProps {
  quantity: number;
  ticketPrice: number;
  raffleId: string;
  onBack: () => void;
}

export function ParticipantDetailsForm({
  quantity,
  ticketPrice,
  raffleId,
  onBack,
}: ParticipantDetailsFormProps) {
  const [preferenceId, setPreferenceId] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParticipantFormData>();

  const totalPrice = quantity * ticketPrice;
  const formattedPrice = formatMoney(totalPrice);

  const onFormSubmit = async (formData: ParticipantFormData) => {
    setShowPayment(true);

    const preference = await createPreference({
      items: [{ title: `Compra de ${quantity} Tickets`, unit_price: ticketPrice, quantity }],
      payer: { name: formData.name, email: formData.email, phone: { number: formData.phone } },
    });

    const payment = await createPayment({
      raffleId,
      preferenceId: preference.id,
      amount: totalPrice,
      quantity,
      payer: formData,
    });

    setPreferenceId(payment.preferenceId);
  };

  return (
    <section className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4 text-gray-800 mb-6">
        <button onClick={onBack} className="inline-flex items-center text-base hover:text-blue-600">
          <ArrowLeft className="h-5 w-5 mr-1" /> Regresar
        </button>
        <h2 className="text-lg font-semibold">Ingresa tus datos</h2>
      </div>

      {/* Purchase Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Resumen de la compra</h3>
          </div>
          <span className="text-lg font-bold text-red-600">{formattedPrice}</span>
        </div>
        <p className="text-gray-600">{quantity} Números</p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        {/* Name Field */}
        <div className="mb-3">
          <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
            Nombre completo
          </label>
          <div className="relative">
            <User className="absolute inset-y-2 left-0 pl-3 h-8 w-8 text-gray-400" />
            <input
              {...register("name", { required: "Nombre es requerido" })}
              id="name"
              className={`block w-full pl-10 px-4 py-3 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Nombre completo"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute inset-y-2 left-0 pl-3 h-8 w-8 text-gray-400" />
            <input
              {...register("email", {
                required: "Correo es requerido",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Correo no es válido",
                },
              })}
              id="email"
              type="email"
              className={`block w-full pl-10 px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="usuario@dominio.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone Field */}
        <div className="mb-3">
          <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <div className="relative">
            <Smartphone className="absolute inset-y-2 left-0 pl-3 h-8 w-8 text-gray-400" />
            <input
              {...register("phone", {
                required: "Teléfono es requerido",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Número de teléfono debe tener 10 dígitos",
                },
              })}
              id="phone"
              type="tel"
              className={`block w-full pl-10 px-4 py-3 rounded-lg border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="3#########"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Instagram Field */}
        <div className="mb-3">
          <label htmlFor="instagram" className="block text-base font-medium text-gray-700 mb-2">
            Usuario de Instagram
          </label>
          <div className="relative">
            <AtSign className="absolute inset-y-2 left-0 pl-3 h-8 w-8 text-gray-400" />
            <input
              {...register("instagram", { required: "Usuario de Instagram es requerido" })}
              id="instagram"
              className={`block w-full pl-10 px-4 py-3 rounded-lg border ${
                errors.instagram ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="username"
            />
            {errors.instagram && <p className="text-red-500 text-sm">{errors.instagram.message}</p>}
          </div>
        </div>

        {/* National ID Field */}
        <div className="mb-3">
          <label htmlFor="nationalId" className="block text-base font-medium text-gray-700 mb-2">
          Número de identificación
          </label>
          <div className="relative">
            <UserSquare2 className="absolute inset-y-2 left-0 pl-3 h-8 w-8 text-gray-400" />
            <input
              {...register("nationalId", { required: "Cédula es requerida",
              pattern: {
                value: /^\d{7,}$/,
                message: "Número de identificación no es válido",
              }, })}
              id="nationalId"
              className={`block w-full pl-10 px-4 py-3 rounded-lg border ${
                errors.nationalId ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="1.111.111.111"
            />
            {errors.nationalId && <p className="text-red-500 text-sm">{errors.nationalId.message}</p>}
          </div>
        </div>

        {/* Submit Button */}
        {!showPayment ? (
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            Continuar con el pago ({formattedPrice})
          </button>
        ) : (
          <PaymentButton preferenceId={preferenceId} />
        )}
      </form>
    </section>
  );
}
