import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TrainingMenu } from '../types';

// ローカルストレージのキー
const STORAGE_KEY = 'fps_training_menus';
const CURRENT_MENU_KEY = 'fps_current_menu_id';

// ローカルストレージからメニューデータを読み込む
const loadMenusFromStorage = (): TrainingMenu[] => {
  try {
    const savedMenus = localStorage.getItem(STORAGE_KEY);
    return savedMenus ? JSON.parse(savedMenus) : [];
  } catch (error) {
    console.error('メニューデータの読み込みに失敗しました:', error);
    return [];
  }
};

// ローカルストレージから現在のメニューIDを読み込む
const loadCurrentMenuIdFromStorage = (): string | null => {
  try {
    return localStorage.getItem(CURRENT_MENU_KEY);
  } catch (error) {
    console.error('現在のメニューIDの読み込みに失敗しました:', error);
    return null;
  }
};

interface TrainingMenuContextType {
  menus: TrainingMenu[];
  currentMenu: TrainingMenu | null;
  addMenu: (menu: TrainingMenu) => void;
  updateMenu: (menu: TrainingMenu) => void;
  deleteMenu: (menuId: string) => void;
  setCurrentMenu: (menuId: string | null) => void;
}

const TrainingMenuContext = createContext<TrainingMenuContextType | undefined>(
  undefined
);

export const useTrainingMenu = () => {
  const context = useContext(TrainingMenuContext);
  if (!context) {
    throw new Error(
      'useTrainingMenu must be used within a TrainingMenuProvider'
    );
  }
  return context;
};

interface TrainingMenuProviderProps {
  children: ReactNode;
}

export const TrainingMenuProvider: React.FC<TrainingMenuProviderProps> = ({
  children,
}) => {
  // 初期値としてローカルストレージから読み込んだデータを使用
  const [menus, setMenus] = useState<TrainingMenu[]>(loadMenusFromStorage());
  
  // 現在選択中のメニュー
  const [currentMenu, setCurrentMenuState] = useState<TrainingMenu | null>(null);

  // 初期化時に現在のメニューIDを読み込む
  useEffect(() => {
    const currentMenuId = loadCurrentMenuIdFromStorage();
    if (currentMenuId) {
      const menu = menus.find(m => m.id === currentMenuId) || null;
      setCurrentMenuState(menu);
    } else if (menus.length > 0) {
      setCurrentMenuState(menus[0]);
    }
  }, []);

  // メニューが変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
    } catch (error) {
      console.error('メニューデータの保存に失敗しました:', error);
    }
  }, [menus]);

  // 現在のメニューIDが変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      if (currentMenu) {
        localStorage.setItem(CURRENT_MENU_KEY, currentMenu.id);
      } else {
        localStorage.removeItem(CURRENT_MENU_KEY);
      }
    } catch (error) {
      console.error('現在のメニューIDの保存に失敗しました:', error);
    }
  }, [currentMenu]);

  const addMenu = (menu: TrainingMenu) => {
    setMenus([...menus, menu]);
  };

  const updateMenu = (updatedMenu: TrainingMenu) => {
    setMenus(
      menus.map((menu) =>
        menu.id === updatedMenu.id ? updatedMenu : menu
      )
    );

    // 現在のメニューを更新
    if (currentMenu && currentMenu.id === updatedMenu.id) {
      setCurrentMenuState(updatedMenu);
    }
  };

  const deleteMenu = (menuId: string) => {
    setMenus(menus.filter((menu) => menu.id !== menuId));

    // 現在のメニューが削除された場合、最初のメニューを選択
    if (currentMenu && currentMenu.id === menuId) {
      const remainingMenus = menus.filter((menu) => menu.id !== menuId);
      setCurrentMenuState(remainingMenus.length > 0 ? remainingMenus[0] : null);
    }
  };

  const setCurrentMenu = (menuId: string | null) => {
    if (menuId === null) {
      setCurrentMenuState(null);
    } else {
      const menu = menus.find((m) => m.id === menuId) || null;
      setCurrentMenuState(menu);
    }
  };

  return (
    <TrainingMenuContext.Provider
      value={{
        menus,
        currentMenu,
        addMenu,
        updateMenu,
        deleteMenu,
        setCurrentMenu,
      }}
    >
      {children}
    </TrainingMenuContext.Provider>
  );
}; 