const express = require("express");

const router = express.Router();
const path = require("path");

const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });

const root_path = path.dirname(require.main.filename);
const models = require(`${root_path}/models`);
const multer = require("multer");
const fs = require("fs");
const config = require("config");
const { QueryTypes } = require("sequelize");
var moment = require("moment");
var functions = require(root_path + "/utils/function");

const { serverUrl } = config.get("api");
const { type } = config.get("api");
const rimraf = require("rimraf");
const { delete_files_FormArray } = require("../../utils/function");
const { mentorNotification } = require("../backend/sendEmail");

// @author:Mamta - middleware for upload image and logo in folder
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const source = req.body.upload_option;
    if (source == "photo" || source == "video") {
      var dir = `./src/assets/public/upload/mentor/${req.body.id}`; // req.body.id == mentor id
    } else if (source == "Logo") {
      var dir = `./src/assets/public/upload/mentor/${req.body.id}/logo`;
    } else if (source == "testimonial") {
      var dir = `./src/assets/public/upload/mentor/${req.body.id}/testimonial`;
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(
        dir,
        {
          recursive: true,
        },
        (error) => {
          if (error) {
            console.log(`ErrorMessage:${error}`);
          }
        }
      );
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${file.originalname
      .toLowerCase()
      .split(" ")
      .join("-")}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: Storage });

// @author:Mamta - to save and update mentor data by mentor id
router.post("/saveMentorDetail", auth, async (req, res) => {
  try {
    if (
      req.query.mentorID === "null" ||
      req.query.mentorID === "" ||
      req.query.mentorID === "undefined"
    ) {
      const created = await models.mentors.create(req.body);
      if (created) res.json({ status: 200, data: created.id });
    } else {
      const updated = await models.mentors.update(req.body, {
        where: { id: req.query.mentorID },
      });
      if (updated)
        res.json({
          status: 200,
          message: "Updated Successfully",
          data: req.query.mentorID,
        });
    }
  } catch (error) {
    console.log("[-] Error in @route /saveMentorDetail method:post\n", error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
});

// @author:Mamta - Upload an image and update the value of the url in the table for a specific mentor id.
router.post(
  "/uploadMentor",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const location =
        type == "DEV"
          ? req.file.path.split("upload\\")
          : req.file.path.split("upload/");
      const url = serverUrl + location[1];
      let preLocation;
      const found = await models.mentors.findOne({
        where: { id: req.body.id },
      });
      if (found) {
        if (req.body.upload_option == "photo") {
          preLocation = found.image;
          await found.update({ image: url });
        }
        if (req.body.upload_option == "video") {
          preLocation = found.video;
          await found.update({ video: url });
        }
        if (
          preLocation != "" &&
          preLocation != null &&
          preLocation != undefined
        ) {
          const file_location = preLocation.split("/").slice(1);
          const dir = `./src/assets/public/upload/${file_location[2]}`;
          fs.unlink(dir, (err) => {
            // console.log(err)
          });
        }
        res.status(200).json({
          message: "file uploaded successfully..",
        });
      }
    } catch (error) {
      console.log("[-] Error in @route /uploadMentor method:post\n", e);
      res.status(500).json({ status: false, message: "Something went wrong" });
    }
  }
);

