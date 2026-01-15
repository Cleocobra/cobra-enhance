import { useState } from 'react';
import styles from './OptionsAccordion.module.css';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { UpscaleOptions } from '@/lib/types';
import clsx from 'clsx';

interface Props {
    options: UpscaleOptions;
    onChange: (opts: UpscaleOptions) => void;
}

export function OptionsAccordion({ options, onChange }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const update = <K extends keyof UpscaleOptions>(key: K, val: UpscaleOptions[K]) => {
        onChange({ ...options, [key]: val });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
                <span style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Settings size={18} color="#ccc" />
                    Opções Avançadas
                </span>
                {isOpen ? <ChevronUp size={18} color="#ccc" /> : <ChevronDown size={18} color="#ccc" />}
            </div>

            {isOpen && (
                <div className={styles.content}>
                    {/* Toggle: Recriar Rostos */}
                    <div className={styles.toggleRow} onClick={() => update('enhanceTexture', !options.enhanceTexture)}>
                        <span>Recriar Rostos (IA)</span>
                        <div className={clsx(styles.switch, options.enhanceTexture && styles.active)}>
                            <div className={styles.knob} />
                        </div>
                    </div>

                    {/* Toggle: Artefatos */}
                    <div className={styles.toggleRow} onClick={() => update('removeArtifacts', !options.removeArtifacts)}>
                        <span>Remover Artefatos de Compressão</span>
                        <div className={clsx(styles.switch, options.removeArtifacts && styles.active)}>
                            <div className={styles.knob} />
                        </div>
                    </div>

                    {/* Slider: Redução de Ruído */}
                    <div className={styles.row}>
                        <div className={styles.labelGroup}>
                            <span>Redução de Ruído</span>
                            <span>{options.noiseReduction}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="100"
                            value={options.noiseReduction}
                            onChange={(e) => update('noiseReduction', Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                    {/* Slider: Nitidez */}
                    <div className={styles.row}>
                        <div className={styles.labelGroup}>
                            <span>Nitidez</span>
                            <span>{options.sharpness}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="100"
                            value={options.sharpness}
                            onChange={(e) => update('sharpness', Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                </div>
            )}
        </div>
    );
}
