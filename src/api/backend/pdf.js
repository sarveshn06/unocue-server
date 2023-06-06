const express = require('express');
const router = express.Router();
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');
const merge = require('easy-pdf-merge');
var fs = require('fs');
const { QueryTypes } = require('sequelize');
const config = require('config');
const { serverUrl } = config.get('api');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

let murge_file = []
var fonts = {
    Roboto: {
        normal: root_path + '/pdfmake/fonts/Roboto/Roboto-Regular.ttf',
        bold: root_path + '/pdfmake/fonts/Roboto/Roboto-Medium.ttf',
        italics: root_path + '/pdfmake/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: root_path + '/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
};
var PdfPrinter = require('../../../node_modules/pdfmake/src/printer');

router.get('/generatePDF',auth,async (req, res) => {
try{
    var query="SELECT eu.id AS enroll_id,cp.NAME,cp.banner_logo,t.task_name,u.NAME AS username,u.lastname,sm.*  "
    query=query+`FROM student_modules AS sm JOIN company_programs AS cp ON sm.program_id = cp.id JOIN tasks AS t ON sm.task_id = t.id JOIN users AS u ON u.id = sm.user_id JOIN enrolled_users AS eu ON eu.program_id = sm.program_id `
    query=query+`WHERE sm.program_id = ${req.query.program_id} AND eu.user_id =${req.query.user_id} AND sm.user_id = ${req.query.user_id} ORDER BY sm.module_id`


    const result = await models.sequelize.query(query, { types: QueryTypes.SELECT })
    murge_file=[]
    var array = []
    if(result[0]){
        result[0].forEach((e, index) => {
            if(e.normalQuestion.length > 0 || e.videoQuestion.length >0 || e.mcqQuestion >0){
                array.push({ text: e.NAME, fontSize: 18, bold: true, margin: [50, 20, 50, 0,] ,alignment: 'center'})
                array.push({ text: e.task_name, fontSize: 14, bold: true, margin: [50, 10, 50, 40,] ,alignment: 'center'})
                e.normalQuestion.forEach(nq => {
                    array.push({ text: nq.question, fontSize: 7, bold: true, margin: [50, 20, 50, 0,] })
                    array.push({ text: 'Answer:', fontSize: 7, bold: true ,margin: [50, 0, 50, 0,]})
                    array.push({ text: nq.answer, fontSize: 7 ,margin: [50, 0, 50, 0,]})
                })
    
                e.videoQuestion.forEach(nq => {
                    array.push({ text: nq.question, fontSize: 7, bold: true, margin: [50, 20, 50, 0,] })
                    array.push({ text: 'Answer:', fontSize: 7, bold: true,margin: [50, 0, 50, 0,] })
                    array.push({ text: nq.answer, fontSize: 7 ,margin: [50, 0, 50, 0,]})
                })
    
                e.mcqQuestion.forEach(nq => {
                    array.push({ text: nq.question, fontSize: 7, bold: true, margin: [50, 20, 50, 0,] })
                    array.push({ text: 'Answer:', fontSize: 7, bold: true ,margin: [50, 0, 50, 0,]})
                    array.push({ text: nq.answer, fontSize: 7 ,margin: [50, 0, 50, 0,] })
                })
                var documentDefinition = {
                    pageMargins: [ 40, 60, 40, 60 ],
                    header: {
                        stack:[
                            {text:'Application Id: '+e.enroll_id,fontSize:8,width:100,alignment: 'left'},
                            {text:e.username+" "+e.lastname,fontSize:8,width:100,alignment: 'left'}
                            
                        ],	style: 'header'
                    },
                    content: array,
                    styles:{
                        header:{
                            margin:[20,30,0,0]
                        }
                    }
                }
    
                var printer = new PdfPrinter(fonts);
                // console.log("printer---->" ,printer)
                var pdfDoc = printer.createPdfKitDocument(documentDefinition);
                // console.log("pdfDoc---->" + pdfDoc)
                var dir = root_path + '/assets/public/upload/user/' + req.query.user_id+'/'+req.query.program_id;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var final_dir=dir + '/task'+index+ '.pdf'
                pdfDoc.pipe(fs.createWriteStream(final_dir));
                pdfDoc.end();
                murge_file.push(final_dir)
                array=[];
                docDefinition = null;
            }
           
        })

        models.student_program_uploads.findAll({
            where: {
                user_id: req.query.user_id,
                program_id: req.query.program_id
            }
        }).then(data => {
            if (data) {
                // console.log('data',data)
                data.forEach(element => {
                    if (element.path != '') {
                        murge_file.push(element.path)
                    }
    
                })
    
                var dir = root_path + '/assets/public/upload/user/' + req.query.user_id+'/'+req.query.program_id;
                const directory= dir + '/final_student_submission.pdf';
                if(murge_file.length>=2){
                    merge(murge_file,directory, function (err) {
                        if (err) {
                            return console.log(err)
                        }
                        var minusPublic =directory.split('upload/')
                        var url = serverUrl + minusPublic[1]
                        res.status(200).json({
                            data:url
                        })
                    });
                }else{
                    if(murge_file.length<2 && murge_file.length!=0){
                       
                        var minusPublic = murge_file[0].split('upload/')//for live
                        // var minusPublic = murge_file[0].split('upload\\')//for local
                        var url = serverUrl + minusPublic[1]
                          res.status(200).json({
                            data:url
                        })
                    }
                }
                
            }
        })
    }
}catch(error){
    console.log('[-] Error in @route /generatePDF method:get\n',error)
    res.status(500).json({ staus: false, message: 'Somthing went wrong' })
}
})


router.get('/get-work-task-pdf', auth, async (req, res) => {
    try {
        const found = await models.student_workshop_tasks.findOne({ where: { user_id: req.query.user_id, workshop_id: req.query.workshop_id }, raw: true })
        var array = []

        if (found) {
            if (found.normalQuestion.length > 0 || found.videoQuestion.length > 0 || found.mcqQuestion > 0) {
                found.normalQuestion.forEach(nq => {
                    array.push({ text: nq.question, fontSize: 7, bold: true, margin: [50, 20, 50, 0,] })
                    array.push({ text: 'Answer:', fontSize: 7, bold: true, margin: [50, 0, 50, 0,] })
                    array.push({ text: nq.answer, fontSize: 7, margin: [50, 0, 50, 0,] })
                })

                found.videoQuestion.forEach(nq => {
                    array.push({ text: nq.question, fontSize: 7, bold: true, margin: [50, 20, 50, 0,] })
                    array.push({ text: 'Answer:', fontSize: 7, bold: true, margin: [50, 0, 50, 0,] })
                    array.push({ text: nq.answer, fontSize: 7, margin: [50, 0, 50, 0,] })
                })

                found.mcqQuestion.forEach(nq => {
                    array.push({ text: nq.question, fontSize: 7, bold: true, margin: [50, 20, 50, 0,] })
                    array.push({ text: 'Answer:', fontSize: 7, bold: true, margin: [50, 0, 50, 0,] })
                    array.push({ text: nq.answer, fontSize: 7, margin: [50, 0, 50, 0,] })
                })


                var documentDefinition = {
                    pageMargins: [40, 60, 40, 60],
                    // header: {
                    //     stack:[
                    //         {text:'Application Id: '+e.enroll_id,fontSize:8,width:100,alignment: 'left'},
                    //         {text:e.username+" "+e.lastname,fontSize:8,width:100,alignment: 'left'}

                    //     ],	style: 'header'
                    // },
                    content: array,
                    styles: {
                        header: {
                            margin: [20, 30, 0, 0]
                        }
                    }
                }

                var printer = new PdfPrinter(fonts);
                var pdfDoc = printer.createPdfKitDocument(documentDefinition);
                var dir = root_path + '/assets/public/upload/userPdf';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var final_dir = dir + '/generated_task.pdf'
                pdfDoc.pipe(fs.createWriteStream(final_dir));
                pdfDoc.end();
                murge_file.push(final_dir)
                array = [];
                docDefinition = null;
            }

            found.uploadQuestion.forEach(uq => {
                murge_file.push(uq.path+'.pdf')
            })
            var dir = root_path + '/assets/public/upload/userPdf';
            const directory = dir + '/final_student_submission.pdf';
            if (murge_file.length >= 2) {
                merge(murge_file, directory, function (err) {
                    if (err) {
                        return console.log(err)
                    }
                    murge_file = [];
                    var minusPublic = directory.split('upload/')
                    var url = serverUrl + minusPublic[1]
                    res.status(200).json({
                        data: url
                    })
                });
            } else {
                if (murge_file.length < 2 && murge_file.length != 0) {

                    var minusPublic = murge_file[0].split('upload/')//for live
                    // var minusPublic = murge_file[0].split('upload\\')//for local
                    var url = serverUrl + minusPublic[1]
                    murge_file = [];
                    res.status(200).json({
                        data: url
                    })
                }
            }
        }

    } catch (error) {
        console.log('[-] Error in @route /get-work-task-pdf method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})


module.exports = router;