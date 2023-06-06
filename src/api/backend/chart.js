const express = require('express');
const router = express.Router();
var path = require('path');
var root_path = path.dirname(require.main.filename);
const { QueryTypes } = require('sequelize');
console.log(root_path);
//var models = require(root_path + '/models');
const models = require( '../../models/index');

router.get('/getWorkshopAdmin',async function(req,res){
    const role=req.query.role;
    const companyID=req.query.companyID;
    if(role=='admin'){
        const result = await models.sequelize.query("SELECT concat(c.name,'[',c.city,',',c.state,']') as name,COUNT(w.company_id) AS value FROM companies AS c LEFT JOIN workshops AS w ON w.company_id = c.id GROUP BY c.id", { types: QueryTypes.SELECT })
        //  console.log(about Course);
        res.json({
            data: result[0]
        })
    }else if(role == 'company'){
        const result=await models.sequelize.query(`select language as name ,count(id) as value from workshops where company_id=${companyID} group by language`,{types:QueryTypes.SELECT})
        res.json({
            data: result[0]
        })
    }else if(role == 'user'){
        const result=await models.sequelize.query(`select concat(c.name,'[',c.city,',',c.state,']') as name,count(w.company_id) as value from companies c inner join workshops w on c.id=w.company_id group by w.company_id`,{types:QueryTypes.SELECT})
        res.json({
            data: result[0]
        })
    }
   
})

router.get('/getWorkExperimentAdmin',async function(req,res){
    const role=req.query.role;
    const companyID=req.query.companyID;
    const referralCode=req.query.referralCode;
    if(role=='admin'){
        const result = await models.sequelize.query("SELECT concat( c.NAME, '[', c.city, ',', c.state, ']' ) AS name, count(e.program_id) as value FROM companies c left join company_programs cp ON cp.company_id = c.id left join enrolled_users e ON e.program_id = cp.id group by c.id", { types: QueryTypes.SELECT })
        //  console.log(about Course);
        res.json({
            data: result[0]
        })
    }else if(role == 'company'){
        const result = await models.sequelize.query(`SELECT cp.faculty as name ,count(e.program_id) as value FROM companies c left join company_programs cp ON cp.company_id = c.id left join enrolled_users e ON e.program_id = cp.id where c.id=${companyID} group by cp.faculty`, { types: QueryTypes.SELECT })
        res.json({
            data: result[0]
        })
    }else if(role == 'user'){
        const result = await models.sequelize.query(`select cp.faculty as name,count(e.program_id) as value from company_programs cp left join enrolled_users e on cp.id = e.program_id where cp.referral_code='${referralCode}' group by cp.faculty`, { types: QueryTypes.SELECT })
        //  console.log(about Course);
        res.json({
            data: result[0]
        })
    }
   
})

router.get('/getAllStudentDetailAdmin',async(req,res)=>{

    //to get enrolled users number

//to get total number of users 

    const totalEnrolledUsersNumber = await models.sequelize.query(`select count(*) as value from users where id in (select DISTINCT(user_id) from enrolled_users)`, { types: QueryTypes.SELECT })
    console.log('1',totalEnrolledUsersNumber[0][0].value)
    const totalRegisteredUserNumber = await models.sequelize.query(`select count(*) as value from users where role='user'`, { types: QueryTypes.SELECT })
    const neverEnrolled=parseInt(totalRegisteredUserNumber[0][0].value)-parseInt(totalEnrolledUsersNumber[0][0].value)
    const data=[
       { name:'enrolled',value:totalEnrolledUsersNumber[0][0].value},
       {name:'never enrolled',value:neverEnrolled}
    ]
    res.json({
        total:totalRegisteredUserNumber[0][0].value,
        data:data
    })
})


module.exports=router;