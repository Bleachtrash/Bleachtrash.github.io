import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using the POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool, replace values in red
const pool = mysql.createPool({
    host: "zj2x67aktl2o6q2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "cpn1rwizcyq4gkne",
    password: "lx3mud2mxg0smiai",
    database: "rsop01m1ako88oih",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', (req, res) => {
    res.render('home.ejs');
});

//This function looks up a single quote by ID
async function getQuoteById(quoteId) {

    // console.log(quoteId);
    let singleQuoteQuery = `SELECT * FROM quotes WHERE quoteId = ?`;
    let params = [ quoteId ];
    const [ rows ] = await pool.query(singleQuoteQuery, params);
    // console.log(rows);

    if (rows.length < 1) {
        return null;
    } else {
        return rows[0];
    }


}

//This function gets all the data we need for dropdown lists
async function getQuoteFormData() {
    let getAuthorsQuery = 'SELECT * FROM authors;';
    const [ rows ] =  await pool.query(getAuthorsQuery);

    const [categories] = await pool.query("SELECT DISTINCT category from quotes");

    let formErrors = {}; //can be populated with errors for each field

    return { authors: rows, categories: categories};
}

// renders an empty new quote form
app.get('/newQuote', async (req, res) => {

    //this runs any queries to populate drop-downlists
    let formData = await getQuoteFormData();

    res.render('newQuote.ejs', { formData, formErrors: {} });
});

app.get("/newAuthor", async(req, res) => {

    res.render('newAuthor.ejs', {formErrors: {}});
});

// submits the users input to be entered into the db
app.post('/insertQuote', async (req, res) => {
    let quote = req.body.quote;
    let authorId = req.body.authorId;
    let categories = req.body.categories;
    let likes = req.body.likes;


    let hasErrors = false;
    let errors = {};
    if (quote === '') {
        hasErrors = true;
        errors.quote = "Quote cannot be empty";
    } // you can add other checks after this
    if(likes === ''){
        hasErrors = true;
        errors.likes = "Liikes cannot be empty";
    }
    if (hasErrors) {

        let formData = await getQuoteFormData();
        //attach errors to be returned with the form
        res.render('newQuote.ejs', {formData, formErrors : errors});

    } else {

        let insertQuery =
        `INSERT INTO quotes (quote, authorId, catagory, likes)
        VALUES (?, ?, ?, ?);`

        let params = [ quote, authorId, catagory, likes];

        const [rows] = await pool.query(insertQuery, params);

        //res.render('newQuote.ejs');
        res.redirect('/newQuote');
    }
});

app.post("/insertAuthor", async(req, res) =>{
    let authorFirstName = req.body.authorFirstName;
    let authorLastName = req.body.authorLastName;
    let authorDOB = req.body.authorDOB;
    let authorDOD = req.body.authorDOD;
    let authorGender = req.body.authorGender;
    let authorProfession = req.body.authorProfession;
    let authorCountry = req.body.authorCountry;
    let authorPortrait = req.body.authorPortrait;
    let authorBiography = req.body.authorBiography;

    let hasErrors = false;
    let errors = {};
    if(authorFirstName === ''){
        hasErrors = true;
        errors.authorFirstName = "Author firstname cannot be empty";
    }
    if(authorLastName === ''){
        hasErrors = true;
        errors.authorLastName = "Author lastname cannot be empty";
    }
    if(authorDOB === ''){
        hasErrors = true;
        errors.authorDOB = "Author date of birth cannot be empty";
    }
    if (new Date(authorDOB).getTime() > new Date(authorDOD).getTime()) {
      hasErrors = true;
      errors.authorDOD = "Author date of death cannot be before date of birth";
    }
    if(authorProfession == ''){
        hasErrors = true;
        errors.authorProfession = "Author profession cannot be empty";
    }
    if(authorCountry === ''){      
        hasErrors = true;
        errors.authorCountry = "Author country cannot be empty";
    }
    if(authorPortrait === ''){
        hasErrors = true;
        errors.authorPortrait = "Author portrait cannot be empty";
    }
    if(authorBiography === ''){
        hasErrors = true;
        errors.authorBiography = "Author biography cannot be empty";
    }

    if (hasErrors) {

        //attach errors to be returned with the form
        res.render('newAuthor.ejs', {formErrors : errors});

    } else {

        let insertQuery =
        `INSERT INTO authors (firstName, lastName, dob, dod, gender, profession, country, portrait, biography)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`

        let params = [ authorFirstName, authorLastName, authorDOB, authorDOD, authorGender, authorProfession, authorCountry, authorPortrait, authorBiography];

        const [rows] = await pool.query(insertQuery, params);

        res.redirect('/newAuthor');

    }
});

// renders the edit quote form
app.get('/editQuote', async (req, res) => {

    let quoteId = req.query.quoteId;
    let quoteObject = await getQuoteById(quoteId);


    if (quoteObject == null) {
        res.redirect('/quoteList');
    } else {
         let formData = await getQuoteFormData();
         let formObject = quoteObject; // the first record should be the quote we're editing

         res.render('editQuote.ejs', {formData, formObject, formErrors: {}});
    }
});


app.get('/quoteList', async (req, res) => {
    let quotesQuery = `SELECT * FROM quotes`;
    const [rows] = await pool.query(quotesQuery);

    res.render('quoteList.ejs', {quotes: rows});

});


app.post('/updateQuote', async (req, res) => {
    let quote = req.body.quote;
    let authorId = req.body.authorId;
    let categories = req.body.categories;
    let likes = req.body.likes;


    let hasErrors = false;
    let errors = {};
    if (quote === '') {
        hasErrors = true;
        errors.quote = "Quote cannot be empty";
    } // you can add other checks after this
    if(likes === ''){
        hasErrors = true;
        errors.likes = "Likes cannot be empty";
    }
    if (hasErrors) {

        let formData = await getQuoteFormData();
        //attach errors to be returned with the form
        res.render('editQuote.ejs', {formData, formErrors : errors});

    } else {
        let updateQuery =
            `UPDATE quotes SET
            quote = ?,
            authorId = ?
            category = ?
            likes = ?
            WHERE quoteId = ?`

        let params = [quote, authorId, categories, likes, quoteId];
        const [ rows ] = await pool.query(updateQuery, params);

        res.redirect('/quoteList');
    }

});




app.get("/dbTest", async(req, res) => {
  try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})
