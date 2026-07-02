import {Holiday} from "@/data/types/holiday";
import {ThemedText} from "@/components/themed-text";
import {Entypo, Ionicons} from "@expo/vector-icons";
import {Pressable, StyleSheet, View} from "react-native";
import {CategoryBundle} from "@/data/types/categoryBundle";
import {router} from "expo-router";

type UpcomingHolidayCardProps = {
    holiday: Holiday
    bundles: CategoryBundle[]
    onRemove: (id: number) => void
}

export default function HolidayCard({holiday, bundles, onRemove}: UpcomingHolidayCardProps) {
    return (
        <Pressable style={styles.cardContainer} onPress={() => router.push({pathname: "/(tabs)/holidayplaner/[id]", params: {id: holiday.id}})}>
            <View style={styles.location}>
                <Entypo name="location-pin" size={35} color="white"/>
                <ThemedText style={{fontSize: 32}}>{holiday.location}</ThemedText>
            </View>
            <View style={styles.bundles}>
                {holiday.bundles.map(bundleId => {
                    const bundle = bundles.find(b => b.id === bundleId);
                    return bundle ? <ThemedText key={bundle.id}>{bundle.name}</ThemedText> : null;
                })}
            </View>
            <View style={styles.footer}>
                <ThemedText type="defaultSemiBold">{holiday.startDate}</ThemedText>
                <Ionicons name="trash" size={22} color="white"
                          onPress={() => onRemove(holiday.id)}/>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: "80%",
        backgroundColor: "#2F2F2F",
        marginTop: 10,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        gap: 15,
    },
    location: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    bundles: {
        alignItems: "center",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
    }
});