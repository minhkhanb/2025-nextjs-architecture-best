import PokemonList from '@src/components/PokemonList';

export default function PokemonPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl text-center">
        Pokémon List
      </h1>
      <PokemonList page={page} />
    </div>
  );
}
