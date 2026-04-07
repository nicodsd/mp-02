import React from 'react';
import { UtensilsCrossed, Github, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 border-t border-stone-800 pt-16 pb-8 text-bone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">GastroQR</span>
            </div>
            <p className="text-stone-400 max-w-sm">
              La plataforma líder para digitalizar menús de restaurantes. Sin aplicaciones, sin fricción, solo buena comida.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Producto</h4>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Generador QR</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Plantillas</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Guías</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Empresa</h4>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacidad</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} GastroQR Inc. Hecho con ❤️ para la gastronomía.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-stone-500 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-stone-500 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-stone-500 hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};