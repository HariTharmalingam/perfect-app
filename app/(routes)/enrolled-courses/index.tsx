import ProgramCard from "@/components/cards/program.card";
import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";

export default function index() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [loader, setLoader] = useState(false);
  const { loading, user } = useUser();

  useEffect(() => {
        axios.get(`${SERVER_URI}/get-program-content/`)

    // axios.get(`${SERVER_URI}/get-programs`).then((res: any) => {
    //   user?.programs.forEach((item: any ) => {
    //     console.log("user",item.programId)
    //   })

    //   res.data.programs.forEach((item: any ) => {
    //     console.log("programs",item._id)
    //   })

    //   const programs: ProgramType[] = res.data.programs;

    //   const data = programs.filter((i: ProgramType) =>
    //     user?.programs.some((d: any) => d.programId === i._id)
    //   );
    //   console.log("data",data)
    //   // console.log("db programs",programs.id)

    //   setPrograms(data);
    // });
  }, [loader, user]);

  return (
    <>
      {loader || loading ? (
        <Loader />
      ) : (
        <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
          <FlatList
            data={programs}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <ProgramCard item={item} />}
          />
        </LinearGradient>
      )}
    </>
  );
}
