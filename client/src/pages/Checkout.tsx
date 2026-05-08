import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { useNavigate } from 'wouter';

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Queries
  const { data: cart } = trpc.cart.get.useQuery();

  // Mutations
  const createOrder = trpc.orders.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart?.items || cart.items.length === 0) {
      alert('Carrinho vazio');
      return;
    }

    createOrder.mutate(
      {
        items: cart.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: formData,
        paymentMethod,
      },
      {
        onSuccess: (order) => {
          alert('Pedido criado com sucesso!');
          navigate(`/orders/${order.id}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Endereço de Entrega</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Rua"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Número"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    required
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="CEP"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    required
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Estado"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Método de Pagamento</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <span className="text-foreground">Cartão de Crédito</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <span className="text-foreground">PIX</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="boleto"
                    checked={paymentMethod === 'boleto'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <span className="text-foreground">Boleto</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 font-semibold"
            >
              {createOrder.isPending ? 'Processando...' : 'Finalizar Pedido'}
            </button>
          </form>

          {/* Order Summary */}
          <div className="border border-border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-foreground mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              {cart?.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                  <span className="text-foreground">R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {parseFloat(cart?.total || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span>A calcular</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Total</span>
              <span>R$ {parseFloat(cart?.total || '0').toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
