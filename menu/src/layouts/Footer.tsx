export default function Footer() {
  return (
    <footer className="w-full h-[400px] flex justify-center flex-col text-center">
      <h2 className="mb-2">Nosotros</h2>
      <p className="mb-6">No te pierdas de nuestras promos</p>
      <div className="flex flex-col items-center justify-center gap-4 mb-4">
        <div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            className="bg-[#E1306C] text-white px-4 py-2 rounded no-underline w-[2.6rem]"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            className="bg-[#4267B2] text-white px-4 py-2 rounded no-underline w-[2.6rem]"
          >
            Facebook
          </a>
        </div>
        <div className="flex flex-col items-center">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener"
            className="bg-[#25D366] text-white px-4 py-2 rounded no-underline w-[2.6rem]"
          >
            Whatsapp
          </a>
          <span className="text-sm mt-1">Chatea con nosotros</span>
        </div>
      </div>
    </footer>
  );
}
