
import React, { useState, useRef } from 'react';
import { Upload, Camera, RefreshCw, Wand2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { visualizeFlooring } from '../services/geminiService';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

const VisualizerPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualizedImage, setVisualizedImage] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setVisualizedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processVisualization = async () => {
    if (!image || !selectedMaterial) return;

    setIsProcessing(true);
    setError(null);
    try {
      const result = await visualizeFlooring(image, `${selectedMaterial.name} - ${selectedMaterial.category}. ${selectedMaterial.description}`);
      setVisualizedImage(result);
    } catch (err: any) {
      setError("Unable to process image. Please ensure your API key is valid and the image is clear.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setVisualizedImage(null);
    setSelectedMaterial(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">AI Floor Studio</h1>
          <p className="text-neutral-500 max-w-2xl">Transform your space in three steps: Upload your room, select a material, and let Gemini AI handle the rest.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Workspace */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[32px] p-4 shadow-xl shadow-neutral-200/50 border border-neutral-100 relative min-h-[500px] flex items-center justify-center overflow-hidden">
              {!image ? (
                <div className="text-center p-12">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upload your room photo</h3>
                  <p className="text-neutral-400 mb-8 max-w-sm">Use a clear, well-lit photo of the room you'd like to redesign.</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-neutral-900 text-white px-8 py-3 rounded-full font-medium hover:bg-neutral-800 transition-all"
                  >
                    Browse Files
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div className="w-full h-full relative group">
                  <img 
                    src={visualizedImage || image} 
                    alt="Room Preview" 
                    className="w-full h-full object-cover rounded-2xl max-h-[70vh]"
                  />
                  
                  {isProcessing && (
                    <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl text-white">
                      <RefreshCw className="w-12 h-12 animate-spin mb-4 text-amber-500" />
                      <p className="font-medium text-lg">Reimagining your floors...</p>
                      <p className="text-neutral-300 text-sm mt-2 px-8 text-center">Gemini is rendering the material into your space.</p>
                    </div>
                  )}

                  {!isProcessing && visualizedImage && (
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-neutral-200/50">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-sm font-semibold text-neutral-800">Visualized</span>
                    </div>
                  )}

                  {!isProcessing && (
                    <button 
                      onClick={reset}
                      className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-white transition-all text-sm font-medium border border-neutral-200"
                    >
                      <ArrowLeft size={16} /> New Photo
                    </button>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 text-red-800">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                1. Select Material
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {PRODUCTS.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedMaterial(product)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedMaterial?.id === product.id ? 'border-amber-500 scale-95' : 'border-transparent hover:border-neutral-200'
                    }`}
                  >
                    <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                    {selectedMaterial?.id === product.id && (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {selectedMaterial && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">{selectedMaterial.category}</p>
                  <p className="font-bold text-neutral-900">{selectedMaterial.name}</p>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{selectedMaterial.description}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                2. Render Result
              </h4>
              <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                Clicking render will send your photo and selection to Gemini AI to generate a professional mockup.
              </p>
              <button
                disabled={!image || !selectedMaterial || isProcessing}
                onClick={processVisualization}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  !image || !selectedMaterial || isProcessing 
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                  : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-200'
                }`}
              >
                <Wand2 size={20} /> Generate Mockup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerPage;
