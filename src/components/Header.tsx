import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Plus, Menu, X, Bell, Heart, Wifi, WifiOff, RefreshCw, Database } from 'lucide-react';
import { auth, checkSupabaseConnection, supabase, fixCurrentUserProfile } from '../lib/supabase';
import { checkAndFixSupabaseConnection } from '../lib/fixSupabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFixing, setIsFixing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth();
  }, [navigate, location.pathname]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check Supabase connection
      const connected = await checkSupabaseConnection();
      setIsConnected(connected);

      if (!connected) {
        console.warn('⚠️ Supabase connection failed');
        setIsLoading(false);
        return;
      }

      // Check current auth state
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        console.log('👤 Found authenticated user:', currentUser.email);
        
        // Get user profile from database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
        
        if (!profileError && profileData) {
          console.log('✅ Profile found:', profileData.name);
          
          const userData = {
            id: currentUser.id,
            name: profileData.name,
            email: profileData.email,
            sellerType: profileData.seller_type,
            isLoggedIn: true
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          console.warn('⚠️ Profile not found for authenticated user');
          setUser({ 
            id: currentUser.id, 
            email: currentUser.email, 
            needsProfileFix: true,
            isLoggedIn: true 
          });
        }
      } else {
        console.log('👤 No authenticated user');
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('💥 Error checking auth state:', error);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in - get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (!profileError && profileData) {
          const userData = {
            id: session.user.id,
            name: profileData.name,
            email: profileData.email,
            sellerType: profileData.seller_type,
            isLoggedIn: true
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Redirect to home page after successful login
          if (location.pathname === '/auth') {
            navigate('/');
          }
        } else {
          // Profile missing - set flag for repair
          setUser({ 
            id: session.user.id, 
            email: session.user.email, 
            needsProfileFix: true,
            isLoggedIn: true 
          });
        }
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setUser(null);
        localStorage.removeItem('user');
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleFixProfile = async () => {
    setIsFixing(true);
    try {
      console.log('🔧 Attempting to fix user profile...');
      const result = await fixCurrentUserProfile();
      
      if (result.success) {
        console.log('✅ Profile fixed successfully');
        // Reload the page to refresh the state
        window.location.reload();
      } else {
        console.error('❌ Failed to fix profile:', result.error);
        alert('Nu s-a putut repara profilul. Te rugăm să încerci din nou sau să te deconectezi și să te conectezi din nou.');
      }
    } catch (error) {
      console.error('💥 Error fixing profile:', error);
      alert('A apărut o eroare. Te rugăm să încerci din nou.');
    } finally {
      setIsFixing(false);
    }
  };

  const handleFixConnection = async () => {
    setIsFixing(true);
    try {
      const success = await checkAndFixSupabaseConnection();
      
      if (success) {
        // Reload the page to refresh the state
        window.location.reload();
      } else {
        alert('Nu s-a putut repara conexiunea. Te rugăm să încerci din nou sau să accesezi pagina de reparare.');
        navigate('/fix-supabase');
      }
    } catch (error) {
      console.error('Error fixing connection:', error);
      alert('A apărut o eroare. Te rugăm să încerci din nou.');
      navigate('/fix-supabase');
    } finally {
      setIsFixing(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsLoading(true);
    await auth.signOut();
    setUser(null);
    setIsUserMenuOpen(false);
    setIsLoading(false);
    navigate('/');
  };

  const renderUserButton = () => {
    if (isLoading) {
      return (
        <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
      );
    }

    if (user?.needsProfileFix) {
      return (
        <button
          onClick={handleFixProfile}
          disabled={isFixing}
          className="flex items-center space-x-2 p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition-colors"
          title="Click pentru a repara profilul"
        >
          {isFixing ? (
            <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="w-5 h-5 bg-yellow-500 rounded-full animate-pulse"></div>
          )}
          <span className="text-xs text-yellow-700 hidden xl:inline">
            {isFixing ? 'Se repară...' : 'Repară profil'}
          </span>
        </button>
      );
    }

    if (user) {
      return (
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-nexar-accent rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden xl:inline">
              Bună, {user.name || 'Utilizator'}
            </span>
          </div>
        </button>
      );
    }

    return (
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <User className="h-5 w-5 text-gray-700" />
      </button>
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group min-w-0">
            <img 
              src="/Nexar - logo_black & red.png" 
              alt="Nexar" 
              className="h-20 sm:h-24 w-auto transition-transform group-hover:scale-105 flex-shrink-0"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.includes('Nexar - logo_black & red.png')) {
                  target.src = '/nexar-logo.jpg';
                } else if (target.src.includes('nexar-logo.jpg')) {
                  target.src = '/nexar-logo.png';
                } else if (target.src.includes('nexar-logo.png')) {
                  target.src = '/image.png';
                } else {
                  target.style.display = 'none';
                  const textLogo = target.nextElementSibling as HTMLElement;
                  if (textLogo) {
                    textLogo.style.display = 'block';
                  }
                }
              }}
            />
            <div className="hidden text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-nexar-accent">
              NEXAR
            </div>
          </Link>

          {/* Connection Status Indicator - Only show if disconnected */}
          {isConnected === false && (
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={handleFixConnection}
                disabled={isFixing}
                className="flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
              >
                {isFixing ? (
                  <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                <span>{isFixing ? 'Se repară...' : 'Deconectat'}</span>
              </button>
              
              <Link
                to="/fix-supabase"
                className="flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                <Database className="h-3 w-3" />
                <span>Reparare Avansată</span>
              </Link>
            </div>
          )}

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/anunturi"
              className={`px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                isActive('/anunturi')
                  ? 'bg-nexar-accent text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Anunțuri
            </Link>
            <Link
              to="/adauga-anunt"
              className="flex items-center space-x-2 bg-nexar-accent text-white px-3 xl:px-4 py-2 rounded-lg font-medium hover:bg-nexar-gold transition-all duration-200 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xl:inline">Adaugă Anunț</span>
              <span className="xl:hidden">Adaugă</span>
            </Link>
            
            {/* User Menu */}
            <div className="relative">
              {renderUserButton()}
              
              {isUserMenuOpen && !isLoading && !user?.needsProfileFix && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 py-2 animate-scale-in">
                  {user ? (
                    <>
                      <Link
                        to="/profil"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profilul Meu
                      </Link>
                      <Link
                        to="/favorite"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Favorite</span>
                      </Link>
                      <Link
                        to="/notificari"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Bell className="h-4 w-4" />
                        <span>Notificări</span>
                      </Link>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                      <Link
                        to="/fix-supabase"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Database className="h-4 w-4" />
                        <span>Reparare Supabase</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        disabled={isLoading}
                      >
                        Deconectează-te
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      className="block px-4 py-2 text-sm text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Conectează-te
                    </Link>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-slide-up bg-white/95 backdrop-blur-md">
            <div className="space-y-2">
              {/* Connection Status on Mobile - Only show if disconnected */}
              {isConnected === false && (
                <div className="flex flex-col space-y-2 px-4 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-800 mb-4">
                  <div className="flex items-center space-x-2">
                    <WifiOff className="h-3 w-3" />
                    <span>Deconectat de la Supabase</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleFixConnection}
                      disabled={isFixing}
                      className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-red-200 text-red-800 rounded-md text-xs"
                    >
                      {isFixing ? (
                        <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      <span>Repară</span>
                    </button>
                    
                    <Link
                      to="/fix-supabase"
                      className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-blue-200 text-blue-800 rounded-md text-xs"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Database className="h-3 w-3" />
                      <span>Reparare Avansată</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Profile Fix Button on Mobile */}
              {user?.needsProfileFix && (
                <button
                  onClick={handleFixProfile}
                  disabled={isFixing}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg font-medium mb-4"
                >
                  {isFixing ? (
                    <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span>{isFixing ? 'Se repară profilul...' : 'Repară Profilul'}</span>
                </button>
              )}
              
              <Link
                to="/anunturi"
                className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Anunțuri
              </Link>
              <Link
                to="/adauga-anunt"
                className="flex items-center space-x-2 px-4 py-3 bg-nexar-accent text-white rounded-lg font-medium mx-0"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="h-4 w-4" />
                <span>Adaugă Anunț</span>
              </Link>
              
              {isLoading ? (
                <div className="px-4 py-3 text-gray-700 font-medium border-t border-gray-200 mt-2 pt-4">
                  Se încarcă...
                </div>
              ) : user && !user.needsProfileFix ? (
                <>
                  <div className="px-4 py-3 text-gray-700 font-medium border-t border-gray-200 mt-2 pt-4">
                    Bună, {user.name || 'Utilizator'}
                  </div>
                  <Link
                    to="/profil"
                    className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profilul Meu
                  </Link>
                  <Link
                    to="/favorite"
                    className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Favorite
                  </Link>
                  <Link
                    to="/admin"
                    className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <Link
                    to="/fix-supabase"
                    className="block px-4 py-3 rounded-lg font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Reparare Supabase
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                    disabled={isLoading}
                  >
                    Deconectează-te
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block px-4 py-3 rounded-lg font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Conectează-te
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;