import { useState } from 'react';
import { TrainingMenuForm } from './TrainingMenuForm';
import { TrainingMenuRunner } from './TrainingMenuRunner';
import { TrainingMenuList } from './TrainingMenuList';
import { useTrainingMenu } from '../context/TrainingMenuContext';
import { useLanguage } from '../context/LanguageContext';
import { TrainingMenu } from '../types';

enum AppView {
  List = 'list',
  Form = 'form',
  Runner = 'runner',
}

export const TrainingApp: React.FC = () => {
  const { t } = useLanguage();
  const { addMenu, updateMenu, currentMenu, setCurrentMenu } = useTrainingMenu();
  const [appView, setAppView] = useState<AppView>(AppView.List);
  const [editingMenu, setEditingMenu] = useState<TrainingMenu | undefined>(undefined);

  const handleSelectMenu = (menuId: string) => {
    setCurrentMenu(menuId);
    setAppView(AppView.Runner);
  };

  const handleNewMenu = () => {
    setEditingMenu(undefined);
    setAppView(AppView.Form);
  };

  const handleEditMenu = () => {
    if (currentMenu) {
      setEditingMenu(currentMenu);
      setAppView(AppView.Form);
    }
  };

  const handleMenuSave = (menu: TrainingMenu) => {
    if (editingMenu) {
      updateMenu(menu);
    } else {
      addMenu(menu);
      setCurrentMenu(menu.id);
    }
    setAppView(AppView.List);
  };

  const handleBackToList = () => {
    setAppView(AppView.List);
  };

  const renderView = () => {
    switch (appView) {
      case AppView.List:
        return (
          <TrainingMenuList
            onSelectMenu={handleSelectMenu}
            onNewMenu={handleNewMenu}
          />
        );
      case AppView.Form:
        return <TrainingMenuForm 
          onSave={handleMenuSave} 
          existingMenu={editingMenu}
          onCancel={handleBackToList}
        />;
      case AppView.Runner:
        return currentMenu ? (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: 'var(--default-width)',
                margin: '0 auto',
                padding: '0 20px 10px',
              }}
            >
              <button
                onClick={handleBackToList}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ddd',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px',
                }}
              >
                ← {t('backToList')}
              </button>
              <button
                onClick={handleEditMenu}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FF6267',
                  cursor: 'pointer',
                }}
              >
                {t('edit')}
              </button>
            </div>
            <TrainingMenuRunner menu={currentMenu} />
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '50px',
              color: '#ddd',
            }}
          >
            {t('noMenuSelected')}
            <button
              onClick={handleBackToList}
              style={{
                backgroundColor: '#FF6267',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 15px',
                cursor: 'pointer',
                marginTop: '20px',
                display: 'block',
                margin: '20px auto 0',
              }}
            >
              {t('backToList')}
            </button>
          </div>
        );
    }
  };

  return (
    <div>
      <main style={{ maxWidth: 'var(--default-width)', margin: '0 auto', padding: '0 20px' }}>
        {renderView()}
      </main>
    </div>
  );
}; 