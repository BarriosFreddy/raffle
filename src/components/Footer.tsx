import { Mail, Phone, Clock, Shield, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  supportPhoneNumber?: string;
}

export function Footer({ supportPhoneNumber }: FooterProps) {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contáctenos</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <a href="mailto:eventoscalidad269@gmail.com" className="hover:text-blue-300 transition-colors">
                  eventoscalidad269@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <a href={`https://wa.me/${supportPhoneNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">Soporte Técnico</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horario de Atención</h3>
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-2 mt-1 text-gray-400" />
              <div>
                <p>Lunes a Sábado</p>
                <p>8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Políticas</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-gray-400" />
                <Link to="/" className="hover:text-blue-300 transition-colors">
                  Protección de Datos
                </Link>
              </li>
              <li className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-400" />
                <Link to="/" className="hover:text-blue-300 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Eventos Calidad. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
