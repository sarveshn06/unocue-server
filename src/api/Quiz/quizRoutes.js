const express = require('express');
const router = express.Router();
var path = require('path');
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');
var fs = require('fs');
const config = require('config');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

// @route :/addquiz method: post
// @description : adding quiz
router.post('/addquiz', auth, async function (req, res) {
    try {
        const found = await models.quiz.findOne({ where: { WorkShop_id: req.body.WorkShop_id } })
        if (found) {
            await models.quiz.update(req.body, { where: { WorkShop_id: req.body.WorkShop_id } })
        } else {
            const addQuiz = await models.quiz.create(req.body);
        }
        res.status(200).json({ status: true, message: 'added successfully' })
    } catch (e) {
        console.log(`[-] Error in @route /addquiz method:post \n ${e}`)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }

});

// @route :/quiz method: get
// @description : retrive the quiz 
router.get('/quiz', auth, async function (req, res) {
    try {
        const getQuiz = await models.quiz.findOne({ where: { WorkShop_id: req.query.id } })
        res.status(200).json({ status: true, message: 'getting quiz', data: getQuiz })
    } catch (e) {
        console.log(`[-] Error in @route /quiz method:get \n ${e}`)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    }
})

// @route: /user-quiz-score method:post
// @desciption : to add the user score
router.post('/add-user-quiz-score', auth, async (req, res) => {
    try {
        const addingUserQuiz = await models.quizAnalytics.create({ ...req.body, user_id: req.user.id })
        if(addingUserQuiz){
            await models.enrolled_workshops.update({quiz_completed:1},{where:{workshop_id:req.body.workShop_id,user_id:req.user.id}})
        }
        res.status(200).json({ status: true, message: 'added sucessfully' ,quiz_completed:true })
    } catch (e) {
        console.log(`[-] Error in @route /user-quiz-score method:post \n ${e}`)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    }
})



module.exports = router;