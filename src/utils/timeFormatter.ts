import { Language } from '../context/LanguageContext';

/**
 * 秒数を時間、分、秒にフォーマットする関数
 * @param seconds 合計秒数
 * @param language 言語設定
 * @returns フォーマットされた時間文字列
 */
export const formatTime = (seconds: number, language: 'ja' | 'en' | 'ko'): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (language === 'ja') {
    // 日本語の場合: 1時間 30分 15秒
    return [
      hours > 0 ? `${hours}時間` : '',
      minutes > 0 ? `${minutes}分` : '',
      remainingSeconds > 0 ? `${remainingSeconds}秒` : '',
    ]
      .filter(Boolean)
      .join(' ');
  } else if (language === 'ko') {
    // 韓国語の場合: 1시간 30분 15초
    return [
      hours > 0 ? `${hours}시간` : '',
      minutes > 0 ? `${minutes}분` : '',
      remainingSeconds > 0 ? `${remainingSeconds}초` : '',
    ]
      .filter(Boolean)
      .join(' ');
  } else {
    // 英語の場合: 1h 30m 15s
    return [
      hours > 0 ? `${hours}h` : '',
      minutes > 0 ? `${minutes}m` : '',
      remainingSeconds > 0 ? `${remainingSeconds}s` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
};

/**
 * mm:ss 形式で時間をフォーマットする関数
 * @param seconds 秒数
 * @returns mm:ss 形式の文字列
 */
export const formatTimeMMSS = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}; 