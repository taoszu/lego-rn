export default class StrUtils {
  static isEmpty(text?: string): boolean {
    return text == null || text.length == 0;
  }

  static isNotEmpty(text?: string): boolean {
    return !StrUtils.isEmpty(text);
  }
}
