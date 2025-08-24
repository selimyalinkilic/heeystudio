export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-6 md:py-8 lg:py-10">
          <h1 className="text-xl lg:text-3xl font-bold text-white">
            heey studio
          </h1>
          <nav>
            <ul className="flex space-x-4 lg:space-x-12">
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-lg hover:text-underline"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-lg hover:text-underline"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-lg hover:text-underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
