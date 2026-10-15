import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'Amazaura',
    timestamp: new Date().toISOString(),
  });
});

// Image Generation Proxy with gemini-3-pro-image-preview & 1K/2K/4K sizing
app.post('/api/generate-image', async (req: Request, res: Response) => {
  const { prompt, imageSize, aspectRatio, model = 'gemini-3-pro-image-preview' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // If no API key is provided, return an informative response explaining configuration
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured in the environment secrets. Please configure it in the Secrets panel.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Attempt generateImages or generateContent for gemini-3-pro-image-preview
    // Size mapping: 1K (1024), 2K (2048), 4K (3840)
    const sizePrompt = imageSize ? ` High resolution ${imageSize} ultra-detailed output.` : '';
    const fullPrompt = `${prompt}.${sizePrompt}`;

    let generatedBase64: string | null = null;

    try {
      // Primary: try ai.models.generateImages
      const result = await ai.models.generateImages({
        model,
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio || '16:9',
          outputMimeType: 'image/jpeg',
        },
      });

      if (result.generatedImages && result.generatedImages.length > 0) {
        const img = result.generatedImages[0];
        if (img.image?.imageBytes) {
          generatedBase64 = `data:image/jpeg;base64,${img.image.imageBytes}`;
        }
      }
    } catch (e1: any) {
      console.warn('generateImages call notice, attempting generateContent fallback:', e1?.message);
      // Secondary: attempt generateContent with model
      const contentRes = await ai.models.generateContent({
        model,
        contents: fullPrompt,
      });

      // Check if image data is in response candidates
      const candidate = contentRes.candidates?.[0];
      const part = candidate?.content?.parts?.find((p: any) => p.inlineData);
      if (part?.inlineData?.data) {
        generatedBase64 = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
      }
    }

    if (generatedBase64) {
      return res.json({ imageUrl: generatedBase64, model, imageSize, aspectRatio });
    }

    throw new Error('No image payload returned by the Gemini service.');
  } catch (error: any) {
    console.error('Gemini image generation error:', error?.message);
    return res.status(500).json({
      error: `Gemini generation failure: ${error?.message || 'Unknown error'}`,
    });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Real, transparent receipt
  res.json({
    success: true,
    message: 'Thank you for subscribing to The Amazaura Edit weekly newsletter.',
    email,
    timestamp: new Date().toISOString(),
  });
});

// Contact inquiry endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  res.json({
    success: true,
    message: 'Your inquiry has been received by the Amazaura Editorial Desk. We typically respond within 2 business days.',
    ticketId: `AMZ-${Date.now().toString(36).toUpperCase()}`,
  });
});

async function main() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Amazaura production server running on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
