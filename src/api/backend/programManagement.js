const express = require("express");
const router = express.Router();
var path = require("path");
var root_path = path.dirname(require.main.filename);
var models = require(root_path + "/models");
const multer = require("multer");
var fs = require("fs");
const config = require("config");
var rimraf = require("rimraf");
const { serverUrl } = config.get("api");
const { type } = config.get("api");
const { QueryTypes } = require("sequelize");
const { delete_files_FormArray } = require("../../utils/function");
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
// Multer File upload settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var dir;
    var upload_option = req.body.upload_option;
    if (
      upload_option == "vdo" ||
      upload_option == "back_image" ||
      upload_option == "program_logo"
    ) {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/gallery/" +
        req.body.id;
    } else if (upload_option == "testimonialPhoto") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/gallery/" +
        req.body.id +
        "/TestPhoto";
    } else if (upload_option == "icon") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/gallery/" +
        req.body.id +
        "/icons";
    } else if (upload_option == "speakerPhoto") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/gallery/" +
        req.body.id +
        "/SpeakerPhoto";
    } else if (
      upload_option == "workshop_image" ||
      upload_option == "workshop_certificate"
    ) {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/workshop/" +
        req.body.id;
    } else if (
      upload_option == "instr_vdo" ||
      upload_option == "res_vdo" ||
      upload_option == "task_logo"
    ) {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/task/" +
        req.body.id;
    } else if (upload_option == "model_soln") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/task/" +
        req.body.id +
        "/Model_Solution";
    } else if (upload_option == "certificate") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/programs/" +
        req.body.id;
    } else if (upload_option == "module") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/programs/" +
        req.body.program_id +
        "/module/" +
        req.body.id;
    } else if (upload_option == "videoQues") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/programs/" +
        req.body.program_id +
        "/module/" +
        req.body.id +
        "/video";
    } else if (upload_option == "workshopTestPhoto") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/workshop/" +
        req.body.id +
        "/testimonial";
    } else if (upload_option == "workshopIcon") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/workshop/" +
        req.body.id +
        "/icons";
    } else if (upload_option == "workshopSpeakerPhoto") {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/workshop/" +
        req.body.id +
        "/speaker_photo";
    } else if (
      upload_option == "workTask" ||
      upload_option == "task_solution"
    ) {
      dir =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/workshop/" +
        req.body.workshop_id +
        "/task";
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    //   console.log("destination",dir)
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // console.log("id",req.body.id)
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    //console.log(fileName)
    cb(null, fileName);
  },
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  // fileFilter: (req, file, cb) => {
  //     console.log('1211321321321321',file)
  // if (
  //     file.mimetype == 'video/*' ||
  //     // file.mimetype == 'video/mpeg' ||
  //     file.mimetype == 'image/jpeg' ||
  //     file.mimetype == 'image/jpg' ||
  //     file.mimetype == 'image/png' ||
  //     file.mimetype == 'application/pdf'
  // ) {
  //     cb(null, true)
  // } else {
  //     cb(null, false)
  //     return cb(new Error('Only video or image format allowed!'))
  // }
  // },
});

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    var dir =
      "./src/assets/public/upload/company/" +
      req.body.company_id +
      "/workshop/" +
      req.body.id;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});
var upload1 = multer({ storage: storage1 });

//Get company wise all programs
//Get company wise all programs
router.get("/getProgramData", auth, (req, res) => {
  console.log(
    "getProgramData getProgramData getProgramData==>" + req.query.filter,
    req.query.role
  );
  var condition = {};
  var progarmsData = [];
  if (req.query.role == "company") {
    models.company_programs
      .findAll({
        where: {
          company_id: req.query.college_id,
        },
      })
      .then(function (allprogarms) {
        res.json({
          status: 200,
          data: allprogarms,
        });
      });
  } else if (req.query.role == "user") {
    models.company_programs
      .getCollegeData(
        req.query.filter,
        req.query.programId,
        req.query.page,
        req.query.user_id
      )
      .then(function (allprogarms) {
        res.json({
          status: 200,
          data: allprogarms,
        });
      });
  } else {
    models.company_programs.findAll().then(function (allprogarms) {
      res.json({
        status: 200,
        data: allprogarms,
      });
    });
  }
});

//Get proram wise all task
router.get("/getTaskData", auth, async (req, res) => {
  var condition = {};
  //console.log("req.query.role--->"+req.query.role);
  //console.log("req.query.program_id--->"+req.query.program_id);
  if (req.query.role == "company" || req.query.role == "admin") {
    models.tasks
      .findAll({
        where: { program_id: req.query.program_id },
      })
      .then(function (alltasks) {
        res.json({
          status: 200,
          data: alltasks,
        });
      });
  } else if (req.query.role == "user") {
    if (req.query.program_id) {
      const result = await models.tasks.getTaskValue(
        req.query.program_id,
        req.query.user_id
      );
      res.json({
        status: 200,
        data: result,
      });
    } else {
      res.json({
        status: 200,
        data: [],
      });
    }
  } else {
    models.tasks
      .findAll({
        where: { status: "active" },
      })
      .then(function (alltasks) {
        res.json({
          status: 200,
          data: alltasks,
        });
      });
  }
});

