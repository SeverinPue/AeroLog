import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import {Item} from "@/data/types/equipmentItem";
import {Button, Pressable, StyleSheet, TextInput} from "react-native";
import {useEffect, useState} from "react";
import {Dropdown} from "react-native-element-dropdown";
import {Ionicons} from "@expo/vector-icons";
import {CategoryBundle} from "@/data/types/categoryBundle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Checkbox} from "expo-checkbox";

type ItemInputProps = {
    onSubmit: (item: Omit<Item, "id" | "dateBought" | "chargeState">, calculateBatteryLife: boolean) => void
    onCancel: () => void
};

export default function ItemInput({onSubmit, onCancel}: ItemInputProps) {
    const [item, setItem] = useState<Omit<Item, "id" | "dateBought" | "chargeState">>({
        name: "",
        category: 0,
        amount: 0,
        bundles: []
    });
    const [calculateBatterLife, setCalculateBatteryLife] = useState(false)
    const [categories, setCategories] = useState<CategoryBundle[]>([])
    const [add, setAdd] = useState<boolean>(false)
    const [newCategory, setNewCategory] = useState<string>()

    useEffect(() => {
        const loadCategories = async () => {
            const stored = await AsyncStorage.getItem("categories");
            if (stored) {
                setCategories(JSON.parse(stored));
            }
        };
        loadCategories();
    }, []);

    const addCategory = async () => {
        if (!newCategory) return;
        const updated = [...categories, {id: categories.length + 1, name: newCategory}];
        setCategories(updated);
        await AsyncStorage.setItem("categories", JSON.stringify(updated));
        setAdd(false)
        setNewCategory(undefined)
        setItem({...item, category: updated[updated.length - 1].id})
    }

    return (
        <ThemedView style={styles.outtestContainer}>
            <ThemedText type="title">Add new item</ThemedText>
            <ThemedView style={styles.form}>
                <ThemedView style={styles.inputPair}>
                    <ThemedText>Name</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Name..." placeholderTextColor="#888"
                        onChangeText={value => setItem({...item, name: value})}/>
                </ThemedView>
                <ThemedView>
                    <ThemedText>Category</ThemedText>
                    <ThemedView style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            containerStyle={styles.dropdownContainer}
                            itemTextStyle={styles.dropdownItemText}
                            activeColor="#2C2C2E"
                            data={categories}
                            labelField="name"
                            valueField="id"
                            placeholder="Category..."
                            value={item.category}
                            onChange={(selected) =>
                                setItem({...item, category: selected.id})
                            }
                        />
                        <Pressable onPress={() => setAdd(true)}>
                            <Ionicons name="add" size={24} color="white"/>
                        </Pressable>
                    </ThemedView>
                    { add &&
                        <ThemedView style={{alignSelf: "center", width: "90%"}}>
                            <TextInput
                                style={styles.input}
                                placeholder="New category..." placeholderTextColor="#888"
                                onChangeText={value => setNewCategory(value)}
                            />
                            <ThemedView style={styles.rowContainer}>
                                <Button title={"Cancel"} onPress={() => setAdd(false)}/>
                                <Button title={"Save"} onPress={addCategory}/>
                            </ThemedView>
                        </ThemedView>
                    }
                </ThemedView>
                <ThemedView>
                    <ThemedText>Amount</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount..." placeholderTextColor="#888"
                        keyboardType="numeric"
                        onChangeText={value => setItem({...item, amount: Number(value)})}/>
                </ThemedView>
                <ThemedView style={{flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10}}>
                    <Checkbox
                        value={calculateBatterLife}
                        onValueChange={setCalculateBatteryLife}
                        color={calculateBatterLife ? '#555' : undefined}
                    />
                    <ThemedText>Calculate Battery Life</ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.rowContainer}>
                <Button title={"Cancel"} onPress={onCancel}/>
                <Button title={"Save"} onPress={() => onSubmit(item, calculateBatterLife)}/>
            </ThemedView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    outtestContainer: {
        alignItems: "center",
        width: "90%",
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: 20,
        width: "100%",
        marginTop: 20
    },
    form: {
        width: "100%",
        marginTop: 20,
    },
    inputPair: {
        width: "100%",
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
    dropdown: {
        marginTop: 8,
        marginBottom: 8,
        height: 44,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        backgroundColor: "#1C1C1E",
        justifyContent: "center",
        width: "90%",
    },
    placeholder: {
        color: "#888",
        fontSize: 16,
    },
    selectedText: {
        color: "#FFF",
        fontSize: 16,
    },
    dropdownContainer: {
        backgroundColor: "#1C1C1E",
        borderColor: "#444",
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownItemText: {
        color: "#FFF",
        fontSize: 16,
    },
});