import { Resolution } from '@/lib/types';
import styles from './ResolutionSelector.module.css';
import clsx from 'clsx';

interface Props {
    value: Resolution;
    onChange: (val: Resolution) => void;
}

const options: { id: Resolution; label: string; desc: string }[] = [
    { id: '2k', label: '2K', desc: '~2048px (QHD)' },
    { id: '4k', label: '4K', desc: '~4096px (UHD)' },
    { id: '8k', label: '8K', desc: '~7680px (Ultra)' },
];

export function ResolutionSelector({ value, onChange }: Props) {
    return (
        <div className={styles.grid}>
            {options.map((opt) => (
                <div
                    key={opt.id}
                    className={clsx(styles.optionCard, value === opt.id && styles.selected)}
                    onClick={() => onChange(opt.id)}
                >
                    <span className={styles.title}>{opt.label}</span>
                    <span className={styles.subtitle}>{opt.desc}</span>
                </div>
            ))}
        </div>
    );
}
