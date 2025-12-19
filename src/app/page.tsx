import UpscaleApp from '@/components/UpscaleApp';

export const metadata = {
  title: 'Cobra Enhance - AI Image Upscaler',
  description: 'Aumente a resolução de suas imagens para 8K com inteligência artificial. Cobra Enhance: Qualidade extrema para seus projetos.',
  keywords: ['upscale', '8k', 'ai', 'imagem', 'melhorar qualidade', 'cobra art', 'venum', 'super resolução'],
};

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 0%, rgb(165 246 59 / 15%), transparent 50%)'
    }}>
      <UpscaleApp />

      <footer style={{ textAlign: 'center', marginTop: 'auto', padding: '2rem', color: '#666', fontSize: '0.9rem' }}>
        <p>© 2024 Cobra Design Ltda. Todos os direitos reservados. CNPJ: 41.019.460/0001-49</p>
      </footer>
    </main>
  );
}
