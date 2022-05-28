//created in 2.8
const express=require('express');
const router=express.Router();
//added 3.13
const auth = require('../../middleware/auth');
// added 3.14
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const{check, validationResult}= require('express-validator'); 


// @route  get api/ auth
// @desc   test route
// @access public
router.get('/', auth, async (req, res) => {
    //added get user from token 3.13
    try{
    const user =await User.findById(req.user.id).select ('-password');
    res.json(user);
    }
    catch (err){
    console.error(err.message);
    res.status (500).send('Server Error');
    }
    });


    //changed 3.14
// @route POST api/auth
// @desc  Authenticate user & webtoken
// @access Public
router.post('/',
//object 3.10
[
 
    check('email', 'Please include av alid email').isEmail(),
    check('password','Password is Required').exists()
], 
async (req, res) =>{
 //console. log(req.body);

//added 3.10
const errors=validationResult(req);
if (!errors.isEmpty()){
  return res.status (400).json({ errors: errors.array() });
}

const {email, password } = req.body;



 try {
     //see if user exist 3.11
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // added 3.14 Matching passwords
    const isMatch=await bcrypt.compare(password, user.password);

    if(!isMatch){
    return res
    .status (400)
    .json ({ errors: [{ msg: 'Invalid Credentials 2' }] });
    }
    

    //webtoken added 3.12
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

    
    // res.send ('User registered');
  
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
  
});
              
module.exports = router;