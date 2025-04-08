import PokemonList from '@src/components/PokemonList';

interface PageProps {
  searchParams: {
    page?: string;
  };
}

export default function PokemonPage({ searchParams }: PageProps): JSX.Element {
  const page = parseInt(searchParams?.page || '1', 10); // Get page from searchParams or default to 1

  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl">
        Pokémon List
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Explore a list of Pokémon fetched from an API.
      </p>
      <PokemonList page={page} /> {/* Pass the page prop to PokemonList */}
    </div>
  );
}
