import React from 'react';
import ReactDOM from 'react-dom/client';
import styled, { createGlobalStyle } from 'styled-components';
import { Settings } from './components/Settings';
import { CyberEffects, CyberProgress } from './components/CyberEffects';

// グローバルスタイル
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #00FF00;
    --secondary: #002B36;
    --accent: #00FFFF;
    --background: #000A14;
  }

  body {
    margin: 0;
    padding: 0;
    background: var(--background);
    color: var(--primary);
    font-family: 'Cyber', monospace;
    overflow: hidden;
  }
`;

// スタイルコンポーネントの定義は変更なし...
const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TitleBar = styled.div`
  -webkit-app-region: drag;
  height: 32px;
  background: var(--secondary);
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: var(--primary);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
`;

const Title = styled.h1`
  color: var(--primary);
  font-size: 2.5rem;
  text-shadow: 0 0 10px var(--primary);
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const Button = styled.button<{ $processing?: boolean }>`
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
  font-size: 1.2rem;
  padding: 1rem 2rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 20px var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.$processing && `
    pointer-events: none;
    opacity: 0.7;
  `}
`;

const StatusText = styled.div`
  color: var(--accent);
  margin-top: 1rem;
  text-align: center;
  z-index: 1;
`;

const SettingsButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 8px;
  cursor: pointer;
  z-index: 1;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 10px var(--accent);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 10, 20, 0.8);
  z-index: 100;
`;

// メインアプリケーションコンポーネント
function App() {
  const [processing, setProcessing] = React.useState(false);
  const [status, setStatus] = React.useState('待機中...');
  const [progress, setProgress] = React.useState(0);
  const [showSettings, setShowSettings] = React.useState(false);
  const [excludedPaths, setExcludedPaths] = React.useState<string[]>([]);

  // 設定の読み込み
  const loadSettings = React.useCallback(async () => {
    try {
      const result = await window.electronAPI.loadSettings();
      if (result.success && result.settings) {
        setExcludedPaths(result.settings.excludedPaths);
        console.log('Loaded excluded paths:', result.settings.excludedPaths);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleOrganize = async () => {
    setProcessing(true);
    setStatus('整理を開始中...');
    setProgress(0.1);

    try {
      console.log('Organizing with excluded paths:', excludedPaths);
      const result = await window.electronAPI.organizeDesktop(excludedPaths);
      if (result.success) {
        setProgress(1);
        setStatus('整理が完了しました！');
      } else {
        setStatus(`エラーが発生しました: ${result.error}`);
      }
    } catch (error) {
      setStatus(`エラーが発生しました: ${error}`);
    } finally {
      setProcessing(false);
      setTimeout(() => {
        setStatus('待機中...');
        setProgress(0);
      }, 3000);
    }
  };

  // 設定が更新された時のハンドラー
  const handleSettingsUpdate = async (newExcludedPaths: string[]) => {
    setExcludedPaths(newExcludedPaths);
    console.log('Updated excluded paths:', newExcludedPaths);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <TitleBar>デスクトップまとめる</TitleBar>
        <Content>
          <CyberEffects />
          <Title>デスクトップまとめる</Title>
          <Button 
            onClick={handleOrganize} 
            $processing={processing}
            disabled={processing}
          >
            まとめる
          </Button>
          {processing && <CyberProgress progress={progress} />}
          <StatusText>{status}</StatusText>
          <SettingsButton onClick={() => setShowSettings(true)}>
            設定
          </SettingsButton>
        </Content>
      </Container>

      {showSettings && (
        <>
          <Overlay onClick={() => setShowSettings(false)} />
          <Settings 
            onClose={() => {
              setShowSettings(false);
              loadSettings(); // 設定を閉じる時に再読み込み
            }}
          />
        </>
      )}
    </>
  );
}

// アプリケーションのレンダリング
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);