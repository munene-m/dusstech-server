import { Request, Response } from "express";
import Cart from "../models/cart";
import Products from "../models/products";
import Auth from "../models/auth";
import logger from "../helpers/logging";
import { validateCartFields } from "../utils/validation";

export async function addCartItem(req: Request, res: Response) {
  const { customerId, productId, quantity } = req.body;
  const validationError = validateCartFields(customerId, productId);
  if (validationError) {
    return res.status(400).json(validationError);
  }
  try {
    const product = await Products.findById(productId);
    const customer = await Auth.findById(customerId);

    if (!product) {
      return res.status(404).json({ error: "Product does not exist" });
    }
    if (!customer) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const existingCartItem = await Cart.findOne({
      customerId: customerId,
      productId: productId, // Here we are checking for the same productId in the cart
    });

    if (existingCartItem) {
      return res
        .status(400)
        .json({ error: "This item is already in the cart" });
    }

    const item = new Cart({
      customerId: customerId,
      productId: productId,
      productName: product.name,
      productDescription: product.description,
      productImage: product.image,
      quantity,
      price: product.price,
    });
    const savedItem = await item.save();

    res.status(201).json(savedItem);
    logger.info(`Cart item added by: ${customer.email}`);
  } catch (error) {
    logger.error("An error occured when adding item to cart", error);
    res
      .status(400)
      .json({ message: "An error occured when adding item to cart" });
  }
}

export async function updateCart(req: Request, res: Response) {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(400).json({ error: "Cart item does not exist" });
    }
    const updatedProduct = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    logger.error("An error occured when updating cart", error);
    res.status(400).json({ error: "An error occurred when updating cart" });
  }
}

export async function getCartItems(req: Request, res: Response) {
  try {
    const customerId = req.params.id;
    const cartItems = await Cart.find({ customerId: customerId });

    res.status(200).json(cartItems);
  } catch (error) {
    logger.error("Cannot get cart items for this customer", error);
    res.status(400).json({ message: "Cart is empty" });
  }
}

export async function deleteItem(req: Request, res: Response) {
  try {
    const item = await Cart.findById(req.params.id);
    if (!item) {
      return res.status(400).json("Item not found");
    }
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    logger.error("An error occurred when deleting the cart item: ", error);
    res
      .status(400)
      .json({ message: "An error occurred when deleting the cart item" });
  }
}

export async function deleteCartItems(req: Request, res: Response) {
  try {
    const customerId = req.params.customerId;

    // Find and delete all cart items for the specified customerId
    const result = await Cart.deleteMany({ customerId: customerId });

    if (result.deletedCount === 0) {
      res.status(400).json({ message: "No cart items found for the customer" });
    } else {
      res.status(200).json({ message: "Cart items deleted" });
    }
  } catch (error) {
    logger.error("An error occurred when deleting cart items: ", error);
    res
      .status(400)
      .json({ message: "An error occurred when deleting cart items" });
  }
}
