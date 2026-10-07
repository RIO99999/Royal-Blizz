import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { naira } from '../utils/format';

export default function Cart() {
  const { cart, removeFromCart, changeQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container page">
        <div className="empty">
          <h2>Your cart is empty</h2>
          <p>Browse the shop and add some products.</p>
          <Link to="/shop" className="btn btn-orange">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <span className="price">{naira(item.price)}</span>
              </div>
              <div className="qty-control">
                <button onClick={() => changeQuantity(item.product, -1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQuantity(item.product, 1)}>+</button>
              </div>
              <div className="cart-item-total">{naira(item.price * item.quantity)}</div>
              <button className="btn-remove" onClick={() => removeFromCart(item.product)} aria-label="Remove">
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{naira(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{naira(subtotal)}</span>
          </div>
          <button className="btn btn-orange btn-block" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
          <Link to="/shop" className="link-orange center">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
