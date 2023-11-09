import { ObjectId } from "mongoose";

export function validateUserFields(email: string, password: string) {
  if (!email || !password) {
    switch (true) {
      case !email:
        return "Email is required";
      case !password:
        return "Password is required";
      default:
        return "Please enter all required fields";
    }
  }
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!email.match(emailRegex)) {
    return "Invalid email address";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null; // No validation error
}

export function validateLoginFields(email: string, password: string) {
  if (!email || !password) {
    switch (true) {
      case !email:
        return "Email is required";
      case !password:
        return "Password is required";
      default:
        return "Please enter all required fields";
    }
  }
  return null;
}

export function validateAdminRegistration(
  phoneNumber: string,
  email: string,
  password: string
) {
  if (!phoneNumber || !email || !password) {
    switch (true) {
      case !phoneNumber:
        return "Phone number is required";
      case !email:
        return "Email is required";
      case !password:
        return "Password is required";
      default:
        return "Please enter all required fields";
    }
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!email.match(emailRegex)) {
    return "Invalid email address";
  }
  const phoneRegex = /^(?:\+254|0)[17]\d{8}$/; // Matches +254 or 0, followed by 1 or 7, and then 8 digits

  if (!phoneNumber.match(phoneRegex)) {
    return "Invalid phone number format";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null; // No validation error
}

export function validateProductFields(
  name: string,
  description: string,
  price: number,
  image: Express.Multer.File | undefined
) {
  if (!name || !price || !description || !image) {
    if (!name) {
      return "Item name is required";
    } else if (!price) {
      return "Price is required";
    } else if (!description) {
      return "Item description is required";
    } else if (!image) {
      return "Image is required";
    } else {
      return "Please enter all required fields";
    }
  }
  return null;
}

export function validateWorkFields(
  title: string,
  description: string,
  image: Express.Multer.File | undefined
) {
  if (!title || !description || !image) {
    if (!title) {
      return "Item name is required";
    } else if (!image) {
      return "Image is required";
    } else if (!description) {
      return "Item description is required";
    } else {
      return "Please enter all required fields";
    }
  }
  return null;
}

export function validateCartFields(customerId: ObjectId, productId: ObjectId) {
  if (!customerId || !productId) {
    if (!customerId) {
      return "customerId is required";
    } else if (!productId) {
      return "productId is required";
    } else {
      return "Please enter all required fields";
    }
  }
  return null;
}
