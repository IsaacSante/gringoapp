import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';

import TrackRow from '@/components/track-row';

type Track = {
  id: string;
  name: string;
  description: string;
  src: ReturnType<typeof require>;
};

type Props = {
  tracks: Track[];
};

export default function TrackContainer({ tracks }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const handlePress = async (track: Track) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    if (playingId === track.id) {
      setPlayingId(null);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(track.src);
    soundRef.current = sound;
    setPlayingId(track.id);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) setPlayingId(null);
    });
  };

  return (
    <>
      {tracks.map((track, i) => (
        <TrackRow
          key={track.id}
          index={i + 1}
          name={track.name}
          description={track.description}
          isPlaying={playingId === track.id}
          onPress={() => handlePress(track)}
        />
      ))}
    </>
  );
}