// to get all mentor data for befor login page
router.post("/allMentorsList", async (req, res) => {
  try {
    const pageLimit = parseInt(req.body.limit);
    const { page, filter, orderFilter } = req.body;
    const offset = (parseInt(page) - 1) * pageLimit;
    let condition = "";
    let query = `select id,name,image,degree from mentors `;
    let countQuery = `select count(*) as count from mentors`;

    const finalData = [];
    if (filter.length > 0) {
      condition = " where ";
      filter.forEach((e, i) => {
        condition =
          condition +
          `lcase(JSON_EXTRACT(degree, '$[0].stream')) REGEXP '${e}' OR lcase(JSON_EXTRACT(degree , '$[0].university_location')) REGEXP '${e}' or lcase(name) REGEXP '${e}' `;
        if (filter.length - 1 != i) {
          condition = condition + " || ";
        }
      });
    }

    if (orderFilter == "Latest") {
      condition =
        condition +
        ` ORDER BY JSON_EXTRACT( degree, '$[0].graduation_year' ) DESC `;
    } else if (orderFilter == "Earliest") {
      condition =
        condition +
        ` ORDER BY JSON_EXTRACT( degree, '$[0].graduation_year' ) ASC `;
    }

    query = query + condition + ` limit ${pageLimit} offset ${offset}`;
    countQuery = countQuery + condition;
    console.log(query);
    const countMentor = await models.sequelize.query(countQuery, {
      types: QueryTypes.SELECT,
    });
    const allMentor = await models.sequelize.query(query, {
      types: QueryTypes.SELECT,
    });
    console.log("All mentor", allMentor[0]);
    if (allMentor[0]) {
      allMentor[0].forEach((re) => {
        const Book = re.user ? true : false;
        let degrees = [];

        try {
          degrees = JSON.parse(re.degree);
        } catch (error) {
          console.log("Error parsing degree:", error);
        }
        console.log(degrees);
        degrees.forEach((ele) => {
          console.log("Printing", ele);

          finalData.push({
            id: re.id,
            name: re.name,
            image: re.image,
            university_name: ele.university_name,
            college_name: ele.college_name,
            degree: ele.program,
            year: ele.graduation_year,
            bookmark: Book,
          });
        });
      });
    }
    res
      .status(200)
      .json({ status: true, data: finalData, count: countMentor[0][0].count });
  } catch (error) {
    console.log("[-] Error in @route /allMentorsList method:get\n", error);
    res
      .status(500)
      .json({ status: false, message: "Something went wrong is this coming" });
  }
});

//After login

router.post("/all-mentors-list-book", auth, async (req, res) => {
  try {
    const pageLimit = parseInt(req.body.limit);
    const { page, filter, orderFilter } = req.body;
    const offset = (parseInt(page) - 1) * pageLimit;
    let condition = "";
    let query = `select m.id,m.name,m.image,m.degree,bm.user_id as user from mentors as m left join bookmarkmentors as bm on bm.mentor_id = m.id and bm.user_id=${req.user.id}`;
    let countQuery = `select count(*) as count from mentors as m left join bookmarkmentors as bm on bm.mentor_id = m.id and bm.user_id=${req.user.id}`;

    const finalData = [];
    if (filter.length > 0) {
      condition = " where ";
      filter.forEach((e, i) => {
        condition =
          condition +
          `lcase(JSON_EXTRACT(m.degree, '$[0].stream')) REGEXP '${e}' OR lcase(JSON_EXTRACT(m.degree , '$[0].university_location')) REGEXP '${e}' or lcase(m.name) REGEXP '${e}' `;
        if (filter.length - 1 != i) {
          condition = condition + " || ";
        }
      });
    }

    if (orderFilter == "Latest") {
      condition =
        condition +
        ` ORDER BY JSON_EXTRACT( m.degree, '$[0].graduation_year' ) DESC `;
    } else if (orderFilter == "Earliest") {
      condition =
        condition +
        ` ORDER BY JSON_EXTRACT( m.degree, '$[0].graduation_year' ) ASC `;
    }

    query = query + condition + ` limit ${pageLimit} offset ${offset}`;
    countQuery = countQuery + condition;
    const countMentors = await models.sequelize.query(countQuery, {
      types: QueryTypes.SELECT,
    });
    const allMentor = await models.sequelize.query(query, {
      types: QueryTypes.SELECT,
    });
    if (allMentor[0]) {
      allMentor[0].forEach((re) => {
        const Book = re.user ? true : false;
        let degrees = [];

        try {
          degrees = JSON.parse(re.degree);
        } catch (error) {
          console.log("Error parsing degree:", error);
        }
        console.log(degrees);
        degrees.forEach((ele) => {
          console.log("Printing", ele);

          finalData.push({
            id: re.id,
            name: re.name,
            image: re.image,
            university_name: ele.university_name,
            college_name: ele.college_name,
            degree: ele.program,
            year: ele.graduation_year,
            bookmark: Book,
          });
        });
      });
    }
    res
      .status(200)
      .json({ status: true, data: finalData, count: countMentors[0][0].count });
  } catch (error) {
    console.log(
      "[-] Error in @route /all-mentors-list-book method:get\n",
      error
    );
    res
      .status(500)
      .json({ status: false, message: "Something went wrong is this query" });
  }
});

