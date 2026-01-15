'use client';
import { useState, useRef } from 'react';
import styles from './UpscaleApp.module.css';
import { UploadZone } from './UploadZone';
import { ResolutionSelector } from './ResolutionSelector';
import { OptionsAccordion } from './OptionsAccordion';
import { ResultComparison } from './ResultComparison';
import { UpscaleOptions, UpscaleResult, Resolution } from '@/lib/types';
import { Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpscaleApp() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [options, setOptions] = useState<UpscaleOptions>({
        resolution: '4k',
        enhanceTexture: false, // Default off to preserve artistic details
        noiseReduction: 30,
        sharpness: 20,
        removeArtifacts: true
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [result, setResult] = useState<UpscaleResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setError(null);
        setResult(null);

        try {
            setStatusText('Enviando imagem...');

            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('options', JSON.stringify(options));

            // Simulate progress steps if it's quick
            setTimeout(() => setStatusText('Processando com IA (Super-Resolução)...'), 800);
            setTimeout(() => setStatusText('Aplicando ajustes de nitidez...'), 1600);

            const response = await fetch('/api/upscale', {
                method: 'POST',
                body: formData,
            });

            let data: UpscaleResult;
            try {
                const text = await response.text();
                try {
                    data = JSON.parse(text);
                } catch {
                    // If HTML error (e.g. 500/404), throw readable error
                    throw new Error(`Erro do Servidor (${response.status}): Ocorreu um erro interno ao processar a imagem.`);
                }
            } catch (e: any) {
                throw new Error(e.message || 'Erro de comunicação com o servidor.');
            }

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Erro ao processar imagem');
            }

            setStatusText('Finalizando...');
            setResult(data);

            // Scroll to result
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro inesperado.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.heroHeader}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.title}
                >
                    Cobra Enhance
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.subtitle}
                >
                    Transforme suas imagens com tecnologia de Upscaling pro.
                    Aumente a resolução para 2K, 4K ou 8K mantendo detalhes extremos.
                </motion.p>
            </header>

            <motion.div
                className={styles.glassPanel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className={styles.sectionTitle}>
                    <span style={{ background: 'var(--primary)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>1</span>
                    Upload da Imagem
                </div>
                <UploadZone
                    selectedFile={selectedFile}
                    onFileSelect={(f) => { setSelectedFile(f); setResult(null); setError(null); }}
                />
            </motion.div>

            {selectedFile && (
                <motion.div
                    className={styles.glassPanel}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className={styles.sectionTitle}>
                        <span style={{ background: 'var(--primary)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>2</span>
                        Escolha a Resolução
                    </div>

                    <ResolutionSelector
                        value={options.resolution}
                        onChange={(val) => setOptions(prev => ({ ...prev, resolution: val }))}
                    />

                    <div style={{ marginTop: '1.5rem' }}>
                        <OptionsAccordion
                            options={options}
                            onChange={setOptions}
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ff6b6b', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <button
                        className={styles.primaryButton}
                        onClick={handleProcess}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className={styles.loader} />
                                {statusText}
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Melhorar e Exportar
                            </>
                        )}
                    </button>
                </motion.div>
            )}

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className={styles.sectionTitle} style={{ justifyContent: 'center', paddingBottom: '1rem' }}>
                            <CheckCircle color="var(--primary)" size={24} />
                            Processamento Concluído
                        </div>

                        <ResultComparison
                            original={selectedFile}
                            result={result}
                            onReset={() => {
                                // Reset all state
                                setResult(null);
                                setSelectedFile(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
