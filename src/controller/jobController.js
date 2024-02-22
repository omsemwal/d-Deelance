const JobPost = require("../model/jobspostmodel");
const jobPost = require("../model/jobspostmodel");

const postjob=async (req, res) => {
  const {
    jobTitle,
    jobType,
    jobTiming,
    jobRequirements,
    salaryType,
    salaryMin,
    salaryMax,
    salaryRate,
    supplementalPay,
    benefits,
    language,
    hiringAmount,
    hiringUrgency,
  } = req.body;

  const jobPost = new JobPost({
    userId: req.userId, // from authenticate middleware
    jobTitle,
    jobType,
    jobTiming,
    jobRequirements,
    salaryType,
    salaryMin,
    salaryMax,
    salaryRate,
    supplementalPay,
    benefits,
    language,
    hiringAmount,
    hiringUrgency,
  });

  try {
    await jobPost.save();
    res
      .status(201)
      .json({ message: "Job posted successfully", jobId: jobPost._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating job post" });
  }
};

// Endpoint to get all job posts for a user
const  getJobUsingUserId= async (req, res) => {

  const { userId } = req.params;
  if (req.userId !== userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const jobPosts = await JobPost.find({ userId });
    res.json({ jobPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching job posts" });
  }
};

const getjobsjobId =async (req, res) => {
  try {
    const jobPost = await JobPost.findById(req.params.jobId).populate(
      "userId",
      "username email FullName"
    );
    if (!jobPost) {
      return res.status(404).send("Job not found");
    }
    res.json(jobPost);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};



const getJobs= async (req, res) => {
  const page = parseInt(req.query.page) || 1; // la pagina corrente, default 1
  const limit = parseInt(req.query.limit) || 10; // il numero di elementi per pagina, default 10

  try {
    const jobPosts = await JobPost.find({})
      .populate("userId", "FullName country")
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await JobPost.countDocuments(); // conta il totale dei documenti

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      jobPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching job posts" });
  }
};


module.exports={jobPost,getJobUsingUserId,getJobs, getjobsjobId}