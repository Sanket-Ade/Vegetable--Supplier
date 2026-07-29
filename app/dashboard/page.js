

"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import AddCropModal from '@/Components/AddCropModal';
import FarmerCalendar from '@/Components/FarmerCalender';
import Link from 'next/link';
import {
  LayoutDashboard,
  Sprout,
  Store,
  CloudSun,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Search,
  ArrowUpRight,
  Calendar,
  Package,
  Trash2,
  X,
  Loader2
} from 'lucide-react';

// Vegetable/Crop Image Mapping
const cropImages = {
  'Tomato': '🍅', 'Onion': '🧅', 'Potato': '🥔', 'Carrot': '🥕', 'Cabbage': '🥬',
  'Cauliflower': '🥦', 'Spinach': '🥬', 'Brinjal': '🍆', 'Cucumber': '🥒', 'Bell Pepper': '🫑',
  'Chili': '🌶️', 'Garlic': '🧄', 'Ginger': '🫚', 'Radish': '🥕', 'Pumpkin': '🎃',
  'Corriender': '🌿', 'Lettuce': '🥬', 'Broccoli': '🥦', 'Peas': '🫛', 'Corn': '🌽',
  'Mango': '🥭', 'Banana': '🍌', 'Apple': '🍎', 'Orange': '🍊', 'Grapes': '🍇',
  'Watermelon': '🍉', 'Pomegranate': '🍎', 'Lemon': '🍋', 'Strawberry': '🍓', 'Pear': '🍐',
  'Peach': '🍑', 'Kiwi': '🥝', 'Wheat': '🌾', 'Rice': '🌾', 'Soya Bean': '🌱',
  'Cotton': '🌾', 'Sugarcane': '🎋', 'Tea': '🍃', 'Coffee': '☕', 'default': '🌱'
};

const getCropImage = (cropName) => {
  const matchedKey = Object.keys(cropImages).find(key => key.toLowerCase() === cropName?.toLowerCase());
  return cropImages[matchedKey] || cropImages['default'];
};

const getCropGradient = (cropName) => {
  const vegetables = ['Tomato', 'Onion', 'Potato', 'Carrot', 'Cabbage', 'Cauliflower', 'Spinach', 'Brinjal', 'Cucumber', 'Bell Pepper', 'Chili', 'Garlic', 'Ginger', 'Radish', 'Pumpkin', 'Corriender', 'Lettuce', 'Broccoli', 'Peas', 'Corn'];
  const fruits = ['Mango', 'Banana', 'Apple', 'Orange', 'Grapes', 'Watermelon', 'Pomegranate', 'Lemon', 'Strawberry', 'Pear', 'Peach', 'Kiwi'];
  if (vegetables.some(v => v.toLowerCase() === cropName?.toLowerCase())) return 'from-green-100 to-emerald-50';
  if (fruits.some(f => f.toLowerCase() === cropName?.toLowerCase())) return 'from-orange-100 to-amber-50';
  return 'from-yellow-100 to-amber-50';
};

