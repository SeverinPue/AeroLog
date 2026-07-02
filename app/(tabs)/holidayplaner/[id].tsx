import {useLocalSearchParams} from "expo-router";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Holiday} from "@/data/types/holiday";
import {CategoryBundle} from "@/data/types/categoryBundle";
import {Animated, StyleSheet} from "react-native";
import {Item} from "@/data/types/equipmentItem";
import ScrollView = Animated.ScrollView;
import {Checkbox} from "expo-checkbox";
import {Checklist} from "@/data/types/checklist";

export default function HolidayDetails() {
    const {id} = useLocalSearchParams();
    const [holiday, setHoliday] = useState<Holiday>()
    const [bundles, setBundles] = useState<CategoryBundle[]>([]);
    const [equipment, setEquipment] = useState<Item[]>([])
    const [checklist, setChecklist] = useState<Checklist>({holiday: Number(id), doneItems: []})

    useEffect(() => {
        const loadHoliday = async () => {
            const stored = await AsyncStorage.getItem("holidays");
            if (stored) {
                setHoliday(JSON.parse(stored).find((h: Holiday) => h.id === Number(id)));
            }
        };
        const loadBundles = async () => {
            const stored = await AsyncStorage.getItem("bundles");
            if (stored) {
                setBundles(JSON.parse(stored));
            }
        };
        const loadEquipment = async () => {
            const stored = await AsyncStorage.getItem("equipment");
            if (stored) {
                setEquipment(JSON.parse(stored));
            }
        };
        const loadChecklist = async () => {
            const stored = await AsyncStorage.getItem("checklists");
            if (stored) {
                const checklists: Checklist[] = JSON.parse(stored);
                const existingChecklist = checklists.find(c => c.holiday === Number(id));
                if (existingChecklist) {
                    setChecklist(existingChecklist);
                }
            }
        }
        loadChecklist()
        loadEquipment();
        loadHoliday();
        loadBundles();
    }, [])

    useEffect(() => {
        const updateChecklist = async () => {
            const stored = await AsyncStorage.getItem("checklists");
            let checklists: Checklist[] = stored ? JSON.parse(stored) : [];
            const existingChecklistIndex = checklists.findIndex(c => c.holiday === Number(id));
            if (existingChecklistIndex !== -1) {
                checklists[existingChecklistIndex] = checklist;
            } else {
                checklists.push(checklist);
            }
            await AsyncStorage.setItem("checklists", JSON.stringify(checklists));
        }
        updateChecklist();
    }, [checklist]);

    return (
        <ThemedView style={styles.outtestContainer}>
            <ThemedText type="title">{holiday?.location}</ThemedText>
            <ThemedText>{holiday?.startDate}</ThemedText>
            <ScrollView style={styles.packlist} contentContainerStyle={{alignItems: "center"}}>
                <ThemedText type="defaultSemiBold" style={{fontSize: 26}}>Packlist</ThemedText>
                <ThemedView style={styles.bundlesList}>
                    {bundles.filter(bundle => holiday?.bundles.includes(bundle.id)).map((bundle) => (
                        <ThemedView key={bundle.id}>
                            <ThemedText style={styles.bundleTitle}>{bundle.name}</ThemedText>
                            {equipment
                                .filter(equipment => equipment.bundles.includes(bundle.id))
                                .map(equipment => (
                                    <ThemedView key={equipment.id}>
                                        <ThemedView style={styles.item}>
                                            <Checkbox
                                                value={checklist.doneItems.includes(equipment.id)}
                                                onValueChange={value => {
                                                    if (value) {
                                                        setChecklist(prev => ({
                                                            ...prev,
                                                            doneItems: [...prev.doneItems, equipment.id]
                                                        }));
                                                    } else {
                                                        setChecklist(prev => ({
                                                            ...prev,
                                                            doneItems: prev.doneItems.filter(id => id !== equipment.id)
                                                        }));
                                                    }
                                                }}
                                                color={checklist.doneItems.includes(equipment.id) ? '#555' : undefined}
                                            />
                                            <ThemedText
                                                style={styles.itemName}>{equipment.name}</ThemedText>
                                            <ThemedView style={styles.itemAddons}>
                                                <ThemedText>{equipment.amount}</ThemedText>
                                            </ThemedView>
                                        </ThemedView>
                                    </ThemedView>
                                ))}
                            <ThemedView style={styles.separator}/>
                        </ThemedView>
                    ))}
                </ThemedView>
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    outtestContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
    },
    packlist: {
        width: "100%",
        marginTop: 20,
    },
    bundlesList: {
        marginTop: 20,
        width: "90%",
        paddingBottom: 100,
    },
    bundleTitle: {
        fontWeight: "bold",
        fontSize: 18,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
        paddingHorizontal: 10,
        gap: 20,
    },
    itemName: {
        flex: 1,
        marginRight: 10,
    },
    itemAddons: {
        flexDirection: "row",
        gap: 10,
        flexShrink: 0,
    },
    separator: {
        height: 1,
        backgroundColor: "#555",
        marginVertical: 10,
    },
});