// to get all mentor data for after login page with bookmark data
//router.post('/all-mentors-list-book',auth,async (req,res) => {
//   try{
//     const pageLimit = parseInt(req.body.limit);
//     const { page } = req.body;
//     const offset = (parseInt(page) - 1) * pageLimit;
//     const allMentor = await models.sequelize.query(`select m.id,m.name,m.image,m.degree,bm.user_id as user from mentors as m left join bookmarkmentors as bm on bm.mentor_id = m.id and bm.user_id=${req.user.id}  limit ${pageLimit} offset ${offset}`, { types: QueryTypes.SELECT })
//     const finalData = [];
//     if (allMentor[0]) {
//       allMentor[0].forEach(re => {
//         const Book= re.user?true:false;
//         re.degree.forEach((ele) => {
//           if (ele.show) {
//             finalData.push({
//               id: re.id,
//               name: re.name,
//               image: re.image,
//               university_name: ele.university_name,
//               college_name: ele.college_name,
//               degree: ele.program,
//               bookmark: Book
//             });
//           }
//         });
//       });
//     }
//     res.status(200).json({status:true,data: finalData})
//   }catch(error){
//     console.log('[-] Error in @route /all-mentors-list-book method:get\n', error);
//     res.status(500).json({ status: false, message: 'Something went wrong' });
//   }
// })

