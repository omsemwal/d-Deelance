const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Transport = require("nodemailer-brevo-transport");
const nodemailer = require("nodemailer");

const axios = require('axios');

const BrevoTransport = require('nodemailer-brevo-transport');

const { token, authenticate,getUserFromToken  } = require("../middleware/mid");
// const sendEmail = require('../utils/sendEmail');

// Function to validate email format
function validateEmail(email) {
  // Regular expression for email validation
  const emailRegex = /^[a-z0-9_]{1,}@[a-z]{3,10}[.]{1}[a-z]{3}$/;
  return emailRegex.test(email);
}

// Function to validate username format
function validateUsername(username) {
  // Regular expression for username validation (alphanumeric)
  const usernameRegex = /^[A-Za-z0-9]+$/;
  return usernameRegex.test(username);
}

// Function to validate full name format
function validateFullName(fullName) {
  // Regular expression for full name validation (alphabets and spaces)
  const fullNameRegex = /^[A-Za-z\s]+$/;
  return fullNameRegex.test(fullName);
}

//=========================signup==========================================//




async function sendPasswordResetEmail(to, resetLink) {
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>Reset Password - Deelance</title>
      <style>
        .hover-bg-primary-light:hover {
          background-color: #55f3de !important;
        }
        .hover-text-decoration-underline:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .sm-w-full {
            width: 100% !important;
          }
          .sm-py-8 {
            padding-top: 32px !important;
            padding-bottom: 32px !important;
          }
          .sm-px-6 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .sm-leading-8 {
            line-height: 32px !important;
          }
        }
      </style>
    </head>
    <body style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; width: 100%; background-color: #f8fafc; padding: 0">
      <div role="article" aria-roledescription="email" lang="en">
        <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="background-color: #f8fafc">
              <table class="sm-w-full" style="width: 600px" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="sm-py-8 sm-px-6" style="padding: 18px; background: #0A0A0B;">
                    <h1 style="border: 0; color: #ffffff; max-width: 55%; vertical-align: middle">Deelance</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-6">
                    <table style="width: 100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-px-6" style="border-radius: 4px; background-color: #fff; padding: 16px 28px 16px 28px; text-align: left; font-size: 14px; line-height: 24px; color: #334155; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)">
                          <p>Hello,</p>
                          <p>To reset your password, please click the button below:</p>
                          <div style="line-height: 100%; margin-bottom: 20px; text-align: center;">
                            <a href="${resetLink}" class="hover-bg-primary-light" style="text-decoration: none; display: inline-block; border-radius: 4px; background-color: #864DD2; padding-top: 14px; padding-bottom: 14px; padding-left: 16px; padding-right: 16px; text-align: center; font-size: 14px; font-weight: 600; color: #fff">Reset Password &rarr;</a>
                          </div>
                          <p>Cheers,</p>
                          <p>The Deelance Team</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 48px"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>`;

    const mailOptions = {
      from: 'noreply@deelance.com',
      to: to,
      subject: 'Reset Password - Deelance',
      html: emailHtml
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Email inviata con successo:', result);
    } catch (error) {
      console.error('Errore nell\'invio dell\'email:', error);
    }
}


//   const { token } = req.query;

//   // Check if token is provided and not empty
//   if (!token || typeof token !== 'string' || token.trim().length === 0) {
//       return res.status(400).json({ errors: [{ type: 'field', msg: 'Token is required', location: 'query' }] });
//   }

//   try {
//       // Find user by verification token
//       const user = await User.findOne({ verificationToken: token });
//       if (!user) {
//           return res.status(400).send('Invalid token');
//       }

//       // Update user verification status and remove verification token
//       user.verified = true;
//       user.verificationToken = undefined;
//       await user.save();

//       // If user has a referrer, update referrer's points
//       if (user.referrer) {
//           const referrer = await User.findById(user.referrer);
//           if (referrer) {
//               referrer.points += 100;
//               await referrer.save();
//           }
//       }

//       res.status(200).send('Email verified successfully');
//   } catch (error) {
//       console.log(error);
//       res.status(500).send('Server error');
//   }
// };
// Route handler for user registration
// const register = async (req, res) => {
//   try {
//     const { username, email, password, wallet, FullName, referrer } = req.body;

