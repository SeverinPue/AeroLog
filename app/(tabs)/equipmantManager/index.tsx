import {Animated, Button, Pressable, StyleSheet, TextInput} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';

import categories from '@/data/categories.json';
import equipmentList from '@/data/equipment.json';
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Item} from "@/data/types/equipmentItem";
import {useEffect, useState} from "react";
import ScrollView = Animated.ScrollView;

export default function ChecklistScreen() {
    const [equipment, setEquipment] = useState<Item[]>([]);
    const [showInput, setShowInput] = useState<number>();
    const [newName, setNewName] = useState<string>();
    const [edit, setEdit] = useState<boolean>(false);

    useEffect(() => {
        const loadEquipment = async () => {
            const stored = await AsyncStorage.getItem("equipment");
            if (stored) {
                setEquipment(JSON.parse(stored));
            } else {
                await AsyncStorage.setItem("equipment", JSON.stringify(equipmentList));
                const init = await AsyncStorage.getItem("equipment");
                if (init) {
                    setEquipment(JSON.parse(init));
                }
            }
        };
        loadEquipment();
    }, []);

    const changeAmount = async (id: number, amount: number) => {
        if (amount < 0 && equipment.find(item => item.id === id)?.amount === 0) {
            return;
        } else {
            const updated = equipment.map(item => item.id === id ? {...item, amount: item.amount + amount} : item)
            setEquipment(updated)
            await AsyncStorage.setItem("equipment", JSON.stringify(updated));
        }
    }

    const removeItem = async (id: number) => {
        const updated = equipment.filter(item => item.id !== id);
        setEquipment(updated)
        await AsyncStorage.setItem("equipment", JSON.stringify(updated));
    }

    const saveNewName = async (id: number) => {
        if (!newName) return;
        const updated = equipment.map(item => item.id === id ? {...item, name: newName} : item)
        setEquipment(updated)
        await AsyncStorage.setItem("equipment", JSON.stringify(updated));
        setShowInput(undefined)
        setNewName(undefined)
    }

    return (
        <ThemedView style={styles.outtestContainer}>
            <ThemedText type="title" onPress={async () => {/* TODO REMOVEEEE */
                await AsyncStorage.removeItem("equipment")
            }}>Equipment</ThemedText>
            <Pressable style={styles.editButton} onPress={() => setEdit(true)}>
                <Ionicons name="pencil-sharp" size={34} color="black"/>
            </Pressable>
            <ScrollView style={styles.equipmentContainer}>
                {categories.map((category) => (
                    <ThemedView key={category.id}>
                        <ThemedText style={styles.categoryTitle}>{category.name}</ThemedText>
                        {equipment
                            .filter(equipment => equipment.category === category.id)
                            .map(equipment => (
                                <ThemedView key={equipment.id}>
                                    { edit ?
                                        <>
                                            <ThemedView style={styles.item}>
                                                <ThemedText style={styles.itemName}
                                                            onPress={() => showInput === equipment.id ? setShowInput(undefined) : setShowInput(equipment.id)}>
                                                    {equipment.name}
                                                </ThemedText>
                                                <ThemedView style={styles.itemAddons}>
                                                    <Ionicons name="remove-circle" size={24} color="white"
                                                              onPress={() => changeAmount(equipment.id, -1)}/>
                                                    <ThemedText>{equipment.amount}</ThemedText>
                                                    <Ionicons name="add-circle" size={24} color="white"
                                                              onPress={() => changeAmount(equipment.id, 1)}/>
                                                    <Ionicons name="trash" size={24} color="white"
                                                              onPress={() => removeItem(equipment.id)}/>
                                                </ThemedView>
                                            </ThemedView>
                                            <ThemedView>
                                                {showInput === equipment.id &&
                                                    <TextInput style={styles.input} defaultValue={equipment.name}
                                                               autoFocus={true}
                                                               placeholder="Enter new name..." placeholderTextColor="#888"
                                                               onChangeText={value => setNewName(value)}
                                                               onEndEditing={() => saveNewName(equipment.id)}/>
                                                }
                                            </ThemedView>
                                        </>
                                        :
                                        <>
                                            <ThemedView style={styles.item}>
                                                <ThemedText style={styles.itemName}>{equipment.name}</ThemedText>
                                                <ThemedView style={styles.itemAddons}>
                                                    <ThemedText>{equipment.amount}</ThemedText>
                                                </ThemedView>
                                            </ThemedView>
                                        </>
                                    }
                                </ThemedView>
                            ))}
                        <ThemedView style={styles.separator}/>
                    </ThemedView>
                ))}
            </ScrollView>
            { edit &&
                <></>
            }
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    outtestContainer: {
        flex: 1,
        paddingTop: 40,
        alignItems: "center",
    },
    container: {
        alignItems: "center"
    },
    equipmentContainer: {
        marginTop: 40,
        width: "90%",
        paddingBottom: 100,
    },
    categoryTitle: {
        fontWeight: "bold",
        fontSize: 18,
    },
    item: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
        paddingHorizontal: 7,
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
    input: {
        marginTop: 8,
        marginBottom: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        backgroundColor: "#1C1C1E",
        color: "#FFF",
        fontSize: 16,
    },
    editButton: {
        position: "absolute",
        right: 30,
        bottom: 50,
        padding: 10,
        borderRadius: "50%",
        backgroundColor: "white",
    }
});
