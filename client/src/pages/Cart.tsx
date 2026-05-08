import { trpc } from '../lib/trpc';
import { useNavigate } from 'wouter';

export default function Cart() {
  const navigate = useNavigate();

  // Queries
  const { data: cart, isLoading } = trpc.cart.get.useQuery();

  // Mutations
  const removeItem = trpc.cart.removeItem.useMutation();
  const clearCart = trpc.cart.clearCart.useMutation();

  const handleRemoveItem = (itemId: string) => {
    removeItem.mutate(
      { itemId },
      {
        onSuccess: () => {
          // Refetch cart
        },
      }
    );
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando carrinho...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Carrinho de Compras</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Voltar ao Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Carrinho de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item: any) => (
                <div key={item.id} className="border border-border rounded-lg p-4 flex gap-4">
                  {/* Item Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Sem imagem</div>
                  </div>

                  {/* Item Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Quantidade: {item.quantity}</p>
                    <p className="text-lg font-bold text-foreground">R$ {parseFloat(item.price).toFixed(2)}</p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removeItem.isPending}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <button
              onClick={() => clearCart.mutate()}
              disabled={clearCart.isPending}
              className="mt-4 text-muted-foreground hover:text-foreground underline"
            >
              Limpar carrinho
            </button>
          </div>

          {/* Cart Summary */}
          <div className="border border-border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-foreground mb-4">Resumo do Pedido</h2>

            <div className="space-y-2 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {parseFloat(cart.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span>A calcular</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Desconto</span>
                <span>R$ 0,00</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-foreground mb-6">
              <span>Total</span>
              <span>R$ {parseFloat(cart.total).toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 font-semibold"
            >
              Ir para Checkout
            </button>

            <button
              onClick={() => navigate('/catalog')}
              className="w-full mt-2 border border-border text-foreground py-3 rounded-lg hover:bg-muted"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
