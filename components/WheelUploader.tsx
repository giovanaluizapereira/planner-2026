
import React, { useRef } from 'react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';

interface WheelUploaderProps {
  onImageUpload: (base64: string) => void;
  isAnalyzing: boolean;
  currentImage: string | null;
}

const WheelUploader: React.FC<WheelUploaderProps> = ({ onImageUpload, isAnalyzing, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept="image/png,image/jpeg"
      />
      
      {!currentImage ? (
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="text-indigo-500" size={32} />
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-bold text-lg">Subir Roda da Vida</p>
            <p className="text-slate-400 text-sm">Clique para selecionar seu PNG ou JPEG</p>
          </div>
        </button>
      ) : (
        <div className="relative group rounded-[40px] overflow-hidden shadow-md border border-slate-100">
          <img 
            src={currentImage} 
            alt="Roda da Vida" 
            className="w-full object-cover max-h-96"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors"
            >
              <ImageIcon size={20} />
              Trocar Imagem
            </button>
          </div>
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
              <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
              <p className="text-slate-800 font-bold text-xl">Analisando sua Roda...</p>
              <p className="text-slate-500">Nossa IA está extraindo suas notas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WheelUploader;
