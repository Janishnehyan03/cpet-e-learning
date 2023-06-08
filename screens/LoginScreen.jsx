import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Axios from "../utils/Axios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loginUser = async () => {
    // console.log(email,password);
    if (email === null || email === "") {
      throw "Please enter your email";
    }
    if (password === null || password === "") {
      throw "Please enter your password";
    }

    try {
      const response = await Axios.post("/auth/login", {
        email,
        password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        const username = response.data.user.name;
        const userId = response.data.user.id;

        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("userExists", "true");
        await AsyncStorage.setItem("userId", userId);

        return token;
      }
    } catch (error) {
      console.log(error.response);
      if (error.response.data) {
        throw error.response.data.message;
      } else {
        throw "Something went wrong";
      }
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const authToken = await loginUser(email.trim(), password.trim());

      if (authToken !== null) {
        // Save the authentication token to AsyncStorage.
        await AsyncStorage.setItem("authToken", authToken);

        // Navigate to the home screen.
        navigation.replace("Home");
      } else {
        // Show an error message.
        alert("Invalid email or password.");
      }
    } catch (e) {
      // Show an error message.
      alert(e.toString());
    } finally {
      setIsLoading(false);
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(newText) => setEmail(newText)}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(newText) => setPassword(newText)}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.registerText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 40,
  },
  input: {
    width: "80%", // Adjusted width to occupy 80% of the container
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  button: {
    width: "80%", // Adjusted width to occupy 80% of the container
    backgroundColor: "#4B26A0",
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 40,
  },
  registerText: {
    color: "blue",
  },
});

export default LoginScreen;
