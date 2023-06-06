const express = require('express');
const router = express.Router();
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');
var fs = require('fs');
const config = require('config');

const { VideoUpload } = require('../../utils/multer')



// @route :/getActivityUserData method: get
// @description : to get the user related activity data
router.get('/getActivityUserData', async function (req, res) {
    console.log("query", req.query)
   
    let attry = req.query.att
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.query.userId, course_id: req.query.courseId }})
        res.status(200).json({ status: true, data: user })
    } catch (e) {
        console.log('[-] Error in @route /mindMapData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }

})


// @route :/mindMapData method:post
// @description : to add the MindMap data of user
router.post('/mindMapData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ mind_map: req.body.MindmapData }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                mind_map: req.body.MindmapData
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /mindMapData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

// @route :/KeywordsData method:post
// @description : to add the Keywords data of user
router.post('/keywordsData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ keywords: req.body.KeywordsData }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                keywords: req.body.KeywordsData
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /keywordsData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})


// @route :/BigWigData method:post
// @description : to add the BigWig data of user
router.post('/bigWigData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ big_wigs: req.body.BigWigData }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                big_wigs: req.body.BigWigData
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /mindMapData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

// @route :/IdeaBoardData method:post
// @description : to add the IdeaBoard data of user
router.post('/ideaBoardData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ idea_board: req.body.IdeaBoardData.ideaboard }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                idea_board: req.body.IdeaBoardData.ideaboard
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /ideaBoardData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

// @route :/InMyOpinionData method:post
// @description : to add the InMyOpinion data of user
router.post('/inMyOpinionData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ in_my_opinion: req.body.InMyOpinionData }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                in_my_opinion: req.body.InMyOpinionData
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /inMyOpinionData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

// @route :/JourneysData method:post
// @description : to add the Journeys data of user
router.post('/journeysData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ journeys: req.body.JourneysData }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                journeys: req.body.JourneysData
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /journeysData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

// @route :/NewsViewsData method:post
// @description : to add the Newsviews data of user
router.post('/newsViewsData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ news_and_views: req.body.NewsViewsData }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                news_and_views: req.body.NewsViewsData
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /newsViewsData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

// @route :/NoteSquareData method:post
// @description : to add the NoteSquare data of user
router.post('/noteSquareData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ note_square: req.body.NoteSquareData }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                note_square: req.body.NoteSquareData
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /noteSquareData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

// @route :/RightPickData method:post
// @description : to add the RightPick data of user
router.post('/rightPickData', async function (req, res) {
    try {
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ right_pick: req.body.RightPickData }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                right_pick: req.body.RightPickData
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }
    } catch (e) {
        console.log('[-] Error in @route /rightPickData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

// @route :/speakUpData method:post
// @description : to add the speakUpData data of user
router.post('/speakUpData', VideoUpload.single('video'), async function (req, res) {
    try {
        const data = {
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            destination: req.file.destination,
            filename: req.file.filename,
            size: req.file.size
        }
        const user = await models.user_activity_analytics.findOne({ where: { user_id: req.body.user, course_id: req.body.courseId } })
        if (user) {
            const updatedResult = await models.user_activity_analytics.update({ speak_up: data }, { where: { user_id: req.body.user, course_id: req.body.courseId } })
            if (updatedResult) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        } else {
            const result = await models.user_activity_analytics.create({
                course_id: req.body.courseId,
                user_id: req.body.user,
                speak_up: data
            })
            if (result) {
                res.status(200).json({ status: true, message: 'Uploaded Successfully.' })
            }
        }




        // res.status(200).json({status:true,message:'uploaded successfully'})
    } catch (e) {
        console.log('[-] Error in @route /speakUpData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})


router.get('/streamvideo', async (req, res) => {
    try {
        // Getting the file 
        let videoData = await models.user_activity_analytics.findOne({ where: { user_id: req.query.user, course_id: req.query.courseId } ,raw:true})
        if (!videoData.speak_up) return res.status(200).json({ status: false, message: "No Video Found" })

        let videoName = videoData.speak_up.filename
        const videoPath = await path.join(path.dirname(process.mainModule.filename), 'assets', 'speakupVideos', videoName)

        //Reading the file
        const videoStat = fs.statSync(videoPath);
        const fileSize = videoStat.size;
        const videoRange = req.headers.range;

        if (videoRange) {
            const parts = videoRange.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0]);
            const end = parts[1] ? parseInt(parts[1], 10) : Math.min(fileSize - 1, start + 2000000);
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: false, message: 'Error, while streaming video' })
    }
})

// @route :/getUserTable method: get
// @description: to get the user Table
router.get('/getUserTable',async(req,res)=>{
    try{
      const result= await models.users.findAll({raw:true});
      res.status(200).json({status:true,data:result})
    }catch(e){
      console.log('[-] Error in @route /getUserTable method:get')
      console.log(e)
      res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
   
   
  })
module.exports = router;