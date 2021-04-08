const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');

const path = require("path");
const Sequelize = require("sequelize");

//imports database
const db = require("./config/database"); 

//tests the database
db.authenticate()
.then(() => console.log('Success!'))
.catch(err => console.log("Error: " + err))

const app = express();

//handlebars
app.engine("handlebars", exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));

//set static folder

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("index", { layout: 'landing' });
})

//Gig routes
app.use("/gigs", require("./routes/gigs"));

const PORT = process.env.PORT || 5001;


app.listen(PORT, console.log(`Server listening on port: ${PORT}...`));