// Helper functions for
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import {
  User,
  TokensSession,
  EmailOptions,
  Session,
  ProviderUser,
} from "~~/iam/misc/types";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { H3Event, H3Error } from "h3";
import { getClientPlatform } from "../middleware";
import passwordGenerator from "generate-password";
import {
  emailWithNodemailerService,
  emailWithNodemailerSmtp,
  emailWithSendgrid,
} from "./email";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import queryString from "query-string";

/**
 * @desc Returns a random string of 32 characters in hexadecimal
 * @info Can be used to create a secret
 */
export function makeRandomString32(): string {
  return crypto.randomBytes(32).toString("hex");
}

const config = useRuntimeConfig();
const prisma = new PrismaClient();

/**
 * @desc Hashes a password or any string using Argon 2
 * @param password Unhashed password
 */
export async function hashPassword(
  password: string
): Promise<string | H3Error> {
  try {
    return await argon2.hash(password);
  } catch (err) {
    return createError({ statusCode: 500, statusMessage: "Password error" });
  }
}

/**
 * @desc Makes a uuid
 */
export function makeUuid(): string {
  return uuidv4();
}

/**
 * @desc Suite of checks to validate user before registration
 * @param event Event from Api
 * @info returns NuxtError HTTP status code if comething is wrong
 */
export async function validateUserRegistration(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);

  // Check if body contains first_name, last_name, email, and password
  const bodyError = await validateRegisterBody(event);
  if (bodyError) {
    return createError({ statusCode: 400, statusMessage: bodyError });
  }

  // Check email is in a valid format
  if (!validateEmail(body.email)) {
    return createError({ statusCode: 400, statusMessage: "Bad email format" });
  }

  // If a user with that email already exists, return error
  const user = await getUserByEmail(body.email);
  if (user)
    return createError({
      statusCode: 409,
      statusMessage: "Email already exists",
    });

  // Check password meets minimum strength requirements
  if (!validatePassword(body.password)) {
    return createError({
      statusCode: 400,
      statusMessage: `Poor password strength. Password must contain at least 8 characters, an upper-case letter, and a lower-case letter, 
        a number, and a non-alphanumeric character.`,
    });
  }
}

/**
 * @desc Suite of checks to validate data before updating user
 * @param event Event from Api
 * @info Expects fromRoute object in event.context.params
 */
export async function validateUserUpdate(
  event: H3Event
): Promise<H3Error | void> {
  const { fromRoute } = event.context.params;
  const body = await readBody(event);

  // If no uuid given
  if (!fromRoute.uuid)
    return createError({
      statusCode: 400,
      statusMessage: "Uuid not supplied",
    });

  // If uuid exists, but user does not exist
  if (!(await userExists(fromRoute.uuid)))
    return createError({
      statusCode: 400,
      statusMessage: "User not found",
    });

  // If no updatable properties supplied
  if (
    "first_name" in body === false &&
    "last_name" in body === false &&
    "role" in body === false &&
    "permissions" in body === false
  )
    return createError({
      statusCode: 400,
      statusMessage: "No updatable properties supplied",
    });

  // If first_name empty
  if ("first_name" in body && !body.first_name)
    return createError({
      statusCode: 400,
      statusMessage: "first_name must have data",
    });

  // If last_name empty
  if ("last_name" in body && !body.last_name)
    return createError({
      statusCode: 400,
      statusMessage: "last_name must have data",
    });

  // If role empty
  if ("role" in body && !body.role)
    return createError({
      statusCode: 400,
      statusMessage: "role must have data",
    });
}

/**
 * @desc Suite of checks to validate data before updating user profile
 * @param event Event from Api
 */
export async function validateUserProfileUpdate(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);

  // If uuid not provided
  if (!body.uuid)
    return createError({
      statusCode: 400,
      statusMessage: "User uuid not provided",
    });

  // If nothing supplied can be updated
  if (
    "first_name" in body === false &&
    "last_name" in body === false &&
    "current_password" in body === false &&
    "new_password" in body === false
  )
    return createError({
      statusCode: 400,
      statusMessage: "No updatable properties supplied",
    });

  const user = await getUserByUuid(body.uuid);
  // This error really shouldn't happen
  if (!user)
    return createError({
      statusCode: 400,
      statusMessage: "User not found",
    });

  // If first name is supplied, but has no value
  if ("first_name" in body === true && body.first_name.trim() === "")
    return createError({
      statusCode: 400,
      statusMessage: "first_name must have a value",
    });

  // If last name is supplied, but has no value
  if ("last_name" in body === true && body.last_name.trim() === "")
    return createError({
      statusCode: 400,
      statusMessage: "last_name must have a value",
    });

  // If either current password or new password is supplied, but not the other one
  if ("new_password" in body === true && "current_password" in body === false)
    return createError({
      statusCode: 400,
      statusMessage: "Both current_password and new_password must be supplied",
    });

  if ("new_password" in body === false && "current_password" in body === true)
    return createError({
      statusCode: 400,
      statusMessage: "Both current_password and new_password must be supplied",
    });

  // If supplied current password does not match password in database
  if ("current_password" in body)
    if (!(await verifyPassword(user.password, body.current_password)))
      return createError({
        statusCode: 400,
        statusMessage: "Wrong current password",
      });

  // If new password is supplied, but fails password strength policy
  if ("new_password" in body === true && !validatePassword(body.new_password))
    return createError({
      statusCode: 400,
      statusMessage: `Poor new password strength. Password must contain at least 8 characters, an upper-case letter, and a lower-case letter, 
      a number, and a non-alphanumeric character.`,
    });
}

