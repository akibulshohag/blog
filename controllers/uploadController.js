const User = require('../models/User')
const Profile = require('../models/Profile')
const fs = require('fs')

exports.uploadProfilePics = async (req,res,next)=>{

    if(req.file){
        try{
            let oldProfilePic = req.user.profilePic
            let profile = await Profile.findOne({user: req.user._id})
            let profilePic = `/uploads/${req.file.filename}`
            if(profile){
                await Profile.findOneAndUpdate(
                    {user: req.user._id },
                    {$set: {profilePic}}
                )
            }
                await User.findOneAndUpdate(
                    {_id:req.user._id},
                    {$set:{profilePic}}
                )

                if(oldProfilePic !== '/uploads/default.jpg'){
                    fs.unlink(`public${oldProfilePic}`,err=>{
                        if(err){
                            console.log(err);
                        }
                    })
                }
                res.status(200).json({
                    profilePic
                })
        }catch(err){
            res.status(500).json({
                profilePic: req.user.profilePic
            })
            
            
        }
    }else{
            res.status(500).json({
                profilePic: req.user.profilePic
            })
    }
}

exports.removeProfilePics = async (req,res,next) =>{
    try{
        let defaultProfile = '/uploads/default.jpg'
        let currentProfile = req.user.profilePic

        fs.unlink(`public${currentProfile}`, async(err)=>{
            let profile = await Profile.findOne({user: req.user._id})
            if(profile){
                await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set :{profilePic: defaultProfile}}
                )
            }
            await User.findOneAndUpdate(
                {_id: req.user._id},
                {$set :{profilePic: defaultProfile}}
            )
        })
        res.status(200).json({
            profilePic: defaultProfile
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Can not remove'
        })
    }
}

exports.postImageUploadController = (req,res,next)=>{
    if (req.file){
        return res.status(200).json({
            imgUrl: `/uploads/${req.file.filename}`
        })
    }

    res.status(500).json({
        message: 'Server Error'
    })
}