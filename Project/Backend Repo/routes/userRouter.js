// User routes
const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register
router.route("/").put( async(req,res) => { // chage post to put
    try{
       const {
            userId,
            name,
            email,
            phone,
            designation,
            password
        
        } = req.body;

    // Validation
    //    if(!userId ||
    //         !name ||
    //         !email ||
    //         !phone ||
    //         !designation ||
    //         !password
    //     ){
    //        return res
    //         .status(400)
    //         .json({errorMessage: "Please enter required fields."});
    //    }
       if(password.length < 6){
            return res
            .status(400)
            .json({errorMessage: "Please enter required fields."});
       }
       // finding by user ID
       const existingUser = await User.findOne({userId});
       if(existingUser)
            return res.status(400).json(
                {errorMessage: "An account with this email already exists."}
            );

        // hash password
        // const salt = await bcrypt.getSalt();
        // const passwordhash = await bcrypt.hash(password, salt);

        const newUser = new User({
            userId,
            name,
            email,
            phone,
            designation,
            password
        });

        const saveUser = newUser.save();
        console.log(saveUser);
        // sign the token
        const token = jwt.sign({
            user: saveUser._id
        }, process.env.JWT_SECRET);

        // send the token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        })
         .send();

       console.log(password);
            
        
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
});

// login
router.route("/login").post( async (req,res) => {
    try{
        const {email, password} = req.body;

        // Validation
       if(!email || !password){
        return res
         .status(400)
         .json({errorMessage: "Please enter required fields."});
        }

        const existingUser = await User.findOne({email});
        const existingUserName = await User.findOne({name:email});
        if(!existingUser)
            return res.status(400).json(
                {errorMessage: "Wrong user name or password."}
            );
        
        if(password != existingUser.password){
            return res.status(400).json(
                {errorMessage: "Wrong user name or password."}
            );
        }

        // sign the token
        const token = jwt.sign({
            user: existingUser._id
        }, process.env.JWT_SECRET);

        // send the token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        })
         .send();

    }
    catch(err){
        console.error(`error : ${err}`);
    }
} )

// logout
router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    }).send();
})

// find User by userID
router.route("/get/:id").get(async (req, res) => {
    let userId = req.params.id;
    const user = await User.findOne({
        userId: userId,
    }).then((foundUser) => {
        res.status(200).send({status: "User fetched ", foundUser})
    }).catch((err) => {
        console.log(err.massage);
        res.status(500).send({status: " error with get User ", error: err});
    })

})


module.exports = router;

