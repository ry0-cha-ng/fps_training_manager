import { useState } from 'react';
import { TrainingMenu, TrainingMenuItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TrainingMenuFormProps {
  onSave: (menu: TrainingMenu) => void;
  existingMenu?: TrainingMenu;
  onCancel: () => void;
}

export const TrainingMenuForm: React.FC<TrainingMenuFormProps> = ({
  onSave,
  existingMenu,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(existingMenu?.title || '');
  const [description, setDescription] = useState(existingMenu?.description || '');
  const [items, setItems] = useState<TrainingMenuItem[]>(
    existingMenu?.items || [
      {
        id: `item_${Date.now()}`,
        name: '',
        description: '',
        durationInSeconds: 300, // デフォルトは5分
      },
    ]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleItemNameChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newItems = [...items];
    newItems[index].name = e.target.value;
    setItems(newItems);
  };

  const handleItemDescriptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newItems = [...items];
    newItems[index].description = e.target.value;
    setItems(newItems);
  };

  const handleItemDurationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newItems = [...items];
    // 分から秒に変換
    newItems[index].durationInSeconds = parseInt(e.target.value) * 60;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        name: '',
        description: '',
        durationInSeconds: 300, // デフォルトは5分
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!title.trim()) {
      alert(t('errorEnterTitle'));
      return;
    }

    if (items.length === 0) {
      alert(t('errorAddMenuItem'));
      return;
    }

    // 空のアイテム名をチェック
    for (const item of items) {
      if (!item.name.trim()) {
        alert(t('errorEnterItemName'));
        return;
      }
    }

    const newMenu: TrainingMenu = {
      id: existingMenu?.id || `menu_${Date.now()}`,
      title,
      description,
      items,
    };

    onSave(newMenu);
  };

  // 分単位に変換
  const secondsToMinutes = (seconds: number) => Math.floor(seconds / 60);

  return (
    <div style={{ maxWidth: 'var(--default-width)', margin: '0 auto', padding: '30px' }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: '#1a2025',
            padding: '30px',
            borderRadius: '10px',
            marginBottom: '30px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#FF6267', margin: 0, fontSize: '1.8rem' }}>
              {t('registerMenu')}
            </h2>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {t('menuTitleLabel')}
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder={t('menuTitlePlaceholder')}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#11161C',
                border: '1px solid #2a3740',
                borderRadius: '6px',
                color: 'white',
                fontSize: '1.1rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {t('menuDescription')}
            </label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder={t('menuDescriptionPlaceholder')}
              rows={3}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#11161C',
                border: '1px solid #2a3740',
                borderRadius: '6px',
                color: 'white',
                resize: 'vertical',
                fontSize: '1.1rem',
              }}
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#1a2025',
            padding: '30px',
            borderRadius: '10px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
            }}
          >
            <h3 style={{ color: '#ddd', margin: 0, fontSize: '1.5rem' }}>{t('menuItems')}</h3>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#11161C',
                padding: '25px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #2a3740',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '1.3rem' }}>{t('item')} {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#FF6267',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  {t('delete')}
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontSize: '1rem',
                  }}
                >
                  {t('itemName')}
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemNameChange(index, e)}
                  placeholder={t('itemNamePlaceholder')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1a2025',
                    border: '1px solid #2a3740',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1.1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontSize: '1rem',
                  }}
                >
                  {t('itemDescription')}
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleItemDescriptionChange(index, e)}
                  placeholder={t('itemDescriptionPlaceholder')}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1a2025',
                    border: '1px solid #2a3740',
                    borderRadius: '6px',
                    color: 'white',
                    resize: 'vertical',
                    fontSize: '1.1rem',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontSize: '1rem',
                  }}
                >
                  {t('itemDuration')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={secondsToMinutes(item.durationInSeconds)}
                  onChange={(e) => handleItemDurationChange(index, e)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1a2025',
                    border: '1px solid #2a3740',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1.1rem',
                  }}
                />
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={addItem}
              style={{
                backgroundColor: '#FF6267',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 20px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                width: '100%',
              }}
            >
              {t('addItem')}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: '#2a3740',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '15px 30px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              minWidth: '180px',
            }}
          >
            {t('backToList')}
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: '#FF6267',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '15px 30px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              minWidth: '180px',
            }}
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
}; 