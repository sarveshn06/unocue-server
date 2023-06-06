"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var company_jobs = sequelize.define("company_jobs", {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    overview: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    role_responsibilites: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    qualification: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    salary: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    company_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    company_courses: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });

  company_jobs.getCollegeData = async function (filter) {
    var condition = "";
    var filter1 = filter ? filter.replace("[", "(") : "";
    var filter2 = filter1 ? filter1.replace("]", ")") : "";
    // if(filter!=''){
    //     condition = `Where cp.faculty in ${filter2} and cp.referral_code='${code}' `
    // }else{
    //     condition = `Where cp.referral_code='${code}'`
    // }
    var query =
      "SELECT c.name as company_name, c.logo, cp.id as company_program_id, cp.name as company_program_name, cp.description, cp.testimonials, cp.benefits, cp.steps, cp.video, cp.duration, cp.faculty ,cp.referral_code from company_jobs as cp JOIN companies as c on cp.company_id = c.id";
    query += " " + condition;
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  };

  company_jobs.getCompanyCourse = async function (company_id, role) {
    if (role == "admin") {
      var query =
        "SELECT cp.name as company_program_name from company_programs as cp Join course as c on c.id = cp.course_id";
    } else {
      var query =
        "SELECT cp.name as company_program_name from company_programs as cp Join course as c on c.id = cp.course_id where cp.company_id =" +
        company_id;
    }

    console.log("query===>" + query);
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  };

  return company_jobs;
};
