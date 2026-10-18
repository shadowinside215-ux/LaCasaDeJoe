import React, { useState } from 'react';
import {
  Shield,
  Utensils,
  FolderTree,
  Image as ImageIcon,
  Building,
  LogOut,
  LogIn,
  Save,
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sliders,
  Database,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../lib/authContext.tsx';
import {
  BusinessSettings,
  MenuCategory,
  MenuItem,
  GalleryItem
} from '../../types/restaurant.ts';
import {
  updateBusinessSettings,
  saveMenuCategory,
  deleteMenuCategory,
  saveMenuItem,
  deleteMenuItem,
  saveGalleryItem,
  deleteGalleryItem,
  seedInitialDataIfEmpty
} from '../../lib/firestoreService.ts';
import { buildCloudinaryUrl } from '../../lib/cloudinary.ts';
import { uploadImageFile, compressDataUriIfNeeded } from '../../lib/cloudinaryUpload.ts';

interface AdminDashboardProps {
  settings: BusinessSettings;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  galleryItems: GalleryItem[];
  onRefreshData: () => Promise<void>;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  categories,
  menuItems,
  galleryItems,
  onRefreshData,
  onExitAdmin,
}) => {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'items' | 'categories' | 'gallery' | 'deploy'>('overview');

  // Business settings form state
  const [businessForm, setBusinessForm] = useState<BusinessSettings>({ ...settings });
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Logo upload state
  const [logoUploading, setLogoUploading] = useState<boolean>(false);
  const [logoUploadMsg, setLogoUploadMsg] = useState<string>('');

  // Item form modal
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [itemPhotoUploading, setItemPhotoUploading] = useState(false);

  // Category form modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<MenuCategory> | null>(null);

  // Gallery form modal
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [galleryPhotoUploading, setGalleryPhotoUploading] = useState(false);

  // Seed status
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string>('');

  // STRICT AUTHENTICATION GUARD
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#070d17] text-[#f4efe6] pt-28 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#0f1a2c] border border-[#22354f] rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-[#16253c] text-[#c49756] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#263c5d] shadow-lg">
            <Shield className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-editorial text-[#fbf8f2] mb-2">
            Administrator Authentication
          </h2>
          <p className="text-xs text-[#9ab0cd] leading-relaxed mb-6">
            To manage restaurant settings, upload logos, or edit dishes, you must sign in as authorized administrator:
            <br />
            <strong className="text-[#c49756] text-sm mt-1 inline-block font-mono">dragonballsam86@gmail.com</strong>
          </p>

          {user && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-300 mb-6 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div>
                Signed in as <strong>{user.email}</strong>. This account is not authorized. Please switch to dragonballsam86@gmail.com.
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={loginWithGoogle}
              className="w-full py-3 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c49756]/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>

            {user && (
              <button
                onClick={logout}
                className="w-full py-2.5 bg-[#162338] hover:bg-[#1f324d] text-[#cbd7e6] text-xs font-medium rounded-lg transition-colors border border-[#273d5c] cursor-pointer"
              >
                Sign Out & Switch Account
              </button>
            )}

            <button
              onClick={onExitAdmin}
              className="w-full py-2.5 text-xs text-[#7e94b0] hover:text-[#f4efe6] transition-colors cursor-pointer"
            >
              ← Return to Restaurant Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Logo Upload via Cloudinary
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setLogoUploadMsg('Optimizing and uploading logo...');
    try {
      const res = await uploadImageFile(
        file,
        businessForm.cloudinaryCloudName || 'demo',
        businessForm.cloudinaryUploadPreset || 'ml_default'
      );
      if (res.success && res.url) {
        setBusinessForm((prev) => ({ ...prev, logoUrl: res.url }));
        setLogoUploadMsg(
          res.source === 'cloudinary'
            ? 'Logo uploaded to Cloudinary CDN! Click "Save Settings" below to persist.'
            : 'Logo compressed & optimized (under 50KB). Click "Save Settings" below to persist.'
        );
      } else {
        setLogoUploadMsg(res.message || 'Logo upload failed.');
      }
    } catch (err) {
      setLogoUploadMsg('Upload failed: ' + String(err));
    } finally {
      setLogoUploading(false);
    }
  };

  // Handle Dish Photo Upload via Cloudinary
  const handleDishPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    setItemPhotoUploading(true);
    try {
      const res = await uploadImageFile(
        file,
        businessForm.cloudinaryCloudName || 'demo',
        businessForm.cloudinaryUploadPreset || 'ml_default'
      );
      if (res.success && res.url) {
        setEditingItem((prev) => ({ ...prev, imageUrl: res.url }));
      } else {
        alert(res.message || 'Photo upload failed');
      }
    } catch (err) {
      alert('Upload failed: ' + String(err));
    } finally {
      setItemPhotoUploading(false);
    }
  };

  // Handle Gallery Photo Upload via Cloudinary
  const handleGalleryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingGallery) return;

    setGalleryPhotoUploading(true);
    try {
      const res = await uploadImageFile(
        file,
        businessForm.cloudinaryCloudName || 'demo',
        businessForm.cloudinaryUploadPreset || 'ml_default'
      );
      if (res.success && res.url) {
        setEditingGallery((prev) => ({ ...prev, imageUrl: res.url }));
      } else {
        alert(res.message || 'Gallery upload failed');
      }
    } catch (err) {
      alert('Upload failed: ' + String(err));
    } finally {
      setGalleryPhotoUploading(false);
    }
  };

  // Handle Business Form Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving changes to Firestore...');
    try {
      let payloadToSave = { ...businessForm };
      // Prevent Firestore document size limit if user has a large logo stored in state
      if (
        payloadToSave.logoUrl &&
        payloadToSave.logoUrl.startsWith('data:image/') &&
        payloadToSave.logoUrl.length > 150000
      ) {
        setSaveStatus('Optimizing logo size to fit database limits...');
        payloadToSave.logoUrl = await compressDataUriIfNeeded(payloadToSave.logoUrl, 100000);
        setBusinessForm(payloadToSave);
      }

      await updateBusinessSettings(payloadToSave);
      await onRefreshData();
      setSaveStatus('Settings updated successfully!');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (err) {
      console.error(err);
      setSaveStatus('Error saving settings: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Seed database
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedResult('Writing verified baseline to Firestore...');
    try {
      const res = await seedInitialDataIfEmpty();
      setSeedResult(res.message);
      await onRefreshData();
    } catch (err) {
      setSeedResult('Failed to write data: ' + String(err));
    } finally {
      setIsSeeding(false);
    }
  };

  // Menu Item Actions
  const handleOpenNewItem = () => {
    const firstCat = categories[0] || { id: 'starters', name: 'Starters' };
    setEditingItem({
      id: `dish-${Date.now()}`,
      name: '',
      description: '',
      price: null,
      priceOnRequest: false,
      categoryId: firstCat.id,
      categoryName: firstCat.name,
      imageUrl: '',
      imageAlt: '',
      isAvailable: true,
      isFeatured: false,
      dietary: [],
      order: menuItems.length + 1,
    });
    setItemModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem({ ...item });
    setItemModalOpen(true);
  };

  const handleSaveItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.id) return;

    const targetCategory = categories.find((c) => c.id === editingItem.categoryId);
    const completeItem: MenuItem = {
      id: editingItem.id,
      name: editingItem.name,
      description: editingItem.description || '',
      price: editingItem.price ? Number(editingItem.price) : null,
      priceOnRequest: editingItem.priceOnRequest ?? false,
      categoryId: editingItem.categoryId || 'starters',
      categoryName: targetCategory?.name || editingItem.categoryName || 'Starters',
      imageUrl: editingItem.imageUrl || '',
      imageAlt: editingItem.imageAlt || editingItem.name,
      isAvailable: editingItem.isAvailable ?? true,
      isFeatured: editingItem.isFeatured ?? false,
      dietary: editingItem.dietary || [],
      order: editingItem.order ?? menuItems.length + 1,
    };

    try {
      await saveMenuItem(completeItem);
      setItemModalOpen(false);
      setEditingItem(null);
      await onRefreshData();
    } catch (err) {
      alert('Error saving dish: ' + String(err));
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this dish?')) return;
    try {
      await deleteMenuItem(id);
      await onRefreshData();
    } catch (err) {
      alert('Error removing dish: ' + String(err));
    }
  };

  // Category Actions
  const handleOpenNewCategory = () => {
    setEditingCat({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      order: categories.length + 1,
      description: '',
      isActive: true,
    });
    setCatModalOpen(true);
  };

  const handleEditCategory = (cat: MenuCategory) => {
    setEditingCat({ ...cat });
    setCatModalOpen(true);
  };

  const handleSaveCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name || !editingCat.id) return;

    const slug = editingCat.slug || editingCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const completeCat: MenuCategory = {
      id: editingCat.id,
      name: editingCat.name,
      slug,
      order: editingCat.order ?? categories.length + 1,
      description: editingCat.description || '',
      isActive: editingCat.isActive ?? true,
    };

    try {
      await saveMenuCategory(completeCat);
      setCatModalOpen(false);
      setEditingCat(null);
      await onRefreshData();
    } catch (err) {
      alert('Error saving category: ' + String(err));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Items under this category should be reassigned.')) return;
    try {
      await deleteMenuCategory(id);
      await onRefreshData();
    } catch (err) {
      alert('Error deleting category: ' + String(err));
    }
  };

  const handleReorderCategory = async (cat: MenuCategory, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex((c) => c.id === cat.id);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === categories.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetCat = categories[targetIndex];

    const currentOrder = cat.order;
    const targetOrder = targetCat.order;

    await saveMenuCategory({ ...cat, order: targetOrder });
    await saveMenuCategory({ ...targetCat, order: currentOrder });
    await onRefreshData();
  };

  // Gallery Actions
  const handleOpenNewGallery = () => {
    setEditingGallery({
      id: `gal-${Date.now()}`,
      title: '',
      caption: '',
      imageUrl: '',
      category: 'dishes',
      altText: '',
      isFeatured: false,
      order: galleryItems.length + 1,
    });
    setGalleryModalOpen(true);
  };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGallery({ ...item });
    setGalleryModalOpen(true);
  };

  const handleSaveGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery || !editingGallery.title || !editingGallery.imageUrl || !editingGallery.id) return;

    const completePhoto: GalleryItem = {
      id: editingGallery.id,
      title: editingGallery.title,
      caption: editingGallery.caption || '',
      imageUrl: editingGallery.imageUrl,
      category: editingGallery.category || 'dishes',
      altText: editingGallery.altText || editingGallery.title,
      isFeatured: editingGallery.isFeatured ?? false,
      order: editingGallery.order ?? galleryItems.length + 1,
    };

    try {
      await saveGalleryItem(completePhoto);
      setGalleryModalOpen(false);
      setEditingGallery(null);
      await onRefreshData();
    } catch (err) {
      alert('Error saving photo: ' + String(err));
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Remove this photo from the restaurant gallery?')) return;
    try {
      await deleteGalleryItem(id);
      await onRefreshData();
    } catch (err) {
      alert('Error removing photo: ' + String(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#070d17] text-[#f4efe6] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#1b2b40] mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c49756] font-semibold mb-1">
              <Shield className="w-4 h-4 text-[#c49756]" />
              <span>Verified Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#fbf8f2]">
              La Casa De Joe · Administration
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#a0b5ce] hidden sm:inline">
              Admin: <strong className="text-[#f4efe6] font-mono">{user?.email}</strong>
            </span>

            <button
              onClick={logout}
              className="px-3 py-1.5 bg-[#162338] hover:bg-[#1f324d] text-xs font-semibold text-[#f4efe6] rounded border border-[#273d5c] flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="px-3.5 py-1.5 bg-[#1b2b40] hover:bg-[#253954] text-xs font-semibold text-[#cbd7e6] rounded transition-colors cursor-pointer"
            >
              Exit to Website
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#18263a] scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: Sliders },
            { id: 'business', label: 'Business, Logo & Cloudinary', icon: Building },
            { id: 'items', label: 'Menu Dishes', icon: Utensils },
            { id: 'categories', label: 'Categories', icon: FolderTree },
            { id: 'gallery', label: 'Gallery Photos', icon: ImageIcon },
            { id: 'deploy', label: 'Deployment & Setup', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#c49756] text-[#0b1320]'
                    : 'bg-[#111c2c] text-[#8fa5c2] hover:text-[#f4efe6] hover:bg-[#18273d]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-[#101a29] border border-[#1d2d44] rounded-lg">
                <span className="text-xs text-[#8299b5] uppercase tracking-wider block mb-1">
                  Google Score
                </span>
                <div className="text-3xl font-bold font-editorial text-[#d4a86a] tabular-nums mb-1">
                  {settings.googleRating.toFixed(1)} / 5.0
                </div>
                <span className="text-xs text-[#6e85a3]">
                  {settings.googleReviewsCount} verified reviews
                </span>
              </div>

              <div className="p-6 bg-[#101a29] border border-[#1d2d44] rounded-lg">
                <span className="text-xs text-[#8299b5] uppercase tracking-wider block mb-1">
                  Active Menu Dishes
                </span>
                <div className="text-3xl font-bold font-editorial text-[#f4efe6] tabular-nums mb-1">
                  {menuItems.length} Dishes
                </div>
                <span className="text-xs text-[#6e85a3]">
                  Pan Con Tomate, Patatas Bravas, Plateaux
                </span>
              </div>

              <div className="p-6 bg-[#101a29] border border-[#1d2d44] rounded-lg">
                <span className="text-xs text-[#8299b5] uppercase tracking-wider block mb-1">
                  Glovo Store Link
                </span>
                <div className="text-sm font-semibold text-emerald-400 truncate mb-1">
                  Active & Verified
                </div>
                <span className="text-xs text-[#6e85a3] truncate block">
                  {settings.glovoUrl || 'Configured'}
                </span>
              </div>

              <div className="p-6 bg-[#101a29] border border-[#1d2d44] rounded-lg">
                <span className="text-xs text-[#8299b5] uppercase tracking-wider block mb-1">
                  Restaurant Logo
                </span>
                <div className="text-sm font-semibold text-[#f4efe6] mb-1">
                  {settings.logoUrl ? 'Logo Configured' : 'No Logo Uploaded'}
                </div>
                <span className="text-xs text-[#6e85a3]">
                  Upload via Cloudinary in settings
                </span>
              </div>

            </div>

            {/* Sync Initial Data button */}
            <div className="p-6 bg-[#111d2e] border border-[#223550] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-editorial text-[#fbf8f2] mb-1">
                  Sync Verified Data to Firestore
                </h3>
                <p className="text-xs text-[#8fa5c2] max-w-xl">
                  Write the verified business data and authentic dishes (Pan Con Tomate 28 MAD, Patatas Bravas 20 MAD, Plateaux 120 MAD) directly to your Firestore database.
                </p>
              </div>

              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="px-5 py-2.5 bg-[#c49756] hover:bg-[#d4a86a] disabled:opacity-50 text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{isSeeding ? 'Writing...' : 'Sync to Firestore'}</span>
              </button>
            </div>

            {seedResult && (
              <div className="p-3 bg-[#17253a] border border-[#273c5b] rounded text-xs text-[#a0b5ce]">
                {seedResult}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BUSINESS INFORMATION & LOGO UPLOAD */}
        {activeTab === 'business' && (
          <form onSubmit={handleSaveSettings} className="space-y-8">
            
            {/* Restaurant Logo Card */}
            <div className="bg-[#101a29] border border-[#1d2d44] rounded-lg p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#1b2b40] mb-6">
                <div>
                  <h3 className="text-lg font-bold font-editorial text-[#fbf8f2]">
                    Restaurant Logo
                  </h3>
                  <p className="text-xs text-[#8fa5c2]">
                    Upload an official logo image via Cloudinary to appear on the website navbar and footer.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Logo Preview */}
                <div className="w-32 h-32 bg-[#09111c] border-2 border-dashed border-[#22354f] rounded-xl flex items-center justify-center p-3 overflow-hidden shrink-0">
                  {businessForm.logoUrl ? (
                    <img
                      src={businessForm.logoUrl}
                      alt="Restaurant Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-[#556984] text-xs">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span>No Logo</span>
                    </div>
                  )}
                </div>

                {/* Upload & Management Actions */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-4 py-2 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer shadow-md">
                      <Upload className="w-4 h-4" />
                      <span>{logoUploading ? 'Uploading...' : 'Upload Logo File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={logoUploading}
                        className="hidden"
                      />
                    </label>

                    {businessForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setBusinessForm({ ...businessForm, logoUrl: '' })}
                        className="px-3.5 py-2 bg-[#1b2b40] hover:bg-red-950/80 text-xs text-[#cbd7e6] hover:text-red-300 rounded border border-[#2b3e58] hover:border-red-800 transition-colors cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>

                  {logoUploadMsg && (
                    <div className="text-xs text-[#d4a86a] flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{logoUploadMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-[#8fa5c2] mb-1">
                      Or direct logo image URL:
                    </label>
                    <input
                      type="text"
                      value={businessForm.logoUrl || ''}
                      onChange={(e) => setBusinessForm({ ...businessForm, logoUrl: e.target.value })}
                      placeholder="https://res.cloudinary.com/... or image link"
                      className="w-full px-3 py-1.5 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* General Business Form */}
            <div className="bg-[#101a29] border border-[#1d2d44] rounded-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1b2b40]">
                <div>
                  <h3 className="text-lg font-bold font-editorial text-[#fbf8f2]">
                    Restaurant Information & Settings
                  </h3>
                  <p className="text-xs text-[#8fa5c2]">
                    Update contact details, Google review figures, and external links.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>

              {saveStatus && (
                <div className="p-3 bg-[#162942] border border-[#27446b] rounded text-xs text-[#a0c4f2]">
                  {saveStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={businessForm.name}
                    onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Telephone Number
                  </label>
                  <input
                    type="text"
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Full Address (Sala Al Jadida)
                  </label>
                  <input
                    type="text"
                    value={businessForm.address}
                    onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Official Glovo Store URL
                  </label>
                  <input
                    type="url"
                    value={businessForm.glovoUrl}
                    onChange={(e) => setBusinessForm({ ...businessForm, glovoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Google Maps Search / Directions URL
                  </label>
                  <input
                    type="text"
                    value={businessForm.googleMapsUrl}
                    onChange={(e) => setBusinessForm({ ...businessForm, googleMapsUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Google Rating (out of 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={businessForm.googleRating}
                    onChange={(e) => setBusinessForm({ ...businessForm, googleRating: parseFloat(e.target.value) || 4.8 })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Google Reviews Count
                  </label>
                  <input
                    type="number"
                    value={businessForm.googleReviewsCount}
                    onChange={(e) => setBusinessForm({ ...businessForm, googleReviewsCount: parseInt(e.target.value) || 82 })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Cloudinary Cloud Name
                  </label>
                  <input
                    type="text"
                    value={businessForm.cloudinaryCloudName}
                    onChange={(e) => setBusinessForm({ ...businessForm, cloudinaryCloudName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Cloudinary Upload Preset (Unsigned)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ml_default or restaurant_preset"
                    value={businessForm.cloudinaryUploadPreset || ''}
                    onChange={(e) => setBusinessForm({ ...businessForm, cloudinaryUploadPreset: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={businessForm.instagramUrl}
                    onChange={(e) => setBusinessForm({ ...businessForm, instagramUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Closing Time
                  </label>
                  <input
                    type="text"
                    value={businessForm.closingTime}
                    onChange={(e) => setBusinessForm({ ...businessForm, closingTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                    Our Story Text
                  </label>
                  <textarea
                    rows={4}
                    value={businessForm.storyText}
                    onChange={(e) => setBusinessForm({ ...businessForm, storyText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09111c] border border-[#22354f] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#1b2b40] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>

          </form>
        )}

        {/* TAB 3: MENU ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-editorial text-[#fbf8f2]">
                  Manage Menu Dishes ({menuItems.length})
                </h3>
                <p className="text-xs text-[#8fa5c2]">
                  Add, edit, or remove seafood dishes and pricing.
                </p>
              </div>

              <button
                onClick={handleOpenNewItem}
                className="px-4 py-2 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="bg-[#101a29] border border-[#1d2d44] rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#142236] text-[#8ea3c0] border-b border-[#1f3047] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Dish Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Price (MAD)</th>
                    <th className="py-3 px-4">Photo</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2a40]">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#142033] transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#f4efe6]">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-[#8fa5c2]">
                        {item.categoryName}
                      </td>
                      <td className="py-3 px-4 text-[#9bb0cb] max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="py-3 px-4 tabular-nums font-semibold text-[#d4a86a]">
                        {item.price ? `${item.price},00 MAD` : 'On Request'}
                      </td>
                      <td className="py-3 px-4 text-[#7187a4]">
                        {item.imageUrl ? (
                          <span className="text-emerald-400">Has Photo</span>
                        ) : (
                          <span className="text-[#647994]">No Photo</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-1.5 text-[#9ab0cb] hover:text-[#f4efe6] bg-[#162438] rounded hover:bg-[#203450]"
                          title="Edit Dish"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 bg-[#162438] rounded hover:bg-[#203450]"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-editorial text-[#fbf8f2]">
                  Manage Menu Categories ({categories.length})
                </h3>
                <p className="text-xs text-[#8fa5c2]">
                  Create, edit, toggle visibility, and reorder categories.
                </p>
              </div>

              <button
                onClick={handleOpenNewCategory}
                className="px-4 py-2 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="bg-[#101a29] border border-[#1d2d44] rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#142236] text-[#8ea3c0] border-b border-[#1f3047] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Dishes Count</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2a40]">
                  {categories.map((cat, idx) => {
                    const count = menuItems.filter((i) => i.categoryId === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-[#142033] transition-colors">
                        <td className="py-3 px-4 tabular-nums font-semibold text-[#8fa5c2]">
                          #{cat.order}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#f4efe6]">
                          {cat.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#7187a4]">
                          {cat.slug}
                        </td>
                        <td className="py-3 px-4 tabular-nums text-[#cbd7e6]">
                          {count} dishes
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] font-medium ${cat.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {cat.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleReorderCategory(cat, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 text-[#9ab0cb] hover:text-[#f4efe6] bg-[#162438] rounded disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorderCategory(cat, 'down')}
                            disabled={idx === categories.length - 1}
                            className="p-1.5 text-[#9ab0cb] hover:text-[#f4efe6] bg-[#162438] rounded disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditCategory(cat)}
                            className="p-1.5 text-[#9ab0cb] hover:text-[#f4efe6] bg-[#162438] rounded hover:bg-[#203450]"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 bg-[#162438] rounded hover:bg-[#203450]"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: GALLERY & CLOUDINARY UPLOAD */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-editorial text-[#fbf8f2]">
                  Gallery Photos & Cloudinary Uploads ({galleryItems.length})
                </h3>
                <p className="text-xs text-[#8fa5c2]">
                  Upload seafood photographs to Cloudinary and organize gallery items.
                </p>
              </div>

              <button
                onClick={handleOpenNewGallery}
                className="px-4 py-2 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload / Add Photo</span>
              </button>
            </div>

            {galleryItems.length === 0 ? (
              <div className="text-center py-12 p-8 bg-[#101a29] border border-[#1d2d44] rounded-lg">
                <ImageIcon className="w-8 h-8 text-[#556984] mx-auto mb-2" />
                <p className="text-sm text-[#8fa5c2] mb-3">No gallery photos currently uploaded.</p>
                <button
                  onClick={handleOpenNewGallery}
                  className="px-4 py-2 bg-[#c49756] text-[#0b1320] text-xs font-semibold rounded"
                >
                  Upload First Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#101a29] border border-[#1d2d44] rounded-lg overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] bg-[#070c14] overflow-hidden">
                      {item.imageUrl && (
                        <img
                          src={buildCloudinaryUrl(item.imageUrl, { width: 500, height: 375, crop: 'fill' }, settings.cloudinaryCloudName)}
                          alt={item.altText || item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-[#cbd7e6] uppercase">
                        {item.category}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold font-editorial text-[#fbf8f2] mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#8fa5c2] line-clamp-2 mb-3">
                          {item.caption}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#1b2a40] flex items-center justify-between">
                        <span className="text-[11px] text-[#6b829e] italic truncate max-w-[65%]">
                          {item.altText || item.title}
                        </span>
                        <div className="space-x-1 shrink-0">
                          <button
                            onClick={() => handleEditGallery(item)}
                            className="p-1 text-[#9ab0cb] hover:text-[#f4efe6] bg-[#162438] rounded"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="p-1 text-red-400 hover:text-red-300 bg-[#162438] rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: DEPLOYMENT & CLOUD SETUP */}
        {activeTab === 'deploy' && (
          <div className="bg-[#101a29] border border-[#1d2d44] rounded-lg p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold font-editorial text-[#fbf8f2] mb-1">
                Vercel Deployment & Production Readiness
              </h3>
              <p className="text-xs text-[#8fa5c2]">
                Guidelines for hosting this application on Vercel with live Firebase and Cloudinary integrations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1b2b40]">
              <div className="p-5 bg-[#142135] border border-[#213450] rounded-lg space-y-3">
                <h4 className="text-sm font-semibold text-[#f4efe6] flex items-center gap-2">
                  <span className="p-1 bg-[#c49756] text-[#0b1320] rounded text-[10px] font-bold">1</span>
                  <span>Vercel Configuration</span>
                </h4>
                <ul className="text-xs text-[#c4d3e6] space-y-1.5 list-disc list-inside">
                  <li>Framework Preset: <strong>Vite</strong></li>
                  <li>Build Command: <strong>npm run build</strong></li>
                  <li>Output Directory: <strong>dist</strong></li>
                  <li>Install Command: <strong>npm install</strong></li>
                </ul>
              </div>

              <div className="p-5 bg-[#142135] border border-[#213450] rounded-lg space-y-3">
                <h4 className="text-sm font-semibold text-[#f4efe6] flex items-center gap-2">
                  <span className="p-1 bg-[#c49756] text-[#0b1320] rounded text-[10px] font-bold">2</span>
                  <span>Cloudinary Image Integration</span>
                </h4>
                <ul className="text-xs text-[#c4d3e6] space-y-1.5 list-disc list-inside">
                  <li>Cloud Name: <strong>{businessForm.cloudinaryCloudName || 'Configured'}</strong></li>
                  <li>Unsigned Preset: <strong>{businessForm.cloudinaryUploadPreset || 'ml_default'}</strong></li>
                  <li>Logo & photo uploads are enabled via Cloudinary API</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* DISH ITEM MODAL */}
      {itemModalOpen && editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-xl bg-[#0f1a2c] border border-[#22354f] rounded-xl p-6 shadow-2xl my-8">
            <h3 className="text-lg font-bold font-editorial text-[#fbf8f2] mb-4">
              {editingItem.id && menuItems.some((i) => i.id === editingItem.id) ? 'Edit Dish' : 'Add New Seafood Dish'}
            </h3>

            <form onSubmit={handleSaveItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Pan Con Tomate"
                  className="w-full px-3 py-2 bg-[#080e18] border border-[#20314a] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                  Category *
                </label>
                <select
                  value={editingItem.categoryId || categories[0]?.id || ''}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.id === e.target.value);
                    setEditingItem({
                      ...editingItem,
                      categoryId: e.target.value,
                      categoryName: cat?.name || 'Starters',
                    });
                  }}
                  className="w-full px-3 py-2 bg-[#080e18] border border-[#20314a] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="e.g. Pain grillé, tomate râpée et anchois."
                  className="w-full px-3 py-2 bg-[#080e18] border border-[#20314a] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                  Price in MAD (e.g. 28)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={editingItem.price ?? ''}
                  onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="e.g. 28"
                  className="w-full px-3 py-2 bg-[#080e18] border border-[#20314a] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                />
              </div>

              {/* Cloudinary Photo Uploader */}
              <div className="p-3 bg-[#080e18] border border-[#20314a] rounded-lg space-y-2">
                <label className="block text-xs font-medium text-[#c4d1e2]">
                  Photo (Optional - Cloudinary Upload)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 bg-[#1a2b42] hover:bg-[#253d5e] text-xs font-medium text-[#f4efe6] rounded cursor-pointer flex items-center gap-1.5 border border-[#2c4568]">
                    <Upload className="w-3.5 h-3.5 text-[#c49756]" />
                    <span>{itemPhotoUploading ? 'Uploading...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDishPhotoUpload}
                      disabled={itemPhotoUploading}
                      className="hidden"
                    />
                  </label>
                  {editingItem.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Clear Photo
                    </button>
                  )}
                </div>
                {editingItem.imageUrl && (
                  <div className="text-[11px] text-emerald-400 truncate">
                    Attached: {editingItem.imageUrl}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#1e2f47] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 bg-[#17253a] hover:bg-[#20324c] text-xs text-[#cbd7e6] rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {catModalOpen && editingCat && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-[#0f1a2c] border border-[#22354f] rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-editorial text-[#fbf8f2] mb-4">
              {editingCat.id && categories.some((c) => c.id === editingCat.id) ? 'Edit Category' : 'Add Category'}
            </h3>

            <form onSubmit={handleSaveCatSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  placeholder="e.g. Starters"
                  className="w-full px-3 py-2 bg-[#080e18] border border-[#20314a] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editingCat.description || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080e18] border border-[#20314a] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#1e2f47] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 bg-[#17253a] hover:bg-[#20324c] text-xs text-[#cbd7e6] rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY PHOTO MODAL */}
      {galleryModalOpen && editingGallery && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-[#0f1a2c] border border-[#22354f] rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-editorial text-[#fbf8f2] mb-4">
              {editingGallery.id && galleryItems.some((g) => g.id === editingGallery.id) ? 'Edit Photo' : 'Upload Photo'}
            </h3>

            <form onSubmit={handleSaveGallerySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingGallery.title || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  placeholder="Photo Title"
                  className="w-full px-3 py-2 bg-[#080e18] border border-[#20314a] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                />
              </div>

              {/* Cloudinary File Upload */}
              <div className="p-3 bg-[#080e18] border border-[#20314a] rounded-lg space-y-2">
                <label className="block text-xs font-medium text-[#c4d1e2]">
                  Upload Image via Cloudinary
                </label>
                <label className="px-3 py-1.5 bg-[#1a2b42] hover:bg-[#253d5e] text-xs font-medium text-[#f4efe6] rounded cursor-pointer flex items-center gap-1.5 border border-[#2c4568] inline-flex">
                  <Upload className="w-3.5 h-3.5 text-[#c49756]" />
                  <span>{galleryPhotoUploading ? 'Uploading...' : 'Choose File to Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryPhotoUpload}
                    disabled={galleryPhotoUploading}
                    className="hidden"
                  />
                </label>
                {editingGallery.imageUrl && (
                  <div className="text-[11px] text-emerald-400 truncate">
                    Attached: {editingGallery.imageUrl}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4d1e2] mb-1">
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingGallery.imageUrl || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080e18] border border-[#20314a] rounded text-xs text-[#f4efe6] focus:border-[#c49756] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#1e2f47] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 bg-[#17253a] hover:bg-[#20324c] text-xs text-[#cbd7e6] rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c49756] hover:bg-[#d4a86a] text-[#0b1320] text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
