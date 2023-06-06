var models  = require('../models');
var Sequelize = require('sequelize');
var moment = require('moment');
var Moment = require('moment-timezone');
require('moment-range');
const config = require('config');
var fs = require('fs');
const { type } = config.get('api'); 

module.exports = {
    get_current_datetime: function(format) {
		if(format) {
			return Moment(new Date()).tz('Asia/Kolkata').format(format);
		}else {
			return Moment(new Date()).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
		}
	},

	delete_files_FormArray: function(actualFiles,dir){
		const allFiles=[];// all files present in directory
		const newFiles=[];// User uploaded file names
		var new_allFiles=[];// after comparing allFiles and newFiles, store unmatched value.
		actualFiles.forEach(e=>{
			const lastIndex = (type=='DEV' ?e.lastIndexOf('\\') : e.lastIndexOf('/'));		
			const after = e.slice(lastIndex + 1);
			newFiles.push(after)
		})

		//to get filename present in directory
		// const dir='./src/assets/public/upload/company/' + req.body.company_id + '/programs/'+ req.body.program_id+'/module/'+req.body.id;
		fs.readdir(dir, (err, files) => {
			files.forEach(file => {
			  allFiles.push(file)
			});
			
			// for getting a filename which is not present in newFiles array;
			if(allFiles.length !=0){
				for(var i=0;i<allFiles.length;i++){
					matches=false;
					for (var j=0;j<newFiles.length;j++){
						if(allFiles[i]==newFiles[j]) matches=true
					}
					if(!matches) new_allFiles.push( allFiles[i] );
				}
			}
			
				//for deleteing file present in new_allFiles.
				if(new_allFiles.length!=0){
					new_allFiles.forEach(fileName=>{
						fs.unlink(dir+'/'+fileName,(err)=>{
							console.log(err)
						})
					})
				}
		  });
	}
}
