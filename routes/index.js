var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, "../", "public", "assets", "songs")


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Playtify'
  });
});
router.get('/player', function (req, res, next) {
  // Get list of songs and past it to the front end
  const songs = []
  let i = 0;
  fs.readdirSync(folder).forEach(Namefile => {
    Namefile = Namefile.substring(0, Namefile.length - 4)
    songs.push({
      songName: Namefile.split("-").join(" "),
      id: i
    })
    i++
  })

  // render the template
  res.render('player', {
    title: 'player',
    songs: songs
  });
});

router.get('/help', function (req, res, next) {
  res.render('form', {
    title: 'Help',
    type: req.query.type,
    messages: {
      title: "How can we help?",
      titleInput: "Message",
      placeholder: "Tell us your message or problem is"
    }
  })

});
router.get('/contact', function (req, res, next) {
  res.render('form', {
    title: 'Contact',
    type: req.query.type,
    messages: {
      title: "Contact Us",
      titleInput: "Message",
      placeholder: "What would you like to tell us"
    }
  })
});

router.get("/about", (req, res, next) => {
  res.render('about', {title: "About"})
})

module.exports = router;