//     // Validate email
//     if (!validateEmail(email)) {
//       return res.status(400).send("Invalid email format");
//     }

//     // Validate username
//     if (!validateUsername(username)) {
//       return res.status(400).send("Invalid username format");
//     }

//     // Validate full name
//     if (!validateFullName(FullName)) {
//       return res.status(400).send("Invalid full name format");
//     }

//     // Check if email already exists
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).send("Email already exists");
//     }

//     // Check if username already exists
//     const existingUserName = await User.findOne({ username });
//     if (existingUserName) {
//       return res.status(400).send("Username already exists");
//     }

//     // Check if wallet address already exists and is not empty
//     if (wallet) {
//       const existingWallet = await User.findOne({ wallet });
//       if (existingWallet) {
//         return res.status(400).send("Wallet Address already exists");
//       }
//     }

//     // Find referrer user if provided
//     let referrerUser = null;
//     if (referrer) {
//       referrerUser = await User.findById(referrer);
//       if (!referrerUser) {
//         referrerUser = null;
//       }
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate verification token
//     const verificationToken = crypto.randomBytes(20).toString("hex");

//     // Create new user instance
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       wallet: wallet || "",
//       FullName,
//       verificationToken,
//       referrer: referrerUser ? referrerUser._id : null,
//     });

//     // Save the new user
//     let data = await newUser.save();

//     // Construct verification URL and email content
//     const verificationUrl = `https://app.deelance.com/email-verify?token=${verificationToken}`;
//     const emailHtml = `<p>Click here to verify your email: <a href="${verificationUrl}">Verify!</a></p>`;

//     // Send verification email
//     await sendEmail(email, username, verificationUrl);
//     console.log("Email sent successfully");

//     //  Respond with success message
//     res.status(201).send({ msg: "User registered successfully", DaTA: data });
//   } catch (error) {
//     // Handle errors
//     console.error("Failed to register user:", error);
//     res.status(500).send("Failed to register user");
//   }
// };

