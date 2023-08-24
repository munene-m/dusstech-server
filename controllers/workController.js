import Work from "../models/work.js";
import multer from "multer";
import dotenv from "dotenv";
import logger from "../helpers/logging.js";
import { validateWorkFields } from "../utils/validation.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

export async function createWorkDone(req, res) {
  const { title, description } = req.body;
  const image = req.file;
  const validationError = validateWorkFields(title, description, image);
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
    const product = await Work.create({
      title,
      description,
      image: result.secure_url, // Save the Cloudinary URL to the works document
    });
    if (!product) {
      res.status(400).json({ error: "An error occured when adding work item" });
    }
    res.status(201).json({
      _id: product.id,
      title: product.title,
      description: product.description,
      image: product.image,
    });
    logger.info(`Work item - ${product.id} has been added successfully`);
  } catch (error) {
    logger.error("An error occured: ", error);
    res.status(400).json({ message: "An error occurred" });
  }
}

export async function updateWorkDone(req, res) {
    try {
      const product = await Work.findById(req.params.id);
      if (!product) {
        res
          .status(400)
          .json({ error: "The work item you tried to update does not exist" });
      }
      const { title, description } = req.body;
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
  
      const updatedItem = await Work.findByIdAndUpdate(
        req.params.id,
        { title, description, image },
        { new: true }
      );
      logger.info(`Item - ${updatedItem.id} updated successfully!`);
      res.status(200).json(updatedItem);
    } catch (error) {}
  }

  export async function getItems(req, res) {
    try {
      const items = await Work.find();
  
      res.status(200).json(items)
    } catch (error) {
      logger.error("There are no items at this time");
      res.status(400).json({ message: "There are no items at this time" });
    }
  }

  export async function getItem(req, res) {
    try {
      const item = await Work.findById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "This item does not exist" })
        // throw new Error("This product does not exist");
      } else {
        res.status(200).json(item);
      }
    } catch (error) {
      logger.error(`Item does not exist`)
      res.status(400).json({ message: "This item does not exist" });
    }
  }

  export async function deleteItem(req, res) {
    try {
      const item = await Work.findById(req.params.id);
      if (!item) {
        res.status(404).json({error: "Item not found "})
        // throw new Error("Product not found ");
      } else {
        await Work.findByIdAndDelete(req.params.id);
        logger.info(`Item - ${item.id} deleted successfully`)
        res.status(200).json({ message: "Item deleted" });
      }
    } catch (error) {
      logger.error('Item not found')
      res.status(400).json({ message: "Item not found" });
    }
  }