import { useState, useEffect, useCallback, memo } from 'react';
import * as api from './api';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Users, 
  ChefHat, 
  Settings, 
  Bell, 
  Search, 
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowRight,
  MapPin,
  Home,
  Brush,
  ChevronDown,
  Instagram,
  Facebook,
  Phone,
  Mail,
  Heart,
  ShoppingCart,
  Minus,
  X,
  Eye,
  EyeOff,
  Package
} from 'lucide-react';

import { MenuComponent } from './components/MenuComponent';
import { LocationsComponent } from './components/LocationsComponent';
import { ImageWithSkeleton } from './components/ImageWithSkeleton';
import { ClientNavbar } from './components/layout/ClientNavbar';
import { CartDrawer } from './components/layout/CartDrawer';
import { ClientFooter } from './components/layout/ClientFooter';
import { ClientMobileNav } from './components/layout/ClientMobileNav';

import { ClientHomeView } from './views/client/ClientHomeView';
import { ClientHistoryView } from './views/client/ClientHistoryView';
import { ClientLoginView } from './views/client/ClientLoginView';
import { ClientConfirmationView } from './views/client/ClientConfirmationView';
import { PaymentModal } from './components/layout/PaymentModal';
import { FloatingDecorations } from './components/FloatingDecorations';

import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminTopbar } from './components/layout/AdminTopbar';
import { AdminNotifications } from './components/layout/AdminNotifications';

import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminTablesView } from './views/admin/AdminTablesView';
import { AdminQueueView } from './views/admin/AdminQueueView';
import { AdminKitchenView } from './views/admin/AdminKitchenView';
import { AdminInventarioView } from './views/admin/AdminInventarioView';
import { AdminCashierView } from './views/admin/AdminCashierView';
import { AdminAnalyticsView } from './views/admin/AdminAnalyticsView';
import { AdminSettingsView } from './views/admin/AdminSettingsView';

