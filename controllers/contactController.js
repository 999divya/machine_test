const Contact = require("../model/contactModel");
const { check, validationResult } = require("express-validator");
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("data.csv");
const multer = require('multer');
const {upload, cloudinary, storage} = require('../utils/cloudinary');




exports.createContact = async (req, res,next) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, mobile } = req.body;
 
    // console.log("reqfilesss",req.files);
    const contactImage = req.file ? req.file.path : null;
   
    const duplicateMobile = await Contact.findOne({ mobile: mobile });

    if (!duplicateMobile) {
      const duplicateName = await Contact.findOne({ name: name });
      if (!duplicateName) {
        const obj = {
          name,
          mobile,
          image:contactImage
        }

        const saveResult =  new Contact (obj);
        await saveResult.save()
        // const result = await Contact.create({
        //   name,
        //   mobile,
        //   contactImage,
        // });
      } else {
        const addNumber = await Contact.updateOne(
          { name },
          { $addToSet: { mobile: mobile } }
        );
        console.log("the updated array", addNumber);
      }

      return res.status(201).json({ message: "Contact created successfully" });
    } else {
      return res.status(200).json({
        errors: [
          {
            mobile: duplicate.mobile,
            msg: "The user already exists",
          },
        ],
      });
    }
  
  } catch (err) {
    return res.status(404).json({ created: false, err: err.message });
  }
};





exports.getAllContacts = async (req, res) => {
  try {
    const allContacts = await Contact.find({});
    if (allContacts) {
      let arra = [];
      allContacts.forEach((contact) => {
        let obj = {
          Name: contact.name,
          Mobile: contact.mobile,
        };

        arra.push(obj);
      });

      fastcsv
        .write(arra, { headers: true })
        .on("finish", function () {
          console.log("Write to CSV successfully!");
        })
        .pipe(ws);

      return res.status(200).json({
        message: "The list of all the users is given below",
        allContacts,
      });
    } else {
      return res.status(200).json({ message: "No contacts available" });
    }
  } catch (err) {
    return res.status(404).json({ created: false, err: err.message });
  }
};





exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await Contact.findByIdAndDelete(id);
    const allContacts = await Contact.find({});
    return res.status(200).json({
      message: `The contact with the id ${id} is deleted`,
      allContacts,
    });
  } catch (err) {
    return res.status(404).json({ created: false, err: err.message });
  }
};




exports.editContact = async (req, res) => {
  try {
    const { id } = req.params;

    const findUser = await Contact.findByIdAndUpdate(id, req.body);
    const showUpdatedId = await Contact.findOne({ _id: id });
    return res.status(200).json({
      message: `The contact with the id ${id} is updated`,
      showUpdatedId,
    });
  } catch (err) {
    return res.status(404).json({ created: false, err: err.message });
  }
};



exports.searchContact = async (req, res) => {
  try {
    const thename = req.body.name ? req.body.name : req.body.mobile;
    console.log("thename", thename);
    const data = await Contact.find({
      $or: [
        { name: { $regex: `${thename}`, $options: "i" } },
        { mobile: { $regex: `${thename}`, $options: "i" } },
      ],
    });
    return res.status(200).json({
      message: `The contact with the query is updated`,
      data,
    });
  } catch (err) {
    return res.status(404).json({ created: false, err: err.message });
  }
};
