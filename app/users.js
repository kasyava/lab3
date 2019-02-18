const express = require("express");
const bcrypt = require("bcrypt");
const multer = require('multer');

const User = require("../models/User");


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



    router.post("/", upload.none(), (req, res) =>{
        console.log(req.body);
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.generateToken();

        user.save()
            .then(user => res.send({name: user.username, token: user.token}))
            .catch(error => res.status(400).send(error));
    });

    router.post('/sessions', upload.none(), async (req, res) =>{

        const user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(400).send({error: 'Username not found'});
        }

        const isMatch = await user.checkPassword(req.body.password);// bcrypt.compare(req.body.password, user.password);

        if(!isMatch){
            return res.status(400).send({error: 'Password is wrong'});
        }

        user.generateToken();

        let role = user.role;

        await user.save();

        res.send({name: user.username, token: user.token, role: role})


    });

    router.delete("/sessions", async (req, res) =>{
        const token = req.get('Token');
        const success = {message: "Success"};

        if(!token) return res.send(success);

        const user = await User.findOne({token});
        if(!user) return res.send(success);

        user.token = '';
        user.save();
        return res.send(success);
    });


module.exports = router;