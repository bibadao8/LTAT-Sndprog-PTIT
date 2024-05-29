const albums = [
    {
        title: 'STARBOY',
        artist: 'The Weeknd',
        imageUrl: 'images/album1.jpg',
        tracks: [
            { title: 'Lost in the fire', url: 'audio/Lost in the fire.mp3' },
            { title: 'Starboy', url: 'audio/Starboy.mp3' },
            { title: 'Reminder', url: 'audio/Reminder.mp3' },
            { title: 'Stargirl Interlude', url: 'audio/Stargirl Interlude.mp3' },
            { title: 'Party Monster', url: 'audio/Party Monster.mp3' },
            { title: 'True Colors', url: 'audio/True Colors.mp3' },
        ]
    },
    {
        title: 'Đánh đổi',
        artist: 'Obito',
        imageUrl: 'images/album2.jpg',
        tracks: [
            { title: 'Hà Nội', url: 'audio/Hà Nội.mp3' },
            { title: 'Sài Gòn ơi', url: 'audio/Sài Gòn ơi.mp3' },
            { title: 'Con kể ba nghe', url: 'audio/Con kể ba nghe.mp3' },
            { title: 'Tell the kids i love them', url: 'audio/Tell the kids i love them.mp3' },
        ]
    }
];

let playlist = [];
let currentTrackIndex = 0;
let audio = new Audio();

document.addEventListener('DOMContentLoaded', () => {
    const albumsContainer = document.getElementById('albums');
    const searchBar = document.getElementById('searchBar');
    const playlistContainer = document.getElementById('playlistTracks');
    const clearPlaylistButton = document.getElementById('clearPlaylist');
    const playAllButton = document.getElementById('playAll');
    const shuffleAllButton = document.getElementById('shuffleAll');
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const pauseTrackButton = document.getElementById('pauseTrack');
    const resumeTrackButton = document.getElementById('resumeTrack');
    const nextTrackButton = document.getElementById('nextTrack');

    const displayAlbums = (albums) => {
        albumsContainer.innerHTML = '';
        albums.forEach(album => {
            const albumContainer = document.createElement('div');
            albumContainer.className = 'album-container';
    
            const albumImage = document.createElement('img');
            albumImage.src = album.imageUrl;
            albumImage.alt = album.title + ' Image';
            albumImage.className = 'album-image';
            albumContainer.appendChild(albumImage);
    
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album';
    
            const albumTitle = document.createElement('h2');
            albumTitle.textContent = album.title;
            albumDiv.appendChild(albumTitle);
    
            const artistName = document.createElement('h3');
            artistName.textContent = 'by ' + album.artist;
            albumDiv.appendChild(artistName);
    
            album.tracks.forEach(track => {
                const trackDiv = document.createElement('div');
                trackDiv.className = 'track';
    
                const trackTitle = document.createElement('p');
                trackTitle.textContent = track.title;
                trackDiv.appendChild(trackTitle);
    
                const audioElement = document.createElement('audio');
                audioElement.controls = true;
                audioElement.src = track.url;
                trackDiv.appendChild(audioElement);
    
                const playButton = document.createElement('button');
                playButton.textContent = 'Play';
                playButton.addEventListener('click', () => {
                    audio.src = track.url;
                    audio.play();
                    currentTrackTitle.textContent = track.title;
                });
                trackDiv.appendChild(playButton);
    
                const addToPlaylistButton = document.createElement('button');
                addToPlaylistButton.textContent = 'Add to Playlist';
                addToPlaylistButton.addEventListener('click', () => {
                    addToPlaylist(track);
                });
                trackDiv.appendChild(addToPlaylistButton);
    
                const downloadButton = document.createElement('a');
                downloadButton.textContent = 'Download';
                downloadButton.href = track.url;
                downloadButton.download = '';
                downloadButton.className = 'button download-btn';
                trackDiv.appendChild(downloadButton);
    
                albumDiv.appendChild(trackDiv);
            });
    
            albumContainer.appendChild(albumDiv);
            albumsContainer.appendChild(albumContainer);
        });
    };
    
    const displayPlaylist = () => {
        playlistContainer.innerHTML = '';
        playlist.forEach((track, index) => {
            const trackDiv = document.createElement('div');
            trackDiv.className = 'track';
    
            const trackTitle = document.createElement('p');
            trackTitle.textContent = track.title;
            trackDiv.appendChild(trackTitle);
    
            const audioElement = document.createElement('audio');
            audioElement.controls = true;
            audioElement.src = track.url;
            trackDiv.appendChild(audioElement);
    
            const playButton = document.createElement('button');
            playButton.textContent = 'Play';
            playButton.addEventListener('click', () => {
                audio.src = track.url;
                audio.play();
                currentTrackTitle.textContent = track.title;
            });
            trackDiv.appendChild(playButton);
    
            const removeFromPlaylistButton = document.createElement('button');
            removeFromPlaylistButton.textContent = 'Remove';
            removeFromPlaylistButton.addEventListener('click', () => removeFromPlaylist(index));
            trackDiv.appendChild(removeFromPlaylistButton);
    
            const downloadButton = document.createElement('a');
            downloadButton.textContent = 'Download';
            downloadButton.href = track.url;
            downloadButton.download = '';
            downloadButton.className = 'button download-btn';
            trackDiv.appendChild(downloadButton);
    
            playlistContainer.appendChild(trackDiv);
        });
    };

    const addToPlaylist = (track) => {
        if (!playlist.includes(track)) {
            playlist.push(track);
            displayPlaylist();
        }
    };

    const removeFromPlaylist = (index) => {
        playlist.splice(index, 1);
        displayPlaylist();
    };
    
    clearPlaylistButton.addEventListener('click', () => {
        playlist = [];
        displayPlaylist();
        audio.pause();
        currentTrackTitle.textContent = 'No track playing';
    });
    
    playAllButton.addEventListener('click', () => {
        playlist = [];
        albums.forEach(album => {
            album.tracks.forEach(track => {
                playlist.push(track);
            });
        });
        displayPlaylist();
        currentTrackIndex = 0;
        playTrack();
    });

    shuffleAllButton.addEventListener('click', () => {
        playlist = [];
        albums.forEach(album => {
            let shuffledTracks = album.tracks.slice().sort(() => Math.random() - 0.5);
            shuffledTracks.forEach(track => {
                playlist.push(track);
            });
        });
        displayPlaylist();
        currentTrackIndex = 0;
        playTrack();
    });

    pauseTrackButton.addEventListener('click', () => {
        if (audio) audio.pause();
    });

    resumeTrackButton.addEventListener('click', () => {
        if (audio) audio.play();
    });

    nextTrackButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        playTrack();
    });

    const filterTracks = (searchTerm) => {
        const filteredAlbums = albums.filter(album => {
            return album.tracks.some(track =>
                track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.artist.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }).map(album => {
            return {
                ...album,
                tracks: album.tracks.filter(track =>
                    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    album.artist.toLowerCase().includes(searchTerm.toLowerCase())
                )
            };
        }).filter(album => album.tracks.length > 0);
        displayAlbums(filteredAlbums);
    };

    searchBar.addEventListener('input', (e) => {
        filterTracks(e.target.value);
    });

    displayAlbums(albums);

    function playTrack() {
        if (playlist.length > 0) {
            audio.src = playlist[currentTrackIndex].url;
            audio.play();
            currentTrackTitle.textContent = playlist[currentTrackIndex].title;
        }
    }

    audio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        playTrack();
    });
});
