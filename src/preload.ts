import { contextBridge, ipcRenderer } from 'electron';

// レンダラープロセスで使用するAPIを定義
export const API = {
  organizeDesktop: (excludedPaths: string[]) => 
    ipcRenderer.invoke('organize-desktop', excludedPaths),
  
  saveSettings: (settings: { excludedPaths: string[] }) =>
    ipcRenderer.invoke('save-settings', settings),
  
  loadSettings: () =>
    ipcRenderer.invoke('load-settings'),
};

// APIをウィンドウオブジェクトに安全に公開
contextBridge.exposeInMainWorld('electronAPI', API);

// TypeScript用の型定義
declare global {
  interface Window {
    electronAPI: typeof API;
  }
}