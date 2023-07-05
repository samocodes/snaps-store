import { ALLOWED_FORMATS } from "$lib/constants";
import files from "$lib/store/files";

// funtion to reveal the file explorer menu.
export const revealFileExplorer = (name: string) => {
  const elem = document.querySelector(
    `input[name="${name}"]`
  ) as HTMLInputElement;

  if (!elem) return;
  elem.click();
};

// funtion to reveal to upload file.
export const uploadToTemp = (event: Event) => {
  const target = event.target as HTMLInputElement;

  files.update((file) => {
    if (target.files && target.files.length > 0) {
      // Checks if file format is supported
      const validFiles = Array.from(target.files).filter((file) =>
        isValidFileFormat(file)
      );

      // updates the existing with new file
      file = [...file, ...validFiles];
    }
    return file;
  });
};

export const removeFromTemp = (index?: number) => {
  files.update((value) => {
    value.splice(index ?? 0, 1);
    return value;
  });
};

// function to check if file format is valid
export const isValidFileFormat = (file: File) => {
  return ALLOWED_FORMATS.includes(file.type);
};
