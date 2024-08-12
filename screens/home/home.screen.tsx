import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import AllPrograms from "@/components/programs/all.programs";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 50 }}
    >
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AllPrograms />
      </ScrollView>
    </LinearGradient>
  );
}

export const styles = StyleSheet.create({});
