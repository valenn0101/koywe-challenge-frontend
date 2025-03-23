export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gray-800 py-6 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <p className="text-center text-sm">
            © {currentYear} KoyweCurrency. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
