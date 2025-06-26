import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Heart, MapPin, Calendar, Gauge, ChevronRight, TrendingUp, Users, Award, Shield } from 'lucide-react';
import { listings } from '../lib/supabase';

const HomePage = () => {
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Loading listings from Supabase...');
      
      const { data, error } = await listings.getAll();
      
      if (error) {
        console.error('❌ Error loading listings:', error);
        setError('Nu s-au putut încărca anunțurile');
        return;
      }
      
      console.log('✅ Loaded listings successfully:', data?.length || 0);
      
      if (data && data.length > 0) {
        // Formatăm datele pentru afișare
        const formattedListings = data.map((listing: any) => ({
          id: listing.id,
          title: listing.title,
          price: `€${listing.price.toLocaleString()}`,
          year: listing.year,
          mileage: `${listing.mileage.toLocaleString()} km`,
          location: listing.location,
          image: listing.images && listing.images.length > 0 ? listing.images[0] : "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
          rating: listing.rating || 4.5,
          seller: listing.seller_name,
          category: listing.category,
          featured: listing.featured || false
        }));
        
        // Separăm anunțurile featured și recente
        const featured = formattedListings.filter(listing => listing.featured).slice(0, 3);
        const recent = formattedListings.slice(0, 6);
        
        setFeaturedListings(featured);
        setRecentListings(recent);
      } else {
        console.log('ℹ️ No listings found in database');
        setFeaturedListings([]);
        setRecentListings([]);
      }
      
    } catch (err) {
      console.error('💥 Error in loadListings:', err);
      setError('A apărut o eroare la încărcarea anunțurilor');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: TrendingUp, label: 'Anunțuri Active', value: '2,847', color: 'text-blue-600' },
    { icon: Users, label: 'Utilizatori Activi', value: '15,234', color: 'text-green-600' },
    { icon: Award, label: 'Tranzacții Reușite', value: '8,921', color: 'text-purple-600' },
    { icon: Shield, label: 'Verificări Securitate', value: '100%', color: 'text-red-600' }
  ];

  const categories = [
    { name: 'Sport', count: '847', image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg' },
    { name: 'Touring', count: '623', image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg' },
    { name: 'Cruiser', count: '445', image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg' },
    { name: 'Adventure', count: '389', image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg' },
    { name: 'Naked', count: '312', image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg' },
    { name: 'Enduro', count: '231', image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg' }
  ];

  return (
    <div className="min-h-screen bg-nexar-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Cel mai <span className="text-nexar-accent">Premium</span><br />
              Marketplace pentru <span className="text-nexar-gold">Motociclete</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Descoperă, compară și cumpără motocicleta perfectă din cea mai mare colecție verificată din România
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Caută după marcă, model sau categorie..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent text-gray-900 text-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                    <Filter className="h-5 w-5" />
                    <span>Filtrează</span>
                  </button>
                  <Link
                    to="/anunturi"
                    className="bg-nexar-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-nexar-gold transition-colors flex items-center space-x-2"
                  >
                    <Search className="h-5 w-5" />
                    <span>Caută</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="py-12 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-red-100 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Eroare la încărcarea anunțurilor</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadListings}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Încearcă din nou
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <div className="w-16 h-16 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Se încarcă anunțurile...</h3>
              <p className="text-gray-600">Te rugăm să aștepți</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Listings */}
      {!isLoading && !error && featuredListings.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Anunțuri <span className="text-nexar-accent">Premium</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Cele mai populare motociclete selectate special pentru tine
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/anunt/${listing.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-nexar-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Premium
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                        <Heart className="h-5 w-5 text-gray-600 hover:text-nexar-accent transition-colors" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-nexar-accent transition-colors">
                      {listing.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-nexar-accent">{listing.price}</div>
                      <div className="flex items-center space-x-1 bg-gray-50 rounded-lg px-3 py-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{listing.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{listing.year}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{listing.mileage}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{listing.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{listing.seller}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Vânzător Verificat</span>
                      <ChevronRight className="h-5 w-5 text-nexar-accent group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/anunturi"
                className="inline-flex items-center space-x-2 bg-nexar-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-nexar-gold transition-colors text-lg"
              >
                <span>Vezi Toate Anunțurile</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explorează <span className="text-nexar-accent">Categoriile</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Găsește motocicleta perfectă pentru stilul tău de condus
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/anunturi?categorie=${category.name.toLowerCase()}`}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-gray-900 group-hover:text-nexar-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.count} anunțuri</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      {!isLoading && !error && recentListings.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Anunțuri <span className="text-nexar-accent">Recente</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Cele mai noi motociclete adăugate pe platformă
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/anunt/${listing.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Nou
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                        <Heart className="h-5 w-5 text-gray-600 hover:text-nexar-accent transition-colors" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-nexar-accent transition-colors">
                      {listing.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-nexar-accent">{listing.price}</div>
                      <div className="flex items-center space-x-1 bg-gray-50 rounded-lg px-3 py-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{listing.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{listing.year}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{listing.mileage}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{listing.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{listing.seller}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Vânzător Verificat</span>
                      <ChevronRight className="h-5 w-5 text-nexar-accent group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Listings State */}
      {!isLoading && !error && recentListings.length === 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gray-50 rounded-2xl p-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nu există anunțuri încă
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Fii primul care adaugă un anunț pe cea mai premium platformă pentru motociclete din România!
              </p>
              <Link
                to="/adauga-anunt"
                className="inline-flex items-center space-x-2 bg-nexar-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-nexar-gold transition-colors"
              >
                <span>Adaugă Primul Anunț</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-nexar-accent to-nexar-gold text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Gata să-ți vinzi motocicleta?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Alătură-te celor peste 15,000 de utilizatori care au ales Nexar pentru tranzacțiile lor
          </p>
          <Link
            to="/adauga-anunt"
            className="inline-flex items-center space-x-2 bg-white text-nexar-accent px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            <span>Adaugă Anunț Gratuit</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;