import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import YoutubePlayer from "../components/YoutubePlayer";
import Axios from "../utils/Axios";

const CourseDetailsPage = ({ navigation }) => {
  const router = useRoute();
  const { slug, course } = router.params;
  const [videoTitles, setVideoTitles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const match = course.videos[currentVideoIndex].videoUrl.match(
    /(?:[?&]v=|\/embed\/|\/\d\/|\/vi\/|https?:\/\/(?:www\.)?youtube\.com\/v\/|https?:\/\/(?:www\.)?youtube\.com\/embed\/|https?:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/
  );

  const [courseData, setCourseData] = useState(null);

  const handleVideoEnd = () => {
    if (currentVideoIndex === course.videos.length - 1) {
      Alert.alert("Last Video", "You have reached the last video.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      handleNextVideo();
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex === course.videos.length - 1) {
      Alert.alert("Last Video", "You have reached the last video.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  const currentLesson = course.videos[currentVideoIndex];

  const getVideoTitle = async (videoId) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyBTCAUBcrPkNOeO_HIQ5J67uGf41K801mE`
      );
      const videoTitle = response.data.items[0].snippet.title;
      return videoTitle;
    } catch (error) {
      console.log("Error retrieving video title", error);
      return "";
    }
  };

  const getVideoIdFromUrl = (url) => {
    const match = url.match(
      /(?:[?&]v=|\/embed\/|\/\d\/|\/vi\/|https?:\/\/(?:www\.)?youtube\.com\/v\/|https?:\/\/(?:www\.)?youtube\.com\/embed\/|https?:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };
  const getThumbnailUrl = async (videoId) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyBTCAUBcrPkNOeO_HIQ5J67uGf41K801mE`
      );
      const videoThumbnail =
        response.data.items[0].snippet.thumbnails.default.url;
      return videoThumbnail;
    } catch (error) {
      console.log("Error retrieving video title", error);
      return "";
    }
  };

  const fetchCourseData = async () => {
    try {
      const response = await Axios.get(`/course/${slug}`);
      setCourseData(response.data);
      const titles = await Promise.all(
        response.data.videos.map(async (lesson) => {
          const videoId = getVideoIdFromUrl(lesson.videoUrl);
          const title = await getVideoTitle(videoId);
          return title;
        })
      );
      setVideoTitles(titles);
      const videoThumbnails = await Promise.all(
        response.data.videos.map(async (lesson) => {
          const videoId = getVideoIdFromUrl(lesson.videoUrl);
          const image = await getThumbnailUrl(videoId);
          return image;
        })
      );
      setThumbnails(videoThumbnails);
    } catch (error) {
      console.log("Error loading course data", error);
    }
  };


  useEffect(() => {
    fetchCourseData();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <ScrollView>
      {currentLesson && (
        <YoutubePlayer initialVideoUrl={match[1]} onVideoEnd={handleVideoEnd} />
      )}
      {courseData ? (
        <View>
          <Text style={styles.courseTitle}>{courseData.title}</Text>
          <Text style={styles.courseDescription}>{courseData.description}</Text>
          <View style={styles.creatorContainer}>
            <Image
              style={styles.creatorImage}
              source={{
                uri: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=934&q=80",
              }}
            />
            <Text style={styles.username}>{course.creator.name}</Text>
          </View>
          <Text style={styles.sectionTitle}>Lessons</Text>

          {courseData.videos.map((lesson, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentVideoIndex(index)}
                // style={styles.lessonContainer}
              >
                <View
                  style={[
                    styles.card,
                    currentVideoIndex === index &&
                      styles.highlightedLessonContainer,
                  ]}
                >
                  <Image
                    style={styles.image}
                    source={{ uri: thumbnails[index] }}
                  />
                  <View style={styles.content}>
                    <Text
                      style={[
                        styles.title,
                        currentVideoIndex === index && { color: "white" },
                      ]}
                    >
                      {videoTitles[index]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading course data...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  thumbnailContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "black",
    borderRadius: 5,
    overflow: "hidden",
  },
  creatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform:"uppercase"
  },
  thumbnailImage: {
    flex: 1,
    resizeMode: "cover",
  },
  courseTitle: {
    fontSize: 30,
    color: "#103977",
    fontWeight: "900",
    margin: 8,
  },
  coursePrice: {
    fontSize: 16,
    color: "#208E62",
    margin: 8,
  },
  courseDescription: {
    fontSize: 13,
    color: "gray",
    margin: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginLeft: 14,
    fontSize:17
  },
  lessonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10646A",
    borderRadius: 20,
    marginVertical: 2,
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  lessonIconContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    marginRight: 8,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  lessonIcon: {
    fontSize: 20,
    color: "black",
    padding: 8,
  },
  lessonTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  loadingText: {
    fontSize: 13,
    color: "gray",
    margin: 8,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#d6d6d6",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  highlightedLessonContainer: {
    backgroundColor: "#250c33",
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CourseDetailsPage;
