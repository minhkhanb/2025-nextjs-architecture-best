import Image from 'next/image';
import { GET_POKEMON_LIST } from '@src/graphql/pokemon/queries'; // Import query
import client from '@src/lib/apollo-client'; // Import Apollo client
import Pagination from './Pagination';
import PokemonInformation from './PokemonInformation';

export default async function PokemonList({
  page = 1,
}: {
  page: number;
}): Promise<JSX.Element> {
  const limit = 12;
  const offset = (page - 1) * limit;

  const { data } = await client.query({
    query: GET_POKEMON_LIST,
    variables: { offset, limit },
  });

  const pokemonList = data?.pokemon_v2_pokemon || [];
  const totalCount = data?.pokemon_v2_pokemon_aggregate?.aggregate?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (pokemonList.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No Pokémon data available. Please check the API response.
      </p>
    );
  }

  return (
    <>
      <div className="p-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pokemonList.map(
            (pokemon: {
              id: number;
              name: string;
              image: {
                sprites: {
                  other: {
                    dream_world: {
                      front_default: string;
                    };
                  };
                };
              }[];
            }) => {
              const imageUrl =
                pokemon.image[0]?.sprites?.other?.dream_world?.front_default ||
                null;

              return (
                <li
                  key={pokemon.id}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`Image of Pokémon ${pokemon.name}`}
                      width={96}
                      height={96}
                      className="object-contain mb-2 h-24 w-24"
                      priority
                    />
                  ) : (
                    <p className="text-gray-500">
                      No image available for {pokemon.name}
                    </p>
                  )}
                  <p className="text-lg font-medium">
                    {pokemon.id}. {pokemon.name}
                  </p>
                </li>
              );
            }
          )}
        </ul>
        <Pagination currentPage={page} totalPages={totalPages} baseUrl="" />
      </div>

      <PokemonInformation />
      {/* This component is used to display detailed information about a Pokémon */}
    </>
  );
}
