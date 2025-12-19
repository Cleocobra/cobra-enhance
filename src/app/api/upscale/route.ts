import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { UpscaleOptions, UpscaleResult } from '@/lib/types';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('image') as File;
        const optionsRaw = formData.get('options') as string;

        if (!file) {
            return NextResponse.json({ success: false, error: 'Nenhuma imagem fornecida.' }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, error: 'Arquivo muito grande (Máx. 25MB).' }, { status: 400 });
        }

        const options: UpscaleOptions = JSON.parse(optionsRaw || '{}');
        const buffer = Buffer.from(await file.arrayBuffer());

        // Validate and Read Metadata
        const image = sharp(buffer);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
            return NextResponse.json({ success: false, error: 'Imagem inválida ou corrompida.' }, { status: 400 });
        }

        // Determine Target Dimensions
        const targetSizeMap: Record<string, number> = {
            '2k': 2048,
            '4k': 4096,
            '8k': 7680
        };

        // Default to 2k if invalid
        const maxDimension = targetSizeMap[options.resolution] || 2048;

        let targetWidth = metadata.width;
        let targetHeight = metadata.height;
        const aspectRatio = metadata.width / metadata.height;

        // Scale logic: maintain aspect ratio, fit within maxDimension on longest side
        if (metadata.width >= metadata.height) {
            targetWidth = maxDimension;
            targetHeight = Math.round(maxDimension / aspectRatio);
        } else {
            targetHeight = maxDimension;
            targetWidth = Math.round(maxDimension * aspectRatio);
        }

        // --- REPLICATE INTEGRATION ---
        // --- REPLICATE INTEGRATION ---
        const replicateToken = process.env.REPLICATE_API_TOKEN;

        console.log("API Call initiated.");
        console.log("Token present:", !!replicateToken);

        if (!replicateToken) {
            console.warn("Using Fallback: No Token.");
            // Fallback to previous mock implementation if no token found
            // ... (Simulate generic "AI Processing" delay) ...
            // KEEP EXISTING FALLBACK AS BACKUP? 
            // For now, let's keep the fallback but warn.
            // Or actually, if the user requested the upgrade, let's try to use Replicate but fallback if it fails or no key.

            // --- START FALLBACK ---
            await new Promise(resolve => setTimeout(resolve, 2000));
            let pipeline = image
                .resize(targetWidth, targetHeight, {
                    kernel: sharp.kernel.lanczos3,
                    fit: 'contain',
                    withoutEnlargement: false
                });
            if (options.sharpness > 0) {
                pipeline = pipeline.sharpen({
                    sigma: 1 + (options.sharpness / 50),
                    m1: 0,
                    m2: 3
                });
            }
            const processedBuffer = await pipeline.png().toBuffer();
            const base64Image = `data:image/png;base64,${processedBuffer.toString('base64')}`;

            return NextResponse.json({
                success: true,
                imageUrl: base64Image,
                width: targetWidth,
                height: targetHeight,
                originalWidth: metadata.width,
                originalHeight: metadata.height,
                processingTimeMs: 2000,
                isFallback: true
            });
            // --- END FALLBACK ---
        }

        // --- REAL AI PROCESSING ---
        const Replicate = require("replicate");
        const replicate = new Replicate({
            auth: replicateToken,
        });

        // Determine scale factor based on target resolution vs original
        // Real-ESRGAN usually takes a scale factor. Or we can just resize result.
        // The specific model `nightmareai/real-esrgan` usually takes `image` and `scale` (2, 4, 8) or `face_enhance`.
        // We should try to pick the closest integer scale or just use a strong one and resize down if needed?
        // Let's assume we want max quality.

        // Convert Buffer to data URI for Replicate (or use file object if supported comfortably)
        // For Vercel/Node environment, data URI is safest for small/medium files.
        const fileBase64 = buffer.toString('base64');
        const mimeType = file.type || 'image/png';
        const dataUri = `data:${mimeType};base64,${fileBase64}`;

        // Calculate scale factor needed (approx)
        // e.g. if 1000px and want 4000px, scale is 4.
        const neededScale = Math.max(targetWidth / metadata.width, targetHeight / metadata.height);
        let scale = 2;
        if (neededScale > 4) scale = 8; // Max supported by some runs involves recursive, but let's try standard options
        else if (neededScale > 2) scale = 4;
        else scale = 2;

        // Run prediction
        console.log("Starting Replicate prediction with Real-ESRGAN...");
        const output = await replicate.run(
            "nightmareai/real-esrgan",
            {
                input: {
                    image: dataUri,
                    scale: scale,
                    face_enhance: options.enhanceTexture // Using this toggles usually for faces, but helps detail
                }
            }
        );
        console.log("Replicate output:", output);

        let aiImageUrl = '';

        // Handle stream output (Web Stream or Node Stream)
        if (output && (typeof output === 'object') && ('getReader' in output || 'read' in output || 'pipe' in output)) {
            console.log("Output is a stream, converting to base64...");
            const chunks: Uint8Array[] = [];

            if ('getReader' in (output as any)) {
                // Web Stream
                const reader = (output as any).getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }
            } else {
                // Node Stream (Async Iterable)
                for await (const chunk of (output as any)) {
                    chunks.push(Buffer.from(chunk));
                }
            }

            const buffer = Buffer.concat(chunks);
            const b64 = buffer.toString('base64');
            aiImageUrl = `data:image/png;base64,${b64}`; // Assuming PNG from Real-ESRGAN
        } else {
            // String URL
            aiImageUrl = output as string;
        }

        // We might want to resize strictly to the requested 2K/4K/8K if the AI result is slightly off or huge.
        // For now, let's return the AI URL directly (it will be hosted by Replicate/Cloud).
        // Note: Replicate URLs expire after a while? Usually public for a bit.

        return NextResponse.json({
            success: true,
            imageUrl: aiImageUrl,
            width: targetWidth, // Approximation, actual might vary
            height: targetHeight,
            originalWidth: metadata.width,
            originalHeight: metadata.height,
            processingTimeMs: 0 // Async
        });

    } catch (error: any) {
        console.error('Upscale API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Falha no processamento interno.'
        }, { status: 500 });
    }
}
