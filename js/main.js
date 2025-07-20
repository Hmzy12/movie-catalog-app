const baseUrl = 'https://api.themoviedb.org/3';
const baseImageUrl = 'https://image.tmdb.org/t/p/w500';

const movieContainer = document.getElementById('movie-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

async function getMovies(endpoint) {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${baseUrl}${endpoint}${separator}api_key=${apiKey}`;

    console.log("Requesting URL:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Gagal mengambil data film. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data diterima:", data);
        return data.results;
    } catch (error) {
        console.error("Error di getMovies:", error);
        movieContainer.innerHTML = '<p style="color: red;">Maaf, terjadi kesalahan saat memuat film.</p>';
        return [];
    }
}

function displayMovies(movies) {
    movieContainer.innerHTML = '';

    if (movies.length === 0) {
        movieContainer.innerHTML = '<p>Film tidak ditemukan.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const movieImage = movie.poster_path ?
            `${baseImageUrl}${movie.poster_path}` :
            'https://dummyimage.com/500x750/333/fff.png&text=No+Image';

        let ratingHTML = '';
        if (movie.vote_average > 0) {
            const rating = movie.vote_average.toFixed(1);
            ratingHTML = `
                <div class="rating">
                    <span>⭐ ${rating}</span>
                </div>
            `;
        }

        const overview = movie.overview;

        movieCard.innerHTML = `
            <img src="${movieImage}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${overview}</p>
            </div>
            ${ratingHTML}
        `;

        movieContainer.appendChild(movieCard);
    });
}

async function handleSearch(event) {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
        const movies = await getMovies(`/search/movie?query=${query}`);
        displayMovies(movies);
    } else {
        loadPopularMovies();
    }
}

async function loadPopularMovies() {
    const popularMovies = await getMovies('/movie/popular');
    displayMovies(popularMovies);
}

searchForm.addEventListener('submit', handleSearch);

loadPopularMovies();