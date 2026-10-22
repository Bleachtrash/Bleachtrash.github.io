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


app.get('/planetInfo', async(req, res) => {
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
         data.image = "https://science.nasa.gov/wp-content/uploads/2024/03/pia04304-mars.jpg";
         break;
      case "Jupiter":
         data = solarSystem.getJupiter();
         data.image = "https://science.nasa.gov/wp-content/uploads/2024/03/jupiter-marble-pia22946.jpg?";
         break;
      case "Saturn":
         data = solarSystem.getSaturn();
         break;
      case "Uranus":
         data = solarSystem.getUranus();
         data.image = "https://science.nasa.gov/wp-content/uploads/2024/05/webb-stsci-01hhfp5g5bxsc5m7dx6dg9yxmb.png";
         break;
      case "Neptune":
         data = solarSystem.getNeptune();
         break;
      case "Pluto":
         data = solarSystem.getPluto();
         data.image = "https://science.nasa.gov/wp-content/uploads/2024/03/pluto-new-horizons-pia20291-16x9-1.jpg";
         break;
      case "Asteroids":
         data = solarSystem.getAsteroids();
         break;
      case "Comets":
         data = solarSystem.getComets();
         break;
      default:
         break;
   }
   if(planet == "NASA Pod"){
      try{
         var pod_url = "https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date="
         const d = new Date();
         pod_url += d.getFullYear()+"-";
         pod_url += d.getMonth()+"-";
         pod_url += d.getDate();

         const result = await fetch(pod_url);
         data = await result.json();
         data.status = "good";
      }catch(e){
         data = {};
         data.status = "bad";
      }
   }
   data.name = planet;
   res.render("planet.ejs", data);
});

app.listen(3000, () => {
   console.log('server started');
});