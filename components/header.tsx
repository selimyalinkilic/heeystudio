'use client';

export default function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-6 md:py-8 lg:py-10">
          <h1
            className="text-xl lg:text-3xl font-bold text-white cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            heey studio
          </h1>
          <nav>
            <ul className="flex space-x-4 lg:space-x-12">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-white text-sm lg:text-lg hover:underline transition-all duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="text-white text-sm lg:text-lg hover:underline transition-all duration-300"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-white text-sm lg:text-lg hover:underline transition-all duration-300"
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