//@author:mamta - Get proram wise all program_module data
router.get("/getModuleData", auth, async (req, res) => {
  try {
    if (req.query.role == "company" || req.query.role == "admin") {
      const result = await models.program_module.findAll({
        where: { program_id: req.query.program_id, task_id: req.query.task_id },
        attributes: ["id", "about"],
      });
      res.status(200).json({ status: true, data: result });
    } else if (req.query.role == "user") {
      let moduleData = [];
      models.tasks
        .findAll({
          attributes: ["id", "instruction_video"],
          include: models.program_module,
          where: { program_id: req.query.program_id, id: req.query.task_id },
        })
        .then((result) => {
          if (result) {
            moduleData = [...result];
            var count = 1;
            var program_module_answer = [];
            moduleData[0].program_modules.forEach((e, index) => {
              models.student_modules
                .findOne({
                  where: { module_id: e.id, user_id: req.query.user_id },
                })
                .then((found) => {
                  if (found) {
                    program_module_answer[index] = {
                      module_id: e.id,
                      answer: found.normalQuestion,
                      videoAnswer: found.videoQuestion,
                      mcqAnswer: found.mcqQuestion,
                      isCompleted: true,
                    };
                  } else {
                    program_module_answer[index] = {
                      module_id: e.id,
                      isCompleted: false,
                    };
                  }
                  if (moduleData[0].program_modules.length == count) {
                    res
                      .status(200)
                      .json({
                        status: true,
                        data: {
                          question: moduleData[0],
                          value: program_module_answer,
                        },
                      });
                  } else {
                    count++;
                  }
                });
            });
          }
        });
    } else {
      const result = await models.program_module.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ status: true, data: result });
    }
  } catch (error) {
    console.log("[-] Error in @route /getModuleData method:get\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

//delete single task
router.post("/deleteTaskData", auth, (req, res) => {
  //console.log("req.body.task_id====>"+req.body)
  models.tasks
    .destroy({
      where: {
        id: req.body.task_id,
      },
    })
    .then(async function (task_deleted) {
      const module_ids = await models.program_module.findAll({
        where: { task_id: req.body.task_id },
        attributes: ["id"],
      });
      models.program_module.destroy({ where: { task_id: req.body.task_id } });
      const dir1 =
        "./src/assets/public/upload/company/" +
        req.body.company_id +
        "/task/" +
        req.body.task_id;
      rimraf(dir1, { recursive: true }, (err) => {
        //console.log(err)
      });
      module_ids.forEach((m_id) => {
        const dir1 =
          "./src/assets/public/upload/company/" +
          req.body.company_id +
          "/programs/" +
          req.body.program_id +
          "/module/" +
          m_id.id;
        rimraf(dir1, { recursive: true }, (err) => {
          //console.log(err)
        });
      });
      if (task_deleted) {
        res.json({
          status: 200,
        });
      } else {
        res.json({
          status: 400,
          message: "Task is not deleted.",
        });
      }
    });
});

//@author:mamta - delete single module with uploads
router.post("/deleteModuleData", auth, (req, res) => {
  // console.log("req.body====>",req.body)
  models.program_module.findOne({ where: req.body.module_id }).then((data) => {
    if (data) {
      models.program_module
        .destroy({
          where: {
            id: req.body.module_id,
          },
        })
        .then(function (module_deleted) {
          const str = data.solution;
          const file = str.split("/");
          const file_location = file[3].slice(0, file[3].lastIndexOf("\\"));
          const dir = "./src/assets/public/upload/" + file_location;
          rimraf(
            dir,
            {
              recursive: true,
            },
            (err) => {
              console.log(err);
            }
          );

          if (module_deleted) {
            res.json({
              status: 200,
            });
          } else {
            res.json({
              status: 400,
              message: "Module is not deleted.",
            });
          }
        });
    }
  });
});

//Save & Update company wise single program
router.post("/saveProgramData", auth, (req, res) => {
  //console.log("req.body.programData====>"+req.body.programData)
  var programData = req.body.programData;
  if (
    programData.programId == null ||
    programData.programId == "" ||
    programData.programId == undefined
  ) {
    models.company_programs
      .create({
        name: programData.name,
        description: programData.description,
        testimonials: programData.testimonials,
        benefits: programData.benefits,
        steps: programData.steps,
        company_id: programData.company_id,
        status: "active",
        duration: programData.duration,
        faculty: programData.faculty,
        course_id: programData.course_id,
        referral_code: programData.referral_code,
        level: programData.level,
        speaker: programData.speaker,
        formColor: programData.formColor,
        videoDescription: programData.videoDescription,
        SubTextbanner: programData.SubTextbanner,
      })
      .then(function (companyprogram) {
        if (companyprogram) {
          res.json({
            status: 200,
            data: companyprogram.id,
          });
        } else {
          res.json({
            status: 400,
            message: "Comapny program is not created.",
          });
        }
      });
  } else {
    models.company_programs
      .findOne({
        where: {
          id: programData.programId,
        },
      })
      .then(function (companyprogram) {
        if (companyprogram) {
          // if (req.body.programData.uploadTrue === true) {
          //     if (companyprogram.video != null && companyprogram.video != "") {
          //         const str = companyprogram.video
          //         const file_location = str.split('/').slice(1)
          //         const dir = './src/assets/public/upload/' + file_location[2];
          //         fs.unlink(dir, (err) => {
          //             //console.log(err)
          //         })
          //     }
          // }
          // if (req.body.programData.uploadCertificate === true) {
          //     if (companyprogram.certificate != null && companyprogram.certificate != "") {
          //         const str = companyprogram.certificate
          //         const file_location = str.split('/').slice(1)
          //         const dir = './src/assets/public/upload/' + file_location[2];
          //         fs.unlink(dir, (err) => {
          //             //console.log(err)
          //         })
          //     }
          // }
          companyprogram
            .update({
              name: programData.name,
              description: programData.description,
              testimonials: programData.testimonials,
              benefits: programData.benefits,
              steps: programData.steps,
              background_info: programData.background_info,
              task_description: programData.task_description,
              duration: programData.duration,
              referral_code: programData.referral_code,
              faculty: programData.faculty,
              course_id: programData.course_id,
              level: programData.level,
              speaker: programData.speaker,
              formColor: programData.formColor,
              videoDescription: programData.videoDescription,
              SubTextbanner: programData.SubTextbanner,
            })
            .then(function (programupdated) {
              if (programupdated) {
                res.json({
                  data: programupdated.id,
                  status: 200,
                  message: "Program updated successfully.",
                });
              } else {
                res.json({
                  status: 400,
                  message: "Program not updated.",
                });
              }
            });
        } else {
          res.json({
            status: 400,
            message: "Program not found.",
          });
        }
      });
  }
});

//Save & Update program wise single task
router.post("/saveTaskData", auth, (req, res) => {
  var taskData = req.body.taskData;
  if (
    taskData.taskId == null ||
    taskData.taskId == "" ||
    taskData.taskId == undefined
  ) {
    models.tasks
      .create({
        task_name: taskData.task_name,
        sub_task_name: taskData.sub_task_name,
        key_area: taskData.key_area,
        background_info: taskData.background_info,
        task_description: taskData.task_description,
        program_id: taskData.programId,
        videoDescription: taskData.video_description,
      })
      .then(function (programtask) {
        if (programtask) {
          var dir =
            "./src/assets/public/upload/company/" +
            taskData.company_id +
            "/task";
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          res.json({
            status: 200,
            data: programtask.id,
          });
        } else {
          res.json({
            status: 400,
            message: "Program task is not created.",
          });
        }
      });
  } else {
    models.tasks
      .findOne({
        where: {
          id: taskData.taskId,
        },
      })
      .then(function (programtask) {
        if (programtask) {
          programtask
            .update({
              task_name: taskData.task_name,
              background_info: taskData.background_info,
              task_description: taskData.task_description,
              sub_task_name: taskData.sub_task_name,
              key_area: taskData.key_area,
              videoDescription: taskData.video_description,
            })
            .then(function (taskupdated) {
              if (taskupdated) {
                res.json({
                  data: taskupdated.id,
                  status: 200,
                  message: "Task updated successfully.",
                });
              } else {
                res.json({
                  status: 400,
                  message: "Task not updated.",
                });
              }
            });
        } else {
          res.json({
            status: 400,
            message: "Task not found.",
          });
        }
      });
  }
});

//@author:mamta - Save & update program wise single module
router.post("/saveProgramModule", auth, (req, res) => {
  var moduleData = req.body.moduleData;
  if (
    moduleData.moduleId == null ||
    moduleData.moduleId == "" ||
    moduleData.moduleId == undefined
  ) {
    models.program_module
      .create({
        program_id: moduleData.programId,
        task_id: moduleData.taskId,
        about: moduleData.about,
        module: moduleData.questions,
        videoQuestion: moduleData.videoQuestion,
        mcqQuestion: moduleData.mcqQuestion,
        uploadQuestion: moduleData.uploadQuestion,
      })
      .then(function (programModule) {
        if (programModule) {
          res.json({
            status: 200,
            data: programModule.id,
          });
        } else {
          res.json({
            status: 400,
            message: "Program module is not created.",
          });
        }
      });
  } else {
    models.program_module
      .findOne({
        where: {
          id: moduleData.moduleId,
        },
      })
      .then(function (programModule) {
        if (programModule) {
          programModule
            .update({
              about: moduleData.about,
              module: moduleData.questions,
              videoQuestion: moduleData.videoQuestion,
              mcqQuestion: moduleData.mcqQuestion,
              uploadQuestion: moduleData.uploadQuestion,
            })
            .then(function (moduleupdated) {
              if (moduleupdated) {
                res.json({
                  data: moduleupdated.id,
                  status: 200,
                  message: "Module updated successfully.",
                });
              } else {
                res.json({
                  status: 400,
                  message: "Module not updated.",
                });
              }
            });
        } else {
          res.json({
            status: 400,
            message: "Module not found.",
          });
        }
      });
  }
});

//delete single program
router.post("/deleteProgramData", auth, (req, res) => {
  // console.log("req.body.program_id====>"+req.body.program_id)
  models.company_programs
    .findOne({
      where: {
        id: req.body.program_id,
      },
    })
    .then((programdata) => {
      if (programdata) {
        models.company_programs
          .destroy({
            where: {
              id: req.body.program_id,
            },
          })
          .then(async function (program_deleted) {
            const task_ids = await models.tasks.findAll({
              where: { program_id: req.body.program_id },
              attributes: ["id"],
              raw: true,
            });
            models.tasks.destroy({
              where: { program_id: req.body.program_id },
            });
            models.program_module.destroy({
              where: { program_id: req.body.program_id },
            });
            models.program_surveys.destroy({
              where: { program_id: req.body.program_id },
            });
            if (program_deleted) {
              if (programdata.video != null && programdata.video != "") {
                const str = programdata.video;
                const file = str.split("/").slice(1);
                const file_location = file[2].split("\\", 4).join("/");
                const dir = "./src/assets/public/upload/" + file_location;
                rimraf(dir, { recursive: true }, (err) => {
                  //console.log(err)
                });
                const dir1 =
                  "./src/assets/public/upload/company/" +
                  programdata.company_id +
                  "/programs/" +
                  req.body.program_id;
                rimraf(dir1, { recursive: true }, (err) => {
                  //console.log(err)
                });
                task_ids.forEach((t_id) => {
                  const dir1 =
                    "./src/assets/public/upload/company/" +
                    programdata.company_id +
                    "/task/" +
                    t_id.id;
                  rimraf(dir1, { recursive: true }, (err) => {
                    //console.log(err)
                  });
                });
              }
              res.json({
                status: 200,
              });
            } else {
              res.json({
                status: 400,
                message: "Company program is not deleted.",
              });
            }
          });
      }
    })
    .catch((error) => {
      console.log(
        "[-] Error in @route /deleteProgramData method:post\n",
        error
      );
      res.status(500).json({ staus: false, message: "Somthing went wrong" });
    });
});

//Get single program data
router.get("/getProgramValues", (req, res) => {
  models.company_programs
    .findOne({
      where: {
        id: req.query.program_id,
      },
    })
    .then(function (progarm_data) {
      models.companies
        .findOne({
          where: {
            id: progarm_data.company_id,
          },
          attributes: ["logo", "banner", "name"],
        })
        .then(function (company_data) {
          //console.log("company_data[====>"+JSON.stringify(company_data))
          models.tasks
            .findAll({
              where: {
                program_id: req.query.program_id,
              },
              attributes: ["task_description", "task_name"],
            })
            .then(async (programTaskData) => {
              if (req.query.user_id) {
                var book = await models.bookmark_program_data.findOne({
                  attributes: ["bookmark"],
                  where: {
                    program_id: req.query.program_id,
                    user_id: req.query.user_id,
                  },
                  raw: true,
                });
              }
              res.status(200).json({
                status: true,
                data: progarm_data,
                company_data: company_data,
                program_task: programTaskData,
                bookmark: book ? book.bookmark : "false",
              });
            });
        });
    });
});

router.get("/getProgramValuesAdmin", auth, async (req, res) => {
  try {
    const progarm_data = await models.company_programs.findOne({
      where: { id: req.query.program_id },
    });
    const programModuleData = await models.program_module.findAll({
      where: { program_id: req.query.program_id },
    });
    res.status(200).json({
      status: true,
      data: progarm_data,
      program_module: programModuleData,
    });
  } catch (error) {
    console.log(
      "[-] Error in @route /getProgramValuesAdmin method:get\n",
      error
    );
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

//Get single task data
router.get("/getTaskValues", auth, (req, res) => {
  models.tasks
    .findOne({
      where: {
        id: req.query.task_id,
      },
    })
    .then(function (task_data) {
      res.json({
        status: 200,
        data: task_data,
      });
    });
});
//@author:mamta - Get single program's module data
router.get("/getModuleValues", auth, (req, res) => {
  models.program_module
    .findOne({
      where: {
        id: req.query.module_id,
      },
    })
    .then(function (module_data) {
      res.json({
        status: 200,
        data: module_data,
      });
    });
});

//upload company program related video
router.post("/uploadVideo", auth, upload.single("avatar"), (req, res, next) => {
  var id = req.body.id;
  if (req.file == undefined) {
    res.status(201).json({
      message: "No changes to file!",
    });
  } else {
    var minusPublic =
      type == "DEV"
        ? req.file.path.split("upload\\")
        : req.file.path.split("upload/");
    var url = serverUrl + minusPublic[1];
    var condition = {};
    if (req.body.upload_option == "vdo") {
      condition = { video: url };
    } else if (req.body.upload_option == "back_image") {
      condition = { backgroundImage: url };
    } else if (req.body.upload_option == "program_logo") {
      condition = { banner_logo: url };
    } else if (req.body.upload_option == "instr_vdo") {
      condition = { instruction_video: url };
    } else if (req.body.upload_option == "res_vdo") {
      condition = { resource_task: url };
    } else if (req.body.upload_option == "task_logo") {
      condition = { task_logo: url };
    } else if (req.body.upload_option == "workshop_image") {
      condition = { image: url };
    } else if (req.body.upload_option == "certificate") {
      condition = { certificate: url };
    } else if (req.body.upload_option == "module") {
      condition = { solution: url, mime_type: req.file.mimetype };
    } else if (req.body.upload_option == "videoQues") {
      condition = url;
    } else if (req.body.upload_option == "workshop_certificate") {
      condition = { certificate: url };
    }

    if (
      req.body.upload_option == "vdo" ||
      req.body.upload_option == "back_image" ||
      req.body.upload_option == "program_logo"
    ) {
      models.company_programs
        .update(condition, {
          where: {
            id: id,
          },
        })
        .then(function (data) {
          res.status(200).json({
            message: "file upload successfully!",
            //  avatar: url + '/public/' + req.file.filename,
          });
        });
    } else if (
      req.body.upload_option == "instr_vdo" ||
      req.body.upload_option == "res_vdo" ||
      req.body.upload_option == "task_logo"
    ) {
      models.tasks
        .update(condition, {
          where: {
            id: id,
          },
        })
        .then(function (data) {
          res.status(200).json({
            message: "file upload successfully!",
            //  avatar: url + '/public/' + req.file.filename,
          });
        });
    } else if (
      req.body.upload_option == "workshop_image" ||
      req.body.upload_option == "workshop_certificate"
    ) {
      models.workshops
        .update(condition, {
          where: {
            id: id,
          },
        })
        .then(function (data) {
          res.status(200).json({
            message: "file upload successfully!",
            //  avatar: url + '/public/' + req.file.filename,
          });
        });
    } else if (req.body.upload_option == "certificate") {
      models.company_programs
        .update(condition, {
          where: {
            id: id,
          },
        })
        .then(function (data) {
          dir =
            "./src/assets/public/upload/company/" +
            req.body.company_id +
            "/programs/" +
            req.body.id +
            "/module/";
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          res.status(200).json({
            message: "file upload successfully!",
          });
        });
    } else if (req.body.upload_option == "module") {
      models.program_module
        .update(condition, {
          where: {
            id: id,
          },
        })
        .then(function (data) {
          res.status(200).json({
            message: "file upload successfully!",
            //  avatar: url + '/public/' + req.file.filename,
          });
        });
    } else if (req.body.upload_option == "videoQues") {
      res.status(200).json({
        message: "file upload successfully!",
        url: condition,
      });
    }
  }
});

//get workshop data company wise
router.get("/getWorkshopData", auth, (req, res) => {
  //console.log("getWorkshopData getWorkshopData getWorkshopData==>"+req.query.college_id);
  var workshops = [];
  if (req.query.role == "company") {
    models.workshops
      .findAll({
        where: {
          company_id: req.query.college_id,
        },
      })
      .then(function (allworkshops) {
        res.json({
          status: 200,
          data: allworkshops,
        });
      });
  } else {
    var count = 0;
    models.workshops.findAll({ raw: true }).then(function (allworkshops) {
      allworkshops.forEach((workshop) => {
        models.companies
          .findOne({
            where: {
              id: workshop.company_id,
            },
          })
          .then(function (company) {
            workshops.push({
              id: workshop.id,
              name: workshop.name,
              description: workshop.description,
              stream: workshop.stream,
              degree: workshop.degree,
              testimonials: workshop.testimonials,
              benefits: workshop.benefits,
              speaker: workshop.speaker,
              certificate: workshop.certificate,
              language: workshop.language,
              topic: workshop.topic,
              agenda: workshop.agenda,
              whatsapp_link: workshop.whatsapp_link,
              // start_date:workshop.start_date,
              // end_date:workshop.end_date,
              // start_time:workshop.start_time,
              // end_time:workshop.end_time,
              image: workshop.image,
              company_id: workshop.company_id,
              company_name: company.name,
              quiz: workshop.quiz,
              individual_task: workshop.individual_task,
              group_task: workshop.group_task,
            });
            count++;
            if (count == allworkshops.length) {
              res.json({
                status: 200,
                data: workshops,
              });
            }
          });
      });
    });
  }
});

//delete single workshop
router.post("/deleteWorkshopData", auth, (req, res) => {
  //console.log("req.body.workshop_id====>"+req.body.workshop_id)
  models.workshops
    .findOne({
      where: {
        id: req.body.workshop_id,
      },
    })
    .then((workshopdata) => {
      if (workshopdata) {
        models.workshops
          .destroy({
            where: {
              id: req.body.workshop_id,
            },
          })
          .then(async function (workshop_deleted) {
            await models.quiz.destroy({
              where: { WorkShop_id: req.body.workshop_id },
            });
            if (workshop_deleted) {
              if (workshopdata.image != null && workshopdata.image != "") {
                const str = workshopdata.image;
                const file = str.split("/").slice(1);
                const file_location = file[2].split("\\", 4).join("/");
                const dir = "./src/assets/public/upload/" + file_location;
                rimraf(dir, { recursive: true }, (err) => {});
              }
              res.json({
                status: 200,
              });
            } else {
              res.json({
                status: 400,
                message: "Comapny workshop is not deleted.",
              });
            }
          });
      }
    });
});

//Get single workshop data
router.get("/getWorkshopValues", async (req, res) => {
  try {
    let condition = `SELECT w.*,c.logo as company_logo from workshops as w join companies as c on w.company_id=c.id where w.id=${req.query.workshop_id}`;
    if (req.query.user_id) {
      var book = await models.bookmarkWorkshops.findOne({
        attributes: ["bookmark"],
        where: {
          workshop_id: req.query.workshop_id,
          user_id: req.query.user_id,
        },
        raw: true,
      });
    }
    const workshop_data = await models.sequelize.query(condition, {
      types: QueryTypes.SELECT,
    });
    res.json({
      status: 200,
      data: workshop_data[0],
      bookmark: book ? book.bookmark : false,
    });
  } catch (e) {
    console.log("[-] Error in @route /getWorkshopValues method:get\n", e);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

router.get("/getBatch", async (req, res) => {
  try {
    const result = await models.sequelize.query(
      `select distinct(batch) from workshops where company_id='${req.query.company_id}'`,
      { types: QueryTypes.SELECT }
    );
    if (result) {
      res.json({
        status: 200,
        data: result[0],
      });
    }
  } catch (error) {
    console.log("[-] Error in @route /getBatch method:get\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

//Save & Update company wise single workshop
router.post("/saveWorkshopData", auth, (req, res) => {
  var workshopData = req.body.workshopData;
  //console.log("Moment(new Date(workshopData.date_time)).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')===>"+Moment(new Date(workshopData.date_time)).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'))
  if (
    workshopData.workshopId == null ||
    workshopData.workshopId == "" ||
    workshopData.workshopId == undefined
  ) {
    models.workshops
      .create({
        name: workshopData.name,
        description: workshopData.description,
        stream: workshopData.stream,
        degree: workshopData.degree,
        testimonials: workshopData.Testimonials,
        benefits: workshopData.benefits,
        speaker: workshopData.speaker,
        start_date: workshopData.startDate,
        end_date: workshopData.endDate,
        start_time: workshopData.startTime,
        end_time: workshopData.endTime,
        batch: workshopData.workshopBatch,
        whatsapp_link: workshopData.whatsappLink,
        meet_link: workshopData.meetLink,
        company_id: workshopData.company_id,
        language: workshopData.language,
        topic: workshopData.topic,
        agenda: workshopData.agenda,
      })
      .then(function (companyworkshop) {
        if (companyworkshop) {
          res.json({
            status: 200,
            data: companyworkshop.id,
          });
        } else {
          res.json({
            status: 400,
            message: "Comapny workshop is not created.",
          });
        }
      });
  } else {
    models.workshops
      .findOne({
        where: {
          id: workshopData.workshopId,
        },
      })
      .then(function (companyworkshop) {
        if (companyworkshop) {
          // if (req.body.workshopData.uploadTrue === true) {
          //     if (companyworkshop.image != null && companyworkshop.image != "") {
          //         const str = companyworkshop.image
          //         const file_location = str.split('/').slice(1)
          //         const dir = './src/assets/public/upload/' + file_location[2];
          //         fs.unlink(dir, (err) => {
          //             //console.log(err)
          //         })
          //     }
          // }
          companyworkshop
            .update({
              name: workshopData.name,
              description: workshopData.description,
              stream: workshopData.stream,
              degree: workshopData.degree,
              testimonials: workshopData.Testimonials,
              benefits: workshopData.benefits,
              speaker: workshopData.speaker,
              start_date: workshopData.startDate,
              end_date: workshopData.endDate,
              start_time: workshopData.startTime,
              end_time: workshopData.endTime,
              batch: workshopData.workshopBatch,
              whatsapp_link: workshopData.whatsappLink,
              meet_link: workshopData.meetLink,
              language: workshopData.language,
              topic: workshopData.topic,
              agenda: workshopData.agenda,
            })
            .then(function (workshopupdated) {
              if (workshopupdated) {
                res.json({
                  data: workshopupdated.id,
                  status: 200,
                  message: "Workshop updated successfully.",
                });
              } else {
                res.json({
                  status: 400,
                  message: "Workshop not updated.",
                });
              }
            });
        } else {
          res.json({
            status: 400,
            message: "Workshop not found.",
          });
        }
      });
  }
});

router.get("/search", async (req, res) => {
  try {
    const referral_code = req.query.code;
    const aboutSubject = await models.sequelize.query(
      "select c.name,c.course_picture,s.sub_name,a.* from course c join subject s on c.subjectID = s.id join aboutsubject a on a.course_id = c.id where c.id=" +
        req.query.id,
      { types: QueryTypes.SELECT }
    );
    res.status(200).json({ status: true, data: aboutActivity });
  } catch (e) {
    console.log("[-] Error in @route /getActivityInfo method:post");
    console.log(e);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
});

////TO get the faculty name according company's referral code
router.get("/getcompanyFaculty", auth, async function (req, res) {
  try {
    if (req.query.role == "company") {
      var result = await models.sequelize.query(
        `select id,sub_name from subject where sub_name in (select distinct(faculty) from company_programs where company_id=${req.query.company_id} )`,
        { types: QueryTypes.SELECT }
      );
    } else if (req.query.role == "admin") {
      var result = await models.sequelize.query(
        `select id,sub_name from subject`,
        { types: QueryTypes.SELECT }
      );
    }

    if (result) {
      res.json({
        status: 200,
        data: result[0],
      });
    }
  } catch (error) {
    console.log("======Error on getcompanyFaculty Router====\n", error);
    res.status(500).json({ error: error.message });
  }
});

//to get company referral code
router.get("/getcompanyReferralCode", auth, async function (req, res) {
  try {
    if (req.query.role == "company") {
      var result = await models.sequelize.query(
        `select distinct(referral_code) from company_programs where company_id=${req.query.company_id}`,
        { types: QueryTypes.SELECT }
      );
    } else if (req.query.role == "admin") {
      var result = await models.sequelize.query(
        `select distinct(referral_code) from company_programs`,
        { types: QueryTypes.SELECT }
      );
    }

    if (result) {
      res.status(200).json({ data: result[0] });
    }
  } catch (error) {
    console.log("==== Error On getcompanyReferralCode Router=====\n", error);
    res.status(500).json({ error: error.message });
  }
});

//Auther Shweta Vaidya
//Get all programs data to check the status of course (active/inactive)
router.get("/getAllProgramData", auth, (req, res) => {
  //console.log("getAllProgramData getAllProgramData getAllProgramData==>"+req.query.approval_status);
  var condition = {};
  var progarmsData = [];
  models.company_programs
    .getAllProgramData(req.query.approval_status)
    .then(function (allprogarms) {
      //console.log("JSON.stringify(allprogarms)==>"+JSON.stringify(allprogarms));
      allprogarms.forEach(function (progam) {
        progarmsData.push({
          company_id: progam.company_id,
          company_name: progam.company_name,
          company_program_id: progam.company_program_id,
          company_program_name: progam.company_program_name,
          description: progam.description,
          testimonials: progam.testimonials,
          benefits: progam.benefits,
          steps: progam.steps,
          video: progam.video,
          duration: progam.duration,
          faculty: progam.faculty,
          logo: progam.logo,
          program_status: progam.status,
        });
      });
      res.json({
        status: 200,
        data: allprogarms,
      });
    });
});

//Auther Shweta Vaidya
//To change the status of the company course
//Parameters: company_program_id, status( active / inactive )
router.post("/status", auth, function (req, res) {
  // console.log("req.body.company_program_id===>"+req.body.company_program_id)
  // console.log("req.body.status===>"+req.body.status)
  models.company_programs
    .findOne({
      where: {
        id: req.body.company_program_id,
      },
    })
    .then((company_program) => {
      if (company_program) {
        company_program
          .update({
            status: req.body.status,
          })
          .then(function (updatedcompany_program) {
            var userStatus =
              updatedcompany_program.user_status == "active"
                ? "activated."
                : "de-activated.";
            if (userStatus == "activated.") {
              res.json({
                status: 200,
                message: "Company Program " + req.body.status,
              });
            } else if (userStatus == "de-activated.") {
              res.json({
                status: 200,
                message: "Company Program " + req.body.status,
              });
            } else {
              res.json({
                status: 200,
                message: "Company Program " + req.body.status,
              });
            }
          });
      } else {
        res.json({
          status: 400,
          message: "Company Program not found",
        });
      }
    });
});

//@author: Mamta - to upload and save video questions value
//Parameters : program_module_id , company_id, program_id, upload_option(videoQues)
router.post(
  "/uploadModuleVideos",
  auth,
  upload.array("avatar", 10),
  (req, res, next) => {
    models.program_module
      .findOne({
        where: {
          id: req.body.id,
        },
        raw: true,
      })
      .then((data) => {
        if (data) {
          const videoQuestionsArray = data.videoQuestion;
          req.files.forEach((e) => {
            videoQuestionsArray.forEach((vFile) => {
              if (e.originalname == vFile.video) {
                var minusPublic =
                  type == "DEV"
                    ? e.path.split("upload\\")
                    : e?.path.split("upload/");
                var url = serverUrl + minusPublic[1];
                vFile.video = url;
              }
            });
          });

          models.program_module
            .update(
              {
                videoQuestion: videoQuestionsArray,
              },
              {
                where: {
                  id: req.body.id,
                },
              }
            )
            .then((updated) => {
              if (updated) {
                const actual = [];
                const dir =
                  "./src/assets/public/upload/company/" +
                  req.body.company_id +
                  "/programs/" +
                  req.body.program_id +
                  "/module/" +
                  req.body.id +
                  "/video";
                data.videoQuestion.forEach((e) => {
                  actual.push(e.video);
                });

                delete_files_FormArray(actual, dir);

                res.json({ status: 200, message: "updated successfully..." });
              }
            });
        }
      })
      .catch((error) => {
        console.log(
          "[-] Error in @route /uploadModuleVideos method:post\n",
          error
        );
        res.status(500).json({ staus: false, message: "Somthing went wrong" });
      });
  }
);

router.post(
  "/uploadProgramFormArray",
  auth,
  upload.array("avatar", 10),
  (req, res, next) => {
    models.company_programs
      .findOne({
        where: {
          id: req.body.id,
        },
        raw: true,
      })
      .then((data) => {
        if (data) {
          if (req.body.upload_option == "testimonialPhoto") {
            const formdata = data.testimonials;
            req.files.forEach((e) => {
              formdata.forEach((vFile) => {
                if (e.originalname == vFile.speakerPhoto) {
                  var minusPublic =
                    type == "DEV"
                      ? e.path.split("upload\\")
                      : e?.path.split("upload/");
                  var url = serverUrl + minusPublic[1];
                  vFile.speakerPhoto = url;
                }
              });
            });

            models.company_programs
              .update(
                {
                  testimonials: formdata,
                },
                {
                  where: {
                    id: req.body.id,
                  },
                }
              )
              .then((updated) => {
                if (updated) {
                  // const actual = [];
                  // const dir = './src/assets/public/upload/company/' + req.body.company_id + '/gallery/' + req.body.id + '/TestPhoto';
                  // data.testimonials.forEach(e => {
                  //     actual.push(e.speakerPhoto)
                  // })

                  // delete_files_FormArray(actual, dir)

                  res.json({ status: 200, message: "updated successfully..." });
                }
              });
          } else if (req.body.upload_option == "icon") {
            const formdata = data.benefits;
            req.files.forEach((e) => {
              formdata.forEach((vFile) => {
                if (e.originalname == vFile.icon) {
                  var minusPublic =
                    type == "DEV"
                      ? e.path.split("upload\\")
                      : e?.path.split("upload/");
                  var url = serverUrl + minusPublic[1];
                  vFile.icon = url;
                }
              });
            });

            models.company_programs
              .update(
                {
                  benefits: formdata,
                },
                {
                  where: {
                    id: req.body.id,
                  },
                }
              )
              .then((updated) => {
                if (updated) {
                  // const actual = [];
                  // const dir = './src/assets/public/upload/company/' + req.body.company_id + '/gallery/' + req.body.id + '/icons';
                  // data.formdata.forEach(e => {
                  //     actual.push(e.icon)
                  // })

                  // delete_files_FormArray(actual, dir)

                  res.json({ status: 200, message: "updated successfully..." });
                }
              });
          } else if (req.body.upload_option == "speakerPhoto") {
            const formdata = data.speaker;
            req.files.forEach((e) => {
              formdata.forEach((vFile) => {
                if (e.originalname == vFile.speakerPhoto) {
                  var minusPublic =
                    type == "DEV"
                      ? e.path.split("upload\\")
                      : e?.path.split("upload/");
                  var url = serverUrl + minusPublic[1];
                  vFile.speakerPhoto = url;
                }
              });
            });

            models.company_programs
              .update(
                {
                  speaker: formdata,
                },
                {
                  where: {
                    id: req.body.id,
                  },
                }
              )
              .then((updated) => {
                if (updated) {
                  // const actual = [];
                  // const dir = './src/assets/public/upload/company/' + req.body.company_id + '/gallery/' + req.body.id + '/SpeakerPhoto';
                  // data.speaker.forEach(e => {
                  //     actual.push(e.speakerPhoto)
                  // })

                  // delete_files_FormArray(actual, dir)

                  res.json({ status: 200, message: "updated successfully..." });
                }
              });
          }
        }
      })
      .catch((error) => {
        console.log(
          "[-] Error in @route /uploadProgramFormArray method:post\n",
          error
        );
        res.status(500).json({ staus: false, message: "Somthing went wrong" });
      });
  }
);

router.post(
  "/uploadTaskResource",
  auth,
  upload.array("avatar", 10),
  (req, res, next) => {
    // console.log('===========',req.files)
    // console.log('===========',req.body)
    const source = req.body.source;
    models.tasks
      .findOne({
        where: {
          id: req.body.id,
        },
        raw: true,
      })
      .then((data) => {
        if (data) {
          if (source == "worksheet") {
            req.files.forEach((e) => {
              var minusPublic =
                type == "DEV"
                  ? e.path.split("upload\\")
                  : e?.path.split("upload/");
              var url = serverUrl + minusPublic[1];
              models.uploadTasks
                .create({
                  task_id: req.body.id,
                  program_id: req.body.program_id,
                  company_id: req.body.company_id,
                  field: "worksheet",
                  filename: e.filename,
                  mimeType: e.mimetype,
                  url: url,
                })
                .then((created) => {
                  if (created) {
                    console.log("uploadede");
                    // res.json({ status: 200, message: 'updated successfully...' })
                  }
                });
            });
          } else if (source == "homework") {
            req.files.forEach((e) => {
              var minusPublic =
                type == "DEV"
                  ? e.path.split("upload\\")
                  : e?.path.split("upload/");
              var url = serverUrl + minusPublic[1];
              models.uploadTasks
                .create({
                  task_id: req.body.id,
                  program_id: req.body.program_id,
                  company_id: req.body.company_id,
                  field: "homework",
                  filename: e.filename,
                  mimeType: e.mimetype,
                  url: url,
                })
                .then((created) => {
                  if (created) {
                    console.log("uploadede");
                    // res.json({ status: 200, message: 'updated successfully...' })
                  }
                });
            });
          }
        }
      })
      .catch((error) => {
        console.log(
          "[-] Error in @route /uploadTaskResource method:post\n",
          error
        );
        res.status(500).json({ status: false, message: "Somthing went wrong" });
      });
  }
);

router.get("/getUploadTask", auth, (req, res) => {
  models.uploadTasks
    .findAll({
      where: {
        task_id: req.query.task_id,
        program_id: req.query.program_id,
      },
    })
    .then((found) => {
      if (found) {
        res.status(200).json({
          data: found,
        });
      }
    })
    .catch((error) => {
      console.log("[-] Error in @route /getUploadTask method:get\n", error);
      res.status(500).json({ status: false, message: "Somthing went wrong" });
    });
});

router.get("/deleteUploadedTask", auth, (req, res) => {
  // console.log('--->',req.query.id)
  models.uploadTasks
    .destroy({
      where: {
        id: req.query.id,
      },
    })
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ status: true, message: "successfully deleted" });
      }
    })
    .catch((error) => {
      console.log(
        "[-] Error in @route /deleteUploadedTask method:get\n",
        error
      );
      res.status(500).json({ status: false, message: "Somthing went wrong" });
    });
});

router.post(
  "/uploadWorkshopFormArray",
  auth,
  upload.array("avatar", 10),
  (req, res, next) => {
    models.workshops
      .findOne({
        where: {
          id: req.body.id,
        },
        raw: true,
      })
      .then((data) => {
        if (data) {
          if (req.body.upload_option == "workshopTestPhoto") {
            const formdata = data.testimonials;
            req.files.forEach((e) => {
              formdata.forEach((vFile) => {
                if (e.originalname == vFile.speakerPhoto) {
                  var minusPublic =
                    type == "DEV"
                      ? e.path.split("upload\\")
                      : e?.path.split("upload/");
                  var url = serverUrl + minusPublic[1];
                  vFile.speakerPhoto = url;
                }
              });
            });

            models.workshops
              .update(
                {
                  testimonials: formdata,
                },
                {
                  where: {
                    id: req.body.id,
                  },
                }
              )
              .then((updated) => {
                if (updated) {
                  // const actual = [];
                  // const dir ='./src/assets/public/upload/company/' + req.body.company_id + '/workshop/' + req.body.id + '/testimonial';;
                  // data.testimonials.forEach(e => {
                  //     actual.push(e.speakerPhoto)
                  // })

                  // delete_files_FormArray(actual, dir)

                  res.json({ status: 200, message: "updated successfully..." });
                }
              });
          } else if (req.body.upload_option == "workshopIcon") {
            const formdata = data.benefits;
            req.files.forEach((e) => {
              formdata.forEach((vFile) => {
                if (e.originalname == vFile.icon) {
                  var minusPublic =
                    type == "DEV"
                      ? e.path.split("upload\\")
                      : e?.path.split("upload/");
                  var url = serverUrl + minusPublic[1];
                  vFile.icon = url;
                }
              });
            });

            models.workshops
              .update(
                {
                  benefits: formdata,
                },
                {
                  where: {
                    id: req.body.id,
                  },
                }
              )
              .then((updated) => {
                if (updated) {
                  // const actual = [];
                  // const dir = './src/assets/public/upload/company/' + req.body.company_id + '/workshop/' + req.body.id + '/icons';
                  // data.formdata.forEach(e => {
                  //     actual.push(e.icon)
                  // })

                  // delete_files_FormArray(actual, dir)

                  res.json({ status: 200, message: "updated successfully..." });
                }
              });
          } else if (req.body.upload_option == "workshopSpeakerPhoto") {
            const formdata = data.speaker;
            req.files.forEach((e) => {
              formdata.forEach((vFile) => {
                if (e.originalname == vFile.speakerPhoto) {
                  var minusPublic =
                    type == "DEV"
                      ? e.path.split("upload\\")
                      : e?.path.split("upload/");
                  var url = serverUrl + minusPublic[1];
                  vFile.speakerPhoto = url;
                }
              });
            });

            models.workshops
              .update(
                {
                  speaker: formdata,
                },
                {
                  where: {
                    id: req.body.id,
                  },
                }
              )
              .then((updated) => {
                if (updated) {
                  // const actual = [];
                  // const dir = './src/assets/public/upload/company/' + req.body.company_id + '/workshop/' + req.body.id + '/speaker_photo';
                  // data.speaker.forEach(e => {
                  //     actual.push(e.speakerPhoto)
                  // })

                  // delete_files_FormArray(actual, dir)

                  res.json({ status: 200, message: "updated successfully..." });
                }
              });
          }
        }
      })
      .catch((error) => {
        console.log(
          "[-] Error in @route /uploadWorkshopFormArray method:post\n",
          error
        );
        res.status(500).json({ staus: false, message: "Somthing went wrong" });
      });
  }
);

router.post("/getStudentWorkshop", auth, async (req, res) => {
  try {
    const result = await models.workshops.getWorkshopData(req.body);
    res.status(200).json({ status: 200, data: result });
  } catch (error) {
    console.log("[-] Error in @route /getStudentWorkshop method:post\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

router.post("/saveWorkshopBookmark", auth, async (req, res) => {
  models.bookmarkWorkshops
    .findOne({
      where: {
        workshop_id: req.body.workshop_id,
        user_id: req.user.id,
      },
    })
    .then((data) => {
      if (data) {
        if (req.body.bookmark == false) {
          data.destroy({}).then((deleted) => {
            res
              .status(200)
              .json({ status: true, message: "updated successfully..." });
          });
        }
      } else {
        models.bookmarkWorkshops
          .create({
            workshop_id: req.body.workshop_id,
            user_id: req.user.id,
            bookmark: req.body.bookmark,
          })
          .then((created) => {
            res.json({ status: true, message: "updated successfuuly..." });
          });
      }
    })
    .catch((error) => {
      console.log(
        "[-] Error in @route /uploadWorkshopFormArray method:post\n",
        error
      );
      res.status(500).json({ staus: false, message: "Somthing went wrong" });
    });
});

// author : ankita K get saved bookmark data
router.get("/getProgrambookmarkSave", auth, (req, res) => {
  var bookmarks = req.query.bookMark;
  var user_id = req.user.id;
  var program_id = req.query.id;

  models.bookmark_program_data
    .findOne({
      where: {
        program_id: program_id,
        user_id: user_id,
      },
    })
    .then((Bookmark) => {
      if (Bookmark) {
        if (bookmarks == "false") {
          Bookmark.destroy({}).then((deleted) => {
            res.json({
              data: deleted,
              status: 200,
            });
          });
        }
      } else {
        models.bookmark_program_data
          .create({
            bookmark: bookmarks,
            program_id: program_id,
            user_id: user_id,
          })
          .then((data1) => {
            if (data1) {
              res.json({
                status: 200,
              });
            }
          });
      }
    });
});

router.post("/save-task-permission", auth, async (req, res) => {
  try {
    const field = req.body.field;
    const value = req.body.value;
    const found = await models.workshops.findOne({
      where: { id: req.body.workshop_id },
    });
    if (found) {
      found.update({ [field]: value });
      res.status(200).json({ status: true, message: "updated successfully" });
    }
  } catch (error) {
    console.log(
      "[-] Error in @route /save-task-permission method:post\n",
      error
    );
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

router.post(
  "/uploadGroupTask",
  auth,
  upload1.single("avatar"),
  async (req, res) => {
    try {
      var minusPublic =
        type == "DEV"
          ? req.file.path.split("upload\\")
          : req.file.path.split("upload/");
      var url = serverUrl + minusPublic[1];
      const found = await models.group_task_uploads.findOne({
        where: { workshop_id: req.body.id, company_id: req.body.company_id },
      });
      if (found) {
        await found.update({
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimeType: req.file.mimetype,
          destination: req.file.destination,
          url: url,
        });
      } else {
        await models.group_task_uploads.create({
          workshop_id: req.body.id,
          company_id: req.body.company_id,
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimeType: req.file.mimetype,
          destination: req.file.destination,
          url: url,
        });
      }
      res
        .status(200)
        .json({ status: true, message: "file uploaded successfully.." });
    } catch (error) {
      console.log("[-] Error in @route /uploadGroupTask method:post\n", error);
      res.status(500).json({ staus: false, message: "Somthing went wrong" });
    }
  }
);

router.get("/get-group-task-pdf", auth, async (req, res) => {
  try {
    const data = await models.group_task_uploads.findOne({
      where: { workshop_id: req.query.workshop_id },
      attributes: ["url"],
    });
    res.status(200).json({ status: true, data: data });
  } catch (error) {
    console.log("[-] Error in @route /get-group-task-pdf method:get\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

router.post("/save-workshop-task", auth, async (req, res) => {
  try {
    var taskData = req.body;
    const found = await models.workshop_tasks.findOne({
      where: { workshop_id: req.body.workshopId },
    });
    if (found) {
      const updated = await found.update({
        // about: taskData.about,
        questions: taskData.questions,
        videoQuestion: taskData.videoQuestion,
        mcqQuestion: taskData.mcqQuestion,
        uploadQuestion: taskData.uploadQuestion,
      });
      if (updated)
        res.status(200).json({ status: true, message: "updated successfully" });
    } else {
      const created = await models.workshop_tasks.create({
        workshop_id: taskData.workshopId,
        // about: taskData.about,
        questions: taskData.questions,
        videoQuestion: taskData.videoQuestion,
        mcqQuestion: taskData.mcqQuestion,
        uploadQuestion: taskData.uploadQuestion,
      });
      if (created)
        res.status(200).json({ status: true, message: "updated successfully" });
    }
  } catch (error) {
    console.log("[-] Error in @route /save-workshop-task method:post\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

router.post(
  "/upload-work-task-video",
  auth,
  upload.array("avatar", 10),
  async (req, res, next) => {
    try {
      const data = await models.workshop_tasks.findOne({
        where: { workshop_id: req.body.workshop_id },
      });
      if (data) {
        const videoQuestionsArray = data.videoQuestion;
        req.files.forEach((e) => {
          videoQuestionsArray.forEach((vFile) => {
            if (e.originalname == vFile.video) {
              var minusPublic =
                type == "DEV"
                  ? e?.path.split("upload\\")
                  : e?.path.split("upload/");
              var url = serverUrl + minusPublic[1];
              vFile.video = url;
              vFile.size = e.size;
              vFile.encoding = e.encoding;
              vFile.filename = e.filename;
              vFile.mimetype = e.mimetype;
              vFile.destination = e.destination;
              vFile.originalname = e.originalname;
            }
          });
        });
        await models.workshop_tasks.update(
          { videoQuestion: videoQuestionsArray },
          { where: { workshop_id: req.body.workshop_id } }
        );
      }
      res.json({ status: 200, message: "updated successfully..." });
    } catch (error) {
      console.log(
        "[-] Error in @route /save-workshop-task-video method:post\n",
        error
      );
      res.status(500).json({ staus: false, message: "Somthing went wrong" });
    }
  }
);

router.post(
  "/upload-work-task-solution",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (req.file == undefined) {
        res.status(201).json({
          message: "No changes to file!",
        });
      } else {
        const data = await models.workshop_tasks.findOne({
          where: { workshop_id: req.body.workshop_id },
        });
        if (data) {
          var minusPublic =
            type == "DEV"
              ? req.file.path.split("upload\\")
              : req.file.path.split("upload/");
          var url = serverUrl + minusPublic[1];
          const updated = await data.update({
            solution: url,
            filename: req.file.filename,
            destination: req.file.destination,
            mime_type: req.file.mimetype,
          });
          if (updated)
            res
              .status(200)
              .json({ status: true, message: "updated successfully..." });
        }
      }
    } catch (error) {
      console.log(
        "[-] Error in @route /upload-work-task-solution method:post\n",
        error
      );
      res.status(500).json({ staus: false, message: "Somthing went wrong" });
    }
  }
);

router.get("/get-work-task", auth, async (req, res) => {
  try {
    const data = await models.workshop_tasks.findOne({
      where: { workshop_id: req.query.workshop_id },
    });
    res.status(200).json({ status: true, data: data });
  } catch (error) {
    console.log("[-] Error in @route /get-work-task method:get\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

module.exports = router;
