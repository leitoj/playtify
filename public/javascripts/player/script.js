const audio = document.querySelector("audio")
const controller = document.getElementById("play")
const $titlePage = document.getElementById("titleText")
const $iconView = document.getElementById("iconView")
let listSong = [];
let listSongText = [];
let listSongSize;
let lastIconId;
let view = "all";

const pauseFunction = () => {
    if (audio.paused) {
        audio.play();
        controller.innerHTML = `<i class="far fa-pause-circle"></i>`
    } else if (audio.played) {
        audio.pause();
        controller.innerHTML = `<i class="far fa-play-circle"></i>`
    } else {
        console.log("error")
    }
}

// Play and pause functionality
controller.addEventListener("click", () => {
    pauseFunction()
})
document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
        pauseFunction()
    }
}

// Volume controller
const volume = document.querySelector("#volumen");
volume.addEventListener("change", (e) => {
    const icon = document.getElementById("iconVolume")
    const vol = e.target.value

    audio.volume = vol

    icon.className = "";
    if (vol <= 0.50 && vol > 0) {
        icon.className = "fas fa-volume-down"
    } else if (vol <= 0) {
        icon.className = "fas fa-volume-mute"
    } else {
        icon.className = "fas fa-volume-up"
    }
})

// // Function to read the song which are on the files assets/songs
const getListSong = (classList) => {
    listSong = [];
    const songs = document.querySelectorAll(classList);
    songs.forEach(song => {
        listSong.push(song)
        listSongText.push(song.innerHTML)
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
    // activing the button
    controller.disabled = false;
    // Bar animation
    window.requestAnimationFrame(progressAnimation)

    // Set icon gif
    if (lastIconId == null) {
        lastIconId = "img-" + id;
    } else if (lastIconId != null) {
        let image = document.getElementById(lastIconId)
        image.src = "images/songLogo.jpg"
        lastIconId = "img-" + id;
    }
    let icon = document.getElementById("img-" + id)
    icon.src = 'images/bars.gif'


    // Set as current Song on the screen
    let title = document.getElementById("songTitle");
    title.innerHTML = song.split("-").join(" ");

    // Set play icon on course
    controller.innerHTML = `<i class="far fa-pause-circle"></i>`;
}

// Change song with a click
document.addEventListener("click", (e) => {
    if (e.target.classList == "song") {
        playSong(e.target.innerHTML, e.target.id)
        controller.innerHTML = `<i class="far fa-pause-circle"></i>`;
    }

    if (e.target.classList == "button") {
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
        if (lastSong.id == listSong.length - 1) {
            playSong(listSong[0].innerHTML, 0)
        } else {
            playSong(listSong[nextSong].innerHTML, nextSong)
        }
    } catch (error) {
        return
    }
}

// Get the previus song and play
const prev = () => {
    lastSong = document.querySelector("audio")
    prevSong = parseInt(lastSong.id) - 1;
    if (lastSong.id == 0) {
        playSong(listSong[listSongSize - 1].innerHTML, listSongSize - 1)
    } else {
        playSong(listSong[prevSong].innerHTML, prevSong)
    }
}


// Favorites song functionality

/* 
    Part of code to add songs that you like on favs
    and also the funcionality to delete it, they all use
    the functions add and remove local
*/
document.addEventListener("click", e => {
    // add song as fav
    if (e.target.classList[2] == "fav-icon") {
        e.target.className = "fas fa-heart set-fav"
        addLocal(e.target.getAttribute("aria-name"))
    }

    // Remove the song as fav
    else if (e.target.classList[2] == "set-fav") {
        e.target.className = "far fa-heart fav-icon";
        removeLocal(e.target.getAttribute("aria-name"))
        // Eliminate the node of the song if the view is on fav
        if(view == "fav"){
            removeSongViewFav(e.target)
        }
    }

})

/*
    Prepare and set all the data in the localstorage when the page charge
*/
window.addEventListener("DOMContentLoaded", e => {
    if (!localStorage.getItem("listSongsFavs")) {
        let listSongs = []
        localStorage.setItem("listSongsFavs", JSON.stringify(listSongs))
    }

    // Set the icon for the songs with fav
    let list = localStorage.getItem("listSongsFavs");
    list = JSON.parse(list);
    list.forEach(song => {
        let $tag = document.querySelector(`[aria-name="${song}"]`)
        $tag.className = "fas fa-heart set-fav"
    });


    // Save all the song
    localStorage.setItem("listSongs", JSON.stringify(listSongText))
})

const addLocal = (item) => {
    let list = localStorage.getItem("listSongsFavs");
    list = JSON.parse(list);
    list.push(item)
    localStorage.setItem("listSongsFavs", JSON.stringify(list))
}

const removeLocal = (item) => {
    let list = localStorage.getItem("listSongsFavs");
    list = JSON.parse(list)
    for (let i = 0; i < list.length; i++) {
        if (list[i] == item) {
            list = list.filter(value => value !== item)
            break;
        }
    }
    localStorage.setItem("listSongsFavs", JSON.stringify(list))
}

const removeSongViewFav = (item) => {
    $mainNode = item.parentNode.parentNode;
    $mainNode.remove();
}
// Filter the songs with fav and all

/*
 I got all the html about the all songs
 in that way I don't have to create or modified.
 the idea is only to put it again when the person
 want to see all the songs again

 ALL the songs will be on the const allSongsHtml
*/
const $root = document.getElementById("root")
const allSongsHtml = $root.innerHTML;
const $buttonViewChange = document.getElementById("click-fav");

$buttonViewChange.addEventListener("click", e => {

    /* 
        Before the person choose another song the best option is to pause and delete
        the song which is playing that is why I added this part of code
    */
    let title = document.getElementById("songTitle");
    title.innerHTML = ""
    audio.src = "";
    controller.disabled = true;
    controller.innerHTML = `<i class="far fa-play-circle"></i>`


    let elements = "";
    let listSongsFavs = localStorage.getItem("listSongsFavs");
    listSongsFavs = JSON.parse(listSongsFavs)

    if (listSongsFavs == "") {
        elements = "<span id='any'>There isn't any favorite song <i class='far fa-sad-tear'></i></span>"
    } else {
        for (let i = 0; i < listSongsFavs.length; i++) {
            elements +=
                `
            <div class="songContainer">
                <div>
                    <img src="images/songLogo.jpg" alt="logo song" width="43px" style="border-radius: 3px;"
                    id="img-${i}">
                </div>
                <li class="song" id="${i}">${listSongsFavs[i]}</li>
                <div>
                <i class="fas fa-heart set-fav" aria-name="${listSongsFavs[i]}"></i>
                </div>
            </div>
            `
        }
    }


    // Change the state of the button and update the list with the songs
    if (e.target.innerHTML == "All songs") {
        // Normal view with all songs
        $titlePage.innerHTML = "Last songs";
        e.target.innerHTML = "Songs that you like"
        $root.innerHTML = allSongsHtml;

        // Put the Fav on the songs when there's all the list
        let list = localStorage.getItem("listSongsFavs");
        list = JSON.parse(list);
        list.forEach(song => {
            let $tag = document.querySelector(`[aria-name="${song}"]`)
            $tag.className = "fas fa-heart set-fav"
        });

        $iconView.className = "fas fa-heart"
        view = "all";

    } else {
        // Favorite view
        $titlePage.innerHTML = "Your favorites";
        e.target.innerHTML = "All songs"
        $root.innerHTML = "";
        $root.innerHTML = elements;
        view = "fav";

        $iconView.className = "fas fa-globe"
    }

    // Get the new list of song depending on where you are
    getListSong(".song")

})