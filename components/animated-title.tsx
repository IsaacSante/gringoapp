import { useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/themed-text';

const WORDS = ['GRINGO', 'DAN-AMP'];

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
  const [display, setDisplay] = useState(WORDS[0]);
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
          wordIndex.current = (wordIndex.current + 1) % WORDS.length;
          setDisplay(WORDS[wordIndex.current]);
        }
      }, FRAME_MS);
    }, WORD_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedText type="title">{display}</ThemedText>
  );
}
