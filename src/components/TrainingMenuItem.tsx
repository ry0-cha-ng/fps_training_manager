import { useState, forwardRef, useImperativeHandle } from 'react';
import { TrainingMenuItem as TrainingMenuItemType } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useLanguage } from '../context/LanguageContext';

interface TrainingMenuItemProps {
  item: TrainingMenuItemType;
  isActive: boolean;
  onComplete: () => void;
}

export const TrainingMenuItem = forwardRef<
  { start: () => void } | null,
  TrainingMenuItemProps
>(({ item, isActive, onComplete }, ref) => {
  const { t } = useLanguage();
  const [isCompleted, setIsCompleted] = useState(false);
  const { isRunning, start, pause, formatTime } = useTimer({
    initialSeconds: item.durationInSeconds,
    onComplete: () => {
      setIsCompleted(true);
      onComplete();
    },
  });

  // start メソッドを ref を通して公開
  useImperativeHandle(
    ref,
    () => ({
      start,
    }),
    [start]
  );

  // 完了時にリセット
  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div
      className={`menu-item ${isActive ? 'active' : ''} ${
        isCompleted ? 'completed' : ''
      }`}
      style={{
        padding: '15px',
        marginBottom: '15px',
        borderRadius: '8px',
        backgroundColor: isActive ? '#1a2025' : '#11161C',
        border: isActive ? '1px solid #FF6267' : '1px solid #2a3740',
        transition: 'all 0.3s ease',
        opacity: isCompleted ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: isActive ? '#FF6267' : '#ddd',
          }}
        >
          {formatTime()}
        </div>
      </div>
      <p style={{ margin: '5px 0 15px', fontSize: '0.9rem', color: '#aaa' }}>
        {item.description}
      </p>
      {isActive && !isCompleted && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {!isRunning ? (
            <button
              onClick={start}
              style={{
                backgroundColor: '#FF6267',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 15px',
                cursor: 'pointer',
              }}
            >
              {t('start')}
            </button>
          ) : (
            <button
              onClick={pause}
              style={{
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 15px',
                cursor: 'pointer',
              }}
            >
              {t('pause')}
            </button>
          )}
          <button
            onClick={handleComplete}
            style={{
              backgroundColor: '#2a3740',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 15px',
              cursor: 'pointer',
            }}
          >
            {t('complete')}
          </button>
        </div>
      )}
    </div>
  );
}); 