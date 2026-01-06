
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import LoadingState from './components/LoadingState';
import { generateAuraImage } from './services/geminiService';
import { GeneratedImage, GenerationStatus } from './types';

const SYSTEM_PROMPT = "Una fotografía nocturna granulada, iluminada con flash, ambientada en una gasolinera, con la sensación de un paparazzi crudo o una sesión de moda underground. En primer plano, un hombre de la imagen subida es captado en el momento en que muerde una rebanada de pizza; la sostiene de forma relajada y natural con ambas manos, la salsa está ligeramente esparcida y el movimiento está claramente congelado. Lleva una chaqueta bomber acolchada, negra, mate y oversize, y gafas de sol deportivas de cristales oscuros a pesar de ser de noche; su expresión facial es tranquila, distante e indiferente: cool, sin pretensiones, real. Si el hombre tiene algún accesorio en la imagen de referencia, manténlo, no lo quites ni lo cambies. Al fondo, en lugar de coches, hay un moderno avión de combate militar estacionado en la gasolinera como si estuviera repostando; se distingue por su silueta clara, su cuerpo de metal mate y sus luces de navegación rojas y blancas que brillan débilmente. El fuerte flash de la cámara crea brillos intensos sobre la tela, el metal y la comida, mientras sumerge el fondo en sombras profundas. Las frías luces de neón azul-blanco de la estación se reflejan en las superficies. Grano ligero, encuadre imperfecto y una sensación de realidad sincera y sin intervención.";

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    
    try {
      // Use the updated SYSTEM_PROMPT and the optional uploaded image
      const imageUrl = await generateAuraImage(SYSTEM_PROMPT, selectedImage || undefined);
      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt: SYSTEM_PROMPT,
        timestamp: Date.now()
      };
      setResult(newImage);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
      setStatus(GenerationStatus.ERROR);
    }
  }, [selectedImage]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center px-4 py-12 max-w-7xl mx-auto w-full">
        {/* Intro Section */}
        <section className="text-center mb-16 space-y-4 max-w-3xl">
          <span className="mono text-[10px] bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-white/60">
            Advanced Neural Aesthetics Engine v3.1
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter uppercase italic leading-none">
            Aura <span className="text-white/40">Noir</span> Protocol
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            The creative prompt is pre-configured for the ultimate paparazzi aesthetic. Upload a reference to guide the subject or just initiate the capture.
          </p>
        </section>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-start">
          
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl space-y-6">
              <div className="flex justify-between items-end">
                <label className="mono text-[10px] uppercase tracking-widest text-white/40">Reference Identity</label>
                {selectedImage && (
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="text-[10px] uppercase underline text-white/20 hover:text-white transition-colors"
                  >
                    Remove Image
                  </button>
                )}
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-64 border-2 border-dashed transition-all cursor-pointer rounded-xl flex flex-col items-center justify-center overflow-hidden relative ${
                  selectedImage ? 'border-white/40' : 'border-white/10 hover:border-white/20 bg-black/50'
                }`}
              >
                {selectedImage ? (
                  <>
                    <img src={selectedImage} className="w-full h-full object-cover opacity-60" alt="Upload preview" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                       <span className="bg-black/80 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest">Change Identity</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <svg className="w-8 h-8 mx-auto text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-white/40 uppercase tracking-widest">Tap to upload visual reference</p>
                    <p className="text-[10px] text-white/20 italic">(Optional: Helps the model interpret the person)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={status === GenerationStatus.LOADING}
                className="w-full py-4 bg-white text-black font-extrabold uppercase tracking-widest text-xs rounded-xl hover:bg-white/90 disabled:bg-white/20 disabled:text-black/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {status === GenerationStatus.LOADING ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Developing...
                  </>
                ) : (
                  "Initiate Capture"
                )}
              </button>
              
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
                  <p className="text-xs text-red-400 font-mono italic">Error: {error}</p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="mt-1 w-4 h-4 flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-wider">Aesthetic Locked</p>
                <p className="text-[11px] text-white/40 leading-relaxed font-light">
                  System Protocol is hardcoded to generate high-contrast night scenes with grainy film texture and paparazzi lighting. The prompt is secure and non-editable.
                </p>
              </div>
            </div>
          </div>

          {/* Result Area */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="aspect-video bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative group shadow-2xl shadow-black">
              {status === GenerationStatus.LOADING ? (
                <LoadingState />
              ) : result ? (
                <>
                  <img 
                    src={result.url} 
                    alt="Generated Vision" 
                    className="w-full h-full object-cover grayscale-[0.1] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <div className="flex justify-between w-full items-center">
                      <div className="mono text-[10px] uppercase tracking-widest">
                        Ref: {result.timestamp}<br/>
                        Aesthetic: Paparazzi / Noir
                      </div>
                      <a 
                        href={result.url} 
                        download={`aura-noir-${result.timestamp}.png`}
                        className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                      >
                        Export Print
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/20 p-12 text-center space-y-4">
                  <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center opacity-20">
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                     </svg>
                  </div>
                  <p className="text-sm italic uppercase tracking-[0.2em] font-light">Waiting for capture initiation...</p>
                </div>
              )}
            </div>

            {result && (
              <div className="flex gap-4">
                 <div className="flex-grow p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="mono text-[10px] uppercase text-white/40 mb-1">Exposure Status</p>
                      <p className="text-xs uppercase font-bold tracking-widest">Protocol Executed</p>
                    </div>
                    <div className="text-right">
                      <p className="mono text-[10px] uppercase text-white/40 mb-1">Film Format</p>
                      <p className="text-xs font-bold tracking-widest">35mm Digital Synthesis</p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-white/10 py-12 px-8 text-center space-y-4 bg-black">
        <div className="flex justify-center gap-8 mb-4">
           <div className="w-2 h-2 bg-white rounded-full"></div>
           <div className="w-2 h-2 bg-white/50 rounded-full"></div>
           <div className="w-2 h-2 bg-white/20 rounded-full"></div>
        </div>
        <p className="mono text-[10px] uppercase tracking-[0.5em] text-white/40">
          Aura Noir Aesthetic Protocol &copy; 2024
        </p>
        <p className="text-[10px] text-white/20 italic">
          Proprietary Neural Image Synthesis Model
        </p>
      </footer>
    </div>
  );
};

export default App;
