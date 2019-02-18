const permit = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(401).send({message: 'Не аутентифицирован!'});
        }
        if(!roles.includes(req.user.role)){
            return res.status(403).send({message: 'Не авторизован'})
        }
        next();
    }
};

module.exports = permit;