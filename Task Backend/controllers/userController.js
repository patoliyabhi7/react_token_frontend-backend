const User = require('./../model/userModel')
const Task = require('./../model/taskModel')
const sendEmail = require('./../utils/email')
const appError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { response } = require('express')

// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         // expiresIn: process.env.JWT_EXPIRES_IN,
//         expiresIn: '10s',
//     });
// };
const signToken = (id, expiresIn) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const createSendToken = async (user, statusCode, res) => {
    // const token = signToken(user._id);
    const token = signToken(user._id, '7h');
    const refreshToken = signToken(user._id, '7d');

    // Store the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        secure: true,
        httpOnly: true,
    };

    res.cookie('jwt', token, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Use secure cookies in production
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        statusCode,
        refreshToken,
        response: {
            user,
        },
    });
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ statusMessage: "Refresh token not provided", statusCode: 401 });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('+refreshToken');

        // if (!user || user.refreshToken !== refreshToken) {
        //     return res.status(403).json({ statusMessage: "Invalid refresh token given", statusCode: 403 });
        // }
        if (!user) {
            return res.status(403).json({ statusMessage: "user: Invalid refresh token given", statusCode: 403 });
        }
        if (user.refreshToken !== refreshToken) {
            return res.status(403).json({ statusMessage: "refreshToken: Invalid refresh token given", statusCode: 403 });
        }

        // Generate a new access token
        const newAccessToken = signToken(user._id, '7h');
        const newRefreshToken = signToken(user._id, '7d');

        // Store the refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save();

        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            secure: true,
            httpOnly: true,
        };
        res.cookie('jwt', newAccessToken, cookieOptions);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            status: 'success',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.log('Error:', error);
        res.status(403).json({ error, statusMessage: "Invalid refresh token", statusCode: 403 });
    }
};

exports.verifyJWT = async (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ statusMessage: "User not logged in or Unauthorized request", statusCode: 401 });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id).select("-password");

        if (!user) {
            return res.status(404).json({ statusMessage: "User not found", statusCode: 404 });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ statusMessage: "Invalid access token", statusCode: 401 });
    }
};

exports.register = catchAsync(async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            gender: req.body.gender,
        })
        if (!newUser) {
            return res.status(400).json({
                message: 'Error while registering user',
                statusCode: 400
            })
        }
        createSendToken(newUser, 200, res);
        // res.status(200).json({
        //     statusMessage: 'Signup successful',
        //     statusCode: 200,
        //     response: {
        //         user: newUser
        //     }
        // })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'Failed',
            statusCode: 400,
            message: error.message
        })
    }
})

exports.login = catchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'Failed',
                statusCode: 400,
                MIDIMessageEvent: 'Please enter email and password'
            })
        }
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(400).json({
                status: 'Login failed',
                statusCode: 400,
                message: 'Incorrect email or password'
            })
        }

        createSendToken(user, 200, res);

    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            status: 'Failed',
            message: error.message
        })
    }
})

exports.getCurrentUser = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
})



// via link using token
// const resetURL = `${req.protocol}://${req.get('host')}/api/v1/employee/resetPassword/`

