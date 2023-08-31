import Auth from "../models/auth.js";
import logger from "../helpers/logging.js";
import {
  validateUserFields,
  validateLoginFields,
  validateAdminRegistration,
} from "../utils/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const bcryptSalt = process.env.BCRYPT_SALT;

export async function createUser(req, res) {
  try {
    const { email, password } = req.body;

    const validationError = validateUserFields(email, password);
    if (validationError) {
      res.status(400).json(validationError);
      return; // Exit the function if there's a validation error
    }

    const userExists = await Auth.findOne({ email });
    if (userExists) {
      res.status(403).json({ message: "Forbiden. User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, Number(bcryptSalt));

    const user = await Auth.create({
      email,
      password: hashedPassword,
    });
    if (user) {
      res.status(201).json({
        _id: user.id,
        email: user.email,
        token: generateToken(user.id),
      });
      logger.info(`User - ${email} account created successfully`);
    }
  } catch (error) {
    logger.error("Error occurred when creating account: ", error);
    return res.status(400).json(error);
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const validationError = validateLoginFields(email, password);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }
    const user = await Auth.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    const token = generateToken(user._id);
    res.status(200).json({
      _id: user.id,
      email: user.email,
      token,
    });
    logger.info(`Successful login by ${user.email}`);
  } catch (error) {
    res.status(400).json({ message: "An error occurred." });
  }
}

export async function registerAdmin(req, res) {
  const { username, phoneNumber, email, password } = req.body;
  const validationError = validateAdminRegistration(
    phoneNumber,
    email,
    password
  );
  if (validationError) {
    res.status(400).json(validationError);
    return; // Exit the function if there's a validation error
  }
  try {
    const existingPhoneNumber = await Auth.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      res.status(403).json({ message: "Forbidden. Phone number already exists" });
      return;
    }
    const userExists = await Auth.findOne({ email });
    if (userExists) {
      res.status(403).json({ message: "Forbiden. User already exists" });
    }
  
    const hashedPassword = await bcrypt.hash(password, Number(bcryptSalt));

    const admin = new Auth({
      username: username,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      isAdmin: true
    });
    await admin.save();
    logger.info(`Admin account created - ${admin.email}`)

    res.status(201).json({
        _id: admin.id,
        username: admin.username,
        email:admin.email,
        phoneNumber: admin.phoneNumber,
        isAdmin: admin.isAdmin,
        token: generateToken(admin.id)
    });
  } catch (error) {
    logger.error("Error registering admin:", error);
    res
      .status(400)
      .json({ message: "An error occurred while registering admin" });
  }
}

export async function loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
  
      const validationError = validateLoginFields(email, password);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }
      const user = await Auth.findOne({ email });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }
      const token = generateToken(user._id);
      res.status(200).json({
        _id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
      logger.info(`Successful admin login by ${user.email}`);
    } catch (error) {
      res.status(400).json({ message: "An error occurred." });
    }
  }

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
