"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var company_programs = sequelize.define("company_programs", {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    testimonials: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    steps: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    video: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "active",
    },
    faculty: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    course_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    referral_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM,
      values: ["easy", "intermediate", "hard"],
    },
    certificate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    backgroundImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    banner_logo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    speaker: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    formColor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    videoDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SubTextbanner: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  });

  company_programs.getCollegeData = async function (
    filter,
    programId,
    page,
    user_id
  ) {
    var condition = "";
    const pageLimit = 6;
    if (filter != "") {
      var filter1 = JSON.parse(filter);
    }
    if (filter != " " && filter.length != 0) {
      condition = ` AND (`;
      filter1.forEach((ele, index) => {
        condition =
          condition + `CONCAT(c.name ,cp.level,cp.name) REGEXP '${ele}'`;
        if (index != filter1.length - 1) {
          condition = condition + " OR ";
        } else {
          condition = condition + ")";
        }
      });
    } else if (
      programId != "" &&
      programId != null &&
      programId != undefined &&
      programId != "null" &&
      programId != "undefined"
    ) {
      condition = condition + `and cp.id!='${programId}'   `;
    }
    if (
      page != "" &&
      page != null &&
      page != undefined &&
      page != "null" &&
      page != "undefined"
    ) {
      let offset = (parseInt(page) - 1) * pageLimit;
      condition = condition + `limit ${pageLimit} offset ${offset}`;
    }
    var query =
      "SELECT cu.course_picture,c.name as company_name, c.logo,cp.backgroundImage, cp.id as company_program_id, cp.name as company_program_name, cp.description, cp.testimonials, cp.benefits, cp.steps, cp.video, cp.duration, cp.faculty ,cp.referral_code, cp.status ,cp.level ,bp.bookmark from company_programs as cp JOIN companies as c on cp.company_id = c.id join course cu on cu.name= cp.name left join bookmark_program_data bp on cp.id = bp.program_id AND  bp.user_id =" +
      user_id;
    query += " where cp.status = 'active' ";
    query += " " + condition;

    var countQuery =
      "select count(*) as count from company_programs as cp JOIN companies as c on cp.company_id = c.id join course cu on cu.name= cp.name left join bookmark_program_data bp on cp.id = bp.program_id AND  bp.user_id =" +
      user_id;
    countQuery += " where cp.status = 'active' ";
    countQuery += " " + condition;

    const countOfData = await sequelize.query(countQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    const actualData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    return { actualData: actualData, countOfData: countOfData };
  };

  company_programs.getAllProgramData = async function (approval_status) {
    console.log("1");
    var condition = "";
    if (approval_status != "") {
      condition = `Where cp.status='${approval_status}' `;
    } else {
      condition = "";
    }
    var query =
      "SELECT c.name as company_name, c.logo, c.id as company_id, cp.id as company_program_id, cp.name as company_program_name, cp.description, cp.testimonials, cp.benefits, cp.steps, cp.video, cp.duration, cp.faculty ,cp.referral_code, cp.status from company_programs as cp JOIN companies as c on cp.company_id = c.id";
    query += " " + condition;
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  };

  // company_programs.getAllProgramForAdmin = async function(){

  //     var query="SELECT cu.course_picture,c.name as company_name, c.logo, cp.id as company_program_id, cp.name as company_program_name, cp.description, cp.testimonials, cp.benefits, cp.steps, cp.video, cp.duration, cp.faculty ,cp.referral_code, cp.status ,cp.level ,bp.bookmark from company_programs as cp JOIN companies as c on cp.company_id = c.id join course cu on cu.name= cp.name left join bookmark_program_data bp on cp.id = bp.program_id where cp.status = 'active' ";
  //     return sequelize.query(query, { type: sequelize.QueryTypes.SELECT});
  // }

  return company_programs;
};
