const THEME_CONNECT_FLAG = "_";

export default class ImgUtils {
  private static _defaultKey = "";

  static setDefaultKey = (defaultKey: string) => {
    ImgUtils._defaultKey = defaultKey;
  };

  static get defaultKey() {
    return ImgUtils._defaultKey;
  }

  // 获取图片链接的后缀名
  // aa.png =>  png
  static imageType = (imgUrl: string) => {
    const emptyType = { position: -1, type: "" };
    if (!imgUrl || imgUrl.lastIndexOf(".") < 0) {
      return emptyType;
    }

    const dotIndex = imgUrl.lastIndexOf(".");
    return {
      position: dotIndex,
      type: imgUrl.substring(dotIndex + 1),
    };
  };

  /**
   * 移除图片链接的后缀类型
   * aa.png => aa
   */
  static removeImageType = (imgUrl: string) => {
    const imageType = ImgUtils.imageType(imgUrl);
    if (imageType.type) {
      return imgUrl.substring(0, imageType.position);
    } else {
      return imgUrl;
    }
  };

  /**
   * 从图片链接得到主题后缀
   * 例如 a_dark.png =>  dark
   */
  static getThemeKeyFromUrl = (
    imgUrl: string,
    supportThemeKeySet: Set<string>
  ) => {
    const handleUrl = ImgUtils.removeImageType(imgUrl);
    const themeConnectFlagIndex = handleUrl.lastIndexOf(THEME_CONNECT_FLAG);
    if (themeConnectFlagIndex < 0) {
      return "";
    } else {
      const themeKey = handleUrl.substring(themeConnectFlagIndex + 1);
      if (supportThemeKeySet.has(themeKey)) {
        return themeKey;
      } else {
        return "";
      }
    }
  };

  /**
   * 移除图片链接里的主题key
   */
  static removeThemeKey = (imgUrl: string, themeKey: string) => {
    if (!themeKey) {
      return imgUrl;
    }
    const imageType = ImgUtils.imageType(imgUrl);
    const suffix = `${THEME_CONNECT_FLAG}${themeKey}`;
    const suffixIndex = imgUrl.lastIndexOf(suffix);
    return `${imgUrl.substring(0, suffixIndex)}.${imageType.type}`;
  };

  /**
   * 分离链接的主题key 和 url
   */
  static separateThemeFromUrl = (
    imgUrl: string,
    supportThemeKeySet: Set<string>
  ) => {
    const themeKey = ImgUtils.getThemeKeyFromUrl(imgUrl, supportThemeKeySet);
    const handleUrl = ImgUtils.removeThemeKey(imgUrl, themeKey);
    return {
      theme: themeKey,
      url: handleUrl,
    };
  };

  // 合并链接和主题
  // a.png dark  => a_dark.png
  static mergeThemeToUrl = (imgUrl: string, themeKey: string) => {
    if (!themeKey || themeKey === ImgUtils.defaultKey) {
      return imgUrl;
    } else {
      const imageType = ImgUtils.imageType(imgUrl);
      const handleUrl = ImgUtils.removeImageType(imgUrl);
      return `${handleUrl}${THEME_CONNECT_FLAG}${themeKey}.${imageType.type}`;
    }
  };
}
