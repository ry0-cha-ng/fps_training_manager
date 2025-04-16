import './App.css';
import { TrainingMenuProvider } from './context/TrainingMenuContext';
import { LanguageProvider } from './context/LanguageContext';
import { TrainingApp } from './components/TrainingApp';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useLanguage } from './context/LanguageContext';

// アプリケーションのヘッダーコンポーネント
const AppHeader = () => {
  const { t } = useLanguage();
  
  return (
    <header
      style={{
        backgroundColor: '#1a2025',
        borderBottom: '1px solid #2a3740',
        padding: '15px 0',
        marginBottom: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--default-width)',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: '#FF6267',
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {t('appTitle')}
        </h1>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

function App() {
  return (
    <div className="app">
      <LanguageProvider>
        <TrainingMenuProvider>
          <AppHeader />
          <TrainingApp />
        </TrainingMenuProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
