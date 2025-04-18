import { useState, useRef } from 'react';
import { useTrainingMenu } from '../context/TrainingMenuContext';
import { useLanguage } from '../context/LanguageContext';
import { formatTime } from '../utils/timeFormatter';
import { TrainingMenu } from '../types';
import { convertMenuToCSV, convertCSVToMenu } from '../utils/csvConverter';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TrainingMenuListProps {
  onSelectMenu: (menuId: string) => void;
  onNewMenu: () => void;
}

// SortableMenuItemコンポーネントの定義
const SortableMenuItem = ({
  menu,
  onSelectMenu,
  handleDeleteClick,
  handleExport,
  t,
  language,
}: {
  menu: TrainingMenu;
  onSelectMenu: (menuId: string) => void;
  handleDeleteClick: (e: React.MouseEvent, menu: TrainingMenu) => void;
  handleExport: (menu: TrainingMenu) => void;
  t: (key: string) => string;
  language: 'ja' | 'en' | 'ko';
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: '#1a2025',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '15px',
    cursor: 'pointer',
    border: '1px solid #2a3740',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} onClick={() => onSelectMenu(menu.id)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: 'move',
            padding: '8px',
            marginRight: '15px',
            backgroundColor: '#2a3740',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 9H16M8 12H16M8 15H16"
              stroke="#ddd"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3
              style={{
                color: '#fff',
                margin: '0 0 10px 0',
                fontSize: '1.2rem',
              }}
            >
              {menu.title}
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExport(menu);
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: '#ddd',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '4px 8px',
                }}
              >
                {t('exportMenu')}
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, menu)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#FF6267',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '4px 8px',
                }}
              >
                {t('deleteMenu')}
              </button>
            </div>
          </div>
          <p
            style={{
              margin: '0 0 10px',
              fontSize: '0.9rem',
              color: '#aaa',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'left',
            }}
          >
            {menu.description}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#888',
            }}
          >
            <span>
              {t('items')}: {menu.items.length}
            </span>
            <span>
              {t('totalTime')}: {formatTime(
                menu.items.reduce(
                  (total, item) => total + item.durationInSeconds,
                  0
                ),
                language
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TrainingMenuList: React.FC<TrainingMenuListProps> = ({
  onSelectMenu,
  onNewMenu,
}) => {
  const { menus, currentMenu, deleteMenu, addMenu, updateMenuOrder } = useTrainingMenu();
  const { language, t } = useLanguage();
  const [menuToDelete, setMenuToDelete] = useState<TrainingMenu | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = menus.findIndex((menu) => menu.id === active.id);
      const newIndex = menus.findIndex((menu) => menu.id === over.id);
      
      updateMenuOrder(arrayMove(menus, oldIndex, newIndex));
    }
  };

  // 削除確認ダイアログを表示
  const handleDeleteClick = (e: React.MouseEvent, menu: TrainingMenu) => {
    e.stopPropagation(); // メニュー選択のイベントが発火するのを防ぐ
    setMenuToDelete(menu);
  };

  // 削除を実行
  const confirmDelete = () => {
    if (menuToDelete) {
      deleteMenu(menuToDelete.id);
      setMenuToDelete(null);
    }
  };

  // 削除をキャンセル
  const cancelDelete = () => {
    setMenuToDelete(null);
  };

  // メニューのエクスポート
  const handleExport = (menu: TrainingMenu) => {
    const csv = convertMenuToCSV(menu);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${menu.title}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // メニューのインポート
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const menu = convertCSVToMenu(csv);
        addMenu(menu);
        alert(t('importSuccess'));
      } catch (error) {
        console.error('Import error:', error);
        alert(t('importError'));
      }
    };
    reader.readAsText(file);
    
    // ファイル選択をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ maxWidth: 'var(--default-width)', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h2 style={{ 
          color: '#FF6267', 
          margin: 0,
          flexGrow: 1
        }}>
          {t('menuTitle')}
        </h2>
        <div style={{ 
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundColor: '#2a3740',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 15px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t('importMenu')}
          </button>
          <button
            onClick={onNewMenu}
            style={{
              backgroundColor: '#FF6267',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 15px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t('newMenu')}
          </button>
        </div>
      </div>

      <div>
        {menus.length === 0 ? (
          <div
            style={{
              backgroundColor: '#1a2025',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#ddd' }}>
              {t('noMenus')}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={menus.map(menu => menu.id)}
              strategy={verticalListSortingStrategy}
            >
              {menus.map((menu) => (
                <SortableMenuItem
                  key={menu.id}
                  menu={menu}
                  onSelectMenu={onSelectMenu}
                  handleDeleteClick={handleDeleteClick}
                  handleExport={handleExport}
                  t={t}
                  language={language}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* 削除確認ダイアログ */}
      {menuToDelete && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#1a2025',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ color: '#FF6267', marginTop: 0 }}>
              {t('confirmDelete')}
            </h3>
            <p style={{ color: '#ddd', margin: '15px 0' }}>
              {menuToDelete.title}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              <button
                onClick={cancelDelete}
                style={{
                  backgroundColor: '#2a3740',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 15px',
                  cursor: 'pointer',
                }}
              >
                {t('cancelDelete')}
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  backgroundColor: '#FF6267',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 15px',
                  cursor: 'pointer',
                }}
              >
                {t('confirmButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 