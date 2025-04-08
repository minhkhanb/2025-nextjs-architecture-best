import Image from 'next/image';
import { gql } from '@apollo/client';
import client from '@src/lib/apollo-client'; // Import Apollo Client

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering for server component

const GET_POKEMON_LIST = gql`
  query GetPokemonList {
    pokemon_v2_pokemon(limit: 10) {
      id
      name
      image: pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

export default async function PokemonList(): Promise<JSX.Element> {
  let pokemonList = [];

  try {
    const { data } = await client.query({
      query: GET_POKEMON_LIST,
    });

    if (!data || !data.pokemon_v2_pokemon) {
      console.error('Invalid data structure:', data);
      throw new Error('Invalid data structure received from API');
    }

    pokemonList = data.pokemon_v2_pokemon;
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    return (
      <p className="text-center text-red-500">
        Failed to load Pokémon data. Please try again later.
      </p>
    );
  }

  if (pokemonList.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No Pokémon data available. Please check the API response.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Pokémon List</h1>
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
                    className="object-contain mb-2"
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
    </div>
  );
}
