const express = require("express");
const multer = require("multer");
const path = require("path");
const nanoid = require("nanoid");

const config = require("../config");
const Photos = require("../models/Photo");
const Users = require("../models/User");

const auth = require("../middlewares/auth");
const permit = require("../middlewares/permit");

const storage = multer.diskStorage({
    destination(req, file, cd){
        cd(null, config.uploadPath)
    },
    filename(req, file, cd){
        cd(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});

const router = express.Router();

router.get("/", (req, res) => {
    Photos.find().populate('user')
        .then( results => res.send(results))
        .catch(e => res.send(e).status(500))
});

router.post("/", [auth, upload.single("image")], async  (req, res) => {

    const data = req.body;
    if (req.file) data.photo = req.file.filename;

    const user = await User.findOne({username: req.body.user});
    data.user = user.id;

    const photos = new Photos(data);
    photos.save()
        .then((result) => res.send(result))
        .catch(error => res.status(400).send(error));

});

router.delete("/:id", [auth, permit('admin')], (req, res) => {
    console.log(req.params.id);
    Photos.deleteOne({_id: req.params.id})
        .then(result => res.send(result))
        .catch((e) => res.send(e).status(500));
});

module.exports = router;