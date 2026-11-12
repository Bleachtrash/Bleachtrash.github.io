const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: "zj2x67aktl2o6q2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "cpn1rwizcyq4gkne",
    password: "lx3mud2mxg0smiai",
    database: "rsop01m1ako88oih",
    connectionLimit: 10,
    waitForConnections: true
});

const query = `query {
  Page(page: 0, perPage: 10){
    media(type: ANIME, sort: [POPULARITY_DESC]){
      title{
        english,
        romaji
      },
      studios(isMain: true){
        nodes{
          name
        }
      }
      coverImage {
        medium
      }
      description
      format
      season
      seasonYear
    }
  }
}`;
const variables = {};
const url = "https://graphql.anilist.co"
var options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({query:query, variables:variables})
};

async function post_anime(anime)
{
    
}

async function main()
{
    await fetch(url, options).then(response =>{
    if(!response.ok)
        throw Error("Reponse was not ok!");
    return response.json();
    }).then(json =>{
        for(media of json.data.Page.media){
            console.log(media.title.english);
        }
    });
}

main();