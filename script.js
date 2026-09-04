// --- Music Database ---
// IMPORTANT: Place your actual .mp3 files in the assets/music/ folder.
// Ensure the 'src' matches the exact filename you upload to GitHub.
const songs = [
    {
        id: 1,
        title: "Lofi Study",
        artist: "Chill Maker",
        category: "Lo-Fi",
        cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300&auto=format&fit=crop",
        src: "assets/music/song1.mp3" // <-- Replace with your real file name
    },
    {
        id: 2,
        title: "Midnight Drive",
        artist: "Synthwave",
        category: "Night Drive",
        cover: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=300&auto=format&fit=crop",
        src: "assets/music/song2.mp3"
    },
    {
        id: 3,
        title: "Rainy Vibes",
        artist: "Nature Sounds",
        category: "Lo-Fi",
        cover: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=300&auto=format&fit=crop",
        src: "assets/music/song3.mp3"
    },
    {
        id: 4,
        title: "Ocean Breeze",
        artist: "Relaxing Audio",
        category: "Chill Vibes",
        cover: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=300&auto=format&fit=crop",
        src: "assets/music/song4.mp3"
    }
];

// --- State Variables ---
let currentSongIndex = 0;
let isPlaying = false;
let favorites = JSON.parse(localStorage.getItem('chillFavorites')) || [];

// --- DOM Elements ---
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume-slider');
const songGrid = document.getElementById('song-grid');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('.nav-menu a');
const themeBtn = document.getElementById('theme-btn');

// --- Functions ---

// 1. Render Songs to the Grid
function renderSongs(songList) {
    songGrid.innerHTML = '';
    
    if(songList.length === 0) {
        songGrid.innerHTML = '<p style="color: var(--text-secondary);">No songs found in this vibe.</p>';
        return;
    }

    songList.forEach((song, index) => {
        const isFav = favorites.includes(song.id);
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <img src="${song.cover}" alt="Cover">
            <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${song.id}">
                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <div class="song-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
        `;
        
        // Click to play song
        card.addEventListener('click', (e) => {
            if(e.target.closest('.fav-btn')) return; // Ignore fav button clicks
            
            // Find the global index of this song to play it correctly
            const globalIndex = songs.findIndex(s => s.id === song.id);
            loadSong(globalIndex);
            playSong();
        });

        // Click to favorite
        const favBtn = card.querySelector('.fav-btn');
        favBtn.addEventListener('click', () => toggleFavorite(song.id, favBtn));

        songGrid.appendChild(card);
    });
}

// 2. Load Song into Player
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    
    document.getElementById('player-title').innerText = song.title;
    document.getElementById('player-artist').innerText = song.artist;
    document.getElementById('player-cover').src = song.cover;
    audio.src = song.src;

    // Update player favorite button
    const playerFavBtn = document.getElementById('player-fav-btn');
    const isFav = favorites.includes(song.id);
    playerFavBtn.innerHTML = `<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
    playerFavBtn.classList.toggle('active', isFav);
    playerFavBtn.onclick = () => toggleFavorite(song.id, playerFavBtn, true);
}

// 3. Play & Pause
function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    audio.play().catch(e => console.log("Audio play blocked or file missing:", e));
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    audio.pause();
}

// 4. Next & Prev
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) currentSongIndex = songs.length - 1;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) currentSongIndex = 0;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// 5. Update Progress Bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Update time text
    let currentMins = Math.floor(currentTime / 60);
    let currentSecs = Math.floor(currentTime % 60);
    if (currentSecs < 10) currentSecs = `0${currentSecs}`;
    if (currentMins) currentTimeEl.innerText = `${currentMins}:${currentSecs}`;

    if (duration) {
        let durMins = Math.floor(duration / 60);
        let durSecs = Math.floor(duration % 60);
        if (durSecs < 10) durSecs = `0${durSecs}`;
        durationEl.innerText = `${durMins}:${durSecs}`;
    }
}

// 6. Set Progress on Click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// 7. Toggle Favorite
function toggleFavorite(id, buttonEl, isPlayerBtn = false) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        buttonEl.innerHTML = '<i class="fa-regular fa-heart"></i>';
        buttonEl.classList.remove('active');
    } else {
        favorites.push(id);
        buttonEl.innerHTML = '<i class="fa-solid fa-heart"></i>';
        buttonEl.classList.add('active');
    }
    
    localStorage.setItem('chillFavorites', JSON.stringify(favorites));
    
    // Re-render grid if we are on the favorites tab to keep it synced
    const activeTab = document.querySelector('.nav-menu a.active');
    if (activeTab.id === 'fav-tab' || !isPlayerBtn) {
        filterSongs(); 
    }
}

// 8. Search and Filter
function filterSongs() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.nav-menu a.active').dataset.filter;
    
    let filtered = songs.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchTerm) || song.artist.toLowerCase().includes(searchTerm);
        
        let matchesCategory = true;
        if (activeFilter === 'all') matchesCategory = true;
        else if (!activeFilter) {
            // Favorites tab doesn't have a dataset filter
            matchesCategory = favorites.includes(song.id);
        }
        else matchesCategory = song.category === activeFilter;

        return matchesSearch && matchesCategory;
    });

    renderSongs(filtered);
}

// --- Event Listeners ---

// Playback controls
playBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong); // Auto play next
progressBar.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', (e) => audio.volume = e.target.value);

// Search & Filter Listeners
searchInput.addEventListener('input', filterSongs);

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        document.getElementById('section-title').innerText = e.currentTarget.innerText;
        filterSongs();
    });
});

document.getElementById('play-hero-btn').addEventListener('click', () => {
    loadSong(0);
    playSong();
});

// Mobile menu
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Theme Toggle
themeBtn.addEventListener('click', () => {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('chillTheme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('chillTheme', 'light');
    }
});

// Init
function init() {
    // Load theme
    if (localStorage.getItem('chillTheme') === 'light') {
        document.body.setAttribute('data-theme', 'light');
    }
    
    renderSongs(songs);
    loadSong(0); // Load first song metadata (doesn't auto-play)
}

init();
