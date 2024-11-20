import { emojiUrlMap, emojiBaseUrl } from './emojiMap';
import { i18next } from '@tencentcloud/uikit-base-component-react';
/** Pass in messageBody (group system message SystemMessage, except group prompt message GroupTip）
 * payload = {
 *   msgType: 'TIMTextElem',
 *   msgContent: {
 *     text: 'AAA[smile]AAA[smile]AAA[smile]'
 *   }
 * }
 * ! decodeText function has been deprecated
 * */
export function decodeText(payload: any) {
  const renderDom = [];
  let temp = payload.text;
  let left = -1;
  let right = -1;
  while (temp !== '') {
    left = temp.indexOf('[');
    right = temp.indexOf(']');
    switch (left) {
      case 0:
        if (right === -1) {
          renderDom.push({
            name: 'text',
            text: temp,
          });
          temp = '';
        } else {
          const emojiKey = temp.slice(0, right + 1);
          if (emojiUrlMap[emojiKey]) {
            renderDom.push({
              name: 'img',
              src: emojiBaseUrl + emojiUrlMap[emojiKey],
            });
            temp = temp.substring(right + 1);
          } else {
            renderDom.push({
              name: 'text',
              text: '[',
            });
            temp = temp.slice(1);
          }
        }
        break;
      case -1:
        renderDom.push({
          name: 'text',
          text: temp,
        });
        temp = '';
        break;
      default:
        renderDom.push({
          name: 'text',
          text: temp.slice(0, left),
        });
        temp = temp.substring(left);
        break;
    }
  }
  return renderDom;
}

/**
 * Transforms a text containing emoji keys to a emoji names with i18n
 * Example:
 * 'hello[TUIEmoji_Smile]!' => 'hello[Smile]!''
 * @param {string} text - The text containing emoji keys.
 * @return {string} The transformed text with emoji keys replaced by emoji names.
 */
export function transformTextWithEmojiKeyToName(text: string) {
  if (!text) {
    return '';
  }
  const reg = /(\[.+?\])/g;
  let transformResult: string = text;
  if (reg.test(text)) {
    transformResult = text.replace(reg, match => emojiUrlMap[match] ? i18next.t(`Emoji.${match}`) : match);
  }
  return transformResult;
}

const emojiTranslationMap: Record<string, any> = {};

/**
 * Transforms a text containing emoji names to emoji keys with i18n
 * Example:
 * 'hello[Smile]!' => 'hello[TUIEmoji_Smile]!'
 * @param {string} text - The text containing emoji names.
 * @return {string} The transformed text with emoji names replaced by emoji keys.
 */
export function transformTextWithEmojiNameToKey(text: string) {
  if (!text) {
    return '';
  }
  const reg = /(\[.+?\])/g;
  let transformResult: string = text;
  if (reg.test(text)) {
    const currentLanguage = i18next.language;
    if (!emojiTranslationMap[currentLanguage]) {
      const lngResource = i18next.getDataByLanguage(currentLanguage);
      if (lngResource?.translation?.Emoji) {
        emojiTranslationMap[currentLanguage]
          = Object.fromEntries(Object.entries(lngResource.translation.Emoji).map(([key, value]) => [value, key]));
      }
    }
    transformResult = text.replace(reg, match => emojiTranslationMap[currentLanguage][match] ?? match);
  }
  return transformResult;
}
