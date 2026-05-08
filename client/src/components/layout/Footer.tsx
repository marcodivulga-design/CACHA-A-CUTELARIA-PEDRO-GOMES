import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4">Cachaca & Cutelaria</h3>
            <p className="text-gray-400">
              Produtos artesanais de qualidade premium. Tradição, elegância e excelência em cada detalhe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/catalogo" className="hover:text-amber-400 transition">Catálogo</a></li>
              <li><a href="/sobre" className="hover:text-amber-400 transition">Sobre</a></li>
              <li><a href="/blog" className="hover:text-amber-400 transition">Blog</a></li>
              <li><a href="/faq" className="hover:text-amber-400 transition">FAQ</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold mb-4">Políticas</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/termos" className="hover:text-amber-400 transition">Termos de Uso</a></li>
              <li><a href="/privacidade" className="hover:text-amber-400 transition">Privacidade</a></li>
              <li><a href="/devolucoes" className="hover:text-amber-400 transition">Devoluções</a></li>
              <li><a href="/frete" className="hover:text-amber-400 transition">Frete</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <span>contato@cachaca.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Cachaca & Cutelaria Pedro Gomes. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-amber-400 transition">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
