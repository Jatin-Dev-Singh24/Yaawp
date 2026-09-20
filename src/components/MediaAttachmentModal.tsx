import React, { useState } from 'react';
import { X, Image as ImageIcon, Film, FileText, Send, Check, Loader2, Zap } from 'lucide-react';
import { uploadMediaToSupabase } from '../lib/supabaseStorage';
import { convertImageToWebP, extractVideoThumbnailWebP } from '../utils/mediaConverter';

interface MediaAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (mediaUrl: string, mediaType: 'image' | 'video' | 'file', caption: string, fileName?: string) => void;
  recipientName: string;
}

export const MediaAttachmentModal: React.FC<MediaAttachmentModalProps> = ({
  isOpen,
  onClose,
  onSend,
  recipientName
}) => {
  const [activeType, setActiveType] = useState<'image' | 'video' | 'file'>('image');
  const [caption, setCaption] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string>(
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
  );
  const [fileName, setFileName] = useState('kodak_portra_400.webp');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  if (!isOpen) return null;

  const sampleImages = [
    {
      title: '35mm Camera Rig',
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      fileName: 'leica_m6_rangefinder.jpg'
    },
    {
      title: 'Neon Tokyo Street',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      fileName: 'tokyo_cyberpunk_night.jpg'
    },
    {
      title: 'Moody Highlands',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      fileName: 'scottish_fog_moody.jpg'
    },
    {
      title: 'Golden Hour Silhouette',
      url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
      fileName: 'sunlight_prism_portrait.jpg'
    }
  ];

  const sampleVideos = [
    {
      title: 'Cinematic B-Roll Sample',
      url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      fileName: 'sony_fx3_color_grade.mp4'
    },
    {
      title: 'Slow Motion Waterfall',
      url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
      fileName: 'waterfall_120fps_raw.mp4'
    }
  ];

  const sampleFiles = [
    {
      title: 'Project Creative Brief & Moodboard',
      url: '#',
      fileName: 'Lumina_Creative_Direction_v2.pdf'
    },
    {
      title: 'Davinci Resolve 3D LUT Pack',
      url: '#',
      fileName: 'Cinematic_Kodak2383_LUT.cube'
    }
  ];

  const handleSend = async () => {
    setIsUploading(true);
    try {
      let finalUrl = selectedUrl;
      if (selectedFile) {
        const uploadRes = await uploadMediaToSupabase(selectedFile, 'messages');
        if (uploadRes.url) {
          finalUrl = uploadRes.url;
        }
      }
      onSend(finalUrl, activeType, caption, fileName);
      setCaption('');
      setSelectedFile(null);
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    try {
      if (file.type.startsWith('video/')) {
        setActiveType('video');
        const fakeUrl = URL.createObjectURL(file);
        setSelectedUrl(fakeUrl);
        setFileName(file.name);
        setSelectedFile(file);
      } else if (file.type.startsWith('image/')) {
        setActiveType('image');
        // Convert any image (PNG, JPG, JPEG, GIF, SVG, BMP) to WebP format
        const converted = await convertImageToWebP(file);
        setSelectedFile(converted.file);
        setSelectedUrl(converted.dataUrl);
        setFileName(converted.file.name);
      } else {
        setActiveType('file');
        setSelectedFile(file);
        setSelectedUrl(URL.createObjectURL(file));
        setFileName(file.name);
      }
    } catch (err) {
      console.warn('Error converting file:', err);
      setSelectedFile(file);
      setSelectedUrl(URL.createObjectURL(file));
      setFileName(file.name);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Share Media</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Sending to {recipientName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Category Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 p-2 gap-1 bg-slate-50/80 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={() => {
              setActiveType('image');
              setSelectedUrl(sampleImages[0].url);
              setFileName(sampleImages[0].fileName);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeType === 'image'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Photo
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveType('video');
              setSelectedUrl(sampleVideos[0].url);
              setFileName(sampleVideos[0].fileName);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeType === 'video'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Video
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveType('file');
              setSelectedUrl(sampleFiles[0].url);
              setFileName(sampleFiles[0].fileName);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeType === 'file'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Document
          </button>
        </div>

        {/* Selection Area */}
        <div className="p-4 flex-1 max-h-[300px] overflow-y-auto space-y-3">
          {activeType === 'image' && (
            <div className="grid grid-cols-2 gap-2.5">
              {sampleImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedUrl(img.url);
                    setFileName(img.fileName);
                  }}
                  className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedUrl === img.url
                      ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  {selectedUrl === img.url && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {img.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeType === 'video' && (
            <div className="grid grid-cols-2 gap-2.5">
              {sampleVideos.map((vid, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedUrl(vid.url);
                    setFileName(vid.fileName);
                  }}
                  className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedUrl === vid.url
                      ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <img src={vid.url} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Film className="w-6 h-6 text-white/90" />
                  </div>
                  {selectedUrl === vid.url && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {vid.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeType === 'file' && (
            <div className="space-y-2">
              {sampleFiles.map((f, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedUrl(f.url);
                    setFileName(f.fileName);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedUrl === f.url
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500'
                      : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{f.fileName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{f.title}</p>
                    </div>
                  </div>
                  {selectedUrl === f.url && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom File Upload Button */}
          <div className="pt-2 space-y-1.5">
            <label className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-400/50 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              {isConverting ? (
                <span className="flex items-center gap-1.5 text-indigo-500 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing media...
                </span>
              ) : (
                <span>Choose custom file from device...</span>
              )}
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* Caption & Send */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/60 dark:bg-slate-950/60">
          <input
            type="text"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Add an optional caption..."
            className="flex-1 px-3.5 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isUploading}
            className="px-4 py-2 rounded-full bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
