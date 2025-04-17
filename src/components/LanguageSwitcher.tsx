import { useLanguage, Language } from '../context/LanguageContext';
import { useState, useRef, useEffect } from 'react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 言語の表示名
  const getLanguageLabel = (lang: Language): string => {
    switch (lang) {
      case 'ja': return '日本語';
      case 'en': return 'English';
      case 'ko': return '한국어';
      default: return '';
    }
  };
  
  // 言語切り替え処理
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  // ドロップダウン以外をクリックしたらメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={dropdownRef}
      style={{ 
        position: 'relative',
        display: 'inline-block',
        userSelect: 'none',
        width: '100px'
      }}
    >
      {/* 現在の言語を表示するボタン */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#1a2025',
          color: '#ddd',
          border: '1px solid #2a3740',
          borderRadius: '4px',
          padding: '4px 12px',
          fontSize: '0.9rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <span>{getLanguageLabel(language)}</span>
        <span>▼</span>
      </div>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            backgroundColor: '#1a2025',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            marginTop: '4px',
            zIndex: 100,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            onClick={() => handleLanguageChange('ja')}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: language === 'ja' ? '#FF6267' : 'transparent',
              color: language === 'ja' ? 'white' : '#ddd',
              borderBottom: '1px solid #2a3740',
            }}
          >
            日本語
          </div>
          <div
            onClick={() => handleLanguageChange('en')}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: language === 'en' ? '#FF6267' : 'transparent',
              color: language === 'en' ? 'white' : '#ddd',
              borderBottom: '1px solid #2a3740',
            }}
          >
            English
          </div>
          <div
            onClick={() => handleLanguageChange('ko')}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: language === 'ko' ? '#FF6267' : 'transparent',
              color: language === 'ko' ? 'white' : '#ddd',
            }}
          >
            한국어
          </div>
        </div>
      )}
    </div>
  );
}; 