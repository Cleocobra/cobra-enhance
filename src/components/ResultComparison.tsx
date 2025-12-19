'use client';
import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import styles from './ResultComparison.module.css';
import { Download, ArrowLeftRight } from 'lucide-react';
import { UpscaleResult } from '@/lib/types';

interface Props {
    original: File | null;
    result: UpscaleResult;
    onReset: () => void;
}

export function ResultComparison({ original, result, onReset }: Props) {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const [originalUrl, setOriginalUrl] = useState<string>('');

    useEffect(() => {
        if (original) {
            const url = URL.createObjectURL(original);
            setOriginalUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [original]);

    const handleMove = (clientX: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPos(percent);
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        if (e.buttons > 0) handleMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    const onClick = (e: MouseEvent) => handleMove(e.clientX);

    if (!result.imageUrl || !originalUrl) return null;

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.compareContainer}
                ref={containerRef}
                onMouseMove={onMouseMove}
                onTouchMove={onTouchMove}
                onClick={onClick}
            >
                {/* Bottom Layer: After (Full) */}
                <img
                    src={result.imageUrl}
                    className={styles.image}
                    alt="Processado"
                    draggable={false}
                />

                <div className={styles.labelAfter}>Depois (Upscaled)</div>

                {/* Top Layer: Before (Clipped) */}
                <div className={styles.overlay} style={{ width: `${sliderPos}%` }}>
                    {/* The image inside must match the full container dimensions. 
                        height: 100% ensures it matches the container height (set by the other image).
                        width: auto ensures aspect ratio is preserved, matching the width. 
                    */}
                    <img
                        src={originalUrl}
                        className={styles.overlayImage}
                        alt="Original"
                        style={{ width: 'auto', height: '100%', maxWidth: 'none' }}
                        draggable={false}
                    />
                    <div className={styles.labelBefore}>Antes</div>
                </div>

                {/* Handle */}
                <div className={styles.handle} style={{ left: `${sliderPos}%` }}>
                    <ArrowLeftRight size={16} />
                </div>
            </div>

            <div className={styles.downloadRow}>
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1rem' }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>Resultado Pronto</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                        {result.width} x {result.height}px
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button onClick={onReset} className={styles.resetBtn}>
                        Processar Nova Imagem
                    </button>
                    <a
                        href={result.imageUrl}
                        download={`cobra-enhanced-${result.width}w.png`}
                        className={styles.downloadBtn}
                    >
                        <Download size={18} /> Baixar Imagem
                    </a>
                </div>
            </div>
        </div>
    );
}
