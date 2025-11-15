import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Columna 1: Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Nosotros
          </h2>
          <p className="text-gray-600  mt-2">
            No te pierdas de nuestras promos
          </p>
        </div>

        {/* Columna 2: Redes sociales */}
        <div className="flex flex-col items-center justify-center w-full">
          <span className="text-gray-700 font-semibold mb-3">
            Síguenos
          </span>
          <div className="flex flex-col gap-y-2 items-center">
            <div className="flex space-x-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 h-[57px] shadow-lg w-[57px] flex justify-center items-center text-white p-3 rounded-3xl hover:bg-orange-600 transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 h-[57px] shadow-lg w-[57px] flex justify-center items-center text-white p-3 rounded-3xl hover:bg-orange-600 transition"
              >
                <FaFacebookF size={20} />
              </a>
            </div>
            <span className="text-gray-700 font-semibold">WhatsApp</span>
            <a
              href="https://wa.me/5490000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 h-[57px] shadow-lg w-[57px] flex justify-center items-center text-white p-3 rounded-3xl hover:bg-green-600 transition"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>

        {/* Columna 3: Opinión */}
        <div className="flex flex-col items-center md:items-start md:border-0 border-t-2 border-gray-300 pt-6">
          <a
            href="https://search.google.com/local/writereview?placeid=TU_PLACE_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Danos tu opinión
          </a>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            By Google
          </span>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Nicoding. Todos los derechos reservados.
      </div>
    </footer>
  );
}
