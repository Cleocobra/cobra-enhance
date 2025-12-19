export type Resolution = '2k' | '4k' | '8k';

export interface UpscaleOptions {
    resolution: Resolution;
    enhanceTexture: boolean;
    noiseReduction: number; // 0-100
    sharpness: number; // 0-100
    removeArtifacts: boolean;
}

export interface UpscaleResult {
    success: boolean;
    imageUrl?: string; // Base64 or URL
    width?: number;
    height?: number;
    originalWidth?: number;
    originalHeight?: number;
    error?: string;
    processingTimeMs?: number;
}
