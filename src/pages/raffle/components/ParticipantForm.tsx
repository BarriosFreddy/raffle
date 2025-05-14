import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ShoppingCart,
  UserSquare2,
  Smartphone,
  User,
  Mail,
} from "lucide-react";
import { PaymentButton } from "./PaymentButton";
import { createPreference } from "@/services/mercadopago";
import { createPayment } from "@/services/payments.service";
import { formatMoney } from "@/utils/formatNumber";
import type { ParticipantFormData } from "../../../types/ParticipantFormData";
import { PaymentDataDTO } from "@/types/paymentDataDTO";
import { Raffle } from "@/types";
import { PaymentGateway } from "@/enums/PaymentGateway.enum";
import { notify } from "@/services/notifications";
const { VITE_ENV } = import.meta.env;

interface ParticipantFormProps {
  quantity: number;
  raffle: Raffle;
  onBack: () => void;
}

export function ParticipantForm({
  quantity,
  raffle,
  onBack,
}: ParticipantFormProps) {
  const themeColor = raffle.themeColor || "#4f46e5"; // Default to indigo if not set
  const [paymentData, setPaymentData] = useState<PaymentDataDTO>();
  const [ticketsExceeded, setTicketsExceeded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantFormData>();

  useEffect(() => {
    if (VITE_ENV === "development") {
      reset({
        name: "Username Lastname",
        email: "username@domain.com",
        nationalId: "123456789",
        phone: "3211231231",
      } as ParticipantFormData);
    }
  }, []);

  // ===========================

  const totalPrice = quantity * raffle.ticketPrice;
  const formattedPrice = formatMoney(totalPrice);

  const onFormSubmit = async (formData: ParticipantFormData) => {
    setTicketsExceeded(false);
    const data: PaymentDataDTO = {
      formData,
      amount: totalPrice,
      currency: "COP",
      items: [
        {
          title: `Compra de ${quantity} Tickets`,
          unit_price: raffle.ticketPrice,
          quantity,
        },
      ],
    };

    if (raffle.paymentGateway === PaymentGateway.MERCADO_PAGO) {
      const preference = await createPreference({
        items: data.items,
        payer: {
          name: formData.name,
          email: formData.email,
          phone: { number: formData.phone.trim() },
          identification: { number: formData.nationalId },
        },
      });
      data.preferenceId = preference.id;
    }
    if (
      [PaymentGateway.BOLD, PaymentGateway.NONE].includes(
        raffle.paymentGateway as PaymentGateway
      )
    ) {
      const orderId = crypto.randomUUID();
      data.orderId = orderId;
    }
    setPaymentData(data);

    const payment = await createPayment({
      raffleId: raffle._id,
      preferenceId: data.preferenceId,
      orderId: data.orderId,
      amount: totalPrice,
      quantity,
      payer: formData,
    });
    if (!payment) {
      setPaymentData(undefined);
      setTicketsExceeded(true);
      console.info("Se ha excedido el número de tikcets por persona");
      notify.warning("Has excedido el número de tikcets por persona");
      return
    }
    if (raffle.paymentGateway === PaymentGateway.NONE) {
      window.location.href = `/response?bold-order-id=${data.orderId}&bold-tx-status=approved`;
    }
  };

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center gap-4 text-gray-800 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-base hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Regresar
        </button>
        <h2 className="text-lg font-semibold">Ingresa tus datos</h2>
      </div>

      {/* Purchase Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShoppingCart
              className="h-6 w-6 mr-2"
              style={{ color: themeColor }}
            />
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen de la compra
            </h3>
          </div>
          <span className="text-lg font-bold" style={{ color: themeColor }}>
            {formattedPrice}
          </span>
        </div>
        <p className="text-gray-600">{quantity} Números</p>
      </div>

      {/* Form Fields */}
      {/* Name Field */}
      <div className="mb-3">
        <label
          htmlFor="name"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Nombre completo
        </label>
        <div className="relative">
          <User className="absolute inset-y-2 left-0 pl-3 h-8 w-8 text-gray-400" />
          <input
            {...register("name", { required: "Nombre es requerido" })}
            id="name"
            className={`block w-full pl-10 px-4 py-3 rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:border-transparent`}
            style={{ "--tw-ring-color": themeColor } as React.CSSProperties}
            placeholder="Nombre completo"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="mb-3">
        <label
          htmlFor="email"
          className="block text-base font-medium text-gray-700 mb-2"
        >
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
            } shadow-sm focus:ring-2 focus:border-transparent`}
            style={{ "--tw-ring-color": themeColor } as React.CSSProperties}
            placeholder="usuario@dominio.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone Field */}
      <div className="mb-3">
        <label
          htmlFor="phone"
          className="block text-base font-medium text-gray-700 mb-2"
        >
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
            } shadow-sm focus:ring-2 focus:border-transparent`}
            style={{ "--tw-ring-color": themeColor } as React.CSSProperties}
            placeholder="3#########"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Instagram field removed as requested */}

      {/* National ID Field */}
      <div className="mb-3">
        <label
          htmlFor="nationalId"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Número de identificación
        </label>
        <div className="relative">
          <UserSquare2 className="absolute inset-y-2 left-0 pl-3 h-8 w-8 text-gray-400" />
          <input
            {...register("nationalId", {
              required: "Cédula es requerida",
              pattern: {
                value: /^\d{7,}$/,
                message: "Número de identificación no es válido",
              },
            })}
            id="nationalId"
            className={`block w-full pl-10 px-4 py-3 rounded-lg border ${
              errors.nationalId ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:border-transparent`}
            style={{ "--tw-ring-color": themeColor } as React.CSSProperties}
            placeholder="1.111.111.111"
          />
          {errors.nationalId && (
            <p className="text-red-500 text-sm">{errors.nationalId.message}</p>
          )}
        </div>
      </div>
      {ticketsExceeded && (
        <div className="text-red-500">
          <span>Has excedido el número de tickets por persona</span>
        </div>
      )}
      {/* Submit Button */}
      {!paymentData ? (
        <button
          onClick={handleSubmit(onFormSubmit)}
          type="submit"
          className="w-full text-white py-3 px-4 rounded-lg text-base font-medium transition-colors hover:opacity-90 active:opacity-80"
          style={{ backgroundColor: themeColor }}
        >
          Continuar con el pago ({formattedPrice})
        </button>
      ) : (
        <PaymentButton
          paymentGateway={raffle.paymentGateway as PaymentGateway}
          paymentData={paymentData}
        />
      )}
    </section>
  );
}
