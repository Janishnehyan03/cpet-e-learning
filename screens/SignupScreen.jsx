import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Alert } from "react-native";
import Axios from "../utils/Axios";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (
    email,
    password,
    name,
    confirmPassword,
    context
  ) => {
    try {
      if (!name) {
        throw "Please enter your name";
      }
      if (confirmPassword !== password) {
        throw "Passwords do not match";
      }
      if (!confirmPassword) {
        throw "Please enter your confirm password";
      }
      if (!email) {
        throw "Please enter your email";
      }
      if (!password) {
        throw "Please enter your password";
      }

      const response = await Axios.post("/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: name,
          password: password,
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        const userEmail = data.user.email;
        context.navigation.navigate("OtpScreen", { email: userEmail });
      } else {
        const error = await response.json();
        throw error.message;
      }
    } catch (error) {
      Alert.alert("Error", error.toString());
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      await registerUser(
        email.trim(),
        password.trim(),
        name.trim(),
        confirmPassword.trim()
      );
      navigation.navigate("LoginScreen");
    } catch (error) {
      // Show an error message.
      alert(error.toString());
    } finally {
      setIsLoading(false);
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Create your account</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={setName}
              value={name}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.registerText}>Login Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 25,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#0F6897",
    borderRadius: 15,
    paddingVertical: 20,
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
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "lightblue",
  },
});

export default SignupScreen;
