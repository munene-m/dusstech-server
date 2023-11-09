import express from "express";
const router = express.Router();
import {
  addCartItem,
  updateCart,
  getCartItems,
  deleteItem,
  deleteCartItems,
} from "../controllers/cartController";

router.route("/add").post(addCartItem);
router.route("/update/:id").put(updateCart);
router.route("/items/:id").get(getCartItems);
router.route("/delete/:id").delete(deleteItem);
router.route("/clear-cart/:customerId").delete(deleteCartItems);

export default router;
