import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
   res.render("home.ejs");
});
app.get('/results', async(req, res) => {
    let dogs = [];
    try {
        const response = await fetch(" https://dog.ceo/api/breed/borzoi/images/random/50");
        const json = await response.json();
        dogs = json.message;
    }catch(e){
        console.log("ERROR");
        dogs = [];
    }
    res.render("results.ejs", {results: dogs});
});
app.get('/home', (req, res) =>{
    res.render("home.ejs");
});
app.listen(3000, () => {
   console.log('server started');
});