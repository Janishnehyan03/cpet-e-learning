import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CourseCard = ({ course }) => {
  const navigation = useNavigation();

  const handleGoToDetails = () => {
    // Implement navigation logic to go to details screen
    // For example, if you're using React Navigation Stack Navigator:
    navigation.navigate("Details", {
      slug: course.slug,
      thumbnail: course.thumbnail,
      course,
    });
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: course.thumbnail,
          }}
          style={{ flex: 1, aspectRatio: 1.5, resizeMode: "contain" }}
        />
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productCategory}>#{course.category.name}</Text>
        <Text style={styles.productTitle}>{course.title}</Text>
        <View style={styles.creatorContainer}>
          <Image
            style={styles.creatorImage}
            source={{
              uri: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=934&q=80",
            }}
          />
          <Text style={styles.username}>{course.creator.name}</Text>
        </View>

        <View style={styles.productPrice}>
          <Text style={styles.productPriceValue}>Price: ₹{course.price}</Text>
          <Text style={styles.productPriceValue}>{course.videos.length} videos</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.goToDetailsButton}
        onPress={handleGoToDetails}
      >
        <Text style={styles.goToDetailsButtonText}>
          Go to Details ₹{course.price}{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: 380,
    shadowColor: "#dfdfdf",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 7,
    backgroundColor: "#dbdbdb",
    margin: 6,
    borderRadius: 20,
  },
  imageContainer: {
    borderTopLeftRadius: 20, // Adjust the value to change the roundness
    borderTopRightRadius: 20, // Adjust the value to change the roundness
    overflow: "hidden", // C
  },

  productDetails: {
    padding: 10,
  },
  creator: {
    fontSize: 12,
    fontWeight: "400",
    textTransform: "uppercase",
    color: "#381657",
    marginBottom: 4,
  },
  creatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  creatorImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  productCategory: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#103977",
    marginBottom: 4,
  },
  productTitle: {
    fontWeight: "900",
    fontSize: 23,
    marginBottom: 18,
    textTransform: "uppercase",
    color: "#381657",
  },
  productDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
    color: "#999",
  },

  productPrice: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical:3
  },
  productPriceValue: {
    fontSize: 18,
    color: "#381657",
    fontWeight: "600",
  },
  productPriceDiscount: {
    fontSize: 14,
    fontWeight: "400",
    textDecorationLine: "line-through",
    marginRight: 5,
  },
  productLinks: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  goToDetailsButton: {
    flex: 1,
    backgroundColor: "#381657",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 10,
    borderRadius: 20,
    paddingVertical: 10,
  },
  goToDetailsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CourseCard;
