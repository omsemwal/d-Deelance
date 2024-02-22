  const Task= require("../model/taskModel")

 
const createtask=async (req, res) => {
    try {
      const task = new Task({ ...req.body, userId: req.userId });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  
  
  const gettaskById= async (req, res) => {
      try {
        const task = await Task.findById(req.params.taskId).populate('userId', 'username email FullName');
        if (!task) {
          return res.status(404).send('Task not found');
        }
        res.json(task);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
      }
    };
  
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


  
  const gettask=async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('userId', 'username email FullName');
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const gettasksUserByuserId=  async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID');
  }

  try {
      const tasks = await Task.find({ userId }).populate('userId', 'username email FullName');
      res.json(tasks);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
};




module.exports={createtask,gettaskById,gettasksUserByuserId,gettask}