/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { AuthProvider } from './lib/authContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { StorySection } from './components/StorySection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { LocationContactSection } from './components/LocationContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { DishDetailModal } from './components/DishDetailModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import {
  BusinessSettings,
  MenuCategory,
  MenuItem,
  GalleryItem
} from './types/restaurant.ts';
import {
  getBusinessSettings,
  getMenuCategories,
  getMenuItems,
  getGalleryItems,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_GALLERY_ITEMS
} from './lib/firestoreService.ts';
import { testFirestoreConnection } from './lib/firebase.ts';

function RestaurantApp() {
  const [activeView, setActiveView] = useState<'site' | 'admin'>('site');
  const [settings, setSettings] = useState<BusinessSettings>(INITIAL_BUSINESS_SETTINGS);
  const [categories, setCategories] = useState<MenuCategory[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [, setIsLoading] = useState<boolean>(true);

  // Load data from Firestore
  const loadData = useCallback(async () => {
    try {
      const [fetchedSettings, fetchedCategories, fetchedItems, fetchedGallery] = await Promise.all([
        getBusinessSettings(),
        getMenuCategories(),
        getMenuItems(),
        getGalleryItems(),
      ]);

      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedCategories && fetchedCategories.length > 0) setCategories(fetchedCategories);
      setMenuItems(fetchedItems || []);
      setGalleryItems(fetchedGallery || []);
    } catch (err) {
      console.warn('Using baseline data while connecting to Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check initial connection
    testFirestoreConnection();

    // Check if URL hash is admin
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      setActiveView('admin');
    }

    loadData();
  }, [loadData]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setActiveView('admin');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleExploreMenu = () => {
    if (activeView === 'admin') setActiveView('site');
    setTimeout(() => {
      const el = document.getElementById('menu');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFindRestaurant = () => {
    if (activeView === 'admin') setActiveView('site');
    setTimeout(() => {
      const el = document.getElementById('location');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigate = (selector: string) => {
    if (activeView === 'admin') setActiveView('site');
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#0b1320] text-[#f4efe6] flex flex-col font-sans-clean selection:bg-[#c49756] selection:text-[#0b1320]">
      {/* Luxury Scroll Reading Progress Bar */}
      {activeView === 'site' && (
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#c49756] via-[#f5bd56] to-[#e0b77b] z-[70] pointer-events-none shadow-[0_0_10px_rgba(196,151,86,0.6)]"
        />
      )}
      
      {/* Universal Luxury Navbar */}
      <Navbar
        settings={settings}
        activeView={activeView}
        setActiveView={setActiveView}
        onExploreMenu={handleExploreMenu}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminDashboard
            settings={settings}
            categories={categories}
            menuItems={menuItems}
            galleryItems={galleryItems}
            onRefreshData={loadData}
            onExitAdmin={() => setActiveView('site')}
          />
        ) : (
          <>
            {/* 1. Cinematic Hero Section (The ONLY image on the website per user request) */}
            <HeroSection
              settings={settings}
              onExploreMenu={handleExploreMenu}
              onFindRestaurant={handleFindRestaurant}
            />

            {/* 2. Menu & Ordering Section (Zero pictures, direct Glovo ordering & categories) */}
            <MenuSection
              categories={categories}
              items={menuItems}
              onSelectDish={(dish) => setSelectedDish(dish)}
              glovoUrl={settings.glovoUrl}
              phone={settings.phone}
            />

            {/* 3. Restaurant Story & Culinary Heritage (Zero pictures, pure editorial typography) */}
            <StorySection settings={settings} />

            {/* 4. Reviews & Google 4.8 Rating Reputation (Zero pictures) */}
            <ReviewsSection settings={settings} />

            {/* 5. Location, Plus Code, Interactive Map & Contact (Zero stock pictures) */}
            <LocationContactSection settings={settings} />
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Dish Detail Inspection Modal */}
      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          settings={settings}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RestaurantApp />
    </AuthProvider>
  );
}
