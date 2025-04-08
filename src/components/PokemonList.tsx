import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { gql } from '@apollo/client';
import client from '@src/lib/apollo-client'; // Import getClient from your Apollo client setup

const GET_POKEMON_LIST = gql`
  query GetPokemonList($offset: Int!, $limit: Int!) {
    pokemon_v2_pokemon(offset: $offset, limit: $limit) {
      id
      name
      image: pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

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

  if (pokemonList.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No Pokémon data available. Please check the API response.
      </p>
    );
  }

  console.log('PDebug page:', page);

  return (
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
                    alt={pokemon.name}
                    width={96}
                    height={96}
                    className="object-contain mb-2 h-24 w-24"
                    priority
                  />
                ) : (
                  <p className="text-gray-500">No image available</p>
                )}
                <p className="text-lg font-medium">
                  {pokemon.id}. {pokemon.name}
                </p>
              </li>
            );
          }
        )}
      </ul>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        {page > 1 ? (
          <Link
            href={`?page=${page - 1}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Previous
          </Link>
        ) : (
          <span
            className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            aria-disabled="true"
          >
            Previous
          </span>
        )}
        <Link
          href={`?page=${page + 1}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
