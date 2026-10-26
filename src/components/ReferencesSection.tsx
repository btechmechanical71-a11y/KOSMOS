import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  ExternalLink, 
  Copy, 
  Check, 
  Maximize2, 
  X, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Atom, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Download,
  Info,
  Link as LinkIcon,
  Trash2,
  Share2,
  Upload,
  ImageIcon,
  FileUp,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { ReferencePhoto, INITIAL_REFERENCE_PHOTOS } from '../data/referencePhotos';
import { soundEffects } from '../utils/audio';

const STORAGE_KEY = 'astraforge_reference_photos_v1';

// Compress & process uploaded image files to ensure high quality and fast storage
const processUploadedImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1400;
        const MAX_HEIGHT = 1400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const MOCK_PHOTO_IDS = new Set(['ref-photo-1', 'ref-photo-2', 'ref-photo-3', 'ref-photo-4', 'ref-photo-5', 'ref-photo-6']);

export const ReferencesSection: React.FC = () => {
  const [photos, setPhotos] = useState<ReferencePhoto[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Remove the selected default mock photos
          const filtered = parsed.filter(p => !MOCK_PHOTO_IDS.has(p.id));
          return filtered;
        }
      }
    } catch (e) {
      console.error('Failed to load stored reference photos', e);
    }
    return [];
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<ReferencePhoto | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Direct Upload State
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubtitle, setUploadSubtitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'hardware' | 'semiconductor' | 'isolation' | 'containment' | 'thermal'>('hardware');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadSource, setUploadSource] = useState('Direct User Upload');
  const [uploadFileName, setUploadFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for adding custom photo link via URL
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<'hardware' | 'semiconductor' | 'isolation' | 'containment' | 'thermal'>('hardware');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newExternalLink, setNewExternalLink] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSource, setNewSource] = useState('User Mission Reference');

  // Save to localStorage when photos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error('Failed to save reference photos', e);
    }
  }, [photos]);

  // Check URL hash for direct photo link on mount (e.g. #ref=ref-photo-1)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#ref=')) {
      const photoId = hash.replace('#ref=', '');
      const found = photos.find(p => p.id === photoId);
      if (found) {
        setSelectedPhoto(found);
      }
    }
  }, [photos]);

  const handleCopyLink = (photo: ReferencePhoto) => {
    const url = `${window.location.origin}${window.location.pathname}#ref=${photo.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(photo.id);
    soundEffects.playStepPulse();
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Handle direct file selection from device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setUploadFileName(file.name);
      if (!uploadTitle) {
        setUploadTitle(cleanName);
      }
      const dataUrl = await processUploadedImage(file);
      setUploadPreview(dataUrl);
      setIsUploadModalOpen(true);
      soundEffects.playScanChime();
    } catch (err) {
      console.error('Failed to read image file', err);
    }
  };

  const handleDirectUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPreview || !uploadTitle.trim()) return;

    const newPhoto: ReferencePhoto = {
      id: `ref-photo-${Date.now()}`,
      title: uploadTitle.trim(),
      subtitle: uploadSubtitle.trim() || 'Uploaded Flight Blueprint / Photo',
      category: uploadCategory,
      description: uploadDescription.trim() || 'Directly uploaded mission schematic and engineering documentation.',
      imageUrl: uploadPreview,
      externalLink: uploadPreview,
      dateAdded: new Date().toISOString().split('T')[0],
      source: uploadSource.trim() || 'Direct Mission Contributor'
    };

    setPhotos(prev => [newPhoto, ...prev]);
    soundEffects.playSuccessChime();
    setIsUploadModalOpen(false);

    // Reset upload state
    setUploadPreview(null);
    setUploadTitle('');
    setUploadSubtitle('');
    setUploadDescription('');
    setUploadFileName('');
  };

  const handleAddPhotoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    const newPhoto: ReferencePhoto = {
      id: `ref-photo-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Custom Added Reference Photo',
      category: newCategory,
      description: newDescription.trim() || 'Spacecraft engineering reference and mission flight diagram.',
      imageUrl: newImageUrl.trim(),
      externalLink: newExternalLink.trim() || newImageUrl.trim(),
      dateAdded: new Date().toISOString().split('T')[0],
      source: newSource.trim() || 'AstraForge Contributor Repository'
    };

    setPhotos(prev => [newPhoto, ...prev]);
    soundEffects.playSuccessChime();
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setNewImageUrl('');
    setNewExternalLink('');
    setNewDescription('');
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset reference repository to default flight blueprints?')) {
      setPhotos(INITIAL_REFERENCE_PHOTOS);
      localStorage.removeItem(STORAGE_KEY);
      soundEffects.playStepPulse();
    }
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesCategory = activeCategory === 'all' || photo.category === activeCategory;
    const matchesSearch = 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-[1700px] mx-auto py-3 px-3 sm:px-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Hidden file input for direct photo uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111C30] border border-[#26364D] p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#3973FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#3973FF]/15 text-[#00D9FF] border border-[#3973FF]/30 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#00D9FF]" />
                MISSION IMAGERY &amp; PHOTO ARCHIVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                DIRECT PHOTO UPLOAD ACTIVE
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-heading">
                Reference Repository
              </h1>
              <p className="text-sm font-semibold text-[#00D9FF] font-mono mt-0.5">
                Direct Uploads &amp; Public Access Links for Mission Photos, Blueprints, and Hardware Schematics
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#A7B4C8] max-w-3xl leading-relaxed">
              Upload photos directly from your device or browse existing mission schematics. 
              Each photo automatically generates a distinct shareable link and high-resolution inspection view 
              accessible to anyone visiting the app.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0C1628] hover:bg-[#1E2D48] border border-[#26364D] text-[#A7B4C8] hover:text-[#F8FAFC] font-heading text-xs font-bold transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#00D9FF]" />
              <span>Add URL Link</span>
            </button>

            {/* Direct Photo Upload Button */}
            <button
              id="direct-photo-upload-btn"
              onClick={() => {
                if (uploadPreview) {
                  setIsUploadModalOpen(true);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#3973FF] text-[#080F1E] hover:text-[#F8FAFC] font-heading text-xs font-bold shadow-lg shadow-[#00D9FF]/20 transition cursor-pointer active:scale-95 group"
              title="Upload photos directly from your computer, phone or camera"
            >
              <Upload className="w-4 h-4 text-[#080F1E] group-hover:text-[#F8FAFC] group-hover:-translate-y-0.5 transition" />
              <span>Direct Photo Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter, Search and Repository Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111C30] p-3 rounded-xl border border-[#26364D]">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 font-heading text-xs">
          {[
            { id: 'all', label: 'All Photos', count: photos.length },
            { id: 'isolation', label: 'HAP-NRIP Isolation', count: photos.filter(p => p.category === 'isolation').length },
            { id: 'semiconductor', label: 'GaN MOCVD', count: photos.filter(p => p.category === 'semiconductor').length },
            { id: 'containment', label: 'AERCS Containment', count: photos.filter(p => p.category === 'containment').length },
            { id: 'thermal', label: 'AATM-X Thermal', count: photos.filter(p => p.category === 'thermal').length },
            { id: 'hardware', label: 'Spacecraft Facility', count: photos.filter(p => p.category === 'hardware').length },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                soundEffects.playStepPulse();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#3973FF] text-[#F8FAFC] shadow-md shadow-[#3973FF]/20 font-bold border border-[#00D9FF]/30'
                  : 'text-[#A7B4C8] hover:text-[#F8FAFC] hover:bg-[#0C1628]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeCategory === cat.id ? 'bg-[#080F1E] text-[#00D9FF]' : 'bg-[#0C1628] text-[#A7B4C8]'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input & reset */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photos, schematics..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          <button
            onClick={handleResetToDefaults}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-mono transition cursor-pointer"
            title="Reset repository to default mission photos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Direct Drag & Drop Photo Upload Banner */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="rounded-2xl border-2 border-dashed border-[#00D9FF]/30 hover:border-[#00D9FF]/70 bg-[#0C1628] hover:bg-[#111C30] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition cursor-pointer group"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-[#111C30] border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-lg shadow-[#00D9FF]/10 group-hover:scale-105 transition-transform">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC] font-heading flex items-center gap-2">
              <span>Upload Mission Photo or Blueprint Directly</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#3973FF]/20 text-[#00D9FF] border border-[#3973FF]/40 font-mono">
                CLICK TO CHOOSE FILE
              </span>
            </h3>
            <p className="text-xs text-[#A7B4C8] font-mono mt-0.5">
              Supports PNG, JPG, WebP, SVG from your phone, laptop, or camera. Each upload generates an accessible link.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="shrink-0 px-4 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#3973FF] text-[#080F1E] hover:text-[#F8FAFC] font-heading text-xs font-bold shadow-md shadow-[#00D9FF]/20 flex items-center gap-2 transition"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Browse Device Photos</span>
        </button>
      </div>

      {/* Photo Cards Grid or Clean Awaiting State */}
      {photos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#111C30]/50 border border-[#26364D] text-[#A7B4C8] space-y-4 font-mono max-w-xl mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0C1628] border border-[#26364D] flex items-center justify-center text-[#00D9FF] mx-auto shadow-lg shadow-[#00D9FF]/10">
            <Camera className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F8FAFC] font-heading">Reference Repository Ready</h3>
            <p className="text-xs text-[#A7B4C8] leading-relaxed max-w-md mx-auto font-sans">
              Sample photo cards have been cleared. Upload your mission photos directly from your device or provide photo links to generate accessible public links.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#3973FF] text-[#080F1E] hover:text-[#F8FAFC] text-xs font-heading font-bold transition flex items-center gap-2 mx-auto cursor-pointer shadow-md shadow-[#00D9FF]/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo File</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              id={photo.id}
              className="group rounded-2xl bg-[#111C30] border border-[#26364D] hover:border-[#00D9FF]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-[#00D9FF]/5"
            >
              <div>
                {/* Photo Preview Container */}
                <div 
                  onClick={() => {
                    setSelectedPhoto(photo);
                    soundEffects.playScanChime();
                  }}
                  className="relative h-56 bg-[#080F1E] overflow-hidden cursor-pointer"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] via-transparent to-transparent opacity-80" />

                  {/* Category Badge & Expand Icon */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#080F1E]/90 backdrop-blur-md border border-[#3973FF]/50 text-[#00D9FF]">
                      {photo.category}
                    </span>
                    
                    <span className="w-8 h-8 rounded-lg bg-[#080F1E]/90 backdrop-blur-md border border-[#26364D] flex items-center justify-center text-[#A7B4C8] group-hover:text-[#F8FAFC] group-hover:border-[#00D9FF]/60 transition">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Subtitle tag at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[11px] font-mono text-[#00D9FF] font-semibold line-clamp-1 drop-shadow">
                      {photo.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#00D9FF] transition line-clamp-1 font-heading">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-[#A7B4C8] mt-1 leading-relaxed line-clamp-2 font-sans">
                      {photo.description}
                    </p>
                  </div>

                  {/* Specifications Highlights */}
                  {photo.specifications && (
                    <div className="p-2.5 rounded-xl bg-[#0C1628] border border-[#26364D] space-y-1 font-mono text-[11px]">
                      {Object.entries(photo.specifications).slice(0, 2).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center text-[#A7B4C8]">
                          <span className="text-[#A7B4C8]/60">{k}:</span>
                          <span className="text-[#F8FAFC] font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer with Direct Links */}
              <div className="p-4 pt-2 border-t border-[#26364D] flex items-center justify-between gap-2 font-mono text-xs">
                
                {/* Left Action: Inspect Photo Modal */}
                <button
                  onClick={() => {
                    setSelectedPhoto(photo);
                    soundEffects.playScanChime();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 font-heading font-bold transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>View Full Photo</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {/* Copy Direct Share Link */}
                  <button
                    onClick={() => handleCopyLink(photo)}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                      copiedId === photo.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-[#0C1628] border-[#26364D] hover:border-[#00D9FF]/50 text-[#A7B4C8] hover:text-[#F8FAFC]'
                    }`}
                    title="Copy shareable link to this photo"
                  >
                    {copiedId === photo.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {/* Open External Original Photo Link */}
                  <a
                    href={photo.externalLink || photo.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#0C1628] border border-[#26364D] hover:border-[#00D9FF]/50 text-[#A7B4C8] hover:text-[#F8FAFC] transition cursor-pointer"
                    title="Open photo URL in new browser tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Delete button for user-added photos */}
                  {photo.id.startsWith('ref-photo-') && (
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-400 hover:bg-rose-900/60 transition cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && filteredPhotos.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-3 font-mono">
          <Camera className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm">No photos match your current filter or search criteria.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Direct Photo Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl p-5 space-y-4 font-mono text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Direct Photo Upload
                  </h2>
                  <p className="text-[10px] text-slate-400">Add local image file to the public reference repository</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDirectUploadSubmit} className="space-y-4">
              
              {/* Photo Preview or File Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Select Photo File {uploadFileName && <span className="text-emerald-400 text-[10px]">({uploadFileName})</span>}
                </label>
                
                {uploadPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-500/50 bg-slate-950">
                    <img 
                      src={uploadPreview} 
                      alt="Uploaded preview" 
                      className="max-h-56 w-full object-contain mx-auto bg-slate-950 p-2"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700 text-[10px] font-mono flex items-center gap-1 shadow-md"
                      >
                        <FileUp className="w-3 h-3 text-emerald-400" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-8 text-center bg-slate-950/60 hover:bg-slate-950 transition cursor-pointer space-y-2"
                  >
                    <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-slate-300 font-bold text-xs">Click to browse or drop photo from device</p>
                    <p className="text-slate-500 text-[10px]">PNG, JPG, WebP supported</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., GaN Reactor Epitaxial Susceptor Chamber"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subtitle / Subsystem</label>
                <input
                  type="text"
                  value={uploadSubtitle}
                  onChange={(e) => setUploadSubtitle(e.target.value)}
                  placeholder="e.g., Ultra-High Vacuum Hardware Assembly"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-white placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="hardware">Spacecraft Hardware</option>
                    <option value="semiconductor">GaN Semiconductor</option>
                    <option value="isolation">HAP-NRIP Isolation</option>
                    <option value="containment">AERCS Containment</option>
                    <option value="thermal">AATM-X Thermal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Source / Attribution</label>
                  <input
                    type="text"
                    value={uploadSource}
                    onChange={(e) => setUploadSource(e.target.value)}
                    placeholder="e.g., ISRO / Space Foundry Lab"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Details regarding hardware components, specs, or flight test data..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-white placeholder-slate-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Permanent link will be generated</span>
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadPreview || !uploadTitle.trim()}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload &amp; Generate Link</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Full Screen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-violet-500/50 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40 uppercase">
                  {selectedPhoto.category}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white font-mono truncate">
                  {selectedPhoto.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(selectedPhoto)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition"
                  title="Copy direct share link"
                >
                  {copiedId === selectedPhoto.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === selectedPhoto.id ? 'Copied' : 'Share Link'}</span>
                </button>

                <a
                  href={selectedPhoto.externalLink || selectedPhoto.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-bold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Photo</span>
                </a>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image View */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/90">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-slate-800"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2 font-mono text-xs">
              <p className="text-slate-300 leading-relaxed font-sans text-sm">
                {selectedPhoto.description}
              </p>
              
              <div className="flex flex-wrap items-center justify-between text-slate-500 text-[11px] pt-1">
                <span>Source: {selectedPhoto.source}</span>
                <span>Direct Access: <span className="text-violet-400 select-all font-mono">{`${window.location.origin}${window.location.pathname}#ref=${selectedPhoto.id}`}</span></span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Custom Photo Link via URL Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-violet-500/50 rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4 font-mono text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Add Photo via URL Link
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Provide any image URL link (direct web URL, Cloudinary, Imgur, or cloud storage). 
              A dedicated accessible link and card will be generated for all visitors.
            </p>

            <form onSubmit={handleAddPhotoUrl} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., GaN Susceptor Induction Coil Assembly"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subtitle / Subsystem</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g., Ultra-High Vacuum Heating Stage"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Photo Image URL *</label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">External Document / Article Link (Optional)</label>
                <input
                  type="url"
                  value={newExternalLink}
                  onChange={(e) => setNewExternalLink(e.target.value)}
                  placeholder="https://example.com/spec-sheet"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="hardware">Spacecraft Hardware</option>
                    <option value="semiconductor">GaN Semiconductor</option>
                    <option value="isolation">HAP-NRIP Isolation</option>
                    <option value="containment">AERCS Containment</option>
                    <option value="thermal">AATM-X Thermal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Source / Credit</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g., ISRO Flight Payload Group"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief description of what is depicted in the photo..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  Create Photo Link
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