export default function App() {
  const [appMode, setAppMode] = useState('client'); 
  const [clientView, setClientView] = useState('home'); 
  const [myTicket, setMyTicket] = useState(() => JSON.parse(localStorage.getItem('myTicket') || 'null'));
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [clientOrderHistory, setClientOrderHistory] = useState(() => JSON.parse(localStorage.getItem('clientOrders') || '[]'));
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tables, setTables] = useState([]);
  const [queue, setQueue] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [biStats, setBiStats] = useState(null);
  const [billingTables, setBillingTables] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [apiError, setApiError] = useState(null);

  const [assigningQueueId, setAssigningQueueId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setCurrentUser(user);
        if (user.rol === 'ADMIN') setAppMode('admin');
      } catch(e) { localStorage.removeItem('user'); }
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      const queueData = await api.getQueue();
      setQueue(queueData.map(t => ({
        id: t.id,
        name: t.nombreCliente,
        size: t.tamanoGrupo,
        waitTime: t.tiempoEsperaEstimado || 10,
        status: t.estado
      })));
      
      const savedTicketStr = localStorage.getItem('myTicket');
      if (savedTicketStr) {
        try {
           const savedTicket = JSON.parse(savedTicketStr);
           const ticketInfo = await api.getTicketStatus(savedTicket.id);
           if (ticketInfo.estado !== savedTicket.status) {
              const updatedTicket = { ...savedTicket, status: ticketInfo.estado };
              setMyTicket(updatedTicket);
              localStorage.setItem('myTicket', JSON.stringify(updatedTicket));
           }
        } catch (err) {
           if (err.message && (err.message.includes('404') || err.message.includes('no encontrado') || err.message.includes('No encontrado'))) {
              setMyTicket(null);
              localStorage.removeItem('myTicket');
           }
        }
      }
      
      const productosData = await api.getProductos();
      setMenu(productosData.map(p => ({
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        stock: p.stock,
        imagenUrl: p.imagenUrl,
        disponible: p.disponible,
        categoria: p.categoria || 'General' 
      })));
    } catch(e) { }

    if (currentUser && api.getToken() && currentUser.rol !== 'CLIENTE') {
      try {
        const role = currentUser.rol;
        const [mesasData, comandasData, statsData, billingData, biData] = await Promise.all([
          (role === 'ADMIN' || role === 'ANFITRION') ? api.getMesas().catch(() => null) : Promise.resolve(null),
          (role === 'ADMIN' || role === 'COCINERO') ? api.getComandas().catch(() => null) : Promise.resolve(null),
          (role === 'ADMIN' || role === 'ANFITRION') ? api.getDashboardStats().catch(() => null) : Promise.resolve(null),
          (role === 'ADMIN' || role === 'CAJERO') ? api.getMesasFacturacion().catch(() => null) : Promise.resolve(null),
          (role === 'ADMIN') ? api.getBiStats().catch(() => null) : Promise.resolve(null),
        ]);
        if (mesasData) setTables(mesasData.map(m => ({
          id: m.id,
          name: `Mesa ${m.numero}`,
          capacity: m.capacidad,
          status: m.estado,
          waiter: m.meseroAsignado,
          timeSeated: m.tiempoOcupada || 0
        })));
        if (comandasData) {
          const fetchedOrders = comandasData.map(c => {
            let tableStr = c.mesaNumero !== -1 ? `Mesa ${c.mesaNumero}` : 'Sin Mesa (Walk-in)';
            let itemsList = c.items ? c.items.split(',').map(i => i.trim()) : [];
            let isAnon = false;
            
            if (c.mesaNumero === -1 && itemsList[0] && itemsList[0].startsWith('[')) {
              const match = itemsList[0].match(/\[(.*?)\]/);
              if (match) {
                 tableStr = match[1]; // Sets table to "Ticket: Juan"
                 itemsList[0] = itemsList[0].replace(/\[.*?\]\s*/, '');
              }
            }

            return {
              id: c.id,
              table: tableStr,
              items: itemsList,
              status: c.estado,
              time: c.tiempoPreparacion || 0
            };
          });
          setOrders(fetchedOrders);

          // Sincronizar estados para el historial del cliente
          setClientOrderHistory(prev => {
            const updated = prev.map(histOrder => {
               // Encontrar la comanda en el backend que corresponda.
               // Como el backend autogenera el ID de DB y el frontend usa 'SS-..', 
               // compararemos por historyDbId si lo guardamos en handleCheckout.
               const backendMatch = fetchedOrders.find(fo => fo.id === histOrder.dbId);
               if (backendMatch) {
                  return { ...histOrder, status: backendMatch.status };
               }
               return histOrder;
            });
            localStorage.setItem('clientOrders', JSON.stringify(updated));
            return updated;
          });
        }
        if (statsData) setDashboardStats(statsData);
        if (billingData) setBillingTables(billingData);
        if (biData) setBiStats(biData);
      } catch(e) { }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 8000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const addNotification = useCallback((msg, type) => {
    const id = Date.now();
    setNotifications(prev => [{ id, msg, type }, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const handleAddToCart = useCallback((item) => {
    if (item.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        if (existing.qty >= item.stock) return prev;
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    addNotification(`${item.nombre} agregado al carrito`, 'success');
  }, [addNotification]);

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newQty = c.qty + delta;
      if (newQty < 1) return c;
      const menuItem = menu.find(m => m.id === id);
      if (menuItem && newQty > menuItem.stock) return c;
      return { ...c, qty: newQty };
    }));
  };

  const cartSubtotal = cart.reduce((sum, c) => sum + c.precio * c.qty, 0);
  const cartIGV = cartSubtotal * 0.18;
  const cartTotal = cartSubtotal + cartIGV;
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const handleAuth = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name') || email.split('@')[0];

    setIsAuthLoading(true);
    try {
      let response;
      if (authMode === 'register') {
        response = await api.register(name, email, password);
      } else {
        response = await api.login(email, password);
      }
      
      api.setToken(response.token);
      const user = {
        id: response.usuario.id,
        name: response.usuario.nombre,
        email: response.usuario.email,
        rol: response.usuario.rol
      };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.rol === 'ADMIN' || user.rol === 'ANFITRION' || user.rol === 'COCINERO' || user.rol === 'CAJERO') {
        setAppMode('admin');
        if (user.rol === 'COCINERO') setActiveTab('kitchen');
        else if (user.rol === 'CAJERO') setActiveTab('cashier');
        else if (user.rol === 'ANFITRION') setActiveTab('tables');
        else setActiveTab('dashboard');
      } else {
        setClientView('home');
      }
      addNotification(`¡Bienvenido, ${user.name}!`, 'success');
      fetchAllData();
    } catch (err) {
      addNotification(err.message || 'Error de autenticación', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      setClientView('login');
      addNotification('Inicia sesión para confirmar tu pedido', 'warning');
      return;
    }
    
    setIsCheckoutLoading(true);
    try {
      const itemsString = cart.map(c => `${c.qty}x ${c.nombre}`).join(', ');
      
      let customerName = currentUser ? currentUser.name : 'Cliente Anónimo';
      if (myTicket) customerName = myTicket.name;
      const prefix = `[Ticket: ${customerName}] `;
      
      const finalItems = prefix + itemsString;
      
      const apiOrder = await api.createComanda(null, finalItems, cartTotal);
      
      const deducciones = {};
      cart.forEach(item => {
        deducciones[item.id] = item.qty;
      });
      await api.reducirStock(deducciones);
      
      const orderNum = `SS-${Date.now().toString().slice(-6)}`;
      const newOrderObj = {
        id: orderNum,
        dbId: apiOrder.id,
        items: [...cart],
        subtotal: cartSubtotal,
        igv: cartIGV,
        total: cartTotal,
        time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('es-PE'),
        estimatedMinutes: cart.length * 8 + 5,
        status: apiOrder.estado || 'PREPARANDO'
      };
      
      setConfirmedOrder(newOrderObj);
      
      setClientOrderHistory(prev => {
        const newHistory = [newOrderObj, ...prev];
        localStorage.setItem('clientOrders', JSON.stringify(newHistory));
        return newHistory;
      });
      
      setCart([]);
      setShowCart(false);
      setClientView('history');
      fetchAllData();
    } catch(err) {
      addNotification(err.message || 'Error al procesar el pedido', 'error');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleJoinQueue = async (e) => {
    e.preventDefault();
    const name = e.target.customerName.value;
    const size = parseInt(e.target.partySize.value);
    if (!name || !size) return;
    
    try {
      const ticket = await api.joinQueue(name, size);
      const mapped = {
        id: ticket.id,
        name: ticket.nombreCliente,
        size: ticket.tamanoGrupo,
        waitTime: ticket.tiempoEsperaEstimado || (queue.length * 5 + 10),
        status: ticket.estado
      };
      setQueue(prev => [...prev, mapped]);
      setMyTicket(mapped);
      localStorage.setItem('myTicket', JSON.stringify(mapped));
      addNotification(`Ticket creado: ${name}`, 'success');
      
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const publicVapidKey = 'BMyz-xYtM_1gWb_-J98OqE9tXYmK-c3Hj_s6tN8qJ9wLgS-wUaH2E5_qL0mJtYkH9e_gK7wP5xL0M8_qJ1e_k=';
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          });
          await api.subscribeToPush(subscription, ticket.id).catch(err => console.error('Push update error', err));
        }
      }
    } catch (err) {
      addNotification(err.message || 'Error al unirse a la cola', 'error');
    }
  };

  const handleCancelQueue = async () => {
    if (!myTicket) return;
    try {
      await api.cancelTicket(myTicket.id);
    } catch (err) {
      addNotification(err.message || 'Error al cancelar ticket', 'error');
    } finally {
      setMyTicket(null);
      localStorage.removeItem('myTicket');
      setShowCancelModal(false);
    }
  };

  const handleAssignTable = async (queueItem, tableId) => {
    try {
      await api.assignTableToTicket(queueItem.id, tableId);
      setQueue(prev => prev.filter(q => q.id !== queueItem.id));
      if (myTicket?.id === queueItem.id) {
         setMyTicket(null);
         localStorage.removeItem('myTicket');
      }
      setAssigningQueueId(null);
      addNotification(`${queueItem.name} asignado a Mesa ${tableId}`, 'success');
      fetchAllData();
    } catch (err) {
      addNotification(err.message || 'Error al asignar mesa', 'error');
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const accion = action === 'PREPARANDO' ? 'INICIAR_PREPARACION' : action === 'LISTO' ? 'MARCAR_LISTO' : 'ENTREGAR';
      await api.changeComandaStatus(orderId, accion);
      fetchAllData();
    } catch (err) {
      addNotification(err.message || 'Error en comanda', 'error');
    }
  };

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    api.setToken(null);
    localStorage.removeItem('user');
    setMyTicket(null);
    localStorage.removeItem('myTicket');
    setAppMode('client');
    setClientView('home');
    setCart([]);
    addNotification('Sesión cerrada', 'info');
  }, [addNotification]);

  if (appMode === 'client') {
    return (
      <div className="min-h-screen bg-[#08080A] text-gray-100 flex flex-col relative overflow-hidden pb-16 md:pb-0">
        
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img src="/images/hero-bg.png" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080A]/60 via-[#08080A]/85 to-[#08080A]"></div>
        </div>
        <div className="fixed top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-[120px] pointer-events-none z-0 animate-float"></div>
        <div className="fixed bottom-40 right-20 w-96 h-96 bg-red-500/8 rounded-full blur-[150px] pointer-events-none z-0 animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none z-0 animate-float" style={{animationDelay: '3s'}}></div>

        <ClientNavbar 
          clientView={clientView} 
          setClientView={setClientView} 
          currentUser={currentUser} 
          cartCount={cartCount} 
          setShowCart={setShowCart} 
          handleLogout={handleLogout} 
        />

        <main className="flex-1 flex flex-col p-4 md:p-8 relative overflow-y-auto custom-scrollbar z-10">
          
          {clientView === 'home' && <FloatingDecorations />}

          <div className={`${clientView === 'menu' ? 'max-w-[1400px]' : 'max-w-5xl'} w-full mx-auto flex-1 flex flex-col justify-center transition-all duration-500`}>
            
            {clientView === 'home' && (
              <ClientHomeView 
                myTicket={myTicket} 
                queue={queue} 
                handleJoinQueue={handleJoinQueue} 
                setShowCancelModal={setShowCancelModal} 
                clearTicket={() => {
                  setMyTicket(null);
                  localStorage.removeItem('myTicket');
                }}
              />
            )}

            {clientView === 'menu' && <MenuComponent menu={menu} onAddToCart={handleAddToCart} />}
            {clientView === 'locations' && <LocationsComponent />}
            
            {clientView === 'history' && (
              <ClientHistoryView 
                clientOrderHistory={clientOrderHistory} 
                setClientView={setClientView} 
              />
            )}

            {clientView === 'login' && (
              <ClientLoginView 
                authMode={authMode} 
                setAuthMode={setAuthMode} 
                handleAuth={handleAuth} 
                isAuthLoading={isAuthLoading} 
                showPassword={showPassword} 
                setShowPassword={setShowPassword} 
              />
            )}

            {clientView === 'confirmation' && (
              <ClientConfirmationView 
                confirmedOrder={confirmedOrder} 
                setConfirmedOrder={setConfirmedOrder} 
                setClientView={setClientView} 
              />
            )}

          </div>
        </main>

        <CartDrawer 
          showCart={showCart} 
          setShowCart={setShowCart} 
          cart={cart} 
          cartCount={cartCount} 
          setClientView={setClientView} 
          updateQty={updateQty} 
          removeFromCart={removeFromCart} 
          cartSubtotal={cartSubtotal} 
          cartIGV={cartIGV} 
          cartTotal={cartTotal} 
          handleCheckout={handleCheckout} 
          isCheckoutLoading={isCheckoutLoading} 
          setShowPaymentModal={setShowPaymentModal}
        />

        <PaymentModal
          show={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          total={cartTotal}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            handleCheckout();
          }}
        />

        <ClientFooter setClientView={setClientView} />
        <ClientMobileNav clientView={clientView} setClientView={setClientView} />

        {showCancelModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-[#121214] border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-down">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">¿Abandonar la cola?</h3>
                <p className="text-gray-400 text-sm mb-6">Perderás tu turno actual y tendrás que volver a registrarte si deseas una mesa.</p>
                <div className="flex space-x-3">
                   <button onClick={()=>setShowCancelModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-300 font-medium transition-colors">Conservar turno</button>
                   <button onClick={handleCancelQueue} className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 font-medium transition-colors">Sí, abandonar</button>
                </div>
             </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-gray-100 font-sans overflow-hidden">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} currentUser={currentUser} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <AdminTopbar activeTab={activeTab} />
        <AdminNotifications notifications={notifications} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === 'dashboard' && <AdminDashboardView queue={queue} tables={tables} orders={orders} dashboardStats={dashboardStats} />}
          {activeTab === 'analytics' && <AdminAnalyticsView biStats={biStats} />}
          {activeTab === 'inventory' && <AdminInventarioView menu={menu} fetchAllData={fetchAllData} addNotification={addNotification} />}
          {activeTab === 'tables' && <AdminTablesView tables={tables} fetchAllData={fetchAllData} addNotification={addNotification} />}
          {activeTab === 'cashier' && <AdminCashierView billingTables={billingTables} fetchAllData={fetchAllData} addNotification={addNotification} />}
          {activeTab === 'queue' && <AdminQueueView queue={queue} assigningQueueId={assigningQueueId} setAssigningQueueId={setAssigningQueueId} tables={tables} handleAssignTable={handleAssignTable} />}
          {activeTab === 'kitchen' && <AdminKitchenView orders={orders} handleOrderAction={handleOrderAction} />}
          {activeTab === 'settings' && <AdminSettingsView addNotification={addNotification} />}
        </div>
      </main>
    </div>
  );
}