const FarmerDashboard = () => {
  const [storeDemands, setStoreDemands] = useState([]);
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [statsData, setStatsData] = useState({ active: 0, total: 0 });
  const [myCrops, setMyCrops] = useState([]);

  // --- WEATHER STATES ---
  const [weather, setWeather] = useState({
    temp: "--",
    condition: "Checking...",
    city: "Location",
    icon: "01d"
  });
  const [weatherLoading, setWeatherLoading] = useState(false);

  // --- 1. MOVED FUNCTION OUTSIDE useEffect TO RESOLVE ReferenceError ---
  const fetchDashboardData = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const sRes = await fetch(`/api/farmer/stats?farmerId=${user.id}`);
      const sData = await sRes.json();
      const cRes = await fetch(`/api/products/user?farmerId=${user.id}`);
      const cData = await cRes.json();
      const rRes = await fetch('/api/requirements/all');
      const rData = await rRes.json();

      if (sData.success) setStatsData({ active: sData.activeCrops, total: sData.totalHistory });
      if (cData.success) setMyCrops(cData.crops);
      if (rData.success) setStoreDemands(rData.requirements);
    } catch (err) {
      console.error("Dashboard sync error:", err);
    }
  }, [user]);

  // --- WEATHER FETCH FUNCTION ---
  const fetchWeather = () => {
    setWeatherLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const API_KEY = "266e0cb2136668ae088028bda6e29b92";

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();
          if (data.main) {
            setWeather({
              temp: Math.round(data.main.temp),
              condition: data.weather[0].main,
              city: data.name,
              icon: data.weather[0].icon
            });
          }
        } catch (error) {
          console.error("Weather failed:", error);
        } finally {
          setWeatherLoading(false);
        }
      }, (error) => {
        alert("Please allow location access to see your local weather.");
        setWeatherLoading(false);
      });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/farmer-login');
    }

    // Call the moved function
    fetchDashboardData();
    fetchWeather();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [user, loading, router, fetchDashboardData]);

  const handleDelete = async (productId) => {
    if (confirm("Are you sure you want to remove this listing?")) {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMyCrops(myCrops.filter(c => c._id !== productId));
        setStatsData(prev => ({ ...prev, active: prev.active - 1 }));
      }
    }
  };

  const stats = [
    { title: "Active Crops", value: statsData.active.toString(), icon: <Sprout className="text-emerald-600" />, color: "bg-emerald-50", trend: "Live Listings", trendColor: "text-emerald-600" },
    { title: "Total Listings", value: statsData.total.toString(), icon: <Store className="text-blue-600" />, color: "bg-blue-50", trend: "History", trendColor: "text-blue-600" },
    { title: "Market Price", value: "↑ 5%", icon: <TrendingUp className="text-orange-600" />, color: "bg-orange-50", trend: "vs last month", trendColor: "text-orange-600" },
    {
      title: `${weather.city || 'Weather'}`,
      value: `${weather.temp}°C`,
      icon: weatherLoading ? <Loader2 className="animate-spin text-yellow-600" /> : <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="w" className="w-8 h-8" />,
      color: "bg-yellow-50",
      trend: weather.condition,
      trendColor: "text-yellow-600"
    },
  ];

  const displayedCrops = myCrops.slice(0, 8);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-[65px] flex">
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-[#1b4332] to-[#0f2c1f] text-white flex-col p-6 shadow-xl ">
        <div className="mb-10 text-center ml-[-90px]">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-white bg-clip-text text-transparent">Vege</h2>
          <p className="text-emerald-300 text-[10px] uppercase font-bold tracking-widest mt-1">Farmer Portal</p>
        </div>
        <nav className="space-y-2 flex-1">
          <button className="flex items-center gap-3 w-full p-3 bg-emerald-700/50 rounded-xl transition-all duration-300 hover:bg-emerald-700 group">
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
            <span>Dashboard</span>
            <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button onClick={() => router.push('/marketplace')} className="flex items-center gap-3 w-full p-3 hover:bg-emerald-700/30 rounded-xl transition-all duration-300 group">
            <Store size={20} /> <span>Marketplace</span>
          </button>
          {/* <button onClick={() => router.push('/dashboard/my-crops')} className="flex items-center gap-3 w-full p-3 hover:bg-emerald-700/30 rounded-xl transition-all duration-300 group">
            <Package size={20} /> <span>My Crops</span>
          </button> */}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 p-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-all duration-300 mt-auto group">
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-4 pb-4 px-6 overflow-y-auto">   
        <header className="flex justify-between mt-[0px] items-center mb-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-in slide-in-from-top duration-500 mt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌾</span>
              <p className="text-emerald-600 text-sm font-medium">{greeting}</p>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-gray-500 text-xs mt-1">Here's what's happening with your farm today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center font-bold text-white shadow-lg hover:scale-105 transition-transform cursor-pointer text-sm uppercase">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`${stat.color} p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-2 transform group">{stat.icon}</div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              <p className={`text-xs mt-1 ${stat.trendColor} font-bold`}>{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-gray-800">My Active Listings</h3>
              {myCrops.length > 0 && (
                <button
                  onClick={() => setIsViewAllModalOpen(true)}
                  className="text-emerald-600 text-sm font-bold hover:text-emerald-700 transition-colors flex items-center gap-1 group"
                >
                  View All ({myCrops.length})
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {myCrops.length > 0 ? (
                displayedCrops.map((crop, index) => (
                  <div
                    key={crop._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-gradient-to-br ${getCropGradient(crop.name)} rounded-lg text-2xl`}>
                        {getCropImage(crop.name)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{crop.name}</h4>
                        <p className="text-xs text-gray-500">{crop.quantity}kg • ₹{crop.price}/kg</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-emerald-600 px-2 py-1 bg-emerald-50 rounded-lg uppercase">
                        {crop.status}
                      </span>
                      <button onClick={() => handleDelete(crop._id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400 italic">No listings found. Add your first crop!</div>
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Quick Actions</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 group"
              >
                <span className="flex items-center justify-center gap-2">
                  <Sprout size={18} /> Add New Crop
                </span>
              </button>

              <button
                onClick={fetchWeather}
                className="w-full py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
              >
                {weatherLoading ? <Loader2 size={18} className="animate-spin" /> : <CloudSun size={18} />}
                Check Weather
              </button>

              <button
                onClick={() => setIsCalendarOpen(true)}
                className="w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:border-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                View Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddCropModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} farmerId={user.id} onCropAdded={fetchDashboardData} />

        <FarmerCalendar
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          farmerId={user.id} // Ensure this is passed!
        />
        {isViewAllModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setIsViewAllModalOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">All Active Listings</h2>
                  <p className="text-sm text-gray-500 mt-1">You have {myCrops.length} active listings</p>
                </div>
                <button onClick={() => setIsViewAllModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                <div className="space-y-3">
                  {myCrops.map((crop) => (
                    <div key={crop._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 bg-gradient-to-br ${getCropGradient(crop.name)} rounded-lg text-2xl`}>{getCropImage(crop.name)}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-base">{crop.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {crop.quantity}kg • Price: ₹{crop.price}/kg</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(crop._id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default FarmerDashboard;