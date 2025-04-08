import { gql } from '@apollo/client';

export const GET_POKEMON_LIST = gql`
  query GetPokemonList($offset: Int!, $limit: Int!) {
    pokemon_v2_pokemon(offset: $offset, limit: $limit) {
      id
      name
      image: pokemon_v2_pokemonsprites {
        sprites
      }
    }
    pokemon_v2_pokemon_aggregate {
      aggregate {
        count
      }
    }
  }
`;
