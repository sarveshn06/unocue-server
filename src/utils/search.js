var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');
const { QueryTypes } = require('sequelize');

module.exports = {
    global_workshop_search_data:async function(data){
        workshop_query=`SELECT w.id,w.NAME as name,
            CASE WHEN c.NAME REGEXP '${data}' THEN c.NAME
            WHEN  w.NAME REGEXP '${data}' THEN  w.NAME
            WHEN w.degree REGEXP '${data}' THEN w.degree
            WHEN w.stream REGEXP '${data}' THEN w.stream
            WHEN w.LANGUAGE REGEXP '${data}' THEN w.LANGUAGE
            ELSE 'data not found'
            END AS matched	
            FROM
                workshops AS w
                INNER JOIN companies AS c ON w.company_id = c.id 
            WHERE
                concat( c.NAME, w.NAME, w.degree, w.stream, w.LANGUAGE ) REGEXP '${data}'`

        return await models.sequelize.query(workshop_query, { types: QueryTypes.SELECT });
    },

    global_program_search:async function(data){
        program_query = `SELECT cp.NAME as name,cp.id,
        CASE WHEN c.NAME REGEXP '${data}' THEN c.NAME
        WHEN cp.NAME REGEXP '${data}' THEN cp.NAME
        WHEN cp.LEVEL REGEXP '${data}' THEN cp.LEVEL
        WHEN cp.duration REGEXP '${data}' THEN cp.duration
        ELSE 'data not found'
        END AS matched	
        FROM
            company_programs AS cp
            INNER JOIN companies AS c ON cp.company_id = c.id 
        WHERE
            cp.STATUS = 'active' 
            And concat(c.name,cp.name,cp.level,cp.duration) REGEXP '${data}'`

        return await models.sequelize.query(program_query, { types: QueryTypes.SELECT });
    },

    global_program_search_login:async function(data,user){
        program_query = `SELECT cp.NAME as name,cp.id,
        CASE WHEN c.NAME REGEXP '${data}' THEN c.NAME
        WHEN cp.NAME REGEXP '${data}' THEN cp.NAME
        WHEN cp.LEVEL REGEXP '${data}' THEN cp.LEVEL
        WHEN cp.duration REGEXP '${data}' THEN cp.duration
        ELSE 'data not found'
        END AS matched	
        FROM
            company_programs AS cp
            INNER JOIN companies AS c ON cp.company_id = c.id 
        WHERE
            cp.STATUS = 'active' 
            And concat(c.name,cp.name,cp.level,cp.duration) REGEXP '${data}'
            AND cp.referral_code = '${user.referral_code}'`

        return await models.sequelize.query(program_query, { types: QueryTypes.SELECT });
    }
}