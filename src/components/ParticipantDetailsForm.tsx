import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Instagram,
  UserSquare2,
  Smartphone,
  User,
  Mail,
  AtSign,
} from "lucide-react";
import { PaymentButton } from "./PaymentButton";
import type { ParticipantFormData } from "../types/forms";

interface ParticipantDetailsFormProps {
  quantity: number;
  ticketPrice: number;
  onSubmit: (formData: ParticipantFormData) => void;
  onBack: () => void;
  onPaymentSuccess: (participantId: string, quantity: number) => void;
}

export function ParticipantDetailsForm({
  quantity,
  ticketPrice,
  onSubmit,
  onBack,
  onPaymentSuccess,
}: ParticipantDetailsFormProps) {
  const [formData, setFormData] = useState<ParticipantFormData>({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    nationalId: "",
  });
  const [showPayment, setShowPayment] = useState(false);

  const totalPrice = quantity * ticketPrice;
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(totalPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setShowPayment(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 text-gray-800 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-base hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Regresar
        </button>
        <h2 className="text-lg font-semibold">Ingresa tus datos</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen de la compra
            </h3>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {formattedPrice}
          </span>
        </div>
        <p className="text-gray-600">
          {quantity} oportunidades de ganar
        </p>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Nombre completo
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="block w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="Nombre completo"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="usuario@dominio.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Teléfono
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Smartphone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="block w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="3#########"
          />
        </div>
      </div>

      <div className="relative">
        <label
          htmlFor="instagram"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Usuario de Instagram
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AtSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            className="block w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="username"
            required
          />
        </div>
      </div>

      <div className="relative">
        <label
          htmlFor="nationalId"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Cédula
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserSquare2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="nationalId"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleInputChange}
            className="block w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1.111.111.111"
            required
          />
        </div>
      </div>

      {!showPayment ? (
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Continuar con el pago ({formattedPrice})
        </button>
      ) : (
        <PaymentButton
          title={`Compra de ${quantity} Tickets`}
          price={totalPrice}
          quantity={1}
          name={formData.name}
          email={formData.email}
          phone={formData.phone}
          onSuccess={() => onPaymentSuccess(crypto.randomUUID(), quantity)}
        />
      )}
    </form>
  );
}