// // Route handler for user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!email || !validateEmail(email)) {
      return res.status(400).send("Invalid email format");
    }

    // Validate password length
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    // Check if user is verified
    // if (!user.verified) {
    //   return res.status(400).send("Please verify your email first");
    // }
    
    console.log("Access token secret:", process.env.ACCESS_TOKEN_SECRET);

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });


    // Respond with token
    res.json({ token });
  } catch (error) { 
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user fields
    user.username = req.body.username;
    user.title = req.body.title;
    user.description = req.body.description;
    user.skills = req.body.skills;
    user.education = req.body.education;
    user.otherDetails = req.body.otherDetails;

    // Check if experience array exists
    if (req.body.experience && req.body.experience.length > 0) {
      // Update experience fields
      req.body.experience.forEach((exp, index) => {
        // Check if user.experience[index] exists, otherwise create it
        if (!user.experience[index]) {
          user.experience[index] = {};
        }

        user.experience[index].title = exp.title;
        user.experience[index].companyName = exp.companyName;
        user.experience[index].location = exp.location;
        user.experience[index].locationType = exp.locationType;
        user.experience[index].employementType = exp.employementType;
        user.experience[index].currentlyWorkingHere = exp.currentlyWorkingHere;
        user.experience[index].startDate = exp.startDate;
        user.experience[index].startYear = exp.startYear;

        // Conditionally update endDate and endYear based on currentlyWorkingHere
        if (!exp.currentlyWorkingHere) {
          // Check if endYear and endDate are provided
          if (exp.endYear && exp.endDate) {
            user.experience[index].endDate = exp.endDate;
            user.experience[index].endYear = exp.endYear;
          } else {
            // If not provided, handle the error
            return res
              .status(400)
              .json({
                message:
                  "End date or end year is required for past experiences",
              });
          }
        } else {
          // If currentlyWorkingHere is true, remove endDate and endYear
          user.experience[index].endDate = undefined;
          user.experience[index].endYear = undefined;
        }
      });
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

const avatar = async (req, res) => {
  try {
    // Extract user ID from authenticated user
    const userId = req.user._id;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // The path of the avatar will always be based on the userId, so there's no need to update it in the DB
    const avatarUrl = `./uploads/${userId}.${req.file.filename
      .split(".")
      .pop()}`;
    res.status(200).json({ avatar: avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// const sanitizeUser = (user) => {
//     const sanitizedUser = { ...user.toObject() };
//     delete sanitizedUser.password;
//     return sanitizedUser;
// };


async function sendEmail(to, name, verifyLink) {
  const emailHtml = `
  <!DOCTYPE html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Welcome to Deelance</title>  
    <style>
      .hover-bg-primary-light:hover {
        background-color: #55f3de !important;
      }
      .hover-text-decoration-underline:hover {
        text-decoration: underline;
      }
      @media (max-width: 600px) {
        .sm-w-full {
          width: 100% !important;
        }
        .sm-py-8 {
          padding-top: 32px !important;
          padding-bottom: 32px !important;
        }
        .sm-px-6 {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }
        .sm-leading-8 {
          line-height: 32px !important;
        }
      }
    </style>
  </head>
  <body style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; width: 100%; background-color: #f8fafc; padding: 0">
    <div style="display: none">
    </div>
    <div role="article" aria-roledescription="email" aria-label="Confirm your email address" lang="en">    
      <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="background-color: #f8fafc">
            <table class="sm-w-full" style="width: 600px" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 18px; background: #0A0A0B;">
                  <h1 style="border: 0; color:#ffffff; max-width: 55%; vertical-align: middle">Deelance</h1>
                </td>
              </tr>
              <tr>
                <td align="center" class="sm-px-6">
                  <table style="width: 100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td class="sm-px-6" style="border-radius: 4px; background-color: #fff; padding: 16px 28px 16px 28px; text-align: left; font-size: 14px; line-height: 24px; color: #334155; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)">
                        <p>Hello!</p>
                        <p>Thanks for signing up for Deelance.</p>
                        <p>Please click the link below to verify your account:</p>
                        <div style="line-height: 100%; margin-bottom: 20px; text-align: center;">
                        <a href="${verifyLink}" style="background-color: #864DD2; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify email address</a>
                        </div>
                        <table style="width: 100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td>
                              <div>
                                <p style="margin-bottom:0;">Cheers,</p>
                                <p style="margin-top:0;">The Deelance Team</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 48px"></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: "noreply@deelance.com",
    to: to,
    subject: "Verify your Email! - Deelance",
    html: emailHtml,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email inviata con successo:", result);
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);
  }
}

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 154500,
// });

// app.use(limiter);

const forgotpassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  const resetUrl = `https://app.deelance.com/reset-password/${token}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  res.send("Password reset link sent!");
};

const resetPasswordtoken = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Token not valid");
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.send("Password successfly reset!");
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isPrivate) {
      const token = req.headers.authorization?.split(" ")[1];
      const userIdFromToken = getUserFromToken(token);

      if (!userIdFromToken || userIdFromToken !== user._id.toString()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    res.json({ user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const userVisibility = async (req, res) => {
  const { userId } = req.params;
  const { isPrivate } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    if (user._id.toString() !== req.userId) {
      console.log("Unauthorized");
      return res.status(401).send("Unauthorized");
    }

    user.isPrivate = isPrivate;
    await user.save();

    console.log("Profile visibility updated successfully");
    res.status(200).send("Profile visibility updated successfully");
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).send("Server error");
  }
};

const { getCode, getName } = require("country-list");

const userIncountry = async (req, res) => {
  const { userId } = req.params;
  const { country } = req.body;

  // Controlla se il paese fornito è valido
  /*     if (!getName(country)) {
        return res.status(400).send('Invalid country name');
    }
 */
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    if (user._id.toString() !== req.userId) {
      console.log("Unauthorized");
      return res.status(401).send("Unauthorized");
    }

    user.country = country;
    await user.save();

    console.log("Profile country updated successfully");
    res.status(200).send("Profile country updated successfully");
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).send("Server error");
  }
};

const UpdateUserIdskills = async (req, res) => {
  const { userId } = req.params;
  const { skills } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    user.skills = skills;
    await user.save();

    // Inviare una risposta JSON con i dati aggiornati
    res.status(200).json({ skills: user.skills });
  } catch (error) {
    console.log("Server error:", error);
    // Inviare una risposta JSON con il messaggio di errore
    res.status(500).json({ error: "Server error" });
  }
};



getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const sanitizedUser = sanitizeUser(user);
    res.json({ user: sanitizedUser });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const UpdateTiTleDescription = async (req, res) => {
  const { title, description } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.title = title;
    user.description = description;
    await user.save();

    res.json({ title: user.title, description: user.description });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }

}
const updatekind = async (req, res) => {
  const { userId } = req.params;
  const { kind } = req.body;
  console.log("Updating kind for user:", userId, "to:", kind);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user._id.toString() !== req.userId) {
      return res.status(401).send("Unauthorized");
    }

    user.kind = kind;
    await user.save();

    res.status(200).send("Kind updated successfully");
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

const getProfileUsinId = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId)
      .populate("bonuses")
      .populate("referrer")
      .populate("tasks")
      .populate({ path: "education", model: "Education" })
      .populate({ path: "experience", model: "Experience" })
      .populate({ path: "otherDetails", model: "OtherDetails" });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = {
      username: user.username,
      email: user.email,
      FullName: user.FullName,
      isPrivate: user.isPrivate,
      bonuses: user.bonuses,
      points: user.points,
      title: user.title,
      description: user.description,
      skills: user.skills,
      country: user.country,
      education: user.education,
      experience: user.experience,
      otherDetails: user.otherDetails,
      kind: user.kind,
    };

    res.json({ user: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateprofileUsingId= async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (req.userId !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      Object.assign(user, req.body);
      await user.save();

      res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).send('Server error');
  }
};

const editprofile=async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (req.userId !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      for (const [key, value] of Object.entries(req.body)) {
          if (user[key] && typeof value === 'object' && value !== null) {
              user[key] = { ...user[key].toObject(), ...value };
          } else {
              user[key] = value;
          }
      } await user.save();

      res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).send('Server error');
  }
};

