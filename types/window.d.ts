// File System Access API types for browsers that support it
interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableStream>;
  getFile(): Promise<File>;
}

interface FileSystemWritableStream extends WritableStream {
  write(data: string | Blob | ArrayBuffer | DataView | Uint8Array): Promise<void>;
  close(): Promise<void>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
}

interface Window {
  showSaveFilePicker?(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
}

// Type guard helper
declare global {
  interface Window {
    showSaveFilePicker: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }
}
