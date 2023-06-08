import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Platform, ScrollView } from "react-native";
import CourseCard from "../components/CourseCard";
import Axios from "../utils/Axios";

const Homepage = ({ navigation }) => {
  const isBrowser = Platform.OS === "web";

  const [courses, setCourses] = useState([]);
  const getCourses = async () => {
    try {
      let { data } = await Axios.get("/course");
      setCourses(data.courses);
    } catch (error) {
      console.log(error.response);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    getCourses();
  }, []);
  const renderCourseCards = () => {
    if (isBrowser) {
      // Use flex to display 3 items in one row
      return (
        <View style={styles.flexContainer}>
          {courses.length > 0 &&
            courses.map((course, index) => <CourseCard course={course} key={index} />)}
        </View>
      );
    } else {
      // Do not use flex for mobile screen
      return (
        <ScrollView>
          <View style={styles.mobileContainer}>
            {courses.length > 0 &&
              courses.map((course, index) => (
                <CourseCard course={course} key={index} />
              ))}
          </View>
        </ScrollView>
      );
    }
  };

  return renderCourseCards();
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#0080ff",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0080ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  flexContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mobileContainer: {
    // Add styles specific to the mobile screen layout
  },
});

export default Homepage;
