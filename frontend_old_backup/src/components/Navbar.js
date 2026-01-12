import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glassmorphism shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-primary">
            Jungle Chic
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/shop"
              data-testid="nav-shop-link"
              className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
            >
              Boutique
            </Link>
            <Link
              to="/about"
              data-testid="nav-about-link"
              className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
            >
              À propos
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/account')}
                  data-testid="nav-account-button"
                  className="text-primary hover:text-secondary"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/cart')}
                  data-testid="nav-cart-button"
                  className="text-primary hover:text-secondary relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
                <Button
                  onClick={handleLogout}
                  data-testid="nav-logout-button"
                  variant="ghost"
                  className="hidden md:block text-primary hover:text-secondary"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                data-testid="nav-login-button"
                className="bg-primary text-primary-foreground rounded-full px-8 py-2 hover:bg-primary/90 transition-all duration-300"
              >
                Connexion
              </Button>
            )}

            <button
              className="md:hidden text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-primary/10 mt-2" data-testid="mobile-menu">
            <div className="flex flex-col gap-4 pt-4">
              <Link
                to="/shop"
                data-testid="mobile-shop-link"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Boutique
              </Link>
              <Link
                to="/about"
                data-testid="mobile-about-link"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </Link>
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  data-testid="mobile-logout-button"
                  className="text-primary hover:text-secondary transition-colors duration-200 font-medium text-left"
                >
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};