const solarSystem = (await import('npm-solarsystem')).default;

import express from 'express';
import fetch from 'node-fetch';

//express is an API engine
//it lets you make your own APIs
const app = express();

//EJS is a way to dynamically build html pages
//and easily substitute data into them
app.set("view engine", "ejs");

//public folder
app.use(express.static("public"));

app.get('/', async (req, res) => {
   var images = [];
   try {
      // Get 4 random planet images
      const result = await fetch("https://pixabay.com/api/?key=20426927-497d14db9c234faf7d0df8317&per_page=50&orientation=horizontal&q=solar%20system");
      const json = await result.json();
      // Generate 4 random numbers
      var rand_numbers = [];
      for (let i = 0; i < 4; i++) {
         var num;
         do {
            num = Math.floor(Math.random() * 49);
         } while (rand_numbers.includes(num));

         rand_numbers.push(num);
         images.push(json.hits[num].largeImageURL);
      }
   } catch(e){}
   res.render('home.ejs', { images: images });
});


app.get('/planetInfo', (req, res) => {
   let planet = req.query.planet;
   let picture = "";
   var data;
   switch (planet) {
      case "Mercury":
         data = solarSystem.getMercury();
         break;
      case "Venus":
         data = solarSystem.getVenus();
         break;
      case "Earth":
         data = solarSystem.getEarth();
         break;
      case "Mars":
         data = solarSystem.getMars();
         break;
      case "Jupiter":
         data = solarSystem.getJupiter();
         break;
      case "Saturn":
         data = solarSystem.getSaturn();
         break;
      case "Uranus":
         data = solarSystem.getUranus();
         break;
      case "Neptune":
         data = solarSystem.getNeptune();
         break;
      case "Pluto":
         data = solarSystem.getPluto();
         break;
      default:
         break;
   }
   data.name = planet;
   res.render("planet.ejs", data);
   // if (planet === 'Jupiter') {
   //    //render the planetInfo view with jupiter information
   // } else (planet === 'Mars') {
   //    //render the planetInfo view with mars information
   // }
});



app.listen(3000, () => {
   console.log('server started');
});