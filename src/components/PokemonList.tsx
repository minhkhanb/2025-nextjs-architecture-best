'use client';

import Image from 'next/image';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

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

export default function PokemonList(): JSX.Element {
  const [page, setPage] = useState(1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const { loading, error, data } = useQuery(GET_POKEMON_LIST, {
    variables: { offset, limit },
  });

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="p-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <li
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-gray-300 rounded-full mb-2"></div>
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching Pokémon data:', error);
    return (
      <p className="text-center text-red-500">
        Failed to load Pokémon data. Please try again later.
      </p>
    );
  }

  const pokemonList = data?.pokemon_v2_pokemon || [];

  if (pokemonList.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No Pokémon data available. Please check the API response.
      </p>
    );
  }

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
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${
            page === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
