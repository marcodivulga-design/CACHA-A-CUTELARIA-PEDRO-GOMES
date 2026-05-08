import React, { useState } from 'react';
import { CreditCard, Smartphone, FileText } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface PaymentMethodsProps {
  onSelect: (method: string) => void;
  selectedMethod: string;
}

export function PaymentMethods({ onSelect, selectedMethod }: PaymentMethodsProps) {
  const { data: methods } = trpc.payments.getPaymentMethods.useQuery();

  const icons = {
    'credit-card': CreditCard,
    'smartphone': Smartphone,
    'file-text': FileText,
  };

  return (
    <div className="space-y-4">
      <h3 className="font-playfair text-xl font-semibold text-amber-900">
        Método de Pagamento
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods?.methods.map((method) => {
          const Icon = icons[method.icon as keyof typeof icons];
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <h4 className="font-semibold text-sm text-gray-900">{method.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{method.description}</p>
              <p className="text-xs font-semibold text-amber-600 mt-2">Taxa: {method.fee}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
