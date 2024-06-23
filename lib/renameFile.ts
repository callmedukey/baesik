/**
 * Rename a file while keeping its extension.
 * @param {string} originalFileName - The original file name.
 * @param {string} newName - The new name for the file without extension.
 * @returns {string} - The renamed file with its original extension.
 */
export function renameFileWithExtension(
  originalFileName: string,
  newName: string
) {
  // Extract the file extension
  const extension = originalFileName.substring(
    originalFileName.lastIndexOf(".")
  );

  // Combine the new name with the original extension
  const renamedFile = newName + extension;

  return renamedFile;
}

export function getFileExtention(fileName: string) {
  return fileName.substring(fileName.lastIndexOf(".")).replace(".", "");
}
