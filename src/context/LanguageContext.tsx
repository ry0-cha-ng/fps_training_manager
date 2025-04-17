import { createContext, useContext, useState, ReactNode } from 'react';

// 対応する言語
export type Language = 'ja' | 'en' | 'ko';

// ローカルストレージのキー
const LANGUAGE_STORAGE_KEY = 'fps_language';

// ローカルストレージから言語設定を読み込む
const loadLanguageFromStorage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    return savedLanguage && ['ja', 'en', 'ko'].includes(savedLanguage) 
      ? savedLanguage 
      : 'ja'; // デフォルトは日本語
  } catch (error) {
    console.error('言語設定の読み込みに失敗しました:', error);
    return 'ja';
  }
};

// 翻訳データの型
export type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// 翻訳データ
export const translations: Translations = {
  // 共通
  appTitle: {
    ja: 'FPS Training Manager',
    en: 'FPS Training Manager',
    ko: 'FPS Training Manager',
  },
  // メニューランナー
  menuTitle: {
    ja: '練習メニュー一覧',
    en: 'Training Menu List',
    ko: '트레이닝 메뉴 목록',
  },
  newMenu: {
    ja: '新規メニュー作成',
    en: 'Create New Menu',
    ko: '새 메뉴 만들기',
  },
  deleteMenu: {
    ja: '削除',
    en: 'Delete',
    ko: '삭제',
  },
  confirmDelete: {
    ja: 'このメニューを削除してもよろしいですか？',
    en: 'Are you sure you want to delete this menu?',
    ko: '이 메뉴를 삭제하시겠습니까?',
  },
  cancelDelete: {
    ja: 'キャンセル',
    en: 'Cancel',
    ko: '취소',
  },
  confirmButton: {
    ja: '確認',
    en: 'Confirm',
    ko: '확인',
  },
  totalMenuItems: {
    ja: '総メニュー数',
    en: 'Total Menu Items',
    ko: '총 메뉴 항목',
  },
  totalTime: {
    ja: '総時間',
    en: 'Total Time',
    ko: '총 시간',
  },
  autoStart: {
    ja: '自動開始',
    en: 'Auto Start',
    ko: '자동 시작',
  },
  interval: {
    ja: 'インターバル（秒）',
    en: 'Interval (sec)',
    ko: '인터벌 (초)',
  },
  reset: {
    ja: 'リセット',
    en: 'Reset',
    ko: '리셋',
  },
  progress: {
    ja: '進捗',
    en: 'Progress',
    ko: '진행 상황',
  },
  // インターバル画面
  intervalTitle: {
    ja: 'インターバル',
    en: 'Interval',
    ko: '인터벌',
  },
  prepareNextMenu: {
    ja: '次のメニューの準備をしてください',
    en: 'Please prepare for the next menu',
    ko: '다음 메뉴를 준비해 주세요',
  },
  nextMenu: {
    ja: '次のメニュー',
    en: 'Next Menu',
    ko: '다음 메뉴',
  },
  time: {
    ja: '時間',
    en: 'Time',
    ko: '시간',
  },
  skip: {
    ja: 'スキップ',
    en: 'Skip',
    ko: '건너뛰기',
  },
  // 完了画面
  completed: {
    ja: 'トレーニング完了！',
    en: 'Training Completed!',
    ko: '트레이닝 완료!',
  },
  congratsMessage: {
    ja: 'おつかれさまでした。全てのメニューを完了しました。',
    en: 'Good job! You have completed all training menus.',
    ko: '수고하셨습니다. 모든 메뉴를 완료했습니다.',
  },
  trainAgain: {
    ja: 'もう一度トレーニングする',
    en: 'Train Again',
    ko: '다시 트레이닝하기',
  },
  // ボタン
  start: {
    ja: '開始',
    en: 'Start',
    ko: '시작',
  },
  pause: {
    ja: '一時停止',
    en: 'Pause',
    ko: '일시정지',
  },
  complete: {
    ja: '完了',
    en: 'Complete',
    ko: '완료',
  },
  backToList: {
    ja: '一覧に戻る',
    en: 'Back to List',
    ko: '목록으로 돌아가기',
  },
  edit: {
    ja: '編集',
    en: 'Edit',
    ko: '편집',
  },
  save: {
    ja: '保存',
    en: 'Save',
    ko: '저장',
  },
  // 時間表示
  hour: {
    ja: '時間',
    en: 'h',
    ko: '시간',
  },
  minute: {
    ja: '分',
    en: 'm',
    ko: '분',
  },
  second: {
    ja: '秒',
    en: 's',
    ko: '초',
  },
  // メニューリスト
  noMenus: {
    ja: '登録されている練習メニューはありません。',
    en: 'No training menus registered.',
    ko: '등록된 트레이닝 메뉴가 없습니다.',
  },
  items: {
    ja: 'アイテム数',
    en: 'Items',
    ko: '항목 수',
  },
  // その他のメッセージ
  noMenuSelected: {
    ja: 'メニューが選択されていません。',
    en: 'No menu is selected.',
    ko: '선택된 메뉴가 없습니다.',
  },
  // メニューフォーム
  registerMenu: {
    ja: '練習メニュー登録',
    en: 'Register Training Menu',
    ko: '트레이닝 메뉴 등록',
  },
  menuTitleLabel: {
    ja: 'タイトル',
    en: 'Title',
    ko: '제목',
  },
  menuTitlePlaceholder: {
    ja: '練習メニューのタイトルを入力',
    en: 'Enter training menu title',
    ko: '트레이닝 메뉴 제목을 입력하세요',
  },
  menuDescription: {
    ja: '概要',
    en: 'Description',
    ko: '설명',
  },
  menuDescriptionPlaceholder: {
    ja: '練習メニューの概要を入力',
    en: 'Enter training menu description',
    ko: '트레이닝 메뉴 설명을 입력하세요',
  },
  menuItems: {
    ja: 'メニューアイテム',
    en: 'Menu Items',
    ko: '메뉴 항목',
  },
  addItem: {
    ja: 'アイテム追加',
    en: 'Add Item',
    ko: '항목 추가',
  },
  item: {
    ja: 'アイテム',
    en: 'Item',
    ko: '항목',
  },
  delete: {
    ja: '削除',
    en: 'Delete',
    ko: '삭제',
  },
  itemName: {
    ja: '名前',
    en: 'Name',
    ko: '이름',
  },
  itemNamePlaceholder: {
    ja: 'メニュー項目の名前',
    en: 'Menu item name',
    ko: '메뉴 항목 이름',
  },
  itemDescription: {
    ja: '説明',
    en: 'Description',
    ko: '설명',
  },
  itemDescriptionPlaceholder: {
    ja: 'メニュー項目の説明',
    en: 'Menu item description',
    ko: '메뉴 항목 설명',
  },
  itemDuration: {
    ja: '時間（分）',
    en: 'Duration (minutes)',
    ko: '시간 (분)',
  },
  
  // バリデーションメッセージ
  errorEnterTitle: {
    ja: 'タイトルを入力してください',
    en: 'Please enter a title',
    ko: '제목을 입력해주세요',
  },
  errorAddMenuItem: {
    ja: '少なくとも1つのメニューアイテムを追加してください',
    en: 'Please add at least one menu item',
    ko: '최소 하나의 메뉴 항목을 추가해주세요',
  },
  errorEnterItemName: {
    ja: '全てのメニューアイテムに名前を入力してください',
    en: 'Please enter a name for all menu items',
    ko: '모든 메뉴 항목에 이름을 입력해주세요',
  },
  // 言語名
  languageJapanese: {
    ja: '日本語',
    en: 'Japanese',
    ko: '일본어',
  },
  languageEnglish: {
    ja: '英語',
    en: 'English',
    ko: '영어',
  },
  languageKorean: {
    ja: '韓国語',
    en: 'Korean',
    ko: '한국어',
  },
  // インポート・エクスポート
  importMenu: {
    ja: 'インポート',
    en: 'Import',
    ko: '가져오기',
  },
  exportMenu: {
    ja: 'エクスポート',
    en: 'Export',
    ko: '내보내기',
  },
  importError: {
    ja: 'メニューのインポートに失敗しました。',
    en: 'Failed to import menu.',
    ko: '메뉴 가져오기에 실패했습니다.',
  },
  importSuccess: {
    ja: 'メニューをインポートしました。',
    en: 'Menu imported successfully.',
    ko: '메뉴를 가져왔습니다.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // ローカルストレージから言語設定を読み込む
  const [language, setLanguageState] = useState<Language>(loadLanguageFromStorage());

  // 言語設定が変更されたらローカルストレージに保存
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.error('言語設定の保存に失敗しました:', error);
    }
  };

  // 翻訳関数
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // 翻訳が見つからない場合はキーをそのまま返す
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 