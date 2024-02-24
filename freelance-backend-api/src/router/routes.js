const express = require("express");
const router = express.Router();
const { token, authenticate } = require("../middleware/mid");


const {
  register,
  login,
  avatar,
  profile,
  forgotpassword,
  resetPasswordtoken,
  updateUserProfile,
  userVisibility,
  userIncountry,
  UpdateUserIdskills,
  getUser,
  UpdateTiTleDescription,
  updatekind,
  getProfileUsinId,
  updateprofileUsingId,
  editprofile,
  emailverify,
} = require("../controller/userController");



const {
  createtask,
  gettaskById,
  gettasksUserByuserId,
  gettask,
} = require("../controller/taskController.js");

const {
  getBonuse,
  userUserIdClaimBonusByBonusId,
} = require("../controller/bonusController.js");


const {jobPost,getJobUsingUserId,getJobs,getjobsjobId}=require ("../controller/jobController.js")

const { upload } = require("../middleware/multer");

//========================user router==============================//

router.post("/set-profile", authenticate, profile); // Corrected route paths
router.post("/register", register);
router.post("/forgot-password", forgotpassword);
router.post("/login", login);
router.post("/user/avatar", authenticate, upload.single("avatar"), avatar); // Corrected route paths
router.post("/reset-password/:token", resetPasswordtoken);
router.get("/profile/:userId", updateUserProfile);
router.patch("/user/:userId/visibility", authenticate, userVisibility);
router.patch("/user/:userId/country", authenticate, userIncountry);
router.patch("/user/:userId/skills", authenticate, UpdateUserIdskills);
router.get("/user", authenticate, getUser);
router.patch("/profile", authenticate, UpdateTiTleDescription);
router.patch("/user/:userId/update-kind", authenticate, updatekind);
router.get("/get-profile/:userId", authenticate, getProfileUsinId);
router.put("/update-profile/:userId", authenticate, updateprofileUsingId);
router.patch("/edit-profile/:userId", authenticate, editprofile);
router.get("/email-verify", emailverify);

//===========================  task route ==========================//

router.post("/create-task", authenticate, createtask);
router.get("/task/:taskId", gettaskById);
router.get("/tasks/user/:userId", authenticate, gettasksUserByuserId);
router.get("/tasks", authenticate, gettask);

//=====================Bonous router===============================//

router.post(
  "/user/:userId/claim-bonus/:bonusId",authenticate,userUserIdClaimBonusByBonusId);
router.get("/bonuses", authenticate, getBonuse);


//====================job router====================//
router.post("/post-job", authenticate,jobPost);
router.get("/user/:userId/job-posts", authenticate,getJobUsingUserId);
router.get("/api/jobs", authenticate,getJobs);
router.get("/api/jobs/:jobId",getjobsjobId);

module.exports = router; // Exporting the router directly
