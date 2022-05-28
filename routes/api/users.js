const express=require('express');
const router=express.Router();

// added 3.11
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//added 3.11
const User = require('../../models/User');
//added 3.12
const jwt = require('jsonwebtoken');
const config = require('config');

//validator 3.10
const{check, validationResult}= require('express-validator'); 

// @route  get api/ users
// @desc   test route
// @access public
//router.get('/', (req, res) => res.send('User route'));

//changed 3.10
// @route POST api/users
// @desc  Register user
// @access Public
router.post('/',
//object 3.10
[
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include av alid email').isEmail(),
    check(
    'password',
    'Please enter a password with 6 or more characters'
    ).isLength({min:6})
], 
async (req, res) =>{
 //console. log(req.body);

//added 3.10
const errors=validationResult(req);
if (!errors.isEmpty()){
  return res.status (400).json({ errors: errors.array() });
}

const { name, email, password } = req.body;



 try {
     //see if user exist 3.11
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already exists' }] });
    }

    //get users avatar
    const avatar = normalize(
      gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      }),
      { forceHttps: true }
    );

    user = new User({
      name,
      email,
      avatar,
      password
    });

    // encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

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