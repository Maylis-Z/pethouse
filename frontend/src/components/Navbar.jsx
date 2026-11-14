import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Cart from "./Cart";
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";

const icons = {
  cart: (
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 7H6" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
  shop: (
    <>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  package: <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />,
  logout: (
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  ),
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 8);

  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Close every menu when the page (or #hash) changes.
  // Done during render instead of in an effect, so React doesn't render twice.
  const locationKey = location.pathname + location.hash;
  const [prevLocationKey, setPrevLocationKey] = useState(locationKey);

  if (prevLocationKey !== locationKey) {
    setPrevLocationKey(locationKey);
    setIsProfileOpen(false);
    setIsCartOpen(false);
    setIsMenuOpen(false);
  }

  const cartItems = useSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const count = cartItems.reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0,
  );

  const onHome = location.pathname === "/" && location.hash !== "#products";
  const onShop = location.pathname === "/" && location.hash === "#products";

  const initial = (user?.name || user?.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();
  const firstName = user?.name?.trim().split(" ")[0] || "Account";

  // Shadow + border appear once the page is scrolled
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the profile menu when clicking outside of it
  useEffect(() => {
    if (!isProfileOpen) return;

    const onClickOutside = (e) => {
      if (!profileRef.current?.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isProfileOpen]);

  // Escape closes everything
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
        setIsCartOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Handle scrolling when navigating between pages
  useEffect(() => {
    requestAnimationFrame(() => {
      if (location.hash === "#products") {
        document.getElementById("products")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }, [location.pathname, location.hash]);

  const handleHome = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (location.hash) navigate("/", { replace: true });
    }
  };

  const openShop = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/#products");
    } else {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (location.hash !== "#products") {
        navigate("/#products", { replace: true });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());
    dispatch(clearCart());

    setIsProfileOpen(false);
    setIsCartOpen(false);

    navigate("/");
  };

  const closeAll = () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className={`nb ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="nb-inner">
        <Link to="/" className="nb-logo" onClick={handleHome}>
          <img src="/images/logo.png" alt="" className="nb-logo-img" />
          <span className="nb-logo-text">The PetHouse </span>
        </Link>

        <nav className="nb-links" aria-label="Main">
          <Link
            to="/"
            className={`nb-link ${onHome ? "is-active" : ""}`}
            aria-current={onHome ? "page" : undefined}
            onClick={handleHome}
          >
            <Icon name="home" size={18} />
            Home
          </Link>

          <Link
            to="/#products"
            className={`nb-link ${onShop ? "is-active" : ""}`}
            aria-current={onShop ? "page" : undefined}
            onClick={openShop}
          >
            <Icon name="shop" size={18} />
            Shop
          </Link>
        </nav>

        <div className="nb-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nb-signin">
                Sign in
              </Link>

              <Link to="/register" className="nb-register">
                Create account
              </Link>
            </>
          ) : (
            <>
              <div className="cart-wrapper">
                <button
                  className="nb-icon-btn"
                  onClick={() => {
                    setIsCartOpen(!isCartOpen);
                    setIsProfileOpen(false);
                    setIsMenuOpen(false);
                  }}
                  aria-label={`Shopping cart with ${count} items`}
                  aria-expanded={isCartOpen}
                  title="Cart"
                >
                  <Icon name="cart" />
                  {count > 0 && <span className="nb-badge">{count}</span>}
                </button>

                <Cart
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                />
              </div>

              <div className="nb-profile-wrap" ref={profileRef}>
                <button
                  className="nb-profile"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsCartOpen(false);
                    setIsMenuOpen(false);
                  }}
                  aria-label="Open profile menu"
                  aria-expanded={isProfileOpen}
                >
                  <span className="nb-avatar">{initial}</span>
                  <span className="nb-name">{firstName}</span>
                  <span
                    className={`nb-chevron ${isProfileOpen ? "is-open" : ""}`}
                  >
                    <Icon name="chevron" size={16} />
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="nb-dropdown">
                    <div className="nb-dropdown-head">
                      <span className="nb-avatar nb-avatar-lg">{initial}</span>
                      <div>
                        <strong>{user?.name || "User"}</strong>
                        <p>{user?.email}</p>
                      </div>
                    </div>

                    <div className="nb-dropdown-menu">
                      <Link to="/profile" onClick={closeAll}>
                        <Icon name="user" size={18} /> My Profile
                      </Link>

                      <Link to="/orders" onClick={closeAll}>
                        <Icon name="package" size={18} /> My Orders
                      </Link>

                      <Link to="/settings" onClick={closeAll}>
                        <Icon name="settings" size={18} /> Settings
                      </Link>
                    </div>

                    <button className="nb-logout" onClick={handleLogout}>
                      <Icon name="logout" size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            className="nb-burger"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsProfileOpen(false);
              setIsCartOpen(false);
            }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <Icon name={isMenuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" className="nb-mobile" aria-label="Mobile">
          <Link
            to="/"
            className={`nb-link ${onHome ? "is-active" : ""}`}
            onClick={handleHome}
          >
            <Icon name="home" size={18} />
            Home
          </Link>

          <Link
            to="/#products"
            className={`nb-link ${onShop ? "is-active" : ""}`}
            onClick={openShop}
          >
            <Icon name="shop" size={18} />
            Shop
          </Link>

          {!isAuthenticated && (
            <div className="nb-mobile-auth">
              <Link to="/login" className="nb-signin" onClick={closeAll}>
                Sign in
              </Link>

              <Link to="/register" className="nb-register" onClick={closeAll}>
                Create account
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
