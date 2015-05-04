var express = require('express'),
    cors = require('cors'),
    app = express();
app.use(cors());
var bodyParser = require('body-parser')
var Post = require('./models/post')
var Type = require('./models/Types')
var User = require('./models/user')
var jwt = require('jwt-simple')
var _ = require('lodash')
var Limiter = require('express-rate-limiter');
var MemoryStore = require('express-rate-limiter/lib/memoryStore');
var limiterGet = new Limiter({
    db: new MemoryStore()
});
var limiterPost = new Limiter({
    db: new MemoryStore()
});
var limiterPostAll = new Limiter({
    db: new MemoryStore()
});
var limiterUser = new Limiter({
    db: new MemoryStore()
});
var limiterTypes = new Limiter({
    db: new MemoryStore()
});
var limiterAdd = new Limiter({
    db: new MemoryStore()
});
var limiterReplace = new Limiter({
    db: new MemoryStore()
});
var limiterComment = new Limiter({
    db: new MemoryStore()
});
var limiterRegister = new Limiter({
    db: new MemoryStore()
});
var LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')

var fs = require('fs')

var secretKey = 'supersecretkey'

var logger = require('morgan')
app.use(bodyParser.json({
    limit: '600kb'
}))
app.use(logger('dev'))
app.use(express.static(__dirname))
app.get('/api/posts', limiterGet.middleware({
    innerLimit: 10,
    outerLimit: 60,
    headers: false
}), function (req, res, next) {
    Post.find({}, function (err, posts) {
        if (err) {
            return next(err)
        }
        res.json(posts)
    })

})

app.post('/api/posts', limiterPost.middleware({
    innerLimit: 10,
    outerLimit: 60,
    headers: false
}), function (req, res, next) {
    var idNumber;

    Post.find({
        "name": req.body.name
    }, function (err, data) {

        if (err) {

            return next(err)

        } else if (!data.length) {

            console.log("nice")

            Post.find({}, function (err, posts) {
                console.log("nice!")

                if (err) {
                    return next(err)
                }
                idNumber = posts.length
                callback(idNumber, req, res)
            })
        } else {
            res.send("already exists")
        }
    })
})


app.post('/api/postAll', limiterPostAll.middleware({
    innerLimit: 10,
    outerLimit: 60,
    headers: false
}), function (req, res, next) {
    var idNumber;
    Post.find({}, function (err, posts) {
        if (err) {
            return next(err)
        } else {
            console.log(posts.length)
            for (var i = 0; i < req.count; i++) {
                idNumber = (Post.length + 2)
                console.log(idNumber)
                callback(idNumber, req[i], res)
            }
        }
    })
})

var callback = function (idNumber, req, res) {
    var imageURL = "http://120.24.168.7:3000/images/" + req.body.name + ".jpg";
    var post = new Post({
        id: idNumber,
        name: req.body.name,
        numbers: req.body.numbers,
        category: req.body.category,
        productName: req.body.productName,
        productIntroduction: req.body.productIntroduction,
        productDetail: req.body.productDetail,
        timeLimit: req.body.timeLimit,
        image: imageURL
    })

    data = req.body.image;
    var base64Data, binaryData;

    base64Data = data.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
    base64Data += base64Data.replace('+', ' ');
    binaryData = new Buffer(base64Data, 'base64').toString('binary');

    fs.writeFile("images/" + req.body.name + ".jpg", binaryData, "binary", function (err) {
        console.log(err); // writes out file without error, but it's not a valid image
    });


    post.save(function (err, post) {
        if (err) {
            return next(err)
        }
        res.status(201).json(post)
    })
}



/*
app.get('/api/user',function (req, res, next) {
    User.find(function (err, data) {
        if (err) {
            return next(err)
        }
        res.json(data)
    })
})
*/


app.post('/api/user', limiterUser.middleware({
    innerLimit: 10,
    outerLimit: 60,
    headers: false
}), function (req, res, next) {
    User.find({
        username: req.body.username
    }, function (err, data) {
        console.log(data)
        console.log(req.body.username)
        if (err) {
            res.send("[]")
        } else {
            console.log(data)
            if (typeof data[0] == "undefined") {
                res.send("[]")
                console.log(data[0])
            } else {
                res.json(data[0].possession)
            }
        }
    })
})


