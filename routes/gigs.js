const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Gig = require("../models/Gig");
const Sequelize = require("sequelize")
const Op = Sequelize.Op

    //get gig list
router.get("/", (req, res) => {
    Gig.findAll()
    .then(gigs => res.render('gigs', { gigs } ))
    .catch(err => console.log(err))
});

//display gig form

router.get('/add', (req, res) => {
    res.render('add')
})

//add gig
router.post("/add", (req, res) => {
    let { title, technologies, budget, description, contact_email } = req.body;
    let errors = [];

        //validate fields
    if (!title) {
        errors.push({text: 'Please insert a title'})
    }
    if (!technologies) {
        errors.push({text: 'Please insert a technology'})
    }
    if (!description) {
        errors.push({text: 'Please insert a description'})
    }
    if (!contact_email) {
        errors.push({text: 'Please insert an email'})
    }

    //check for errors
    if(errors.length > 0) {
       return res.render('add', {
            errors,
            title, 
            technologies,
            budget,
            description,
             contact_email 
        })
    }
    //insert into table
    if(!budget) {
        budget='Unknown'
    } else {
        budget = `$${budget}`;
    }
    //make lower case and remove space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ',');

    Gig.create({
        title,
        technologies,
        budget,
        description,
        contact_email
    })
    .then(gig => res.redirect('/gigs'))
    .catch(err => console.log(err))
})

//search for gigs
router.get('/search', (req, res) => {
    let { term } = req.query;
    term = term.toLowerCase();

    Gig.findAll({where: { technologies: { [Op.like]: "%" + term + "%" } } })
    .then(gigs => res.render("gigs", { gigs }))
    .catch(err => console.log(err));
})

module.exports = router;