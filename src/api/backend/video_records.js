const express = require('express');
const router = express.Router();
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');

//@author:Mamta - to get video record watched by particular user by their user_id and video url
router.post('/getVideoRecords',(req,res)=>{
    models.videoRecords.findOne({
        where:{
            user_id:req.body.user_id,
            video_name: req.body.video_name
        }
    }).then(data=>{
        console.log(data)
        if(data){
            res.json({status:200,data:data})
        }
    })
})

//@author:Mamta - to save and update videorecods
router.post('/saveVideoRecords',(req,res)=>{
    models.videoRecords.findOne({
        where:{
            user_id:req.body.user_id,
            video_name:req.body.video_name
        }
    }).then(found=>{
        if(found){
            found.update({
                duration:req.body.duration
            }).then(updated=>{
                if(updated){
                    res.json({status:200,message:'updated Succesfully.'})
                }
            })
        }else{
            models.videoRecords.create(req.body).then(data=>{
                console.log(data)
                if(data){
                    res.json({status:200,message:'updated successfully....'})
                }
            })
        }
    }).catch(error=>{
        console.log('[-] Error in @route /saveVideoRecords method:post\n',e)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    })
   
})

module.exports = router;