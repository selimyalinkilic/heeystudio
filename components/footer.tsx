export default function Footer() {
  return (
    <footer id="contact" className="bg-white relative flex flex-col">
      <div className="container mx-auto text-center">
        <div className="flex flex-col py-14 lg:py-20 gap-14 lg:gap-20">
          <div className="flex justify-center">
            <h2 className="text-3xl lg:text-5xl text-center font-bold text-black">
              Contact
            </h2>
          </div>
          <div className="flex justify-center space-x-20">
            <p className="text-black">
              <a href="mailto:contact@example.com" className="underline">
                contact@example.com
              </a>
            </p>
            <ul>
              <li>
                <a href="https://www.instagram.com" className="underline">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-6 bg-black">
        <p className="text-white">
          &copy; {new Date().getFullYear()} heey studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
