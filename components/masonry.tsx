import Image from 'next/image';
import { Modal } from './modal';
import { useModal } from '@/hooks/useModal';
import { useState } from 'react';
export default function Masonry() {
  const { isOpen, openModal, closeModal } = useModal();
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);

  const handleButtonClick = ({
    image,
    video,
  }: {
    image: string | null;
    video: string | null;
  }) => {
    if (video) {
      setVideo(video);
    }
    if (image) {
      setImage(image);
    }
    openModal();
  };

  return (
    <>
      <div className="flex justify-center pt-14 lg:pt-20">
        <h2 className="text-3xl lg:text-5xl text-center font-bold text-white">
          Portfolio
        </h2>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 py-14 lg:py-20">
        <div className="mb-4 break-inside-avoid overflow-hidden rounded-lg">
          <a
            type="button"
            className="hover:cursor-pointer"
            onClick={() =>
              handleButtonClick({ image: '/photo1.jpeg', video: null })
            }
          >
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
      <Modal title="My Modal" isOpen={isOpen} onClose={closeModal}>
        <h1>Modal Content</h1>
        {image && (
          <Image
            src={image}
            alt="Selected Image"
            layout="responsive"
            width={500}
            height={300}
          />
        )}
        {video && <video src={video} controls />}
      </Modal>
    </>
  );
}
