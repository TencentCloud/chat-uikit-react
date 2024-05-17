import { emojiMap, emojiUrl } from './emojiMap';
/** Pass in messageBody (group system message SystemMessage, except group prompt message GroupTip）
 * payload = {
 *  msgType: 'TIMTextElem',
 *  msgContent: {
 *    text: 'AAA[smile]AAA[smile]AAA[smile]'
 *  }
 *}
 * */
export function decodeText(payload:any) {
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
          if (emojiMap[emojiKey]) {
            renderDom.push({
              name: 'img',
              src: emojiUrl + emojiMap[emojiKey],
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
