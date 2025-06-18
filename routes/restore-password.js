const express = require("express");//Import express
const router = express.Router(); //Created router instance and save it to variable
const {sendEmail} = require("../helpers/mailer/mailer");
const connection = require("../config/db");
const crypto = require("crypto");
const {body, validationResult} = require("express-validator");

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60 * 60 * 1000 * 24; //1 day
const TOKEN_EXPIRATION = 60 * 60 * 1000; // 1 hour

// Route for requesting password reset
router.get("/", (req, res) => {
    res.render("restore-password", {
        title: "Reset Your Password",
        layout: "layout",
        formId: "restore-password",
        formAction: "/restore-password",
        formMethod: "POST",
        formTitle: "Reset Password",
        formMessage: "Enter your email address and we will send you a link to reset your password.",
        formFieldsConfig: {
            showEmail: true,
            showFullName: false,
            showPhone: false,
            showAddress: false,
            showPassword: false,
            showConfirmPassword: false
        }
    });
});

let unlockDate = 0;
let failedAttempts = 0;

router.post("/", (req, res) => {
    const email = req.body.email.trim();
    const query = `SELECT * FROM customer WHERE email = ?`;

    if((unlockDate - Date.now()) > 0 && req.session.lockoutUntil !== null) {
        return res.status(400).json({
            message: `You can't restore password until ${unlockDate}`,
            unlockDate: unlockDate
        });
    } else {
        connection.query(query, [email], (err, results) => {
            if (err || results.length === 0) {
                if (failedAttempts < MAX_FAILED_ATTEMPTS) {
                    req.session.failedAttempts = (req.session.failedAttempts || 0) + 1;
                    failedAttempts = req.session.failedAttempts;
                    return res.status(400).json({
                        message: `We didn't find such email in our database, please check your email. Restore attempts left: ${MAX_FAILED_ATTEMPTS - req.session.failedAttempts}`,
                        invalidAttempts: req.session.failedAttempts,
                        unlockDate: unlockDate
                    });
                } else {
                    req.session.lockoutUntil = Date.now() + LOCKOUT_DURATION;
                    unlockDate = req.session.lockoutUntil;
                    console.log("ELSE LOCKOUT");
                    return res.status(400).json({
                        message: `You can't restore password until ${req.session.lockoutUntil}`,
                        unlockDate: unlockDate
                    });
                }
            } else {
                req.session.failedAttempts = 0;
                req.session.lockoutUntil = null;

                // Generate a reset token
                const token = crypto.randomBytes(32).toString('hex');
                const expires = Date.now() + TOKEN_EXPIRATION;

                // Save token to database
                const updateQuery = `UPDATE customer SET reset_token = ?, reset_token_expiration = ? WHERE email = ?`;
                connection.query(updateQuery, [token, expires, email], (err) => {
                    if (err) {
                        console.error("Error updating reset token:", err);
                        return res.status(500).json({
                            message: "Error generating reset token. Please try again later."
                        });
                    }

                    const resetLink = `${req.protocol}://${req.get('host')}/restore-password/reset?token=${token}`;

                    const emailSubject = "Reset Your Pizzy Password";
                    const emailMessage = `
                        <p>You requested to reset your password for your Pizzy account.</p>
                        <p>Please click the link below to reset your password:</p>
                        <p><a href="${resetLink}">Reset Password</a></p>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    `;

                    sendEmail(email, emailSubject, emailMessage).then(() => {
                        return res.status(200).json({
                            message: "We sent you a link to reset your password. Please check your email!",
                            redirect: "/"
                        });
                    }).catch(err => {
                        console.error("Error sending email:", err);
                        return res.status(500).json({
                            message: "Email service error, please try again later"
                        });
                    });
                });
            }
        });
    }
});

// Route for reset password form (with token)
router.get("/reset", (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.redirect("/restore-password?error=Invalid or missing token");
    }

    const query = `SELECT * FROM customer WHERE reset_token = ? AND customer.reset_token_expiration > ?`;
    connection.query(query, [token, Date.now()], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.redirect("/restore-password?error=Database error");
        }

        if (results.length === 0) {
            return res.redirect("/restore-password?error=Invalid or expired token");
        }

        res.render("reset-password", {
            title: "Set New Password",
            layout: "layout",
            formId: "reset-password-form",
            formAction: "/restore-password/reset",
            formMethod: "POST",
            formTitle: "Set New Password",
            formMessage: "Please enter your new password.",
            token: token,
            formFieldsConfig: {
                showEmail: false,
                showFullName: false,
                showPhone: false,
                showAddress: false,
                showPassword: true,
                showConfirmPassword: true
            },
            hiddenFields: [
                { name: "token", value: token }
            ]
        });
    });
});


router.post("/reset", [
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
    body("confirm-password").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password, token } = req.body;

    const query = `SELECT * FROM customer WHERE reset_token = ? AND reset_token_expiration > ?`;
    connection.query(query, [token, Date.now()], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Update password and clear token
        const updateQuery = `UPDATE customer SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ?`;
        connection.query(updateQuery, [password, token], (err) => {
            if (err) {
                console.error("Error updating password:", err);
                return res.status(500).json({ message: "Error updating password" });
            }

            return res.status(200).json({
                message: "Password updated successfully",
                redirect: "/login"
            });
        });
    });
});

module.exports = router;
