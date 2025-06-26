import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FileText, TrendingUp, AlertTriangle, 
  Check, X, Eye, Edit, Trash2, Search, Filter,
  BarChart3, PieChart, Activity, DollarSign, Shield
} from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Credențiale admin (în producție, acestea ar trebui să fie în backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin@nexar.ro',
    password: 'NexarAdmin2024!'
  };

  useEffect(() => {
    // Verifică dacă admin-ul este deja autentificat
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginForm.username === ADMIN_CREDENTIALS.username && 
        loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Credențiale invalide. Încearcă din nou.');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    navigate('/');
  };

  // Dacă nu este autentificat, afișează formularul de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-nexar-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-nexar-accent" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-gray-600 mt-2">Conectează-te pentru a accesa panoul de administrare</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Administrator
                </label>
                <input
                  type="email"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
                  placeholder="admin@nexar.ro"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parolă
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-nexar-accent text-white py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
              >
                Conectează-te
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Credențiale Demo:</h4>
              <p className="text-sm text-blue-700">
                <strong>Email:</strong> admin@nexar.ro<br />
                <strong>Parolă:</strong> NexarAdmin2024!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: 15247,
    activeListings: 2834,
    pendingListings: 127,
    totalRevenue: 45680,
    monthlyGrowth: 12.5
  };

  const pendingListings = [
    {
      id: 1,
      title: "Yamaha YZF-R1 2023",
      seller: "Alexandru Popescu",
      price: "€18,500",
      submitted: "Acum 2 ore",
      status: "pending",
      image: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"
    },
    {
      id: 2,
      title: "BMW S1000RR 2022",
      seller: "Maria Ionescu",
      price: "€16,800",
      submitted: "Acum 4 ore",
      status: "pending",
      image: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"
    },
    {
      id: 3,
      title: "Ducati Panigale V4",
      seller: "Ion Georgescu",
      price: "€22,000",
      submitted: "Acum 1 zi",
      status: "pending",
      image: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"
    }
  ];

  const allListings = [
    ...pendingListings,
    {
      id: 4,
      title: "Honda CBR1000RR-R",
      seller: "Moto Expert SRL",
      price: "€19,500",
      submitted: "Acum 3 zile",
      status: "approved",
      image: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"
    },
    {
      id: 5,
      title: "Kawasaki Ninja ZX-10R",
      seller: "Speed Motors",
      price: "€17,200",
      submitted: "Acum 5 zile",
      status: "approved",
      image: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"
    }
  ];

  const users = [
    {
      id: 1,
      name: "Alexandru Popescu",
      email: "alex.popescu@email.com",
      joined: "Ian 2023",
      listings: 3,
      status: "active",
      verified: true
    },
    {
      id: 2,
      name: "Maria Ionescu",
      email: "maria.ionescu@email.com",
      joined: "Feb 2023",
      listings: 1,
      status: "active",
      verified: false
    },
    {
      id: 3,
      name: "Ion Georgescu",
      email: "ion.georgescu@email.com",
      joined: "Mar 2023",
      listings: 2,
      status: "suspended",
      verified: true
    }
  ];

  const handleListingAction = (id: number, action: 'approve' | 'reject') => {
    console.log(`${action} listing ${id}`);
    // Here you would make API call to approve/reject listing
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    console.log(`${action} listings:`, selectedListings);
    setSelectedListings([]);
  };

  const toggleListingSelection = (id: number) => {
    setSelectedListings(prev => 
      prev.includes(id) 
        ? prev.filter(listingId => listingId !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-nexar-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nexar-primary mb-4">
              Panou de Administrare
            </h1>
            <p className="text-gray-600 text-lg">
              Gestionează platforma Nexar și monitorizează activitatea
            </p>
          </div>
          <button
            onClick={handleAdminLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Deconectează-te
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-nexar-primary text-white'
                      : 'text-gray-700 hover:bg-nexar-light'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'listings'
                      ? 'bg-nexar-primary text-white'
                      : 'text-gray-700 hover:bg-nexar-light'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Anunțuri</span>
                  {pendingListings.length > 0 && (
                    <span className="bg-nexar-accent text-white text-xs px-2 py-1 rounded-full">
                      {pendingListings.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'users'
                      ? 'bg-nexar-primary text-white'
                      : 'text-gray-700 hover:bg-nexar-light'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Utilizatori</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'reports'
                      ? 'bg-nexar-primary text-white'
                      : 'text-gray-700  hover:bg-nexar-light'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>Rapoarte</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Utilizatori Totali</p>
                        <p className="text-2xl font-bold text-nexar-primary">{stats.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-nexar-accent" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Anunțuri Active</p>
                        <p className="text-2xl font-bold text-nexar-primary">{stats.activeListings.toLocaleString()}</p>
                      </div>
                      <FileText className="h-8 w-8 text-nexar-accent" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">În Așteptare</p>
                        <p className="text-2xl font-bold text-nexar-primary">{stats.pendingListings}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Venituri (EUR)</p>
                        <p className="text-2xl font-bold text-nexar-primary">€{stats.totalRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-nexar-primary mb-4">Activitate Lunară</h3>
                    <div className="h-64 bg-nexar-light rounded-xl flex items-center justify-center">
                      <Activity className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-nexar-primary mb-4">Categorii Populare</h3>
                    <div className="h-64 bg-nexar-light rounded-xl flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-nexar-primary">Gestionare Anunțuri</h3>
                    
                    {selectedListings.length > 0 && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleBulkAction('approve')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <Check className="h-4 w-4" />
                          <span>Aprobă ({selectedListings.length})</span>
                        </button>
                        <button
                          onClick={() => handleBulkAction('reject')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Respinge ({selectedListings.length})</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Search and Filter */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Caută anunțuri..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-nexar-accent focus:border-transparent">
                      <option>Toate statusurile</option>
                      <option>În așteptare</option>
                      <option>Aprobate</option>
                      <option>Respinse</option>
                    </select>
                  </div>

                  {/* Listings Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedListings(allListings.map(l => l.id));
                                } else {
                                  setSelectedListings([]);
                                }
                              }}
                              className="rounded border-gray-300 text-nexar-accent focus:ring-nexar-accent"
                            />
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Anunț</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Vânzător</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Preț</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Acțiuni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allListings.map((listing) => (
                          <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedListings.includes(listing.id)}
                                onChange={() => toggleListingSelection(listing.id)}
                                className="rounded border-gray-300 text-nexar-accent focus:ring-nexar-accent"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={listing.image}
                                  alt={listing.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <div className="font-semibold text-nexar-primary">{listing.title}</div>
                                  <div className="text-sm text-gray-600">{listing.submitted}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{listing.seller}</td>
                            <td className="py-3 px-4 font-semibold text-nexar-accent">{listing.price}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(listing.status)}`}>
                                {listing.status === 'pending' ? 'În așteptare' : 
                                 listing.status === 'approved' ? 'Aprobat' : 'Respins'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button className="p-1 text-nexar-primary hover:bg-nexar-light rounded">
                                  <Eye className="h-4 w-4" />
                                </button>
                                {listing.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleListingAction(listing.id, 'approve')}
                                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleListingAction(listing.id, 'reject')}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                                <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-nexar-primary mb-6">Gestionare Utilizatori</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Utilizator</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Membru din</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Anunțuri</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-nexar-primary rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-nexar-primary">{user.name}</div>
                                {user.verified && (
                                  <div className="text-xs text-green-600">Verificat</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{user.email}</td>
                          <td className="py-3 px-4 text-gray-700">{user.joined}</td>
                          <td className="py-3 px-4 text-gray-700">{user.listings}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                              {user.status === 'active' ? 'Activ' : 'Suspendat'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="p-1 text-nexar-primary hover:bg-nexar-light rounded">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-nexar-primary mb-6">Rapoarte și Reclamații</h3>
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nu există rapoarte noi</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;