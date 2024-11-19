import React, { useEffect, useRef } from 'react';
import { createPreference } from '../services/mercadopago';

interface PaymentButtonProps {
  title: string;
  price: number;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function PaymentButton({
  title,
  price,
  quantity,
  name,
  email,
  phone,
  onSuccess,
  onError
}: PaymentButtonProps) {
  const mpButtonRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const initMercadoPago = async () => {
      try {
        if (!mpButtonRef.current) return;

        const preference = await createPreference({
          items: [
            {
              title,
              unit_price: price,
              quantity
            }
          ],
          payer: {
            name,
            email,
            phone: {
              number: phone
            }
          }
        });

        if (!scriptRef.current) {
          scriptRef.current = document.createElement('script');
          scriptRef.current.src = "https://sdk.mercadopago.com/js/v2";
          scriptRef.current.type = "text/javascript";
          document.head.appendChild(scriptRef.current);

          scriptRef.current.onload = () => {
            const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
            if (!publicKey) {
              console.error('Missing Mercado Pago public key');
              return;
            }

            // @ts-ignore
            const mp = new MercadoPago(publicKey, {
              locale: 'es-CO'
            });

            mp.checkout({
              preference: {
                id: preference.id
              },
              render: {
                container: '#mp-button',
                label: 'Pagar ahora',
              }
            });
          };
        }

        onSuccess?.();
      } catch (error) {
        console.error('Payment initialization error:', error);
        onError?.(error);
      }
    };

    initMercadoPago();

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [title, price, quantity, name, email, phone, onSuccess, onError]);

  return (
    <div className="space-y-4">
      <div id="mp-button" ref={mpButtonRef} className="w-full"></div>
    </div>
  );
}