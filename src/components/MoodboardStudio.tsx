import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Download, RefreshCw, X, Sliders, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MoodboardStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImageSize = '1K' | '2K' | '4K';
type AspectRatio = '1:1' | '16:9' | '4:3' | '9:16';

const PRESET_PROMPTS = [
  'Parisian Autumn Capsule: camel double-breasted wool coat, structured ivory tote bag, nude leather heels, and black sunglasses on a Parisian cafe marble table.',
  'Minimalist Golden Hour Skincare Flatlay: amber glass dropper serum bottle, whipped face cream, fresh jasmine blossoms, and travertine pedestal.',
  'Everyday Elegance Jewelry Box: 14k gold layered chains, freshwater baroque pearl drop earrings, and vintage gold watch on raw linen.',
  'Modern Sanctuary Living Room: minimalist bouclé armchair, amber scented candle glowing softly, ceramic vase with eucalyptus on travertine.',
];

export const MoodboardStudio: React.FC<MoodboardStudioProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0]);
  const [imageSize, setImageSize] = useState<ImageSize>('2K');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    '/assets/images/hero_amazaura_luxury_1792048038650.jpg'
  );
  const [history, setHistory] = useState<Array<{ url: string; prompt: string; size: ImageSize; ratio: AspectRatio }>>([
    {
      url: '/assets/images/hero_amazaura_luxury_1792048038650.jpg',
      prompt: 'Amazaura Signature Hero Still Life',
      size: '2K',
      ratio: '16:9',
    },
    {
      url: '/assets/images/edit_versatile_tote_1792048098180.jpg',
      prompt: 'Chic Pebbled Leather Tote on Italian Marble',
      size: '1K',
      ratio: '4:3',
    },
  ]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a creative styling prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageSize,
          aspectRatio,
          model: 'gemini-3-pro-image-preview',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setHistory((prev) => [
          { url: data.imageUrl, prompt, size: imageSize, ratio: aspectRatio },
          ...prev.slice(0, 5),
        ]);
      } else {
        throw new Error('No image returned from generation service.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation service unavailable.';
      setError(
        `${message} (Note: Connect your GEMINI_API_KEY in the Secrets panel to activate live cloud synthesis with gemini-3-pro-image-preview).`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Amazaura Editorial Studio"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 md:p-6"
    >
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-[#FAF7F0] border border-[#C9A24A]/40 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#063D2E] text-white">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-[#C9A24A]/20 text-[#C9A24A]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-editorial font-bold tracking-wide">
                Amazaura Editorial Moodboard Studio
              </h2>
              <p className="text-xs text-[#FAF7F0]/75">
                Generate bespoke editorial visuals using model <span className="font-mono text-[#C9A24A]">gemini-3-pro-image-preview</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close studio modal"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-xl border border-[#F0E7D8] shadow-sm">
            {/* Prompt input */}
            <div className="md:col-span-12 space-y-2">
              <label htmlFor="prompt-input" className="block text-xs font-semibold uppercase tracking-wider text-[#063D2E]">
                Editorial Styling Prompt
              </label>
              <textarea
                id="prompt-input"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a luxury flatlay, outfit capsule, or home vignette..."
                className="w-full p-3 text-sm rounded-lg border border-[#F0E7D8] bg-[#FAF7F0]/50 text-[#252525] focus:outline-none focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]"
              />
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-stone-500 mr-1 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#C9A24A]" /> Inspirations:
                </span>
                {PRESET_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(p)}
                    className="text-[11px] px-2.5 py-1 rounded bg-[#F0E7D8]/60 text-[#063D2E] hover:bg-[#C9A24A]/20 hover:text-[#063D2E] transition-colors truncate max-w-[200px]"
                    title={p}
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Affordance: 1K, 2K, 4K */}
            <div className="md:col-span-6 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#063D2E]">
                Resolution Specification
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      imageSize === size
                        ? 'bg-[#063D2E] text-[#C9A24A] border-[#063D2E] shadow-sm'
                        : 'bg-[#FAF7F0] text-[#252525] border-[#F0E7D8] hover:border-[#C9A24A]'
                    }`}
                  >
                    {size}
                    <span className="block text-[10px] font-normal opacity-80">
                      {size === '1K' ? '1024 px' : size === '2K' ? '2048 px' : '3840 px'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="md:col-span-6 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#063D2E]">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['16:9', '4:3', '1:1', '9:16'] as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-[#063D2E] text-[#C9A24A] border-[#063D2E] shadow-sm'
                        : 'bg-[#FAF7F0] text-[#252525] border-[#F0E7D8] hover:border-[#C9A24A]'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="md:col-span-12 pt-2">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 px-6 bg-[#063D2E] text-[#FAF7F0] hover:bg-[#042D22] active:scale-[0.99] font-medium text-sm rounded-lg border border-[#C9A24A]/60 shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C9A24A]" />
                    <span>Synthesizing with gemini-3-pro-image-preview ({imageSize})...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C9A24A]" />
                    <span>Generate Editorial Visual ({imageSize} · {aspectRatio})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback & Error */}
          {error && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Canvas Preview Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#063D2E] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#C9A24A]" /> Active Moodboard Canvas
              </h3>
              {generatedImageUrl && (
                <a
                  href={generatedImageUrl}
                  download="amazaura-moodboard.jpg"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#063D2E] hover:text-[#C9A24A] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Full Res
                </a>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black/5 border border-[#F0E7D8] flex items-center justify-center min-h-[300px] max-h-[440px]">
              {generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="Generated editorial moodboard visual"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[440px] rounded-lg"
                />
              ) : (
                <div className="text-center p-8 text-stone-400 text-sm">
                  Click generate above to produce high-fidelity visuals
                </div>
              )}
            </div>
          </div>

          {/* History Gallery */}
          {history.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#F0E7D8]">
              <span className="text-xs text-stone-500 font-medium">Session Lookbook Gallery:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setGeneratedImageUrl(item.url);
                      setPrompt(item.prompt);
                    }}
                    className="relative group rounded-lg overflow-hidden border border-[#F0E7D8] aspect-video bg-black/5 hover:border-[#C9A24A] transition-all text-left"
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <span className="text-[10px] text-white font-medium truncate">{item.prompt}</span>
                      <span className="text-[9px] text-[#C9A24A]">{item.size} · {item.ratio}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
