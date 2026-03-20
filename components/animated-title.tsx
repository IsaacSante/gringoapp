import { ThemedText } from '@/components/themed-text';
import { useEffect, useRef, useState } from 'react';

const WORDS = new Set(['BULLMOON', 'DAN-AMP']);
const WORDS_LIST = [...WORDS];

const SEQUENCES = [
  ['✦', '✶', '✸'],
  ['◇', '◈', '◆'],
  ['○', '◎', '●'],
  ['·', '•', '❋'],
  ['☆', '✧', '★'],
];

const FRAME_MS = 320;
const WORD_INTERVAL_MS = 4000;

function randomSequence() {
  return SEQUENCES[Math.floor(Math.random() * SEQUENCES.length)];
}

export default function AnimatedTitle() {
  const [display, setDisplay] = useState(WORDS_LIST[0]);
  const wordIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const frames = randomSequence();
      let frame = 0;
      const animInterval = setInterval(() => {
        if (frame < frames.length) {
          setDisplay(frames[frame]);
          frame++;
        } else {
          clearInterval(animInterval);
          wordIndex.current = (wordIndex.current + 1) % WORDS_LIST.length;
          setDisplay(WORDS_LIST[wordIndex.current]);
        }
      }, FRAME_MS);
    }, WORD_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const isWord = WORDS.has(display);

  return (
    <ThemedText type="title" style={isWord ? undefined : { fontFamily: 'DotGothic16' }}>
      {display}
    </ThemedText>
  );
}
