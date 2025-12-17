import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center text-left">
        {/* Columna 1: Info */}
        <div className="md:border-r border-gray-300 md:pt-0 md:p-6">
          <h2 className="text-2xl font-bold text-gray-800">Nosotros</h2>
          <p className="text-gray-600 md:mt-2">No te pierdas de nuestras promos</p>
        </div>

        {/* Columna 2: Redes sociales */}
        <div className="flex md:items-center flex-col md:flex-row justify-center">
          <div className="flex items-center gap-2 lg:gap-4 w-full">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 h-[50px] w-[50px] flex justify-center items-center text-white rounded-full hover:bg-orange-600 transition"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 h-[50px] w-[50px] flex justify-center items-center text-white rounded-full hover:bg-orange-600 transition"
            >
              <FaFacebookF size={20} />
            </a>
            <span className="text-gray-600 block">Síguenos</span>
          </div>
          <div className="flex items-center gap-2 md:ml-2 lg:gap-4 mt-4 md:mt-0">
            <a
              href="https://wa.me/5490000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 h-[50px] w-[50px] flex justify-center items-center text-white rounded-full hover:bg-green-600 transition"
            >
              <FaWhatsapp size={20} />
            </a>
            <span className="text-gray-600 block">WhatsApp</span>
          </div>
        </div>

        {/* Columna 3: Opinión */}
        <div className="border-t md:border-l flex flex-col md:border-t-0 md:pt-0 md:p-6 border-gray-300 pt-6">
          <a
            href="https://search.google.com/local/writereview?placeid=TU_PLACE_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 w-fit text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Tu opinión nos importa.
          </a>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
            By Google
          </span>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-8 text-left text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Nicoding. Todos los derechos reservados.
      </div>
    </footer>
  );
}