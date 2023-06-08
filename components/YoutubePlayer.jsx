import React, { useEffect, useReducer, useRef, useState } from "react";
import { View } from "react-native";
import Youtube from "react-native-youtube-iframe";
import Orientation from "react-native-orientation";

export default function YoutubePlayer({ initialVideoUrl, onVideoEnd }) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef();

  const handleStateChange = (state) => {
    if (state === "ended") {
      setPlaying(false);
      onVideoEnd();
    }
  };
  const handleOrientationChange = (orientation) => {
    if (orientation === "LANDSCAPE") {
      playerRef.current.presentFullscreenPlayer();
    } else {
      playerRef.current.dismissFullscreenPlayer();
    }
  };
  useEffect(() => {
    setPlaying(true); // Start playing the video when videoUrl changes
  }, [initialVideoUrl]);

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientationChange);
    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);
  return (
    <View>
      <Youtube
        height={250}
        play={playing}
        videoId={initialVideoUrl}
        onChangeState={handleStateChange}
        ref={playerRef}
      />
    </View>
  );
}
