import {Animated, Pressable, StyleSheet, TextInput} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';

import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Item} from "@/data/types/equipmentItem";
import {useEffect, useState} from "react";
import ScrollView = Animated.ScrollView;
import ItemInput from "@/components/item-input";
import {CategoryBundle} from "@/data/types/categoryBundle";

export default function EquipmentManager() {
    const [equipment, setEquipment] = useState<Item[]>([]);
    const [categories, setCategories] = useState<CategoryBundle[]>([])
    const [showInput, setShowInput] = useState<number>();
    const [newName, setNewName] = useState<string>();
    const [edit, setEdit] = useState<boolean>(false);
    const [add, setAdd] = useState<boolean>(false);

    useEffect(() => {
        const loadEquipment = async () => {
            const stored = await AsyncStorage.getItem("equipment");
            if (stored) {
                setEquipment(JSON.parse(stored));
            }
        };
        const loadCategories = async () => {
            const stored = await AsyncStorage.getItem("categories");
            if (stored) {
                setCategories(JSON.parse(stored));
            }
        };
        loadEquipment();
        loadCategories();
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

    const removeCategory = async (id: number) => {
        const updated = categories.filter(category => category.id !== id);
        setCategories(updated)
        await AsyncStorage.setItem("categories", JSON.stringify(updated));
    }

    const saveNewName = async (id: number) => {
        if (!newName) return;
        const updated = equipment.map(item => item.id === id ? {...item, name: newName} : item)
        setEquipment(updated)
        await AsyncStorage.setItem("equipment", JSON.stringify(updated));
        setShowInput(undefined)
        setNewName(undefined)
    }

    const saveNewEquipment = async (item: Omit<Item, "id">) => {
        const updated = [...equipment, {...item, id: equipment.length + 1}];
        setEquipment(updated);
        await AsyncStorage.setItem("equipment", JSON.stringify(updated));
        const stored = await AsyncStorage.getItem("categories");
        if (stored) {
            setCategories(JSON.parse(stored));
        }
        setAdd(false)
    }

    return (
        <ThemedView style={styles.outtestContainer}>
            { add && edit ?
                <ItemInput onSubmit={saveNewEquipment} onCancel={() => setAdd(false)} />
                :
                <>
                    <ThemedView style={styles.header}>
                        <ThemedText type="title" onPress={async () => {/* TODO REMOVEEEE */
                            await AsyncStorage.removeItem("equipment")
                            await AsyncStorage.removeItem("categories")
                        }}>Equipment</ThemedText>
                        { edit ?
                            <ThemedView style={styles.rowContainer}>
                                <Pressable style={styles.iconButton} onPress={() => setAdd(true)}>
                                    <Ionicons name="add" size={24} color="black"/>
                                </Pressable>
                                <Pressable style={styles.iconButton} onPress={() => setEdit(false)}>
                                    <Ionicons name="checkmark" size={24} color="black"/>
                                </Pressable>
                            </ThemedView>
                            :
                            <Pressable style={styles.iconButton} onPress={() => setEdit(true)}>
                                <Ionicons name="pencil-sharp" size={24} color="black"/>
                            </Pressable>
                        }
                    </ThemedView>
                    <ScrollView style={styles.equipmentContainer}>
                        {categories.map((category) => (
                            <ThemedView key={category.id}>
                                <ThemedView style={{flexDirection: "row", gap: 10}}>
                                    <ThemedText style={styles.categoryTitle}>{category.name}</ThemedText>
                                    { equipment.filter(equipment => equipment.category === category.id).length === 0 &&
                                        <Ionicons name="trash" size={22} color="white"
                                                  onPress={() => removeCategory(category.id)}/>
                                    }
                                </ThemedView>
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
                                                            <Ionicons name="remove-circle" size={22} color="white"
                                                                      onPress={() => changeAmount(equipment.id, -1)}/>
                                                            <ThemedText>{equipment.amount}</ThemedText>
                                                            <Ionicons name="add-circle" size={22} color="white"
                                                                      onPress={() => changeAmount(equipment.id, 1)}/>
                                                            <Ionicons name="trash" size={22} color="white"
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
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 20,
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
    iconButton: {
        padding: 10,
        borderRadius: "50%",
        backgroundColor: "white",
    }
});
