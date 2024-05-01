interface FilePath {
  filePath: string;
}

/**
 * Check whether it is a local file path & already preview markdown
 * */
export const isValidLocalImagePath = ({ filePath }: FilePath): boolean => {
  const pattern: RegExp =
    /^(?!.*(?:https?:\/\/|www\.))["']?.*\.(jpg|jpeg|svg|png|gif)["']?$/i;
  const isLocalFilePath: boolean = pattern.test(filePath);
  const isAlreadyPreview: boolean = filePath.includes("![image preview]");
  return isLocalFilePath && !isAlreadyPreview;
};

/**
 * Check whether it contains a image file extension
 * */
export const isImageFormat = ({ filePath }: FilePath): boolean => {
  const isJpg: boolean = filePath.includes(".jpg");
  const isJpeg: boolean = filePath.includes(".jpeg");
  const isPng: boolean = filePath.includes(".png");
  const isSvg: boolean = filePath.includes(".svg");
  const isGif: boolean = filePath.includes(".gif");

  return isJpg || isJpeg || isPng || isSvg || isGif;
};
