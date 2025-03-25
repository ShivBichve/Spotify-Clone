let music = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${folder}`);
    let text = await a.text();
    let div = document.createElement('div');
    div.innerHTML = text;
    let as = Array.from(div.getElementsByTagName('a'));
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('mp3')) {
            songs.push(element.href.split(`${folder}`)[1]);
        }
    }

    let songUl = document.querySelector('.songList').getElementsByTagName('ul')[0];

    songUl.innerHTML = '';

    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li class="allSongs flex">
                                <div class="music-logo flex items-center">
                                    <i class="ri-music-2-fill"></i>
                                </div>
                                <div class="info">
                                    <p class="songname">${song.replaceAll('%20', ' ')}</p>
                                </div>
                                <div class="play-btn">
                                    <p>Play Now</p>
                                    <i class="ri-play-circle-line play-icon playListIcon" id="0"></i>
                                </div>
                            </li>`;
    }

    listingSongs();

    return songs;
}

async function playMusics(source) {
    music.src = `${currFolder}` + source;
    music.play();

    play.classList.remove('ri-play-fill');
    play.classList.add('ri-pause-fill');

    let songinfo = document.querySelector('.songinfo');
    songinfo.innerHTML = source.replaceAll('%20', ' ');
}

let cardContainer = document.querySelector('.cardContainer');

async function displayAlbums() {
    let a = await fetch('/musics/');
    let text = await a.text();
    let div = document.createElement('div');
    div.innerHTML = text;
    let as = Array.from(div.getElementsByTagName('a'));

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.includes('/musics/')) {
            let folder = element.href.split('/musics/')[1];
            let info = await fetch(`/musics/${folder}/info.json`);
            let data = await info.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card" data-folder="${folder}">
                        <div class="image">
                            <img src="/musics/${folder}/cover.jpg" alt="">
                            <div class="play-logo">
                                <i class="ri-play-circle-line playListIcon" id="0"></i>
                            </div>
                        </div>
                        <h3>
                            ${data.title}
                        </h3>
                        <h4 class="color">
                            ${data.description}
                        </h4>
                    </div>`;
        }
    }

    songs = await getSongs('/musics/album1/');

    addPlaylist();
}

let next = document.querySelector('#next');
let previous = document.querySelector('#previous');

function listingSongs() {
    let songLi = Array.from(document.querySelector('.songList').getElementsByTagName('li'));

    songLi.forEach((e) => {
        e.addEventListener('click', () => {
            playMusics(e.getElementsByTagName('div')[1].firstElementChild.innerHTML);
            let songinfo = document.querySelector('.songinfo');
            songinfo.innerHTML = e.getElementsByTagName('div')[1].firstElementChild.innerHTML;
        });
    });
}

function addPlaylist() {
    let card = Array.from(document.getElementsByClassName('card'));

    card.forEach((e) => {
        e.addEventListener('click', async (el) => {
            songs = await getSongs(`/musics/${el.currentTarget.dataset.folder}/`);
            playMusics(songs[0]);
        });
    });
}

function toNextSong() {
    let index = songs.indexOf(music.src.split('/').slice(-1)[0]);

    if (index + 1 < songs.length) {
        playMusics(songs[index + 1]);
    }
    else if (index + 1 === songs.length) {
        playMusics(songs[0]);
    }
}

function toPreviousSong() {
    let index = songs.indexOf(music.src.split('/').slice(-1)[0]);

    if (index - 1 >= 0) {
        playMusics(songs[index - 1]);
    }
    else if (index - 1 < 0) {
        playMusics(songs[(songs.length) - 1]);
    }
}

let play = document.querySelector('#play');

function toPlayAndPauseSong() {
    if (music.paused || music.currentTime <= 0) {
        music.play();
        play.classList.remove('ri-play-fill');
        play.classList.add('ri-pause-fill');
    }
    else {
        music.pause();
        play.classList.add('ri-play-fill');
        play.classList.remove('ri-pause-fill');
    }
}

function showTime() {
    let songtime = document.querySelector('.songtime');

    let currTime = music.currentTime;
    let duration = music.duration;

    let min1 = Math.floor(currTime / 60);
    let sec1 = Math.floor(currTime % 60);
    let min2 = Math.floor(duration / 60);
    let sec2 = Math.floor(duration % 60);

    if (isNaN(min2 && sec2)) {
        min2 = sec2 = '0';
    }

    min1 < 10 ? min1 = `0${min1}` : min1;
    min2 < 10 ? min2 = `0${min2}` : min2;
    sec1 < 10 ? sec1 = `0${sec1}` : sec1;
    sec2 < 10 ? sec2 = `0${sec2}` : sec2;

    songtime.innerHTML = `${min1}:${sec1}/${min2}:${sec2}`;

    let circle = document.querySelector('.circle');

    circle.style.left = (music.currentTime / music.duration) * 100 + '%';
}

function playKeyEvents() {
    document.addEventListener('keydown', (e) => {
        let sound = document.querySelector('.range').getElementsByTagName('input')[0];
        let left = document.querySelector('.left');

        if (e.key === 's') {
            toNextSong();
        }
        else if (e.key === 'Escape') {
            left.style.left = '0';
        }
        else if (e.key === 'Backspace') {
            left.style.left = '-140%';
        }
        else if (e.key === 'a') {
            toPreviousSong();
        }
        else if (e.key === 'ArrowUp') {
            music.currentTime = music.currentTime + 5;
        }
        else if (e.key === 'ArrowDown') {
            music.currentTime = music.currentTime - 5;
        }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            sound.focus();
        }
    });
}

async function playAll() {

    await displayAlbums();

    music.addEventListener('timeupdate', showTime);

    next.addEventListener('click', toNextSong);

    previous.addEventListener('click', toPreviousSong);

    play.addEventListener('click', toPlayAndPauseSong);

    let seekbar = document.querySelector('.seekbar');

    playKeyEvents();

    seekbar.addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        music.currentTime = ((music.duration) * percent) / 100;
    });

    let sound = document.querySelector('.range').getElementsByTagName('input')[0];

    sound.addEventListener('change', (e) => {
        music.volume = parseInt(e.target.value) / 100;
    });

    let menuBtn = document.querySelector('.menu-icon');
    let left = document.querySelector('.left');
    let close = document.querySelector('.close');

    menuBtn.addEventListener('click', () => {
        left.style.left = '0';
    });

    close.addEventListener('click', () => {
        left.style.left = '-140%';
    });
}

document.addEventListener('DOMContentLoaded', playAll); 