var express = require('express');
const userModel = require("./users");
const multer =require('multer');
const fs =require('fs');


var router = express.Router();


var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "./uploads");
  
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname +"_"+ Date.now() +"_"+ file.originalname);
  }
});


var upload = multer({
  storage: storage,
}).single("image");



router.post('/add', upload, async (req, res) => {
  const user = new userModel({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename
  });

  try {
    await user.save();
    req.session.message = {
      type: 'success',
      message: 'User Added Successfully!!'
    };
    res.redirect('/');
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});


router.get('/', async (req, res) => {
  try {
    const users = await userModel.find();
    res.render('index', { title: "CRUD Application", users: users, });
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});

router.get('/add', function(req,res){
  res.render('add_users', {title: "Add Users"});
});



router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      res.redirect("/");
    } else {
      res.render('edit_user', { title: "Edit users", user: user });
    }
  } catch (err) {
    res.redirect("/");
  }
});



router.post('/update/:id', upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";
  if(req.file){
    new_image = req.file.filename;
    try{
      fs.unlinkSync('./uploads/' + req.body.old_image);
    } catch(err){
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  userModel.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image
  })
  .then(result => {
    if(result){
      req.session.message = { type: 'success', message: 'User updated successfully' };
      res.redirect("/");
    } else {
      res.json({ message: 'User not found', type: 'danger'});
    }
  })
  .catch(err => {
    res.json({ message: err.message, type: 'danger'});
  });
});

router.get('/add', function(req,res){
  res.render('add_users', {title: "Add Users"});
});


router.get('/delete/:id', async (req, res) => {
  let id = req.params.id;
  try {
    const result = await userModel.findByIdAndDelete(id);
    if (result.image != '') {
      try {
        fs.unlinkSync('./uploads/' + result.image);
      } catch (err) {
        console.error(err);
      }
    }
    req.session.message = { type: 'info', message: 'User deleted successfully!' };
    res.redirect('/');
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
