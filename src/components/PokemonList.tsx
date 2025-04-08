import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { gql } from '@apollo/client';
import client from '@src/lib/apollo-client'; // Import getClient from your Apollo client setup
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Import icons from Heroicons

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
  const totalPages = 10; // Example: Assume there are 10 pages of data

  if (pokemonList.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No Pokémon data available. Please check the API response.
      </p>
    );
  }

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

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
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {/* Previous Button */}
        <Link
          href={`?page=${page > 1 ? page - 1 : 1}`}
          aria-label="Go to previous page"
          className={`px-4 py-2 rounded-lg flex items-center ${
            page === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, index) =>
          typeof pageNumber === 'number' ? (
            <Link
              key={index}
              href={`?page=${pageNumber}`}
              aria-label={`Go to page ${pageNumber}`}
              className={`px-4 py-2 rounded-lg ${
                pageNumber === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageNumber}
            </Link>
          ) : (
            <span
              key={index}
              className="px-4 py-2 text-gray-500"
              aria-hidden="true"
            >
              ...
            </span>
          )
        )}

        {/* Next Button */}
        <Link
          href={`?page=${page < totalPages ? page + 1 : totalPages}`}
          aria-label="Go to next page"
          className={`px-4 py-2 rounded-lg flex items-center ${
            page === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
