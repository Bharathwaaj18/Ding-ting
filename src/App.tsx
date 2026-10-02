import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/Customer/HeroBanner';
import { MenuCatalog } from './components/Customer/MenuCatalog';
import { CartDrawer } from './components/Customer/CartDrawer';
import { OrderTracker } from './components/Customer/OrderTracker';
import { MyOrdersView } from './components/Customer/MyOrdersView';
import { AuthModal } from './components/Customer/AuthModal';
import { KitchenDisplaySystem } from './components/Staff/KitchenDisplaySystem';
import { StaffDashboard } from './components/Staff/StaffDashboard';
import { ManualOrderPOS } from './components/Staff/ManualOrderPOS';
import { MenuManager } from './components/Staff/MenuManager';
import { InventoryManager } from './components/Staff/InventoryManager';
import { ReportsView } from './components/Staff/ReportsView';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { role, customerTab, staffTab } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#0E0617] text-slate-100 font-body selection:bg-[#B2FC00] selection:text-[#0E0617]">
      <Navbar />

      <main className="flex-1">
        {role === 'customer' ? (
          <>
            {customerTab === 'home' && (
              <>
                <HeroBanner />
                <MenuCatalog />
              </>
            )}

            {customerTab === 'menu' && (
              <MenuCatalog />
            )}

            {customerTab === 'cart' && (
              <CartDrawer />
            )}

            {customerTab === 'track' && (
              <OrderTracker />
            )}

            {customerTab === 'orders' && (
              <MyOrdersView />
            )}

            {/* Auth Modal - Rendered ONLY in Customer Store */}
            <AuthModal />
          </>
        ) : (
          /* Staff & Admin Interface Views (No funny mascot overlay) */
          <>
            {staffTab === 'kds' && <KitchenDisplaySystem />}
            {staffTab === 'dashboard' && <StaffDashboard />}
            {staffTab === 'new-order' && <ManualOrderPOS />}
            {staffTab === 'menu-manage' && <MenuManager />}
            {staffTab === 'inventory' && <InventoryManager />}
            {staffTab === 'reports' && <ReportsView />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
