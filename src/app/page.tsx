export default function HomePage(): JSX.Element {
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl">
        Build Modern Websites with Ease
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        TailwindCSS makes it easy to create beautiful, responsive designs.
      </p>
      <div className="mt-6 space-x-4">
        <a
          href="#"
          className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Get Started
        </a>
        <a
          href="#"
          className="px-6 py-3 text-blue-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}
