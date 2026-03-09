import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type Props = {
  scrollY: Animated.Value;
  viewportHeight: number;
  contentHeight: number;
  bottomPadding?: number;
  collapsedHeight: number;
};

const THUMB_WIDTH = 12;
const THUMB_HEIGHT = 20;
const TRACK_WIDTH = 1;
const RAIL_RATIO = 0.5;
const TRANSITION_MS = 320;

export default function ScrollIndicator({ scrollY, viewportHeight, contentHeight, bottomPadding = 0, collapsedHeight }: Props) {
  if (!viewportHeight || !contentHeight) return null;

  const actualContent = contentHeight - bottomPadding;
  // Always use collapsed maxScroll as the floor so sensitivity stays consistent
  const collapsedMaxScroll = Math.max(1, actualContent - collapsedHeight);
  const maxScroll = Math.max(collapsedMaxScroll, actualContent - viewportHeight);
  const railHeight = viewportHeight * RAIL_RATIO;
  const maxThumbOffset = Math.max(0, railHeight - THUMB_HEIGHT);
  const railTop = (viewportHeight - railHeight) / 2;
  const lineLeft = (THUMB_WIDTH - TRACK_WIDTH) / 2;

  return (
    <View style={styles.container} pointerEvents="none">
      <View
        style={[
          styles.line,
          { left: lineLeft, top: railTop, height: railHeight },
        ]}
      />
      <SmoothThumb
        scrollY={scrollY}
        railTop={railTop}
        railHeight={railHeight}
        maxScroll={maxScroll}
        maxThumbOffset={maxThumbOffset}
      />
    </View>
  );
}

function SmoothThumb({
  scrollY,
  railTop,
  railHeight,
  maxScroll,
  maxThumbOffset,
}: {
  scrollY: Animated.Value;
  railTop: number;
  railHeight: number;
  maxScroll: number;
  maxThumbOffset: number;
}) {
  const thumbY = useRef(new Animated.Value(0)).current;
  const animRailTop = useRef(new Animated.Value(railTop)).current;
  const currentScrollY = useRef(0);
  const prevMaxScroll = useRef(maxScroll);
  const prevMaxThumbOffset = useRef(maxThumbOffset);

  const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const computeThumb = (sy: number, ms: number, mto: number) => {
    const fraction = Math.min(1, Math.max(0, sy / ms));
    return ease(fraction) * mto;
  };

  // Listen to scroll position changes
  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      currentScrollY.current = value;
      const target = computeThumb(value, maxScroll, maxThumbOffset);
      thumbY.setValue(target);
    });
    return () => scrollY.removeListener(id);
  }, [maxScroll, maxThumbOffset]);

  // When layout changes (expand/collapse), animate thumb to new position
  useEffect(() => {
    if (prevMaxScroll.current !== maxScroll || prevMaxThumbOffset.current !== maxThumbOffset) {
      const target = computeThumb(currentScrollY.current, maxScroll, maxThumbOffset);
      Animated.timing(thumbY, {
        toValue: target,
        duration: TRANSITION_MS,
        useNativeDriver: false,
      }).start();
      prevMaxScroll.current = maxScroll;
      prevMaxThumbOffset.current = maxThumbOffset;
    }
  }, [maxScroll, maxThumbOffset]);

  // Animate rail position on expand/collapse
  useEffect(() => {
    Animated.timing(animRailTop, {
      toValue: railTop,
      duration: TRANSITION_MS,
      useNativeDriver: false,
    }).start();
  }, [railTop]);

  return (
    <Animated.View style={[styles.rail, { height: railHeight, top: animRailTop }]}>
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateY: thumbY }] },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    width: THUMB_WIDTH,
  },
  line: {
    position: 'absolute',
    width: TRACK_WIDTH,
    backgroundColor: '#ffffff22',
  },
  rail: {
    position: 'absolute',
    width: THUMB_WIDTH,
  },
  thumb: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
  },
});