/**
 * @desc Suite of checks to validate data before deleting user
 * @param event Event from Api
 * @info Expects fromRoute object in event.context.params
 */
export async function validateUserDelete(
  event: H3Event
): Promise<H3Error | void> {
  const { uuid } = event.context.params.fromRoute;
  if (!uuid)
    return createError({
      statusCode: 400,
      statusMessage: "Uuid not supplied",
    });

  // If uuid exists, but user does not exist
  if (!(await userExists(uuid)))
    return createError({
      statusCode: 400,
      statusMessage: "User not found",
    });
}

/**
 * @desc Suite of checks to validate data before logging user in
 * @param event Event from Api
 */
export async function validateUserLogin(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);

  // Check if body contains email, and password
  const bodyError = validateLoginBody(body);
  if (bodyError) {
    return createError({ statusCode: 400, statusMessage: bodyError });
  }

  // Check email is in a valid format
  if (!validateEmail(body.email)) {
    return createError({ statusCode: 400, statusMessage: "Bad email format" });
  }
}

/**
 * @desc Checks whether the body in register post request is in correct format
 * @param body Body object passed in register post request
 */
export async function validateRegisterBody(event: H3Event) {
  const body = await readBody(event);
  if ("first_name" in body === false || body.first_name.trim() == "") {
    return "'first_name' is required";
  }

  if ("last_name" in body === false || body.last_name.trim() == "") {
    return "'last_name' is required";
  }

  if ("email" in body === false) {
    return "'email' is required";
  }

  if ("password" in body === false) {
    return "'password' is required";
  }
}

/**
 * @desc Checks whether the body in login post request is in correct format
 * @param body Body object passed in login post request
 */
export function validateLoginBody(body: Object) {
  if ("email" in body === false) {
    return "'email' is required";
  }

  if ("password" in body === false) {
    return "'password' is required";
  }
}

/**
 * @desc Checks whether email is valid
 * @param email The email string
 */
export function validateEmail(email: string): boolean {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }

  return false;
}

/**
 * @desc Checks whether email already exists in database
 * @param email The email string
 */
