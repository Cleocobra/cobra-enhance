'use client';
import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import styles from './UploadZone.module.css';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

// Allow 25MB
const MAX_SIZE = 25 * 1024 * 1024;

interface Props {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export function UploadZone({ onFileSelect, selectedFile }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [selectedFile]);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const validateAndSet = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Por favor envie apenas imagens (JPG, PNG, WebP).');
            return;
        }
        if (file.size > MAX_SIZE) {
            alert('Arquivo muito grande. Máximo 25MB.');
            return;
        }
        onFileSelect(file);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSet(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSet(e.target.files[0]);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelect(null);
        if (inputRef.current) inputRef.current.value = '';
    }

    return (
        <div className={styles.container}>
            {selectedFile && previewUrl ? (
                <div className={styles.previewContainer}>
                    <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                    <button onClick={clearFile} className={styles.removeBtn} title="Remover imagem">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div
                    className={clsx(styles.zone, isDragging && styles.zoneActive)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={inputRef}
                        onChange={handleChange}
                        accept="image/png, image/jpeg, image/webp"
                        style={{ display: 'none' }}
                    />
                    <div className={styles.content}>
                        <div className={styles.iconWrapper}>
                            <UploadCloud size={32} color="var(--primary)" />
                        </div>
                        <p style={{ color: '#fff', fontWeight: 500 }}>
                            Arraste sua imagem ou clique para selecionar
                        </p>
                        <p style={{ fontSize: '0.875rem' }}>JPG, PNG ou WebP (Máx. 25MB)</p>
                    </div>
                </div>
            )}
        </div>
    );
}
