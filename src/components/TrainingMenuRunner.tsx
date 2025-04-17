import { useState, useRef } from 'react';
import { TrainingMenu } from '../types';
import { TrainingMenuItem } from './TrainingMenuItem';
import { useIntervalTimer } from '../hooks/useIntervalTimer';
import { useLanguage } from '../context/LanguageContext';
import { formatTime } from '../utils/timeFormatter';

interface TrainingMenuRunnerProps {
  menu: TrainingMenu;
}

// デフォルトのインターバル時間（秒）
const DEFAULT_INTERVAL_SECONDS = 10;

export const TrainingMenuRunner: React.FC<TrainingMenuRunnerProps> = ({ menu }) => {
  const { language, t } = useLanguage();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showInterval, setShowInterval] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(DEFAULT_INTERVAL_SECONDS);
  
  // 現在のアクティブなメニューアイテムコンポーネントへの参照
  const activeItemRef = useRef<{ start: () => void } | null>(null);

  // インターバルタイマー
  const { 
    start: startInterval, 
    formatTime: formatIntervalTime 
  } = useIntervalTimer({
    durationInSeconds: intervalSeconds,
    onComplete: () => {
      setShowInterval(false);
      if (autoStart) {
        // インターバル完了後、次のメニューを自動開始
        setTimeout(() => {
          activeItemRef.current?.start();
        }, 500);
      }
    }
  });

  // アイテム完了時の処理
  const handleItemComplete = () => {
    if (activeItemIndex < menu.items.length - 1) {
      if (autoStart) {
        // 自動開始が有効ならインターバルを表示
        setShowInterval(true);
        setActiveItemIndex(activeItemIndex + 1);
        startInterval();
      } else {
        // 自動開始が無効なら次のアイテムに進むだけ
        setActiveItemIndex(activeItemIndex + 1);
      }
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setActiveItemIndex(0);
    setIsCompleted(false);
    setShowInterval(false);
  };

  // インターバル時間の変更
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setIntervalSeconds(value);
    }
  };

  // 自動開始の切り替え
  const toggleAutoStart = () => {
    setAutoStart(!autoStart);
  };

  // トレーニングの総時間（秒）を計算
  const totalDuration = menu.items.reduce(
    (total, item) => total + item.durationInSeconds,
    0
  );

  // アクティブなアイテムと参照を接続するためのコールバック
  const setItemRef = (ref: { start: () => void } | null) => {
    activeItemRef.current = ref;
  };

  return (
    <div style={{ maxWidth: 'var(--default-width)', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          backgroundColor: '#1a2025',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '15px'
        }}>
          <h1
            style={{
              color: '#FF6267',
              marginTop: 0,
              marginBottom: '10px',
              fontSize: '2rem',
            }}
          >
            {menu.title}
          </h1>
        </div>
        <p style={{ color: '#ddd', marginBottom: '15px' }}>{menu.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
            {t('totalMenuItems')}: {menu.items.length}
          </div>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
            {t('totalTime')}: {formatTime(totalDuration, language)}
          </div>
        </div>

        {/* 設定オプション */}
        <div style={{ 
          backgroundColor: '#11161C', 
          padding: '10px 15px', 
          borderRadius: '8px',
          marginTop: '10px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <label style={{ fontSize: '0.9rem', color: '#ddd' }}>
              {t('autoStart')}
              <input
                type="checkbox"
                checked={autoStart}
                onChange={toggleAutoStart}
                style={{ marginLeft: '8px' }}
              />
            </label>
            
            <div>
              <label style={{ fontSize: '0.9rem', color: '#ddd' }}>
                {t('interval')}: 
                <input
                  type="number"
                  min="0"
                  value={intervalSeconds}
                  onChange={handleIntervalChange}
                  style={{
                    width: '60px',
                    backgroundColor: '#1a2025',
                    border: '1px solid #2a3740',
                    borderRadius: '4px',
                    color: 'white',
                    padding: '3px 5px',
                    marginLeft: '8px',
                  }}
                  disabled={!autoStart}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {isCompleted ? (
        <div
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            backgroundColor: '#1a2025',
            borderRadius: '10px',
          }}
        >
          <h2 style={{ color: '#FF6267', marginBottom: '20px' }}>
            {t('completed')}
          </h2>
          <p style={{ color: '#ddd', marginBottom: '30px' }}>
            {t('congratsMessage')}
          </p>
          <button
            onClick={handleReset}
            style={{
              backgroundColor: '#FF6267',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {t('trainAgain')}
          </button>
        </div>
      ) : showInterval ? (
        // インターバル表示
        <div
          style={{
            backgroundColor: '#1a2025',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '15px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#FF6267', marginBottom: '10px' }}>
            {t('intervalTitle')}
          </h2>
          <p style={{ color: '#ddd', margin: '10px 0' }}>
            {t('prepareNextMenu')}
          </p>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '15px 0',
              color: 'white',
            }}
          >
            {formatIntervalTime()}
          </div>
          <div style={{
            backgroundColor: '#11161C',
            padding: '15px',
            borderRadius: '8px',
            margin: '20px 0',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#FF6267', marginBottom: '10px', fontSize: '1.2rem' }}>
              {t('nextMenu')}
            </h3>
            <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '1.1rem' }}>
              {menu.items[activeItemIndex].name}
            </h4>
            <p style={{ color: '#ddd', marginBottom: '10px', fontSize: '0.9rem' }}>
              {menu.items[activeItemIndex].description}
            </p>
            <div style={{ color: '#aaa', fontSize: '0.8rem' }}>
              {t('time')}: {formatTime(menu.items[activeItemIndex].durationInSeconds, language)}
            </div>
          </div>
          <button
            onClick={() => {
              setShowInterval(false);
              if (autoStart) {
                activeItemRef.current?.start();
              }
            }}
            style={{
              backgroundColor: '#FF6267',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 15px',
              cursor: 'pointer',
            }}
          >
            {t('skip')}
          </button>
        </div>
      ) : (
        <div>
          {menu.items.map((item, index) => (
            <TrainingMenuItem
              key={item.id}
              item={item}
              isActive={index === activeItemIndex}
              onComplete={handleItemComplete}
              ref={index === activeItemIndex ? setItemRef : undefined}
            />
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        <button
          onClick={handleReset}
          style={{
            backgroundColor: '#2a3740',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          {t('reset')}
        </button>
        <div style={{ color: '#aaa' }}>
          {t('progress')}: {activeItemIndex + 1} / {menu.items.length}
        </div>
      </div>
    </div>
  );
}; 