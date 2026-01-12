import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="">
      {/*       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-left px-6 pt-5">
      <div className="md:border-r border-gray-300 h-full md:pt-0 md:p-6">
        <h2 className="text-2xl font-bold text-gray-600">Nosotros</h2>
        <p className="text-gray-500">Segui a {""} en las redes.</p>
      </div>

      <div className="flex md:items-center flex-col md:flex-row justify-center">
        <div className="flex items-center gap-2 lg:gap-4 w-full">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-200 h-[50px] w-[50px] flex justify-center items-center text-white rounded-full hover:bg-orange-300 transition"
          >
            <FaInstagram className="text-orange-800" size={20} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-200 h-[50px] w-[50px] flex justify-center items-center text-white rounded-full hover:bg-orange-300 transition"
          >
            <FaFacebookF className="text-orange-800" size={20} />
          </a>
          <span className="text-gray-500 block">Síguenos</span>
        </div>
        <div className="flex items-center gap-2 md:ml-2 lg:gap-4 mt-4 md:mt-0">
          <a
            href="https://wa.me/5490000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-200 h-[50px] w-[50px] flex justify-center items-center text-white rounded-full hover:bg-green-300 transition"
          >
            <FaWhatsapp className="text-green-800" size={20} />
          </a>
          <span className="text-gray-500 block">WhatsApp</span>
        </div>
      </div>
      
      <div className="border-t md:border-l flex flex-col gap-8 md:border-t-0 md:pt-0 md:p-6 border-gray-300 pt-6">
        <h2 className="text-2xl font-bold text-gray-600">Danos tu opinión</h2>
        <div className="flex flex-col items-start gap-1">
          <a
            href="https://search.google.com/local/writereview?placeid=TU_PLACE_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 w-fit text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Reseña en Google
          </a>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
            By Google
          </span>
        </div>
      </div>
    </div> */}

      {/* Línea inferior */}
      <div className="mt-5 text-center py-10 text-xs bg-black text-white">
        <p className="text-sm mb-10">Creá tu menú con QMenu. <a className="font-bold px-3 py-2 ml-2 text-base bg-white text-black rounded-md transition" href="https://qmenu.com.ar" target="_blank" rel="noopener noreferrer">¡Prueba ahora!</a></p>
        <br />
        <p>© {new Date().getFullYear()} QMenu. Todos los derechos reservados.</p>
        <p>Por <a className="font-bold" href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">Nico Barrera</a></p>
      </div>
    </footer >
  );
}