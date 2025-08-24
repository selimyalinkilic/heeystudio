export default function Footer() {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto text-center">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} heey studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
