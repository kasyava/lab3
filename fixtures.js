const mongoose = require('mongoose');

const config = require('./config');

const User = require('./models/User');
const Photo = require('./models/Photo');


mongoose.set('useCreateIndex', true);
mongoose.connect(config.db.url + '/' + config.db.name, {useNewUrlParser: true });


const db = mongoose.connection;

db.once('open', async () => {
    try{
        await db.dropCollection('users');

    }
    catch (e) {
        console.log('Collection Users where not present, skipping drop...');
    }
    try{
        await db.dropCollection('photos');

    }
    catch (e) {
        console.log('Collection Photos where not present, skipping drop...');
    }



    console.log('All collections is dropped');

    const [user, admin] = await User.create({
        username: 'test',
        password: 'test',
        role: 'user'
    },{
        username: 'admin',
        password: 'admin',
        role: 'admin'
    });
    console.log('Users created');


    const photos = await Photo.create({
        title: 'Водопады ручья Руфабго',
        photo: 'waterfall.jpg',
        user: admin.id
    },{
        title: 'Горы Сочи',
        photo: 'mountains.jpg',
        user: user.id
    });
    console.log('Photos created');




    db.close();


});