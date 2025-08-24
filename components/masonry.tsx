import Image from 'next/image';
export default function Masonry() {
  return (
    <div className="max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:py-20">
        <div className="mb-4 break-inside-avoid overflow-hidden rounded-lg">
          <a href="#" className="block">
            <Image
              className="hover:scale-105 transition-transform duration-300"
              src="/photo1.jpeg"
              alt="Masonry Cards Image"
              layout="responsive"
              width={500}
              height={300}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
