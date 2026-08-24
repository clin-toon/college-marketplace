import { pool } from "../../db/pool";
import { AppError } from "../../utils/AppError";
import { generateOtp, hashPassword, validateEmail } from "./auth.helpers";
import { RegistrationInput } from "./auth.validation";
import { Resend } from "resend";

/*
This service is responsible for 
sending OTP code in the provided emails
*/

const sendOTPinEmail = async (email: string, otpCode: string) => {
  const resend = new Resend(process.env.API_KEY);

  const { data, error } = await resend.emails.send({
    from: "noreply@klintonthapa.com.np",
    to: email,
    subject: "OTP Verification",
    html: ` <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px 20px; color: #333;">
    
    <h2 style="margin-bottom: 20px; color: #111;">
      Verify your email
    </h2>

    <p style="font-size: 15px; line-height: 1.6;">
      Thank you for creating an account.
    </p>

    <p style="font-size: 15px; line-height: 1.6;">
      Please use the verification code below to activate your account:
    </p>

    <div style="
      background: #f5f5f5;
      padding: 18px;
      text-align: center;
      margin: 25px 0;
      border-radius: 8px;
    ">
      <span style="
        font-size: 30px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #111;
      ">
        ${otpCode}
      </span>
    </div>

    <p style="font-size: 14px; color: #666; line-height: 1.5;">
      This code will expire soon. Please do not share it with anyone.
    </p>

    <p style="font-size: 14px; color: #666; margin-top: 25px;">
      If you didn't create this account, you can safely ignore this email.
    </p>

    <p style="font-size: 14px; margin-top: 30px;">
      Thanks,<br>
      <strong>College Marketplace team</strong>
    </p>

  </div>`,
  });

  if (error) {
    console.error(error);
    throw new AppError("Failed to send OTP", 500);
  }

  return data;
};

/*
This service add otp details and user details
to database for later verifying the otp details
and creating user profile and user accounts.
*/
export const addDetailsToDatabase = async (
  details: RegistrationInput,
  otpCode: string,
) => {
  const { fullName, email, phoneNumber, password, faculty, semester } = details;

  const hashedPassword = await hashPassword(password);

  try {
    await pool.query("BEGIN");

    // 1. Create user
    const userQuery = `
    INSERT INTO users (
      email,
      hashed_password,
      role
    )
    VALUES ($1, $2, $3)
    RETURNING user_id;
  `;

    const userRes = await pool.query(userQuery, [
      email,
      hashedPassword,
      "student",
    ]);

    const userId = userRes.rows[0].user_id;

    // 2. Create user profile
    const profileQuery = `
    INSERT INTO user_profile (
      user_id,
      full_name,
      profile_image_url,
      faculty,
      semester,
      phone
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

    const userProfileRes = await pool.query(profileQuery, [
      userId,
      fullName,
      "",
      faculty,
      semester,
      phoneNumber,
    ]);

    // 3. Create email verification OTP
    const otpQuery = `
    INSERT INTO email_verifications (
      email_id,
      otp,
      expires_at
    )
    VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
    RETURNING *;
  `;

    const otpRes = await pool.query(otpQuery, [email, otpCode]);
    await pool.query("COMMIT");

    return {
      user: userRes.rows[0],
      profile: userProfileRes.rows[0],
      verification: otpRes.rows[0],
    };
  } catch (error: any) {
    await pool.query("ROLLBACK");
    throw new AppError(error, 500);
  }
};

/*
The main service that registers
the account with sending otps 
and calling other services
*/

export const registerAccount = async (registerDetails: RegistrationInput) => {
  const { email } = registerDetails;

  // Validate email and check whether it contains .edu domain or not
  if (!validateEmail(email)) {
    throw new AppError(
      "Invalid email. Please use an email address with the 'oic.edu.np' domain.",
      400,
    );
  }

  const otp = generateOtp();
  await addDetailsToDatabase(registerDetails, otp);
  await sendOTPinEmail(email, otp); // sending otp to the end user
};

/*
This service is responsible for verifying the otp 
send to the user for verifying the authencity of the otp
*/

export const verifyEmailOTP = async (email: string, otp: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Find the latest OTP for this email
    const otpQuery = `
      SELECT
        email_verification_id,
        otp,
        expires_at
      FROM email_verifications
      WHERE email_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    const otpResult = await client.query(otpQuery, [email]);

    // No OTP found
    if (otpResult.rows.length === 0) {
      throw new AppError(
        "No verification OTP found. Please request a new OTP.",
        404,
      );
    }

    const verification = otpResult.rows[0];

    // OTP expired
    if (new Date(verification.expires_at) < new Date()) {
      throw new AppError("The OTP has expired. Please request a new OTP.", 400);
    }

    // OTP doesn't match
    if (verification.otp !== otp) {
      throw new AppError("Invalid OTP. Please enter the correct OTP.", 400);
    }

    // Update user verification status
    const updateUserQuery = `
      UPDATE users
      SET
        is_verified = TRUE,
        updated_at = CURRENT_TIMESTAMP
      WHERE email = $1
      RETURNING user_id, email, is_verified;
    `;

    const userResult = await client.query(updateUserQuery, [email]);

    if (userResult.rows.length === 0) {
      throw new AppError("User associated with this email was not found.", 404);
    }

    const deleteOTPQuery = `
      DELETE FROM email_verifications
      WHERE email_verification_id = $1;
    `;

    await client.query(deleteOTPQuery, [verification.email_verification_id]);

    await client.query("COMMIT");

    return {
      message: "Email verified successfully.",
      user: userResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
