import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    backgroundColor: '#000A14',
  });

  // 開発モードの場合はDevToolsを開く
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // index.htmlをロード
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // デバッグ用のログ
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM is ready');
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 除外パスのチェック関数
function isExcluded(filePath: string, excludedPaths: string[]): boolean {
  const fileName = path.basename(filePath);
  return excludedPaths.some(excludedPath => {
    // 大文字小文字を区別しない完全一致
    return fileName.toLowerCase() === excludedPath.toLowerCase();
  });
}

// ファイル操作の実装
ipcMain.handle('organize-desktop', async (_event, excludedPaths: string[]) => {
  try {
    const desktopPath = path.join(os.homedir(), 'Desktop');
    const documentsPath = path.join(os.homedir(), 'Documents');
    const pastDesktopPath = path.join(documentsPath, 'Past Desktop Files');
    
    console.log('Excluded paths:', excludedPaths);

    // フォルダ名に使用する現在の日時を生成
    const now = new Date();
    const folderName = now.toISOString().replace(/[:.]/g, '-').split('.')[0];
    const newFolderPath = path.join(desktopPath, folderName);

    console.log('Starting desktop organization...');
    console.log('Creating folder:', folderName);

    // デスクトップのファイル一覧を取得
    const files = await fs.promises.readdir(desktopPath, { withFileTypes: true });
    console.log('Found files:', files.length);
    
    // 新しいフォルダを作成
    await fs.promises.mkdir(newFolderPath);
    console.log('Created new folder:', newFolderPath);
    
    // 移動するファイルをフィルタリング
    const filesToMove = files.filter(file => {
      const filePath = path.join(desktopPath, file.name);
      
      // 新しく作成したフォルダ自体は除外
      if (filePath === newFolderPath) {
        console.log('Skipping new folder:', file.name);
        return false;
      }
      
      // 除外パスチェック
      if (isExcluded(filePath, excludedPaths)) {
        console.log('Skipping excluded file:', file.name);
        return false;
      }
      
      return true;
    });

    console.log('Files to move:', filesToMove.length);
    
    // ファイルを移動
    for (const file of filesToMove) {
      const sourcePath = path.join(desktopPath, file.name);
      const destPath = path.join(newFolderPath, file.name);
      await fs.promises.rename(sourcePath, destPath);
      console.log('Moved file:', file.name);
    }
    
    // 移動するファイルがない場合は新規フォルダを削除して終了
    if (filesToMove.length === 0) {
      await fs.promises.rmdir(newFolderPath);
      console.log('No files to move, removed empty folder');
      return { success: true, message: 'ファイルがありませんでした' };
    }
    
    // 過去のデスクトップフォルダがなければ作成
    if (!fs.existsSync(pastDesktopPath)) {
      await fs.promises.mkdir(pastDesktopPath);
      console.log('Created past desktop folder:', pastDesktopPath);
    }
    
    // まとめたフォルダを過去のデスクトップに移動
    const finalPath = path.join(pastDesktopPath, folderName);
    await fs.promises.rename(newFolderPath, finalPath);
    console.log('Moved organized folder to past desktop:', finalPath);
    
    return { success: true };
  } catch (error) {
    console.error('Error organizing desktop:', error);
    return { success: false, error: (error as Error).message };
  }
});

// 除外パス設定の保存
ipcMain.handle('save-settings', async (_event, settings: { excludedPaths: string[] }) => {
  try {
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'settings.json');
    console.log('Saving settings to:', settingsPath);
    console.log('Settings content:', settings);
    await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, error: (error as Error).message };
  }
});

// 除外パス設定の読み込み
ipcMain.handle('load-settings', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'settings.json');
    
    console.log('Loading settings from:', settingsPath);
    
    if (fs.existsSync(settingsPath)) {
      const data = await fs.promises.readFile(settingsPath, 'utf-8');
      const settings = JSON.parse(data);
      console.log('Loaded settings:', settings);
      return { success: true, settings };
    }
    
    console.log('No settings file found, using defaults');
    return { success: true, settings: { excludedPaths: [] } };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { success: false, error: (error as Error).message };
  }
});