import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_600SemiBold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito";
import { useRef } from "react";
import ProgramCard from "../cards/program.card";
import { programsData } from "@/constants/programsData";
import ProgramShowcaseCard from "../cards/programShowcase.card";
export default function AllPrograms() {
  const flatListRef = useRef(null);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
    Nunito_500Medium,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#000000",
            fontFamily: "Raleway_700Bold",
          }}
        >
          Nos programmes
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={programsData}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => <ProgramShowcaseCard item={item} />}
      />
    </View> 
  );
}
