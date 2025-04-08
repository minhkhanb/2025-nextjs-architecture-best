import PokemonList from '@src/components/PokemonList'; // Import the PokemonList component

export default function PokemonPage(): JSX.Element {
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl">
        Pokémon List
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Explore a list of Pokémon fetched from an API.
      </p>
      {/* Render the PokemonList component */}
      <PokemonList />
    </div>
  );
}
