let card = document.querySelector('.card');
let icon = document.querySelector('.play-icon');
let play = document.querySelector('#play');

let song = new Audio('Songs/1.mp3');

let singer = [
    {
        id: 1,
        songName: `<p>Glory <br> Honey Singh</p>`,
    },
    {
        id: 2,
        songName: `<p>Royalty <br> Maestro Chives, Egzod, Neoni</p>`,
    }
];

function playSong() {
    if (song.paused || song.currentTime <= 0) {
        song.play();
        play.classList.remove('ri-play-fill');
        play.classList.add('ri-pause-fill');
    } else {
        song.pause();
        play.classList.remove('ri-pause-fill');
        play.classList.add('ri-play-fill');
    }
}

let songtime = document.querySelector('.songtime');

function displaySongTiming() {
    let curTime = song.currentTime;
    let songDuration = song.duration;

    let min1 = Math.floor(curTime / 60);
    let sec1 = Math.floor(curTime % 60);

    if (min1 < 10) {
        min1 = `0${min1}`;
    }

    if (sec1 < 10) {
        sec1 = `0${sec1}`;
    }

    let min2 = Math.floor(songDuration / 60);
    let sec2 = Math.floor(songDuration % 60);

    songtime.innerHTML = `${min1}:${sec1}/${min2}:${sec2}`;

    let seekbar = document.querySelector('.seekbar');
    let circle = document.querySelector('.circle');

    seekbar.addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        song.currentTime = ((song.duration) * percent) / 100;
    });
    circle.style.left = (song.currentTime / song.duration) * 100 + '%';
}

play.addEventListener('click', playSong);
song.addEventListener('timeupdate', displaySongTiming);

let next = document.querySelector('#next');
let previous = document.querySelector('#previous');
let allSongs = document.querySelectorAll('.allSongs');
let playBtn = document.getElementsByClassName('play-btn');
let playListIcon = document.getElementsByClassName('playListIcon');

songIndex = Array.from(allSongs).length;
let index = 0;
let allSongsIndex = Array.from(playListIcon);

function makeAllPlay() {
    allSongsIndex.forEach((arr) => {
        arr.classList.add('ri-play-circle-line');
        arr.classList.remove('ri-pause-circle-line');
    });
}

let songinfo = document.querySelector('.songinfo');

allSongsIndex.forEach((arr) => {
    arr.addEventListener('click', (e) => {
        index = e.target.id;
        song.src = `Songs/${index}.mp3`;
        song.play();
        play.classList.remove('ri-play-fill');
        play.classList.add('ri-pause-fill');

        let songTitles = singer.filter((e) => {
            return e.id == index;
        });

        songTitles.forEach((e) => {
            let { songName } = e;
            songinfo.innerHTML = songName;
        });

        makeAllPlay();

        e.target.classList.remove('ri-play-circle-line');
        e.target.classList.add('ri-pause-circle-line');
    });
});

function toNextSong() {
    index++;
    if (index > songIndex) {
        index = 1;
    }
    song.src = `Songs/${index}.mp3`;
    song.play();
    play.classList.remove('ri-play-fill');
    play.classList.add('ri-pause-fill');

    let songTitles = singer.filter((e) => {
        return e.id == index;
    });

    songTitles.forEach((e) => {
        let { songName } = e;
        songinfo.innerHTML = songName;
    });

    if (index === 2) {
        allSongsIndex[index - 2].classList.remove('ri-pause-circle-line');
        allSongsIndex[index - 2].classList.add('ri-play-circle-line');
        allSongsIndex[index - 1].classList.remove('ri-play-circle-line');
        allSongsIndex[index - 1].classList.add('ri-pause-circle-line');
    } 
    else if (index === 1) {
        allSongsIndex[index - 1].classList.add('ri-pause-circle-line');
        allSongsIndex[index - 1].classList.remove('ri-play-circle-line');
        allSongsIndex[index].classList.add('ri-play-circle-line');
        allSongsIndex[index].classList.remove('ri-pause-circle-line');
    }
}

function toPreviousSong() {
    index -= 1;
    if (index < 1) {
        index = songIndex;
    }
    song.src = `Songs/${index}.mp3`;
    song.play();
    play.classList.remove('ri-play-fill');
    play.classList.add('ri-pause-fill');

    let songTitles = singer.filter((e) => {
        return e.id == index;
    });

    songTitles.forEach((e) => {
        let { songName } = e;
        songinfo.innerHTML = songName;
    });

    if (index === 2) {
        allSongsIndex[index - 2].classList.remove('ri-pause-circle-line');
        allSongsIndex[index - 2].classList.add('ri-play-circle-line');
        allSongsIndex[index - 1].classList.remove('ri-play-circle-line');
        allSongsIndex[index - 1].classList.add('ri-pause-circle-line');
    }
    else if (index === 1) {
        allSongsIndex[index - 1].classList.add('ri-pause-circle-line');
        allSongsIndex[index - 1].classList.remove('ri-play-circle-line');
        allSongsIndex[index].classList.add('ri-play-circle-line');
        allSongsIndex[index].classList.remove('ri-pause-circle-line');
    }
}

next.addEventListener('click', toNextSong);
previous.addEventListener('click', toPreviousSong);

document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
    song.volume = parseInt(e.target.value) / 100;
});