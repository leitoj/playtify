const audio = document.querySelector("audio")
const controller = document.getElementById("play")
const listSong = []
let listSongSize;
let lastIconId;

// Play and pause functionality
controller.addEventListener("click", () => {
    if(audio.paused){
        audio.play();
        controller.innerHTML = `<i class="far fa-pause-circle"></i>`
    }else if (audio.played){
        audio.pause();
        controller.innerHTML = `<i class="far fa-play-circle"></i>`
    }else{
        console.log("error")
    }
    
})

// Volume controller
const volume = document.querySelector("#volumen");
volume.addEventListener("change", (e) => {
    const icon = document.getElementById("iconVolume")
    const vol = e.target.value
    
	audio.volume = vol

    icon.className = "";
    if(vol <= 0.50 && vol > 0){
        icon.className = "fas fa-volume-down"
    }else if(vol <= 0){
        icon.className = "fas fa-volume-mute"
    }else{
        icon.className = "fas fa-volume-up"
    }
})

// Function to read the song which are on the files assets/songs
const getListSong = (classList) => {
    const songs = document.querySelectorAll(classList);
    songs.forEach(song => {
        listSong.push(song)
    })
    listSongSize = songs.length;
}
getListSong(".song")


// Function to click and play the song
const playSong = (song, id) => {
    song = song.split(" ").join("-")
    let src = `assets/songs/${song}.mp3`
    audio.id = id;
    audio.src = src.split(' ').join('')
    
    // Play audio
    audio.play()
    // Bar animation
    window.requestAnimationFrame(progressAnimation)

    // Set icon gif
    if(lastIconId == null){
        lastIconId = "img-"+id;
    }else if(lastIconId != null){
        let image = document.getElementById(lastIconId)
        image.src = "images/songLogo.jpg"
        lastIconId = "img-"+id;
    }
    let icon = document.getElementById("img-"+id)
    icon.src = 'images/bars.gif'

    
    // Set as current Song on the screen
    let title = document.getElementById("songTitle");
    title.innerHTML = song.split("-").join(" ");
}

// Change song with a click
document.addEventListener("click", (e) => {
    if(e.target.classList == "song"){
        playSong(e.target.innerHTML, e.target.id)
        controller.innerHTML = `<i class="far fa-pause-circle"></i>`;
    }

    if(e.target.classList == "button"){
        e.preventDefault()
    }
})


// Progress bar of the song
const container = document.getElementById("elapsed-container")
const elapsed = document.getElementById("elapsed");

const progressAnimation = () => {
    let audio = document.querySelector("audio")
    let rect = container.getBoundingClientRect()
    let percentage = audio.currentTime / audio.duration;
    elapsed.style.width = (percentage * rect.width) + "px";

    window.requestAnimationFrame(progressAnimation)
}

// Function next song when it finish
const next = () => {
    lastSong = document.querySelector("audio")
    nextSong = parseInt(lastSong.id) + 1;
    try {
        if(lastSong.id == listSong.length - 1){
            playSong(listSong[0].innerHTML, 0)
        }else{
            playSong(listSong[nextSong].innerHTML, nextSong)
        }
    } catch (error){
        return
    }
}

// Get the previus song and play
const prev = () => {
    lastSong = document.querySelector("audio")
    prevSong = parseInt(lastSong.id) - 1;
    if(lastSong.id == 0){
        playSong(listSong[listSongSize - 1].innerHTML, listSongSize - 1)
    }else{
        playSong(listSong[prevSong].innerHTML, prevSong)
    }
}


