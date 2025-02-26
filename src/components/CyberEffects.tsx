import React from 'react';
import styled, { keyframes } from 'styled-components';

// スキャンラインアニメーション
const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

// データフローアニメーション
const dataFlow = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
`;

// グリッドアニメーション
const gridPulse = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.3;
  }
`;

const CyberContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

// グリッドエフェクト
const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(0deg, transparent 24%, 
      var(--primary) 25%, var(--primary) 26%, transparent 27%, transparent 74%, 
      var(--primary) 75%, var(--primary) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, 
      var(--primary) 25%, var(--primary) 26%, transparent 27%, transparent 74%, 
      var(--primary) 75%, var(--primary) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  opacity: 0.05;
  animation: ${gridPulse} 4s ease-in-out infinite;
`;

// スキャンラインエフェクト
const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 255, 0, 0.1) 50%,
    transparent
  );
  animation: ${scanline} 4s linear infinite;
  opacity: 0.5;
`;

// データフローエフェクト
const DataFlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.1) 3px,
    transparent 4px
  );
  background-size: 100% 4px;
  animation: ${dataFlow} 20s linear infinite;
  opacity: 0.3;
`;

// グローエフェクト
const Glow = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(0, 255, 0, 0.2) 0%,
    transparent 70%
  );
  transform: translate(${props => props.$x}px, ${props => props.$y}px);
  transition: all 0.3s ease;
  pointer-events: none;
`;

export function CyberEffects() {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX - 100, // グローエフェクトの中心を調整
        y: e.clientY - 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <CyberContainer>
      <Grid />
      <Scanline />
      <DataFlow />
      <Glow $x={mousePos.x} $y={mousePos.y} />
    </CyberContainer>
  );
}

// プログレスエフェクト
const progressAnimation = keyframes`
  0% {
    transform: scaleX(0);
    filter: hue-rotate(0deg);
  }
  100% {
    transform: scaleX(1);
    filter: hue-rotate(360deg);
  }
`;

const ProgressContainer = styled.div`
  position: relative;
  width: 200px;
  height: 4px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--primary);
  overflow: hidden;
  margin: 10px 0;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--primary);
  transform-origin: left;
  transform: scaleX(${props => props.$progress});
  animation: ${progressAnimation} 2s linear infinite;
`;

interface CyberProgressProps {
  progress: number;
}

export function CyberProgress({ progress }: CyberProgressProps) {
  return (
    <ProgressContainer>
      <ProgressBar $progress={progress} />
    </ProgressContainer>
  );
}