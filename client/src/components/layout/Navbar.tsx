import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

export function Navbar() {
  const { user, logout, getLoginUrl } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🥃</span>
              </div>
              <span className="font-playfair text-xl font-bold text-gray-900">
                Cachaca & Cutelaria
              </span>
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/catalogo">
              <a className="text-gray-700 hover:text-amber-700 transition">Catálogo</a>
            </Link>
            <Link href="/sobre">
              <a className="text-gray-700 hover:text-amber-700 transition">Sobre</a>
            </Link>
            <Link href="/contato">
              <a className="text-gray-700 hover:text-amber-700 transition">Contato</a>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/carrinho">
              <a className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-amber-700 transition" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </a>
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/perfil">
                  <a className="flex items-center gap-2 text-gray-700 hover:text-amber-700">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </a>
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-gray-700 hover:text-red-600 transition"
                >
                  Sair
                </button>
              </div>
            ) : (
              <a
                href={getLoginUrl()}
                className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition"
              >
                Entrar
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link href="/catalogo">
              <a className="block py-2 text-gray-700 hover:text-amber-700">Catálogo</a>
            </Link>
            <Link href="/sobre">
              <a className="block py-2 text-gray-700 hover:text-amber-700">Sobre</a>
            </Link>
            <Link href="/contato">
              <a className="block py-2 text-gray-700 hover:text-amber-700">Contato</a>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
