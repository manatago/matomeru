import React from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--background);
  border: 1px solid var(--primary);
  box-shadow: 0 0 20px var(--primary);
  padding: 2rem;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 0%,
      rgba(0, 255, 0, 0.05) 50%,
      transparent 100%
    );
    pointer-events: none;
  }
`;

const Title = styled.h2`
  color: var(--primary);
  font-family: 'Cyber', monospace;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 0 10px var(--primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: var(--secondary);
  border: 1px solid var(--primary);
  color: var(--primary);
  font-family: 'Cyber', monospace;
  outline: none;

  &:focus {
    box-shadow: 0 0 10px var(--primary);
  }
`;

const ExcludedList = styled.div`
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const ExcludedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--primary);
`;

const RemoveButton = styled.button`
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-family: 'Cyber', monospace;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 10px var(--accent);
  }
`;

const Button = styled.button`
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  cursor: pointer;
  font-family: 'Cyber', monospace;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 10px var(--primary);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [excludedPaths, setExcludedPaths] = React.useState<string[]>([]);
  const [newPath, setNewPath] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 設定の読み込み
    const loadSettings = async () => {
      try {
        const result = await window.electronAPI.loadSettings();
        if (result.success && result.settings) {
          console.log('Loaded settings:', result.settings);
          setExcludedPaths(result.settings.excludedPaths || []);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (paths: string[]) => {
    try {
      console.log('Saving settings:', { excludedPaths: paths });
      const result = await window.electronAPI.saveSettings({ excludedPaths: paths });
      if (!result.success) {
        console.error('Failed to save settings:', result.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleAdd = async () => {
    if (newPath && !excludedPaths.includes(newPath)) {
      const updated = [...excludedPaths, newPath];
      setExcludedPaths(updated);
      setNewPath('');
      await saveSettings(updated);
    }
  };

  const handleRemove = async (path: string) => {
    const updated = excludedPaths.filter(p => p !== path);
    setExcludedPaths(updated);
    await saveSettings(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  if (loading) {
    return (
      <SettingsContainer>
        <Title>設定を読み込み中...</Title>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <Title>除外設定</Title>
      <Input
        type="text"
        value={newPath}
        onChange={(e) => setNewPath(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="除外するファイル/フォルダ名を入力"
      />
      <Button onClick={handleAdd}>追加</Button>
      
      <ExcludedList>
        {excludedPaths.map((path) => (
          <ExcludedItem key={path}>
            <span>{path}</span>
            <RemoveButton onClick={() => handleRemove(path)}>
              削除
            </RemoveButton>
          </ExcludedItem>
        ))}
      </ExcludedList>

      <ButtonContainer>
        <Button onClick={onClose}>閉じる</Button>
      </ButtonContainer>
    </SettingsContainer>
  );
}