// @author:Mamta - get all mentors list for admin
router.get("/getMentors", auth, async (req, res) => {
  try {
    const result = await models.mentors.findAll({
      attributes: ["id", "name", "email"],
    });
    res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("[-] Error in @route /getMentors method:get\n", error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
});

// @author:Mamta -  get single mentor detail by passing the mentor's id
router.get("/getIndividualMentor", async (req, res) => {
  try {
    const result = await models.mentors.findOne({
      where: { id: req.query.id },
    });
    if (result) {
      res.status(200).json({ status: 200, data: result });
    }
  } catch (e) {
    console.log("[-] Error in @route /getIndividualMentor method:get\n", e);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
});

// @author:Mamta - get single mentor detail by passing the mentor's id with bookmark
router.get("/get-individual-mentor-book", auth, async (req, res) => {
  try {
    const result = await models.sequelize.query(
      `select m.*,bm.user_id as user from mentors as m left join bookmarkmentors as bm on bm.mentor_id = m.id and bm.user_id=${req.user.id} where m.id=${req.query.id}`,
      { types: QueryTypes.SELECT }
    );
    if (result) {
      result[0][0].bookmark = result[0][0].user ? true : false;
      res.status(200).json({ status: 200, data: result[0][0] });
    }
  } catch (e) {
    console.log("[-] Error in @route /getIndividualMentor method:get\n", e);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
});
// @author:Mamta - delete mentor detail by passing the mentor's id
router.delete("/deleteMentorDetail", auth, async (req, res) => {
  try {
    const deleted = await models.mentors.destroy({
      where: { id: req.query.id },
    });
    if (deleted) {
      const dir = `./src/assets/public/upload/mentor/${req.query.id}`;
      rimraf(
        dir,
        {
          recursive: true,
        },
        (err) => {
          console.log(err);
        }
      );
    }
    res.status(200).json({ status: 200 });
  } catch (error) {
    console.log("[-] Error in @route /deleteMentorDetail method:delete\n", e);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
});

// @author:Mamta - to upload institute logo and update its value
router.post(
  "/uploadMentorInstituteLogo",
  auth,
  upload.array("avatar"),
  (req, res) => {
    models.mentors
      .findOne({
        where: {
          id: req.body.id,
        },
      })
      .then((data) => {
        if (data) {
          const InstituteLogoArray = data.institute;
          req.files.forEach((e) => {
            InstituteLogoArray.forEach((LFile) => {
              if (e.originalname == LFile.uni_logo) {
                const minusPublic =
                  type == "DEV"
                    ? e.path.split("upload\\")
                    : e.path.split("upload/");
                const url = serverUrl + minusPublic[1];
                LFile.uni_logo = url;
              }
            });
          });

          models.mentors
            .update(
              {
                institute: InstituteLogoArray,
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
                const dir = `./src/assets/public/upload/mentor/${req.body.id}/logo`;
                data.institute.forEach((e) => {
                  actual.push(e.uni_logo);
                });

                delete_files_FormArray(actual, dir);

                res.json({ status: 200, message: "updated successfully..." });
              }
            });
        }
      })
      .catch((error) => {
        console.log(
          "[-] Error in @route /uploadMentorInstituteLogo method:post\n",
          error
        );
        res.status(500).json({ staus: false, message: "Somthing went wrong" });
      });
  }
);

// @author:Mamta - to upload testimnial photo and update its value
router.post(
  "/uploadMentorTestimonialImage",
  auth,
  upload.array("avatar"),
  async (req, res) => {
    try {
      const found = await models.mentors.findOne({
        where: { id: req.body.id },
      });
      if (found) {
        const testimonialImageArray = found.testimonial;
        req.files.forEach((e) => {
          testimonialImageArray.forEach((TData) => {
            if (e.originalname == TData.Photo) {
              const minusPublic =
                type == "DEV"
                  ? e.path.split("upload\\")
                  : e.path.split("upload/");
              const url = serverUrl + minusPublic[1];
              TData.Photo = url;
            }
          });
        });
        const updated = await models.mentors.update(
          { testimonial: testimonialImageArray },
          { where: { id: req.body.id } }
        );
        if (updated) {
          const actual = [];
          const dir = `./src/assets/public/upload/mentor/${req.body.id}/testimonial`;
          found.testimonial.forEach((e) => {
            actual.push(e.Photo);
          });

          delete_files_FormArray(actual, dir);

          res.json({ status: 200, message: "updated successfully..." });
        }
      }
    } catch (error) {
      console.log(
        "[-] Error in @route /uploadMentorTestimonialImage method:post\n",
        error
      );
      res.status(500).json({ staus: false, message: "Somthing went wrong" });
    }
  }
);

// to save mentor bookmark data
router.post("/bookmarkMentors", auth, async (req, res) => {
  try {
    const found = await models.bookmarkMentors.findOne({
      where: {
        user_id: req.user.id,
        mentor_id: req.body.mentor_id,
      },
    });
    if (found) {
      await found.destroy({});
      res
        .status(200)
        .json({ status: true, message: "bookmark updated successfully..." });
    } else {
      await models.bookmarkMentors.create({
        user_id: req.user.id,
        mentor_id: req.body.mentor_id,
      });
      res
        .status(200)
        .json({ status: true, message: "bookmark updated successfully..." });
    }
  } catch (error) {
    console.log("[-] Error in @route /bookmarkMentors method:post\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

router.get("/get-location", async (req, res) => {
  try {
    const data = await models.location.findAll({});
    res.status(200).json({ status: true, data: data });
  } catch (error) {
    console.log("[-] Error in @route /get-location method:get\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

// to enroll mentor
router.post("/enroll-mentor", auth, async (req, res) => {
  try {
    const data = req.body;
    data["enrolled_date"] = moment(
      new Date(functions.get_current_datetime())
    ).format("YYYY-MM-DD");
    data["user_id"] = req.user.id;
    const found = await models.enrolled_mentors.create(req.body);
    if (found) {
      const mentorData = await models.mentors.findOne({
        where: { id: req.body.mentor_id },
        attributes: ["email"],
      });
      const session_time = moment(req.body.session_time, ["HH:mm"]).format(
        "hh:mm A"
      );
      mentorNotification(
        req.user.firstName,
        req.body.session_date,
        session_time,
        mentorData.email
      );
      res.status(200).json({ status: true, message: "created successfully.." });
    }
  } catch (error) {
    console.log("[-] Error in @route /enroll-mentor method:post\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

//to check mentor is enrolled by the user or not
router.get("/check-enrolled-mentor", auth, async (req, res) => {
  try {
    const data = await models.enrolled_mentors.findOne({
      where: { mentor_id: req.query.mentor_id, user_id: req.user.id },
      attributes: [
        "confirmation",
        "session_link",
        "session_date",
        "session_time",
      ],
    });
    if (data) {
      res.status(200).json({ status: true, data: data, message: "Enrolled" });
    } else {
      res.status(200).json({ status: false, message: "Not Enrolled" });
    }
  } catch (error) {
    console.log(
      "[-] Error in @route /check-enrolled-mentor method:get\n",
      error
    );
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

//to get data of student applied for particular mentor
router.get("/applied-mentor-session", auth, async (req, res) => {
  try {
    const mentor_data = await models.sequelize.query(
      `select u.name,u.lastname,u.photo,em.* from enrolled_mentors as em INNER JOIN users as u on u.id=em.user_id where em.mentor_id=${req.query.mentor_id} ORDER BY em.createdAt DESC`,
      { types: QueryTypes.SELECT }
    );
    if (mentor_data) {
      res.status(200).json({ status: true, data: mentor_data[0] });
    }
  } catch (error) {
    console.log(
      "[-] Error in @route /applied-mentor-session method:get\n",
      error
    );
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

//to save confirmation about the session
router.post("/save-confirmation-mentor", auth, async (req, res) => {
  try {
    const found = await models.enrolled_mentors.findOne({
      where: { id: req.body.app_id },
    });
    if (found) {
      await found.update({ confirmation: req.body.confirm });
      res.status(200).json({ status: true, message: "cofirmation updated." });
    }
  } catch (error) {
    console.log(
      "[-] Error in @route /save-confirmation-mentor method:post\n",
      error
    );
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

//to save session link for student after confirmation
router.post("/save-session-link", auth, async (req, res) => {
  try {
    const found = await models.enrolled_mentors.findOne({
      where: { id: req.body.app_id },
    });
    if (found) {
      await found.update({ session_link: req.body.link });
      res.status(200).json({ status: true, message: "Updated Successfully" });
    }
  } catch (error) {
    console.log("[-] Error in @route /save-session-link method:post\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

router.get("/saved-mentor-list", auth, async (req, res) => {
  try {
    const savedMentor = await models.sequelize.query(
      `select m.id,m.name,m.image,m.degree from mentors as m INNER JOIN bookmarkmentors as bm on m.id=bm.mentor_id where bm.user_id=${req.user.id}`,
      { types: QueryTypes.SELECT }
    );
    const finalData = [];
    if (savedMentor[0]) {
      savedMentor[0].forEach((re) => {
        re.degree.forEach((ele) => {
          if (ele.show) {
            finalData.push({
              id: re.id,
              name: re.name,
              image: re.image,
              university_name: ele.university_name,
              college_name: ele.college_name,
              degree: ele.program,
              bookmark: true,
            });
          }
        });
      });
    }
    res.status(200).json({ status: true, data: finalData });
  } catch (error) {
    console.log("[-] Error in @route /saved-mentor-list method:get\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

router.get("/upcoming-mentor", auth, async (req, res) => {
  try {
    const currentDate = moment()
      .utcOffset("+05:30")
      .format("YYYY-MM-DD HH:mm:ss");
    const upcoming = await models.sequelize.query(
      `select m.id,m.name,m.image,m.degree,em.session_date,em.session_time,em.session_link from mentors as m INNER JOIN enrolled_mentors as em on m.id=em.mentor_id where em.user_id=${req.user.id}`,
      { types: QueryTypes.SELECT }
    );
    const finalData = [];
    upcoming[0].forEach((e) => {
      // let workdate = moment(moment(e.session_date + ' ' + e.session_time).utc()).utcOffset("+01:00").format("YYYY-MM-DD HH:mm:ss");
      let workdate = moment(e.session_date + " " + e.session_time).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      if (moment(currentDate).isBefore(workdate)) {
        e.degree.forEach((ele) => {
          if (ele.show) {
            finalData.push({
              id: e.id,
              name: e.name,
              image: e.image,
              university_name: ele.university_name,
              college_name: ele.college_name,
              degree: ele.program,
              session_link: e.session_link,
            });
          }
        });
      }
    });
    res.status(200).json({ status: true, data: finalData });
  } catch (error) {
    console.log("[-] Error in @route /upcoming-mentor method:get\n", error);
    res.status(500).json({ staus: false, message: "Somthing went wrong" });
  }
});

module.exports = router;
