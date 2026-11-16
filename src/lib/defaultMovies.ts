export interface MovieItem {
  id: string;
  title: string;
  slug: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  youtubeVideoId: string;
  releaseDate: string;
  duration: string;
  rating: number;
  genres: string;
  cast: string;
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
}

export const DEFAULT_MOVIES: MovieItem[] = [
  {
    id: "inception",
    title: "Inception",
    slug: "inception",
    overview:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: 'inception', the implantation of another person's idea into a target's subconscious.",
    posterUrl: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    youtubeVideoId: "YoHD9XEInc0",
    releaseDate: "2010-07-15",
    duration: "2h 28m",
    rating: 8.8,
    genres: "Action, Sci-Fi, Adventure",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
    isFeatured: true,
    isTrending: true,
    views: 1246,
  },
  {
    id: "interstellar",
    title: "Interstellar",
    slug: "interstellar",
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/rAiYTsqBkRefTnhVjiJIIqjG8QE.jpg",
    youtubeVideoId: "zSWdZVtXT7E",
    releaseDate: "2014-11-05",
    duration: "2h 49m",
    rating: 8.7,
    genres: "Adventure, Drama, Sci-Fi",
    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    isFeatured: false,
    isTrending: true,
    views: 2940,
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    slug: "the-dark-knight",
    overview:
      "Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    youtubeVideoId: "EXeTwQWrcwY",
    releaseDate: "2008-07-16",
    duration: "2h 32m",
    rating: 9.0,
    genres: "Action, Crime, Drama",
    cast: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
    isFeatured: false,
    isTrending: true,
    views: 4510,
  },
  {
    id: "avengers-endgame",
    title: "Avengers: Endgame",
    slug: "avengers-endgame",
    overview:
      "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    youtubeVideoId: "TcMBFSGVi1c",
    releaseDate: "2019-04-24",
    duration: "3h 01m",
    rating: 8.4,
    genres: "Action, Sci-Fi, Adventure",
    cast: "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth",
    isFeatured: false,
    isTrending: true,
    views: 3820,
  },
];
