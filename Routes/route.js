const express = require('express');
const route = express.Router();
const { check, validationResult, body } = require("express-validator");
const contactController = require('../controllers/contactController');
const {upload, cloudinary, storage} = require('../utils/cloudinary');
const Contact = require('../model/contactModel');


route.post('/create',upload.single('image'),
[
    check("name","Invalid name given").matches(/^[a-zA-Z][a-zA-Z ]*$/),
    check("mobile","Invalid mobile number").isMobilePhone().isLength({ min: 10, max:10 }),
    check('image',"Invalid file input")
    .custom((value, {req}) => {
            if(req.file.mimetype === 'image/png'){
                return '.png'; // return "non-falsy" value to indicate valid data"
            }else{
                return false; // return "falsy" value to indicate invalid data
            }
        })

],
contactController.createContact);


route.get('/contacts',contactController.getAllContacts);

route.get('/search', contactController.searchContact);

route.delete('/delete/:id', contactController.deleteContact);

route.put('/edit/:id',contactController.editContact);

module.exports = route;