export async function emailExists(email: string): Promise<boolean | H3Error> {
  if (!email) return false;
  let error = null;

  let user = undefined;
  await prisma.users
    .findFirst({
      where: {
        email: email,
      },
    })
    .then(async (result) => {
      user = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) {
    console.log("Email error when checking if email exists");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // if user does not exist, return false
  if (user === null) {
    console.log("User not found");
    return false;
  }

  // Otherwise user exists, return true
  return true;
}

/**
 * @desc Checks whether user exists in database using uuid
 * @param uuid User's uuid
 * @return { Promise<boolean> }
 */
export async function userExists(uuid: string): Promise<boolean> {
  if (!uuid) return false;

  let user = undefined;

  await prisma.users
    .findFirst({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      user = result;
    })
    .catch(async (e) => {
      console.error(e);
    });

  if (user === null) return false;

  return true;
}

/**
 * @desc Checks whether password matches a certain strength
 * @param password User's password
 * @return { <boolean> }
 */
export function validatePassword(password: string): boolean {
  // Has at least 8 characters
  if (password.length < 8) return false;

  // Has uppercase letters
  if (!/[A-Z]/.test(password)) return false;

  // Has lowercase letters
  if (!/[a-z]/.test(password)) return false;

  // Has numbers
  if (!/\d/.test(password)) return false;

  // Has non-alphanumeric characters
  if (!/\W/.test(password)) return false;

  return true;
}

/**
 * @desc Suite of checks to validate data before issuing refresh token
 * @param event Event from Api
 */
export async function getNewTokens(
  event: H3Event
): Promise<H3Error | TokensSession> {
  let refreshToken = null;

  // Get client platform
  const errorOrPlatform = getClientPlatform(event);
  if (errorOrPlatform instanceof H3Error) return errorOrPlatform;

  // If app, get token from header
  const platform = errorOrPlatform as string;
  if (platform === "app")
    // If browser, get token from cookies
    refreshToken = event.node.req.headers["iam-refresh-token"] as string;
  else if (["browser", "browser-dev"].includes(platform))
    refreshToken = getCookie(event, "iam-refresh-token") as string;

  // If no token, user is not authenticated
  if (!refreshToken) {
    console.log("Error: No refresh token provided");
    return createError({
      statusCode: 400,
      statusMessage: "No refresh token provided",
    });
  }

  // Get Bearer token
  const bearerToken = refreshToken.split(" ");

  // Check for word "Bearer"
  if (bearerToken[0] !== "Bearer") {
    console.log("Missing word 'Bearer' in token");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Check for token
  if (!bearerToken[1]) {
    console.log("Missing token");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Get user from token
  const errorOrUser = await verifyRefreshToken(bearerToken[1]);

  // Check if user was retrieved from token
  if (errorOrUser instanceof H3Error) {
    console.log("Failed to retrieve user from token");
    return createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const user = errorOrUser as User;

  // Check if user has email attribute
  if (!user.email)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // Check if user exists in the database
  const userInDb = await getUserByEmail(user.email);

  if (userInDb === null) {
    console.log("User not found in database");
    return createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  // Get new tokens
  const errorOrTokens = createNewTokensFromRefresh(bearerToken[1], event);
  if (errorOrTokens instanceof H3Error) return errorOrTokens;

  const tokens = (await errorOrTokens) as TokensSession;
  return tokens;
}

/**
 * @desc Returns user by email
 * @param email User's email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  let user = null;
  await prisma.users
    .findFirst({
      where: {
        email: email,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
    });

  return user;
}

/**
 * @desc Returns user by user's uuid
 * @param uuid User's uuid
 */
export async function getUserByUuid(uuid: string): Promise<User | null> {
  let user = null;
  await prisma.users
    .findFirst({
      where: {
        uuid: uuid,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
    });

  return user;
}

/**
 * @desc Returns user by user id
 * @param id User's id
 */
export async function getUserById(id: number): Promise<User | null> {
  let user = null;
  await prisma.users
    .findFirst({
      where: {
        id: id,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
    });

  return user;
}

/**
 * @desc Updates user's last login value
 * @param email User's email
 */
async function updateLastLogin(email: string): Promise<null | User> {
  let result = null;
  await prisma.users
    .update({
      where: {
        email: email,
      },
      data: {
        last_login: new Date(),
      },
    })
    .then(async (response) => {
      result = response;
    })
    .catch(async (e) => {
      console.error(e);
    });

  return result;
}

/**
 * @desc Updates user's email verified to true
 * @param email User's email
 */
export async function updateEmailVerifiedTrue(
  email: string
): Promise<H3Error | void> {
  let error = null;

  if (!email) {
    console.log("Error no email provided to update email verified to true");
    return createError({ statusCode: 400, statusMessage: "No email provided" });
  }

  await prisma.users
    .update({
      where: {
        email: email,
      },
      data: {
        email_verified: true,
      },
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) {
    console.log("Error updating email verified to true");
    return createError({ statusCode: 500, statusMessage: "Password error" });
  }
}

/**
 * @desc Verifies password against a hash
 * @param hash Hashed password
 * @param password Unhashed password
 */
async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * @desc Verifies user after token is passed
 * @param token JSON web token
 */
export function verifyAccessToken(token: string): H3Error | JwtPayload {
  let error = null;
  let tokenExpiredError = null;
  let jwtUser = null;

  jwt.verify(token, config.iamAccessTokenSecret, (err, user) => {
    if (err) {
      console.log(err);

      // If access token expired, return for attempt to reauthenticate
      if (err instanceof jwt.TokenExpiredError) {
        console.log("Expired access token");
        console.log("Attempt reauthentication");
        tokenExpiredError = err;
      }

      // If not, just return the error
      error = createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    } else {
      jwtUser = user as JwtPayload;
    }
  });

  // Check token expiration error first
  if (tokenExpiredError) return tokenExpiredError;

  // If other error, return error
  if (error)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // If token was valid and we got back a user, return the user
  if (jwtUser) return jwtUser;

  // Otherwise return the error
  return createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
}

/**
 * @desc Verifies password reset token
 * @param token JSON web token
 */
export function verifyPasswordResetToken(token: string): H3Error | JwtPayload {
  let error = null;
  let tokenExpiredError = null;
  let jwtUser = null;

  jwt.verify(token, config.iamResetTokenSecret, (err, user) => {
    if (err) {
      console.log(err);

      // If reset token expired, return error
      if (err instanceof jwt.TokenExpiredError) {
        console.log("Expired password reset token");
        tokenExpiredError = err;
      }

      // If not, just return the error
      error = createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    } else {
      jwtUser = user as JwtPayload;
    }
  });

  // Check token expiration error first
  if (tokenExpiredError) return tokenExpiredError;

  // If other error, return error
  if (error)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // If token was valid and we got back a user, return the user
  if (jwtUser) return jwtUser;

  // Otherwise return the error
  return createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
}

/**
 * @desc Verifies email verification token
 * @param token JSON web token
 */
export function verifyEmailVerificationToken(
  token: string
): H3Error | JwtPayload {
  let error = null;
  let tokenExpiredError = null;
  let jwtUser = null;

  jwt.verify(token, config.iamVerifyTokenSecret, (err, user) => {
    if (err) {
      console.log(err);

      // If email verification token expired, return error
      if (err instanceof jwt.TokenExpiredError) {
        console.log("Expired email verification token");
        tokenExpiredError = err;
      }

      // If not, just return the error
      error = createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    } else {
      jwtUser = user as JwtPayload;
    }
  });

  // Check token expiration error first
  if (tokenExpiredError) return tokenExpiredError;

  // If other error, return error
  if (error)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // If token was valid and we got back a user, return the user
  if (jwtUser) return jwtUser;

  // Otherwise return the error
  return createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
}

/**
 * @desc Creates new tokens given a valid refresh token
 * @param token JSON web token
 */
export async function createNewTokensFromRefresh(
  token: string,
  event: H3Event
): Promise<TokensSession | H3Error> {
  const errorOrUser = await verifyRefreshToken(token);
  if (errorOrUser instanceof H3Error) return errorOrUser;

  const user = errorOrUser as User;

  const publicUser = {
    uuid: user?.uuid,
    email: user?.email,
  };

  if (user) {
    // Create access and refresh tokens
    const accessToken = jwt.sign(publicUser, config.iamAccessTokenSecret, {
      expiresIn: "15m",
    });

    const refreshTokenId = makeUuid();
    const refreshToken = jwt.sign(publicUser, config.iamRefreshTokenSecret, {
      expiresIn: "14d",
      issuer: "NuxtIam",
      jwtid: refreshTokenId,
    });

    // Deactivate current refresh token
    const deactivateTokenError = await deactivateRefreshTokens(user.id);
    if (deactivateTokenError) return deactivateTokenError;

    // Store tokens
    const storeTokenError = await _storeRefreshToken(refreshTokenId, user.id);
    if (storeTokenError) return storeTokenError;

    // Deactivate current session
    const deactivateSessionsError = await deactivateUserSessions(user.id);
    if (deactivateSessionsError instanceof H3Error)
      return deactivateSessionsError;

    // Create new user session
    const sessionOrError = await createUserSession(user.id, accessToken, event);

    // Get session and session id
    if (sessionOrError instanceof H3Error) return sessionOrError;
    const session = sessionOrError as Session;

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      sid: session.sid,
    };
  }

  console.log("Error creating tokens");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @desc Checks if refresh token is active
 * @param tokenId Token's id
 */
async function _refreshTokenActive(tokenId: string): Promise<H3Error | void> {
  let error = null;

  await prisma.refresh_tokens
    .findFirstOrThrow({
      where: {
        token_id: tokenId,
        is_active: true,
      },
    })
    .then(async () => {})
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  if (error)
    return createError({ statusCode: 500, statusMessage: "Server error" });
}

/**
 * @desc Verifies refresh token
 * @param token JSON web token
 */
export async function verifyRefreshToken(
  token: string
): Promise<H3Error | User> {
  let error = null;
  let verifiedUser = null;
  let verifiedTokenPayload = null as JwtPayload | null;

  jwt.verify(token, config.iamRefreshTokenSecret, async (err, token) => {
    if (err) {
      console.log(err);
      error = createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    // Get verified token
    verifiedTokenPayload = token as JwtPayload;
  });

  if (error) return error;

  if (verifiedTokenPayload) {
    // Checks for token issuer
    if (verifiedTokenPayload.iss !== "NuxtIam") {
      console.log("Token issuer unknown");
      return createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    // Get token id
    const tokenId = verifiedTokenPayload.jti;

    // Checks for token id
    if (!tokenId) {
      console.log("Token id not found");
      return createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    // Checks if refresh token is active
    const tokenNotActiveError = await _refreshTokenActive(tokenId);
    if (tokenNotActiveError) {
      console.log("Token not active");

      // This indicates a stolen token therefore deactivate all refresh tokens
      console.log("Detecting a stolen refresh token");
      const user = await getUserByEmail(verifiedTokenPayload.email);

      if (!user) {
        console.log("User not found from verified refresh token");
        console.log("This should not happen. Please check system integrity.");
        return createError({
          statusCode: 403,
          statusMessage: "Forbidden",
        });
      }

      // Deactivate all user's refresh tokens
      console.log(
        `Attempt to deactivate all user:${user.email}'s refresh tokens`
      );
      const deactivateError = await deactivateRefreshTokens(user.id);

      if (deactivateError) {
        console.log(
          `Deactivate all user:${user.email}'s refresh tokens failed`
        );
        console.log(
          `Should attempt to lock user's account if feature is available`
        );

        return deactivateError;
      }
      console.log(
        `All user:${user.email}'s refresh tokens deactivated. User must login`
      );
      return tokenNotActiveError;
    }

    // Try to get user by email
    const user = await getUserByEmail(verifiedTokenPayload.email);
    if (!user) {
      console.log("Failed to return user by email");
      return createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    verifiedUser = user;
  }

  if (verifiedUser) return verifiedUser;

  return createError({
    statusCode: 403,
    statusMessage: "Forbidden",
  });
}

/**
 * @desc Stores refresh token in database
 * @param tokenId Token's id
 * @param userId User's id
 */
async function _storeRefreshToken(
  tokenId: string,
  userId: number
): Promise<H3Error | void> {
  let error = null;
  await prisma.refresh_tokens
    .create({
      data: {
        token_id: tokenId,
        user_id: userId,
        is_active: true,
      },
    })
    .then(async () => {})
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  if (error)
    return createError({ statusCode: 500, statusMessage: "Server error" });
}

/**
 * @desc Deactivates a user's refresh tokens in database
 * @param userId User's id
 */
export async function deactivateRefreshTokens(
  userId: number
): Promise<H3Error | void> {
  let error = null;
  await prisma.refresh_tokens
    .updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_active: false,
      },
    })
    .then(async () => {})
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  if (error)
    return createError({ statusCode: 500, statusMessage: "Server error" });
}

/**
 * @desc Authenticates user
 * @param event Event from Api
 */
export async function login(event: H3Event): Promise<H3Error | TokensSession> {
  const tokens = {} as TokensSession;
  const body = await readBody(event);

  if (!body)
    return createError({
      statusCode: 401,
      statusMessage: "No email or password provided",
    });

  const user = await getUserByEmail(body.email);

  if (user === null) {
    return createError({ statusCode: 401, statusMessage: "Invalid login" });
  }

  if (await verifyPassword(user.password, body.password)) {
    // Update last login time
    await updateLastLogin(user.email);

    const publicUser = {
      uuid: user.uuid,
      email: user.email,
    };

    // Create access token
    const accessToken = jwt.sign(publicUser, config.iamAccessTokenSecret, {
      expiresIn: "15m",
      issuer: "NuxtIam",
      jwtid: makeUuid(),
    });

    // Create refresh token
    const tokenId = makeUuid();
    const refreshToken = jwt.sign(publicUser, config.iamRefreshTokenSecret, {
      expiresIn: "14d",
      issuer: "NuxtIam",
      jwtid: tokenId,
    });

    // Deactivate any other tokens
    const deactivateTokenError = await deactivateRefreshTokens(user.id);
    if (deactivateTokenError) return deactivateTokenError;

    // Store tokens
    const storeTokenError = await _storeRefreshToken(tokenId, user.id);
    if (storeTokenError) return storeTokenError;

    // Assign tokens
    tokens.accessToken = accessToken;
    tokens.refreshToken = refreshToken;

    // Create user session, if error, return error
    const sessionOrTokenError = await createUserSession(
      user.id,
      accessToken,
      event
    );

    // If session error, return error
    if (sessionOrTokenError instanceof H3Error) {
      console.log("Trouble creating session");
      return createError({ statusCode: 500, statusMessage: "Server error" });
    }

    // Get session and session id
    const session = sessionOrTokenError as Session;
    tokens.sid = session.sid;

    return tokens;
  }

  return createError({ statusCode: 401, statusMessage: "Invalid login" });
}

/**
 * @desc Logs a user out
 * @param event Event from Api
 */
export async function logout(event: H3Event): Promise<H3Error | void> {
  let sessionOrError = {} as H3Error | Session;

  // Get session id and session
  const sessionId = getCookie(event, "iam-sid");
  if (sessionId) sessionOrError = await getUserSession(sessionId);

  // If error, log error but delete all cookies anyway
  if (sessionOrError instanceof H3Error) {
    console.log(
      "Error with logout. Sessions might not be disabled. Security risk."
    );
    console.log("Proceeding with removing all cookies");
    deleteCookie(event, "iam-access-token");
    deleteCookie(event, "iam-refresh-token");
    deleteCookie(event, "iam-sid");
  }
  // Otherwise deactivate refresh tokens and all other user's sessions
  else {
    const session = sessionOrError as Session;
    const userOrNull = await getUserById(session.user_id);

    console.log("Cookies and session id removed.");
    deleteCookie(event, "iam-access-token");
    deleteCookie(event, "iam-refresh-token");
    deleteCookie(event, "iam-sid");

    // If no user, log error, but delete all cookies anyway
    if (userOrNull === null) {
      console.log("Error with logout. User not found");      
    } else {
      // Otherwise get user
      const user = userOrNull as User;
      // Deactivate all refresh tokens
      const deactivateError = await deactivateRefreshTokens(user.id);
      if (deactivateError) {
        console.log(`Failed to deactivate user:${user.email}'s refresh tokens`);
        return createError({
          statusCode: 500,
          statusMessage: "Logout error.",
        });
      }

      // Deactivate user sessions
      const deactivateSessionsError = await deactivateUserSessions(user.id);
      if (deactivateSessionsError instanceof H3Error)
        return deactivateSessionsError;

      // End user session
      let endUserSessionOrError = {} as H3Error | Session;
      if (sessionId) endUserSessionOrError = await endUserSession(sessionId);

      // If error, log error
      if (endUserSessionOrError instanceof H3Error) {
        console.log("Error ending user session in logout. Security risk");
      }
    }
  }
}

/**
 * @desc Update user profile
 * @param event H3Event
 */
export async function updateUserProfile(
  event: H3Event
): Promise<User | H3Error> {
  const errorOrVoid = await validateUserProfileUpdate(event);
  if (errorOrVoid instanceof H3Error) return errorOrVoid;

  // After going through validateUserProfileUpdate, supplied values should be clean
  const body = await readBody(event);

  // Properties that user can update in their profile
  let user = {} as User;
  let error = null;

  // Get current user data
  const userDataOrError = await getUserByUuid(body.uuid);
  if (userDataOrError instanceof H3Error) return userDataOrError;
  const userData = userDataOrError as User;

  // Attempt to hash new password, if error, return error
  let newHashedPassword = "";
  if ("new_password" in body === true && "current_password" in body === true) {
    const newHashedPasswordOrError = await hashPassword(body.new_password);
    if (newHashedPasswordOrError instanceof H3Error)
      return newHashedPasswordOrError;
    newHashedPassword = newHashedPasswordOrError as string;
  }

  await prisma.users
    .update({
      where: {
        uuid: body.uuid,
      },
      data: {
        first_name: body.first_name ? body.first_name : userData.first_name,
        last_name: body.last_name ? body.last_name : userData.last_name,
        // If we got a new password, update it, otherwise keep old password
        password:
          newHashedPassword.length > 0 ? newHashedPassword : userData.password,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) return error;

  return user;
}

/**
 * @desc Send email to reset user password
 * @param user User's profile
 * @param token Reset token
 */
export async function sendResetEmail(
  user: User,
  token: string
): Promise<H3Error | true> {
  const emailers = ["nodemailer-service", "nodemailer-smtp", "sendgrid"];
  console.log("Preparing to send reset email");

  // Get emailer and url
  const emailer = config.iamEmailer;
  console.log('Using: ',emailer)
  const url = config.iamPublicUrl;

  // nodemailer-service
  const service = config.iamNodemailerService;
  const serviceSender = config.iamNodemailerServiceSender;
  const servicePassword = config.iamNodemailerServicePassword;

  // nodemailer-smtp
  const smtpHost = config.iamNodemailerSmtpHost;
  const smtpPort = config.iamNodemailerSmtpPort;
  const smtpSender = config.iamNodemailerSmtpSender;
  const smtpPassword = config.iamNodemailerSmtpPassword;

  // Check if emailer is valid
  if (!emailers.includes(emailer)) {
    console.log(
      `Error: Emailer: ${emailer} is an unknown emailer. Aborting send.`
    );
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Common email options
  const options = {
    to: user.email,
    subject: "Nuxt IAM reset password link",
    text: `
    Hello ${user.first_name},
    You requested to reset your password. Please follow the link below. If you did not request to reset your password, 
    disregard this email. Your last login time was: ${user.last_login}.
      
    This is a one-time password link that will reveal a temporary password.
  
    Password reset link: ${url}/iam/verify?token=${token}
    `,
    html: `
    <p>Hello ${user.first_name}</p>,
    <p>You requested to reset your password. Please follow the link below. If you did not request to reset your password, 
    disregard this email. Your last login time was: ${user.last_login}.</p>
    <p>This is a one-time password link that will reveal a temporary password.</p>
    <p>Password reset link: ${url}/iam/verify?token=${token}</p>`,
  } as EmailOptions;

  // Sending with nodemailer-service
  if (emailer === "nodemailer-service") {
    //Options to do with nodemailer-service
    const serviceOptions = options;
    serviceOptions.from = serviceSender;

    // Attempt to send
    const errorOrSent = await emailWithNodemailerService(
      serviceSender,
      servicePassword,
      service,
      serviceOptions
    );

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Sending with nodemailer-smtp
  if (emailer === "nodemailer-smtp") {
    //Options to do with nodemailer-smtp
    const smtpOptions = options;
    smtpOptions.from = smtpSender;

    // Attempt to send email
    const errorOrSent = await emailWithNodemailerSmtp(
      smtpSender,
      smtpPassword,
      smtpHost,
      smtpPort,
      smtpOptions
    );

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Sending with Sendgrid
  if (emailer === "sendgrid") {
    const sendgridOptions = options;
    sendgridOptions.from = config.iamSendgridSender;
    const errorOrSent = await emailWithSendgrid(options);

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Otherwise return error
  console.log("We should not get here");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @desc Send email to verify user's email
 * @param user User's profile
 * @param token Verify token
 */
export async function sendVerifyEmail(
  user: User,
  token: string
): Promise<H3Error | true> {
  const emailers = ["nodemailer-service", "nodemailer-smtp", "sendgrid"];
  console.log("Preparing to send verification email");

  // Get emailer and url
  const emailer = config.iamEmailer;
  const url = config.iamPublicUrl;

  // nodemailer-service
  const service = config.iamNodemailerService;
  const serviceSender = config.iamNodemailerServiceSender;
  const servicePassword = config.iamNodemailerServicePassword;

  // nodemailer-smtp
  const smtpHost = config.iamNodemailerSmtpHost;
  const smtpPort = config.iamNodemailerSmtpPort;
  const smtpSender = config.iamNodemailerSmtpSender;
  const smtpPassword = config.iamNodemailerSmtpPassword;

  // Check if emailer is valid
  if (!emailers.includes(emailer)) {
    console.log(
      `Error: Emailer: ${emailer} is an unknown emailer. Aborting send.`
    );
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Common email options
  const options = {
    to: user.email,
    subject: "Nuxt IAM please verify your email",
    text: `
    Hello ${user.first_name},
    You recently created an account at ${url} on ${user.created_at}. Please verify your email to continue with your account. Please follow the link below to verify your email. 
      
    Follow the link to verify your email: ${url}/iam/verifyemail?token=${token}
    `,
    html: `
    <p>Hello ${user.first_name}</p>,
    <p>You recently created an account at ${url} on ${user.created_at}. Please verify your email to continue with your account. Please follow the link below to verify your email.</p> 
      
    <p>Follow the link to verify your email: ${url}/iam/verifyemail?token=${token}</p>`,
  } as EmailOptions;

  // Sending with nodemailer-service
  if (emailer === "nodemailer-service") {
    //Options to do with nodemailer-service
    const serviceOptions = options;
    serviceOptions.from = serviceSender;

    // Attempt to send
    const errorOrSent = await emailWithNodemailerService(
      serviceSender,
      servicePassword,
      service,
      serviceOptions
    );

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Sending with nodemailer-smtp
  if (emailer === "nodemailer-smtp") {
    //Options to do with nodemailer-smtp
    const smtpOptions = options;
    smtpOptions.from = smtpSender;

    // Attempt to send email
    const errorOrSent = await emailWithNodemailerSmtp(
      smtpSender,
      smtpPassword,
      smtpHost,
      smtpPort,
      smtpOptions
    );

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Sending with Sendgrid
  if (emailer === "sendgrid") {
    const sendgridOptions = options;
    sendgridOptions.from = config.iamSendgridSender;
    const errorOrSent = await emailWithSendgrid(options);

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Otherwise return error
  console.log("We should not get here");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Generates a new password for user given user's uuid
 * @param uuid User's uuid
 * @returns {Promise<H3Error|string>} Returns generated password or error
 */
export async function generateNewPassword(
  uuid: string
): Promise<H3Error | string> {
  let error = null;

  // Generate secure password consistent with password policy
  const password = passwordGenerator.generate({
    length: 20,
    numbers: true,
    symbols: true,
    strict: true,
  });

  // Check if password passes password policy
  const isValidPassword = validatePassword(password);
  if (!isValidPassword) {
    console.log("Failed to generate valid password");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Hash password
  const errorOrHashedPassword = await hashPassword(password);
  if (errorOrHashedPassword instanceof H3Error) {
    console.log("Error hashing password");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  const hashedPassword = errorOrHashedPassword as string;

  // Update database
  await prisma.users
    .update({
      where: {
        uuid: uuid,
      },
      data: {
        password: hashedPassword,
      },
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error updating user password");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  console.log("Updated user password");
  return password;
}

/**
 * @Desc Attempts to add one time token to table, if successful returns the same token id
 * @param tokenId Token's uuid
 * @param expiresAt Date and time when token expires
 * @returns {Promise<H3Error|string>} Returns error or the given uuid
 */
export async function addOneTimeToken(
  tokenId: string,
  expiresAt: Date
): Promise<H3Error | string> {
  let error = null;

  // Update database
  await prisma.one_time_tokens
    .create({
      data: {
        token_id: tokenId,
        expires_at: expiresAt,
      },
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error adding one time token");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  console.log("One time token added successfully");
  return tokenId;
}

/**
 * @desc Returns JWT payload if token is valid, otherwise returns an error
 * @param token JSON web token
 * @param type Assigned token types
 */
export function getTokenPayload(
  token: string,
  type: "access" | "refresh" | "reset"
): H3Error | JwtPayload {
  let error = null;
  const tokenTypes = ["access", "refresh", "reset"];
  let tokenSecret = "";
  let tempPayload = null;
  let payload = null;

  // If incorrect token type, return error
  if (!tokenTypes.includes(type)) {
    console.log("Invalid token type");
    return (error = createError({
      statusCode: 500,
      statusMessage: "Serve error",
    }));
  }

  // Check token type
  switch (type) {
    case "access":
      tokenSecret = config.iamAccessTokenSecret;
      break;
    case "refresh":
      tokenSecret = config.iamRefreshTokenSecret;
      break;
    case "reset":
      tokenSecret = config.iamResetTokenSecret;
      break;
  }

  // Get token payload
  jwt.verify(token, tokenSecret, (err, jwtPayload) => {
    if (err) {
      console.log(err);

      // If not, just return the error
      error = createError({
        statusCode: 500,
        statusMessage: "Server error",
      });
    } else {
      tempPayload = jwtPayload;
    }
  });

  // Check for errors
  if (error) return error;

  // Otherwise return Jwt payload
  if (tempPayload) {
    console.log("Jwt payload obtained successfully");
    payload = tempPayload as JwtPayload;
    return payload;
  }

  // Return error (to satisfy Typescript demannds)
  console.log("We should never reach here");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Create user session
 * @param user_id User id
 * @returns {Promise<H3Error|string>} Returns error or the given uuid
 */
export async function createUserSession(
  userId: number,
  accessToken: string,
  event: H3Event
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // If no user id provided
  if (!userId) {
    console.log("User id not provided for create session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If no access token provided
  if (!accessToken) {
    console.log("Access token not provided for create session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If event not provided
  if (!event) {
    console.log("Event not provided for create session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  const csrfToken = makeRandomString32();
  const ipAddress = getRequestHeader(event, "x-forwarded-for");

  // Create session
  await prisma.sessions
    .create({
      data: {
        user_id: userId,
        sid: makeUuid(),
        start_time: new Date(),
        access_token: accessToken,
        csrf_token: csrfToken,
        is_active: true,
        ip_address: ipAddress ? ipAddress : "unable to get IP address",
      },
    })
    .then(async (result) => {
      session = result as Session;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error creating user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log("We should not be getting this session error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Returns session given session id
 * @param sessionId Session id
 * @returns {Promise<H3Error|Session>} Returns error or the given uuid
 */
export async function getUserSession(
  sessionId: string
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // Create session
  await prisma.sessions
    .findUnique({
      where: {
        sid: sessionId,
      },
    })
    .then(async (result) => {
      session = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error retrieving user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log("We should not be getting this retrieve session error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Deactivates all of a user's sessions
 * @param userId User id
 * @returns {Promise<H3Error|Session>} Returns error or the given uuid
 */
export async function deactivateUserSessions(
  userId: number
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // Deactivate session
  await prisma.sessions
    .updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_active: false,
      },
    })
    .then(async (result) => {
      session = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error deactivating user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log("We should not be getting this deactivate user session error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Records end time of a user session
 * @param sessionId Session id
 * @returns {Promise<H3Error|Session>} Returns error or the given uuid
 */
export async function endUserSession(
  sessionId: string
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // Deactivate session
  await prisma.sessions
    .update({
      where: {
        sid: sessionId,
      },
      data: {
        end_time: new Date(),
      },
    })
    .then(async (result) => {
      session = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error ending user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log("We should not be getting this update user session error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @desc Checks for valid csrf (prevention) token
 * @param event H3 event
 */
export async function validateCsrfToken(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);
  const csrfToken = body.csrf_token;
  const sessionId = getCookie(event, "iam-sid");

  // If missing session id, should be part of validateCsrf() or validateSession() or validateTokenSession()
  if (!sessionId) {
    console.log("Missing session id cookie");
    return createError({
      statusCode: 403,
      statusMessage: "Invalid session",
    });
  }

  // If csrf token is missing should be part of validateCsrf() or validateSession() or validateTokenSession()
  if (!csrfToken) {
    console.log("Missing csrf token");
    return createError({
      statusCode: 403,
      statusMessage: "Missing csrf token",
    });
  }

  // Check if session and token are valid (check if a session with session)
  const sessionOrError = await validateCsrfSessionToken(sessionId, csrfToken);

  // If error, return error, otherwise session and csrftoken are good, we return nothing
  if (sessionOrError instanceof H3Error) return sessionOrError;
}

/**
 * @Desc Check if session and token are valid
 * @param sessionId User session id
 * @param csrfToken User's given csrf token
 * @returns {Promise<H3Error|Session>} Returns error or the given uuid
 */
export async function validateCsrfSessionToken(
  sessionId: string,
  csrfToken: string
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // Deactivate session
  await prisma.sessions
    .findFirst({
      where: {
        sid: sessionId,
        csrf_token: csrfToken,
        is_active: true,
      },
    })
    .then(async (result) => {
      session = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error validating user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log(
    "We should not be getting this validate csrf session token error"
  );
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Check if session and token are valid
 * @param payload Payload from Google access token
 * @returns {Promise<H3Error|User>} Returns error or the given uuid
 */
export async function createGoogleUser(
  payload: jwt.JwtPayload
): Promise<H3Error | User> {
  let error = null;
  let providerUser = {} as ProviderUser | null;
  let user = null;

  // Check if token is Google token (simple check)
  if (!payload.aud?.includes("googleusercontent")) {
    console.log("Error creating Google user: token not a Google token");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Check if payload subject exists
  if (!payload.sub) {
    console.log("Missing payload subject from Google token payload");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Check if Google user exists (payload.sub is unique Google user id)
  await prisma.provider_users
    .findFirst({
      where: {
        provider_user_id: payload.sub,
      },
    })
    .then(async (result) => {
      providerUser = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for error
  if (error) {
    console.log("Error checking if Google user exists");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If provider user exists, get user using user_id
  if (providerUser) {
    await prisma.users
      .findFirst({
        where: {
          id: providerUser.user_id,
        },
      })
      .then(async (result) => {
        user = result;
      })
      .catch(async (e) => {
        console.log("Provider user error");
        console.error(e);
        error = e;
      });
  }

  // Check for error
  if (error) {
    console.log("Error getting already created Google user");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If user exists, return user
  if (user) return user;

  // Generate secure password consistent with password policy
  const password = passwordGenerator.generate({
    length: 20,
    numbers: true,
    symbols: true,
    strict: true,
  });

  // Check if password passes password policy
  const isValidPassword = validatePassword(password);
  if (!isValidPassword) {
    console.log("Failed to generate valid password");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Hash password
  const errorOrHashedPassword = await hashPassword(password);
  if (errorOrHashedPassword instanceof H3Error) {
    console.log("Error hashing password");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  const hashedPassword = errorOrHashedPassword as string;

  // check if user exists
  user = await getUserByEmail(payload.email);

  // If no user, create user
  if (!user) {
    await prisma.users
      .create({
        data: {
          first_name: payload.given_name,
          last_name: payload.family_name,
          uuid: makeUuid(),
          avatar: payload.picture,
          email: payload.email,
          email_verified: true,
          password: hashedPassword,
        },
      })
      .then(async (response) => {
        user = response;
      })
      .catch(async (e) => {
        console.error(e);
        error = e;
      });

    // Check for error
    if (error) {
      console.log("Error creating user after Google login");
      return createError({
        statusCode: 500,
        statusMessage: "Server error",
      });
    }
  }

  // Get user
  let verifiedUser = {} as User;
  if (user) verifiedUser = user as User;

  // Create provider user
  if (user) {
    await prisma.provider_users
      .create({
        data: {
          provider: "GOOGLE",
          provider_user_id: payload.sub,
          user_id: verifiedUser.id,
        },
      })
      .then(async (result) => {
        providerUser = result;
      })
      .catch(async (e) => {
        console.log("Error creating provider user");
        console.error(e);
        error = e;
      });
  }

  if (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have the user, return the user
  if (verifiedUser) return verifiedUser;

  // Otherwise, return an error
  console.log("We should not be getting this create Google user error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Get tokens after Google login
 * @param user Get Google
 * @param event H3 Event
 * @returns {Promise<H3Error|User>} Returns error or the given uuid
 */
export async function getTokensAfterGoogleLogin(
  user: User,
  event: H3Event
): Promise<H3Error | TokensSession> {
  const tokens = {} as TokensSession;

  if (user === null) {
    return createError({
      statusCode: 401,
      statusMessage: "Invalid login. User not found.",
    });
  }

  // Update last login time
  await updateLastLogin(user.email);

  const publicUser = {
    uuid: user.uuid,
    email: user.email,
  };

  // Create access token
  const accessToken = jwt.sign(publicUser, config.iamAccessTokenSecret, {
    expiresIn: "15m",
    issuer: "NuxtIam",
    jwtid: makeUuid(),
  });

  // Create refresh token
  const tokenId = makeUuid();
  const refreshToken = jwt.sign(publicUser, config.iamRefreshTokenSecret, {
    expiresIn: "14d",
    issuer: "NuxtIam",
    jwtid: tokenId,
  });

  // Deactivate any other tokens
  const deactivateTokenError = await deactivateRefreshTokens(user.id);
  if (deactivateTokenError) return deactivateTokenError;

  // Store tokens
  const storeTokenError = await _storeRefreshToken(tokenId, user.id);
  if (storeTokenError) return storeTokenError;

  // Assign tokens
  tokens.accessToken = accessToken;
  tokens.refreshToken = refreshToken;

  // Create user session, if error, return error
  const sessionOrTokenError = await createUserSession(
    user.id,
    accessToken,
    event
  );

  // If session error, return error
  if (sessionOrTokenError instanceof H3Error) {
    console.log("Trouble creating session");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Get session and session id
  const session = sessionOrTokenError as Session;
  tokens.sid = session.sid;

  return tokens;
}

/**
 * @Desc Verifies Google access token after sign in
 * @param token Google access token
 * @info Code obtained from https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
 * @returns { H3Error|jwt.JwtPayload } Returns error or the given uuid
 */
export async function verifyGoogleToken(
  token: string
): Promise<H3Error | jwt.JwtPayload> {
  let tokenPayload = null;

  const clientId = useRuntimeConfig().iamGoogleClientId;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    tokenPayload = ticket.getPayload();

    // if (payload) tokenPayload = payload["sub"];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  await verify().catch(console.error);

  if (tokenPayload) return tokenPayload;
  else {
    console.log("Error verifying Google access token");
    return createError({ statusCode: 401, statusMessage: "Unauthoerized" });
  }
}

/**
 * @desc Gets query parameters from route e.g. ?a=1&b=2 etc
 * @param event H3 event
 */
export function getQueryParams(
  event: H3Event
): queryString.ParsedQuery<string> | null {
  let paramsString = null;
  let params = null;

  // Get url
  let url = event.node.req.url;

  // Get params string
  if (url) paramsString = url.substring(url.indexOf("?"));

  // Parse query params
  if (url && paramsString) params = queryString.parse(paramsString);

  return params;
}
