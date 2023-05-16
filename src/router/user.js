const express = require ("express")
const router = express.Router()

const User = require("../models/user")
const auth = require("../middleware/auth")

router.post ('/users' , (req, res) => {
    
    const user = new User (req.body)

    user.save()
    .then ((user) => {
        res.status(200).send(user)
    })
    .catch((e)=>{
         res.status(400).send(e)
        })
})
///////////////

router.get('/users' , auth ,(req , res) => {

    User.find({}).then((users)=>{

        res.status(200).send(users)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})
//////////////


router.get('/users/:id', auth , (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user)=>{

        if(!user){
           return res.status(404).send("Sorry, The User Does Not Exist")
        }
        res.status(200).send(user)

    }).catch((e)=>{
        res.status(400).send(e)
    })
})
//////////////// 

router.patch('/users/:id', auth , async (req , res) => {

    try{

        const updates = Object.keys (req.body)
        const _id = req.params.id
        const user = await User.findById (_id)

        if(!user){
            return res.status(404).send("Sorry, The User Does Not Exist")
        }

        updates.forEach((ele) => (user[ele] = req.body[ele]))
        await user.save()
        res.status(200).send(user)
    }

    catch(error){
        res.status(400).send(error)
    }
})



/////////


router.delete('/users/:id', auth , async (req , res) => {

    try{
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)

        if(!user){
           return res.status(404).send("Sorry, The User Does Not Exist")
        }

        res.status(200).send(user)
            }
         catch(e){
        res.status(400).send(e)
    }
    })
///////////    Login
   
router.post('/login', async (req , res) => {  

    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        console.log(user);
        const token = await user.generateToken()
        res.status(200).send({ user , token})
    }

    catch(e){
        res.status(400).send(e.message)
    }
})

///////

  router.post ('/users' , async (req , res) => {
    try {

        const user = new User (req.body)
        const token = await user.generateToken()
        await user.save()
         res.status(200).send({user , token})

    } catch (e) {
        res.status(400).send(e)
    }
})


//////    LogOut


router.delete('/logout', auth ,async (req , res) => {

    try{
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((t)=>{
            return t !== req.token
        })

        await req.user.save()
        res.status(200).send("Signed Out  Successfully")
    }

    catch(e){
        res.status(400).send(e)
    }
})
///////


router.delete('/logoutAll', auth , async (req , res) => {

    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send("Signed Out  Successfully")
    }

    catch(e){
        res.status(400).send(e)
    }
})
///////

router.get('/profile', auth ,async (req , res) => {
    
    res.status(200).send(req.user) 
})


module.exports = router 