import React, { useState } from 'react';
import { BarChart3, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'wouter';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (user?.role !== 'admin') {
    return (
      <div className=\"min-h-screen flex items-center justify-center bg-red-50\">
        <div className=\"text-center\">
          <h1 className=\"text-2xl font-bold text-red-900\">Acesso Negado</h1>
          <p className=\"text-red-700 mt-2\">Você não tem permissão para acessar este painel</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className=\"min-h-screen bg-gray-100\">
      {/* Sidebar */}
      <div className=\"fixed left-0 top-0 w-64 h-screen bg-amber-900 text-white p-6 shadow-lg\">
        <h1 className=\"font-playfair text-2xl font-bold mb-8\">Painel Admin</h1>

        <nav className=\"space-y-4\">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
              activeTab === 'overview' ? 'bg-amber-700' : 'hover:bg-amber-800'
            }`}
          >
            <BarChart3 className=\"w-5 h-5\" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
              activeTab === 'products' ? 'bg-amber-700' : 'hover:bg-amber-800'
            }`}
          >
            <Package className=\"w-5 h-5\" />
            <span>Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
              activeTab === 'orders' ? 'bg-amber-700' : 'hover:bg-amber-800'
            }`}
          >
            <ShoppingCart className=\"w-5 h-5\" />
            <span>Pedidos</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
              activeTab === 'customers' ? 'bg-amber-700' : 'hover:bg-amber-800'
            }`}
          >
            <Users className=\"w-5 h-5\" />
            <span>Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
              activeTab === 'settings' ? 'bg-amber-700' : 'hover:bg-amber-800'
            }`}
          >
            <Settings className=\"w-5 h-5\" />
            <span>Configurações</span>
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className=\"w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-900 transition mt-8\"
        >
          <LogOut className=\"w-5 h-5\" />
          <span>Sair</span>
        </button>
      </div>

      {/* Main Content */}
      <div className=\"ml-64 p-8\">
        <div className=\"mb-8\">
          <h1 className=\"font-playfair text-3xl font-bold text-gray-900\">
            {activeTab === 'overview' && 'Dashboard'}
            {activeTab === 'products' && 'Gestão de Produtos'}
            {activeTab === 'orders' && 'Gestão de Pedidos'}
            {activeTab === 'customers' && 'Gestão de Clientes'}
            {activeTab === 'settings' && 'Configurações'}
          </h1>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && <OverviewTab />}

        {/* Products Tab */}
        {activeTab === 'products' && <ProductsTab />}

        {/* Orders Tab */}
        {activeTab === 'orders' && <OrdersTab />}

        {/* Customers Tab */}
        {activeTab === 'customers' && <CustomersTab />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className=\"grid grid-cols-1 md:grid-cols-4 gap-6\">
      <StatCard title=\"Vendas Hoje\" value=\"R$ 2.450,00\" icon=\"📊\" />
      <StatCard title=\"Pedidos\" value=\"12\" icon=\"📦\" />
      <StatCard title=\"Clientes\" value=\"248\" icon=\"👥\" />
      <StatCard title=\"Produtos\" value=\"12\" icon=\"🎁\" />
    </div>
  );
}

function ProductsTab() {
  return (
    <div className=\"bg-white rounded-lg shadow p-6\">
      <h2 className=\"text-xl font-bold mb-4\">Produtos Cadastrados</h2>
      <div className=\"overflow-x-auto\">
        <table className=\"w-full text-sm\">
          <thead className=\"bg-gray-50\">
            <tr>
              <th className=\"px-4 py-2 text-left\">Nome</th>
              <th className=\"px-4 py-2 text-left\">Preço</th>
              <th className=\"px-4 py-2 text-left\">Estoque</th>
              <th className=\"px-4 py-2 text-left\">Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder - será preenchido com dados reais */}
            <tr className=\"border-t\">
              <td className=\"px-4 py-2\">Faca Artesanal #1</td>
              <td className=\"px-4 py-2\">R$ 199,99</td>
              <td className=\"px-4 py-2\">10</td>
              <td className=\"px-4 py-2\">
                <button className=\"text-blue-600 hover:underline\">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className=\"bg-white rounded-lg shadow p-6\">
      <h2 className=\"text-xl font-bold mb-4\">Pedidos Recentes</h2>
      <div className=\"overflow-x-auto\">
        <table className=\"w-full text-sm\">
          <thead className=\"bg-gray-50\">
            <tr>
              <th className=\"px-4 py-2 text-left\">ID</th>
              <th className=\"px-4 py-2 text-left\">Cliente</th>
              <th className=\"px-4 py-2 text-left\">Total</th>
              <th className=\"px-4 py-2 text-left\">Status</th>
              <th className=\"px-4 py-2 text-left\">Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder - será preenchido com dados reais */}
            <tr className=\"border-t\">
              <td className=\"px-4 py-2\">#001</td>
              <td className=\"px-4 py-2\">João Silva</td>
              <td className=\"px-4 py-2\">R$ 499,99</td>
              <td className=\"px-4 py-2\"><span className=\"bg-green-100 text-green-800 px-2 py-1 rounded\">Pago</span></td>\n              <td className=\"px-4 py-2\">
                <button className=\"text-blue-600 hover:underline\">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersTab() {
  return (
    <div className=\"bg-white rounded-lg shadow p-6\">
      <h2 className=\"text-xl font-bold mb-4\">Clientes</h2>
      <div className=\"overflow-x-auto\">
        <table className=\"w-full text-sm\">
          <thead className=\"bg-gray-50\">
            <tr>
              <th className=\"px-4 py-2 text-left\">Nome</th>
              <th className=\"px-4 py-2 text-left\">Email</th>
              <th className=\"px-4 py-2 text-left\">Pedidos</th>
              <th className=\"px-4 py-2 text-left\">Total Gasto</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder - será preenchido com dados reais */}
            <tr className=\"border-t\">
              <td className=\"px-4 py-2\">João Silva</td>
              <td className=\"px-4 py-2\">joao@email.com</td>
              <td className=\"px-4 py-2\">3</td>
              <td className=\"px-4 py-2\">R$ 1.499,97</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className=\"bg-white rounded-lg shadow p-6\">
      <h2 className=\"text-xl font-bold mb-4\">Configurações</h2>
      <div className=\"space-y-4\">
        <div>
          <label className=\"block text-sm font-medium text-gray-700 mb-2\">
            Nome da Loja
          </label>
          <input
            type=\"text\"
            defaultValue=\"Cachaca e Cutelaria Pedro Gomes\"
            className=\"w-full px-3 py-2 border border-gray-300 rounded-lg\"
          />
        </div>
        <div>
          <label className=\"block text-sm font-medium text-gray-700 mb-2\">
            Email de Contato
          </label>
          <input
            type=\"email\"
            defaultValue=\"contato@cachacaecutelaria.com\"
            className=\"w-full px-3 py-2 border border-gray-300 rounded-lg\"
          />
        </div>
        <button className=\"bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700\">
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className=\"bg-white rounded-lg shadow p-6\">
      <div className=\"flex items-center justify-between\">
        <div>
          <p className=\"text-gray-600 text-sm\">{title}</p>
          <p className=\"text-2xl font-bold text-gray-900 mt-2\">{value}</p>
        </div>
        <div className=\"text-4xl\">{icon}</div>
      </div>
    </div>
  );
}
