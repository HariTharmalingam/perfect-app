import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ProgramShowcaseCard({ item }: { item: programsDataType }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/(routes)/program-details",
          params: { item: JSON.stringify(item) },
        })
      }
    >
      <View>
      <ImageBackground source={item.image} style={styles.image}>
      <View style={{ width: wp(85), height: wp(50), flex:1 }}>
          <Text
            style={{
              color: "#FFF",
              fontSize: 30,
              textAlign: "center",
              justifyContent: "center",
              margin: "auto",

              fontFamily: "Raleway_600SemiBold",
            }}
          >
            {item.title}
          </Text>
        </View>
    </ImageBackground>
        
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFF",
    marginHorizontal: 6,
    borderRadius: 12,
    width: "95%",
    height: "auto",
    overflow: "hidden",
    margin: "auto",
    marginVertical: 15,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  }
});