app.post('/api/types', limiterTypes.middleware({
    innerLimit: 10,
    outerLimit: 60,
    headers: false
}), function (req, res, next) {
    var type = new Type({
        id: req.body.id,
        name: req.body.name,
        category: req.body.category
    })
    type.save(function (err, type) {
        if (err) {
            return next(err)
        }
        res.status(201).json(type)
    })
})

app.post('/api/add', limiterAdd.middleware({
    innerLimit: 10,
    outerLimit: 60,
    headers: false
}), function (req, res, next) {
    console.log(req.body)
    Post.update({
        "name": req.body.name
    }, {
        $inc: {
            numbers: -1
        }
    }, function () {
        User.update({
            "username": req.body.username
        }, {
            $push: {
                "possession": req.body._id
            },
        }, function () {
            Post.find({
                name: req.body.name
            }, function (err, data) {
                console.log(data)
                if (err) {
                    return next(err)
                } else if (data.length > 0) {

                    if (data[0].numbers >= 0) {
                        var resp = data[0].numbers
                        console.log(resp)
                        res.json(resp)
                    } else {
                        res.send("couldn't find")
                    }
                }
            })
        })
    })
})


app.post('/api/comment', limiterComment.middleware({
    innerLimit: 1,
    outerTimeLimit: 3600000,
    outerLimit: 1,
    headers: false
}), function (req, res, next) {
    console.log(req.body);
    Post.update({
        "name": req.body.name
    }, {
        $push: {
            "comment": {
                title: req.body.comment,
                date: Date.now(),
                username: req.body.username,
                rate: req.body.rate
            }
        }
    }, function () {
        Post.find({
            "name": req.body.name
        }, function (err, data) {
            if (err) {
                return next(err)
            } else {
                if (typeof data[0] == "undefined") {
                    res.send([])
                } else {
                    res.json(data[0].comment)
                }
            }
        })
    })
})

app.post('/api/replace', limiterReplace.middleware({
    innerLimit: 10,
    outerLimit: 60,
    headers: false
}), function (req, res, next) {
    var imageURL = "http://120.24.168.7:3000/images/" + req.body.name + ".jpg";

    Post.update({
        "name": req.body.name
    }, {
        name: req.body.name,
        numbers: req.body.numbers,
        category: req.body.category,
        productName: req.body.productName,
        productIntroduction: req.body.productIntroduction,
        productDetail: req.body.productDetail,
        timeLimit: req.body.timeLimit,
        image: imageURL
    }, function () {
        Post.find({
            "name": req.body.name
        }, function (err, data) {
            if (err) {
                return next(err)
            } else if (data[0].numbers >= 0) {
                data = req.body.image;
                var base64Data, binaryData;

                base64Data = data.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                binaryData = new Buffer(base64Data, 'base64').toString('binary');

                if (fs.exists("images/" + req.body.name + ".jpg")) {
                    fs.unlink("images/" + req.body.name + ".jpg", function (err) {
                        if (err) throw err;
                        console.log('successfully deleted ');
                    });
                }
                fs.writeFile("images/" + req.body.name + ".jpg", binaryData, "binary", function (err) {
                    console.log(err); // writes out file without error, but it's not a valid image
                });
                res.send("OK")
            }
        })
    })
})

app.post('/api/register', limiterRegister.middleware({
    innerLimit: 10,
    outerLimit: 60,
    headers: false
}), function (req, res, next) {
    var name = req.body.username
    var password = req.body.password
    User.find({}, function (err, data) {
        if (err) {
            return next(err)
        }
        var userdata = findUsername(data, name)
        if (!userdata) {
            console.log("couldnt find user name")
            var token = jwt.encode({
                username: name
            }, secretKey)

            var user = new User({
                username: req.body.username,
                password: req.body.password,
                phonenumber: req.body.phonenumber
            })
            user.save(function (err, data) {
                if (err) {
                    return next(err)
                }
                console.log(data)
                res.status(201).json(token)
            })
        } else res.send("already registered")
    })

})


function findUsername(users, user) {
    return _.find(users, {
        "username": user
    })
}

function validUser(user, password) {
        return user.password === password
    }
    /*
    app.get('/api/user', limiter.middleware({innerLimit: 10, outerLimit: 60}),function (req, res, next) {
        var token = req.headers['x-auth']
        var user = jwt.decode(token, secretKey)
        res.json(user)
    })
    */

app.listen(3000, function () {
    console.log('server listening on', 3000)
})