// const isProfileComplete = (user) => {
//   const requiredFields = ['username', 'email', 'FullName', 'title', 'description', 'country', 'skills'];

//   return requiredFields.every(field => {
//     const fieldValue = user[field];
//     return fieldValue && (typeof fieldValue === 'string' ? fieldValue.trim() !== '' : true);
//   });
// };


const port = 4000;



const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', 
  port: 587, 
  secure: false, 
  auth: {
    user: 'deworkdev@gmail.com',
    pass: 'mckGvnswTr7KYO9t'
  }
});


const register = async (req, res) => {
  try {
    
    const { username, email, password, wallet, FullName, referrer } = req.body;

    
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

  
    const verificationToken = crypto.randomBytes(20).toString("hex");

    
    const verificationUrl = `http://localhost:${port}/email-verify?token=${verificationToken}`;

   
    const emailSent = await sendVerificationEmail(email, FullName, verificationUrl);

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      wallet,
      FullName,
      verificationToken,
      referrer
    });


    await newUser.save();

   
    res.status(201).json({ message: "User registered successfully", verificationUrl });
  } catch (error) {
   
    console.error("Failed to register user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

// Define the emailverify route handler
const emailverify = async (req, res) => {
  const { token } = req.query;
  try {
    
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).send('Invalid verification token');
    }

    user.verified = true;
    user.verificationToken = undefined; 
    await user.save();

   
    res.status(200).send('Email verified successfully');
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).send('Error verifying email');
  }
};

// Define function to send verification email
async function sendVerificationEmail(email, name, verifyLink) {
 
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
    </head>
    <body>
        <p>Hello ${name},</p>
        <p>Thanks for signing up for Deelance.</p>
        <p>Please click the link below to verify your account:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>Cheers,<br/>The Deelance Team</p>
    </body>
    </html>
    `;

  // Email data
  const emailData = {
    from: "deworkdev@gmail.com",
    to: email,
    subject: "Verify your Email! - Deelance",
    html: emailHtml,
  };

  try {
    console.log("Sending verification email with data:", emailData);
    // Send email using nodemailer transporter
    const response = await transporter.sendMail(emailData);
    console.log("Verification email sent successfully:", response);
    return true; // Return true if email sent successfully
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false; // Return false if email sending failed
  }
}


module.exports = {
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
  emailverify
};