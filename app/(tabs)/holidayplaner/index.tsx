import {Animated, Pressable, StyleSheet} from 'react-native';

import {ThemedView} from '@/components/themed-view';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ThemedText} from "@/components/themed-text";
import {useEffect, useState} from "react";
import {Holiday} from "@/data/types/holiday";
import {Ionicons} from "@expo/vector-icons";
import HolidayInput from "@/components/holiday-input";
import HolidayCard from "@/components/holiday-card";
import {CategoryBundle} from "@/data/types/categoryBundle";
import ScrollView = Animated.ScrollView;

export default function FerienplanerScreen() {
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [bundles, setBundles] = useState<CategoryBundle[]>([]);
    const [add, setAdd] = useState<boolean>(false);


    useEffect(() => {
        const loadHolidays = async () => {
            const stored = await AsyncStorage.getItem("holidays");
            if (stored) {
                setHolidays(JSON.parse(stored));
            }
        };
        const loadBundles = async () => {
            const stored = await AsyncStorage.getItem("bundles");
            if (stored) {
                setBundles(JSON.parse(stored));
            }
        };
        loadHolidays();
        loadBundles();
    }, [])

    const addHoliday = async (holiday: Omit<Holiday, "id">) => {
        const newId = holidays.length + 1;
        const updated = [...holidays, {...holiday, id: newId}];
        setHolidays(updated);
        await AsyncStorage.setItem("holidays", JSON.stringify(updated));
        setAdd(false)
    };

    const removeHoliday = async (holidayId: number) => {
        const updated = holidays.filter(holiday => holiday.id !== holidayId);
        setHolidays(updated);
        await AsyncStorage.setItem("holidays", JSON.stringify(updated));
    }

    return (
        <ThemedView style={styles.outtestContainer}>
            { add ?
                <HolidayInput onSubmit={addHoliday} onCancel={() => setAdd(false)} />
                :
                <>
                    <ThemedView style={styles.header}>
                        <ThemedText type="title" onPress={async () => {/* TODO REMOVEEEE */
                            await AsyncStorage.removeItem("bundles")
                            await AsyncStorage.removeItem("holidays")
                        }}>Holiday Planner</ThemedText>
                        <Pressable onPress={() => setAdd(true)}>
                            <Ionicons name="add-circle" size={48} color="white" />
                        </Pressable>
                    </ThemedView>
                    <ScrollView style={{width: "100%"}} contentContainerStyle={{alignItems: "center"}}>
                        {holidays.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map(holiday => (
                            <HolidayCard key={holiday.id} holiday={holiday} bundles={bundles} onRemove={removeHoliday} />
                        ))}
                    </ScrollView>
                </>
            }
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    outtestContainer: {
        flex: 1,
        paddingTop: 50,
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 20,
    }
});
