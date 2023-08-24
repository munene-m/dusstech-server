import Cart from "../models/cart.js";
import Products from "../models/products.js";
import Auth from "../models/auth.js";
import logger from "../helpers/logging.js";
import { validateCartFields } from "../utils/validation.js";

export async function addCartItem(req, res) {
  const { customerId, productId, quantity } = req.body;
  const validationError = validateCartFields(customerId, productId);
  if (validationError) {
    res.status(400).json(validationError);
    return; // Exit the function if there's a validation error
  }
  try {
    const product = await Products.findById(productId);
    const customer = await Auth.findById(customerId);

    if (!product) {
      res.status(404).json({ error: "Product does not exist" });
    }
    if (!customer) {
      res.status(404).json({ error: "User does not exist" });
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

export async function updateCart(req, res) {
    try {
      const cartItem = await Cart.findById(req.params.id);
      if (!cartItem) {
        res.status(400).json({ error: "Cart item does not exist" });
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

  export async function getCartItems(req, res) {
    try {
      const customerId = req.params.id;
      const cartItems = await Cart.find({ customerId: customerId });
  
      res.status(200).json(cartItems);
    } catch (error) {
      logger.error("Cannot get cart items for this customer", error);
      res.status(400).json({ message: "Cart is empty" });
    }
  }

  export async function deleteItem(req, res) {
    try {
      const itemId = req.params.id;
      const item = await Cart.findById(itemId);
      if (!item) {
        res.status(400).json("Item not found");
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

  export async function deleteCartItems(req, res) {
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
        .status(500)
        .json({ message: "An error occurred when deleting cart items" });
    }
  }