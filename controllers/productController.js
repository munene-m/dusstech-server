import Products from "../models/products.js";
import multer from "multer";
import dotenv from "dotenv";
import logger from "../helpers/logging.js";
import { validateProductFields } from "../utils/validation.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(req, res) {
  const { name, description, price, quantity } = req.body;
  const image = req.file;
  const validationError = validateProductFields(
    name,
    description,
    price,
    quantity,
    image
  );
  if (validationError) {
    res.status(400).json(validationError);
    return; // Exit the function if there's a validation error
  }

  const result = await cloudinary.uploader.upload(image.path, {
    width: 500,
    height: 500,
    crop: "scale",
    quality: 50,
  });
  try {
    const product = await Products.create({
      name,
      description,
      price,
      quantity,
      image: result.secure_url, // Save the Cloudinary URL to the product document
    });
    if (!product) {
      res.status(400).json({ error: "An error occured when creating product" });
    }
    res.status(201).json({
      _id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
    });
    logger.info(`Product - ${product.id} has been created successfully`);
  } catch (error) {
    logger.error("An error occured: ", error);
    res.status(400).json({ message: "An error occurred" });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      res
        .status(400)
        .json({ error: "The product you tried to update does not exist" });
    }
    const { name, description, quantity, price } = req.body;
    let image = product.image;

    if (req.file) {
      // If a new image is uploaded, update it in Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: 500,
        height: 500,
        crop: "scale",
        quality: 60,
      });
      image = result.secure_url;
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      { name, description, quantity, price, image },
      { new: true }
    );
    logger.info(`Product - ${updatedProduct.id} updated successfully!`);
    res.status(200).json(updatedProduct);
  } catch (error) {}
}

export async function getProducts(req, res) {
  try {
    const items = await Products.find();

    res.status(200).json(items)
  } catch (error) {
    logger.error("There are no products at this time");
    res.status(400).json({ message: "There are no products at this time" });
  }
}

export async function getProduct(req, res) {
    try {
      const item = await Products.findById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "This product does not exist" })
        // throw new Error("This product does not exist");
      } else {
        res.status(200).json(item);
      }
    } catch (error) {
      logger.error(`Product does not exist`)
      res.status(400).json({ message: "This product does not exist" });
    }
  }

  export async function deleteProduct(req, res) {
    try {
      const item = await Products.findById(req.params.id);
      if (!item) {
        res.status(404).json({error: "Product not found "})
        // throw new Error("Product not found ");
      } else {
        await Products.findByIdAndDelete(req.params.id);
        logger.info(`Product - ${item.id} deleted successfully`)
        res.status(200).json({ message: "Product deleted" });
      }
    } catch (error) {
      logger.error('Item not found')
      res.status(400).json({ message: "Product not found" });
    }
  }