exports.forgotPassword = catchAsync(async (req, res, next) => {
    try {
        const { email } = req.body.email;
        if (!email) {
            return res.status(400).json({
                status: 'Failed',
                statusCode: 400,
                message: 'Please enter your email'
            })
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                statusCode: 404,
                message: 'No user found with this email'
            })
        }

        const passwordResetToken = signToken(user._id, '5m');
        user.passwordResetToken = passwordResetToken;
        await user.save();

        const resetURL = `http://localhost:5173/reset-password/${passwordResetToken}`;

        // const message = `Forgot your password? \n\nTo reset it, please visit the following link and follow the instructions to update your password: ${resetURL}.\n\nIf you did not request a password reset, please disregard this email.`;
        const message = `
        <p>Forgot your password?</p>
        <p>To reset it, please click the button below and follow the instructions to update your password:</p>
        <a href="${resetURL}" style="
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
        ">Reset Password</a>
        <p>If you did not request a password reset, please disregard this email.</p>
      `;
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 5 min)',
                html: message
            })
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Password reset link sent to your email'
            })
        } catch (error) {
            res.clearCookie('otp');
            res.status(400).json({
                statusCode: 400,
                status: 'Error while sending password reset link',
                message: error.message
            })

        }
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            status: 'Error while resetting password',
            message: error.message
        })
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    try {
        const passResetToken = req.params.token;
        const { password, confirmPassword } = req.body;
        const decoded = jwt.verify(passResetToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('+passwordResetToken');
        if (!user) {
            return res.status(400).json({
                status: 'Failed',
                statusCode: 400,
                message: 'User not found'
            });
        }
        if (user.passwordResetToken !== passResetToken) {
            return res.status(400).json({
                status: 'Failed',
                statusCode: 400,
                message: 'Token is invalid/expired'
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'Failed',
                statusCode: 400,
                message: 'Passwords do not match'
            });
        }
        user.password = password;
        user.confirmPassword = confirmPassword;
        user.passwordResetToken = undefined;
        await user.save();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Password reset successfull'
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'Failed',
                statusCode: 401,
                message: 'Token has expired'
            });
        }
        else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({
                status: 'Failed',
                statusCode: 400,
                message: 'Invalid token'
            });
        }
        res.status(400).json({
            status: 'Error',
            statusCode: 400,
            message: error.message
        });
    }
});


// via otp
// exports.forgotPassword = catchAsync(async (req, res, next) => {
//     try {
//         if (!req.body.email) {
//             return res.status(400).json({
//                 status: 'Failed',
//                 statusCode: 400,
//                 statusMessage: 'Please enter your email'
//             })
//         }
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(404).json({
//                 status: 'Failed',
//                 statusCode: 404,
//                 statusMessage: 'User not found with this email id'
//             })
//         }
//         const otp = Math.floor(1000 + Math.random() * 9000);
//         res.cookie("otp", { email: req.body.email, otp }, { maxAge: 300000 });


//         const message = `Reset your password OTP: ${otp} \n This OTP is valid for 5 minutes Only`;
//         try {
//             await sendEmail({
//                 email: user.email,
//                 subject: 'Password Reset OTP',
//                 message
//             })
//             res.status(200).json({
//                 status: 'Email sent successfully',
//                 statusCode: 200,
//                 statusMessage: 'Password reset OTP sent to your email'
//             })
//         } catch (error) {
//             res.clearCookie('otp');
//             res.status(400).json({
//                 statusCode: 400,
//                 status: 'Error while sending OTP',
//                 statusMessage: error.message
//             })

//         }
//     } catch (error) {
//         res.status(400).json({
//             statusCode: 400,
//             status: 'Error while resetting password',
//             statusMessage: error.message
//         })
//     }
// })

// exports.verifyOTP = catchAsync(async (req, res, next) => {
//     try {
//         const enteredOtp = req.body.otp;
//         const otpData = req.cookies.otp;

//         if (!otpData) {
//             return res.status(400).json({
//                 statusCode: 400,
//                 statusMessage: 'OTP expired or not found'
//             });
//         }

//         const { email, otp } = otpData; // otpData is already an object

//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(400).json({
//                 statusMessage: 'User not found with this email',
//                 statusCode: 400
//             });
//         }

//         if (!enteredOtp) {
//             return res.status(400).json({
//                 statusMessage: 'Please enter the OTP',
//                 statusCode: 400
//             });
//         }

//         if (otpData.email !== req.body.email) {
//             return res.status(400).json({
//                 statusMessage: 'Email does not match, unauthorized request',
//                 statusCode: 400
//             });
//         }

//         if (otp !== enteredOtp || email !== req.body.email) {
//             return res.status(400).json({
//                 statusMessage: 'OTP Incorrect or expired',
//                 statusCode: 400
//             });
//         }

//         user.password = req.body.password;
//         user.confirmPassword = req.body.confirmPassword;
//         await user.save();
//         res.clearCookie('otp');

//         createSendToken(user, 200, res);
//     } catch (error) {
//         res.status(400).json({
//             status: 'Error while verifying OTP',
//             statusCode: 400,
//             statusMessage: error.message
//         });
//     }
// });


exports.updatePassword = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(400).json({
                status: 'Failed',
                statusCode: 400,
                statusMessage: 'User not found or not logged in'
            });
        }
        const { currentPassword, password, confirmPassword } = req.body;
        if (!currentPassword || !password || !confirmPassword) {
            return res.status(400).json({
                statusMessage: 'Please enter current, new, and confirm password',
                statusCode: 400
            });
        }
        if (!(await user.correctPassword(currentPassword, user.password))) {
            return res.status(400).json({
                statusMessage: 'Current password is incorrect',
                statusCode: 400
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                statusMessage: 'New password and confirm password do not match',
                statusCode: 400
            });
        }
        user.password = password;
        await user.save();
        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({
            status: 'Error while updating password',
            statusMessage: error.message,
            statusCode: 400
        });
    }
});

