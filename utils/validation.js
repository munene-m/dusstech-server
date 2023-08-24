export function validateUserFields(email, password) {
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

export function validateLoginFields(email, password) {
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

export function validateAdminRegistration(phoneNumber, email, password) {
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

export function validateProductFields(name, description, price, image) {
  if (!name || !price || !description) {
    switch (true) {
      case !name:
        return "Item name is required";
      case !price:
        return "Price is required";
      case !description:
        return "Item description is required";
      case !image:
        return "Image is required";
      default:
        return "Please enter all required fields";
    }
  }
  return null;
}

export function validateWorkFields(title, description, image) {
    if (!title || !description || !image) {
        switch (true) {
          case !title:
            return "Item name is required";
          case !image:
            return "Image is required";
          case !description:
            return "Item description is required";
          default:
            return "Please enter all required fields";
        }
      }
      return null;
}

export function validateCartFields(customerId, productId) {
    if (!customerId || !productId) {
        switch (true) {
          case !customerId:
            return "customerId is required";
          case !productId:
            return "productId is required";
          default:
            return "Please enter all required fields";
        }
      }
      return null;
}