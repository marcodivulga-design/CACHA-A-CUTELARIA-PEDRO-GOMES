import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Bottle, Knife, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Cachaca & Cutelaria Premium
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Descubra nossa seleção exclusiva de cachaças artesanais e cutelaria fina. 
              Qualidade, tradição e elegância em cada produto.
            </p>
            <div className="flex gap-4">
              <Link href="/catalogo">
                <a className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition flex items-center gap-2">
                  Explorar Catálogo
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Link>
              <button className="border-2 border-amber-700 text-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition">
                Saiba Mais
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-12 flex items-center justify-center min-h-96">
            <div className="text-center">
              <Bottle className="w-32 h-32 text-amber-700 mx-auto mb-4" />
              <Knife className="w-32 h-32 text-amber-700 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold text-center mb-16">
            Por que escolher Cachaca & Cutelaria?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏆',
                title: 'Qualidade Premium',
                description: 'Produtos selecionados com rigor e cuidado artesanal'
              },
              {
                icon: '🌿',
                title: 'Tradição Brasileira',
                description: 'Cachaças e cutelaria que honram a cultura local'
              },
              {
                icon: '✨',
                title: 'Elegância Garantida',
                description: 'Perfeito para presentear ou colecionar'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-amber-50 p-8 rounded-xl text-center hover:shadow-lg transition">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold mb-12">
            Destaques
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition">
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-64 flex items-center justify-center">
                  {i % 2 === 0 ? (
                    <Bottle className="w-24 h-24 text-amber-700" />
                  ) : (
                    <Knife className="w-24 h-24 text-amber-700" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Produto Premium #{i}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-700">R$ 199,90</span>
                    <button className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold mb-4">
            Pronto para explorar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Visite nosso catálogo completo e encontre o produto perfeito
          </p>
          <Link href="/catalogo">
            <a className="bg-white text-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-bold inline-flex items-center gap-2">
              Ver Catálogo Completo
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