exports.viewProfile = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        statusMessage: 'User profile fetched successfully',
        statusCode: 200,
        response: {
            user: req.user
        }
    });
});

exports.createTask = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(400).json({
            statusMessage: 'User not found or not logged in',
            statusCode: 400
        })
    }
    const { title, description, status, priority, deadline } = req.body;
    const newTask = await Task.create({
        title,
        description,
        status,
        priority,
        deadline,
        user_id: req.user._id
    });
    if (!newTask) {
        return res.status(400).json({
            statusMessage: 'Error while creating task',
            statusCode: 400
        });
    }

    res.status(200).json({
        statusMessage: 'Task created successfully',
        statusCode: 200,
        response: {
            task: newTask
        }
    });
});

exports.getCurrentUserTask = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(400).json({
            statusMessage: 'User not found or not logged in',
            statusCode: 400
        })
    }
    const tasks = await Task.find({ user_id: req.user.id });
    if (!tasks) {
        return res.status(400).json({
            statusMessage: 'No tasks found for this user'
        });
    }
    res.status(200).json({
        statusMessage: 'Tasks fetched successfully',
        statusCode: 200,
        response: {
            tasks
        }
    });
});

exports.getAllTasks = catchAsync(async (req, res, next) => {
    const tasks = await Task.find();
    if (!tasks) {
        return res.status(400).json({
            statusMessage: 'No tasks found',
            statusCode: 400
        });
    }
    res.status(200).json({
        statusMessage: 'Tasks fetched successfully',
        statusCode: 200,
        response: {
            tasks
        }
    });
});

exports.getTaskById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(400).json({
            statusMessage: 'User not found or not logged in',
            statusCode: 400
        })
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(400).json({
            statusMessage: 'Task not found',
            statusCode: 400
        });
    }
    if (task.user_id.toString() !== req.user.id) {
        return res.status(401).json({
            statusMessage: 'Unauthorized request!, You are not authorized to view this task.',
            statusCode: 401
        });
    }
    res.status(200).json({
        statusMessage: 'Task fetched successfully',
        statusCode: 200,
        response: {
            task
        }
    });
});

exports.updateTask = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(400).json({
            statusMessage: 'User not found or not logged in',
            statusCode: 400
        })
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(400).json({
            statusMessage: 'Task not found',
            statusCode: 400
        });
    }
    if (task.user_id.toString() !== req.user.id) {
        return res.status(401).json({
            statusMessage: 'Unauthorized request!, You are not authorized to update this task.',
            statusCode: 401
        });
    }
    const { title, description, status, priority, deadline } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
        title,
        description,
        status,
        priority,
        deadline
    }, {
        new: true,
        runValidators: true
    });
    if (!updatedTask) {
        return res.status(400).json({
            statusMessage: 'Error while updating task',
            statusCode: 400
        });
    }

    res.status(200).json({
        statusMessage: 'Task updated successfully',
        statusCode: 200,
        response: {
            task: updatedTask
        }
    });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(400).json({
            status: 'Failed',
            statusCode: 400,
            statusMessage: 'User not found or not logged in'
        })
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(400).json({
            statusMessage: 'Task not found',
            statusCode: 400
        });
    }
    if (task.user_id.toString() !== req.user.id) {
        return res.status(401).json({
            statusCode: 401,
            statusMessage: 'Unauthorized request!, You are not authorized to delete this task.'
        });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({
        statusMessage: 'Task deleted successfully',
        statusCode: 200
    });
});

