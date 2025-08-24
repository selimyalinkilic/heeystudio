import Hero from '@/components/hero';
import Masonry from '@/components/masonry';

export default function Home() {
  return (
    <>
      <section>
        <Hero />
      </section>
      <section className="bg-black relative">
        <div className="contaier mx-auto">
          <Masonry />
        </div>
      </section>
    </>
  );
}
