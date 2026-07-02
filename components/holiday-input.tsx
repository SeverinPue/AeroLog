import {Holiday} from "@/data/types/holiday";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import {Button, Pressable, StyleSheet, TextInput} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {CategoryBundle} from "@/data/types/categoryBundle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {Item} from "@/data/types/equipmentItem";

type HolidayInputProps = {
    onSubmit: (holiday: Omit<Holiday, "id">) => void
    onCancel: () => void
};

export default function HolidayInput({onSubmit, onCancel}: HolidayInputProps) {
    const [holiday, setHoliday] = useState<Omit<Holiday, "id">>({
        startDate: new Date().toDateString(),
        bundles: [],
        location: "",
    })
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [bundles, setBundles] = useState<CategoryBundle[]>([])
    const [equipment, setEquipment] = useState<Item[]>([])
    const [add, setAdd] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [newBundle, setNewBundle] = useState<string>("")
    const [newBundleItems, setNewBundleItems] = useState<number[]>([])

    useEffect(() => {
        const loadBundles = async () => {
            const saved = await AsyncStorage.getItem("bundles")
            if (saved) {
                setBundles(JSON.parse(saved))
            }
        }
        const loadEquipment = async () => {
            const saved = await AsyncStorage.getItem("equipment")
            if (saved) {
                setEquipment(JSON.parse(saved))
            }
        }
        const loadHolidays = async () => {
            const stored = await AsyncStorage.getItem("holidays");
            if (stored) {
                setHolidays(JSON.parse(stored));
            }
        };
        loadHolidays();
        loadBundles()
        loadEquipment()
    }, [])

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: new Date(holiday.startDate),
            onChange: (event, selectedDate) => setHoliday({
                ...holiday,
                startDate: selectedDate?.toDateString() || holiday.startDate
            }),
            mode: "date",
            is24Hour: true,
        })
    }

    const selectBundle = (bundleId: number) => {
        if (holiday.bundles.includes(bundleId)) return
        setHoliday({...holiday, bundles: [...holiday.bundles, bundleId]})
    }

    const addBundle = async () => {
        if (!newBundle || newBundleItems.length === 0) return
        const newBundleId = bundles.length + 1
        const updated = [...bundles, {id: newBundleId, name: newBundle}]
        setBundles(updated)
        await AsyncStorage.setItem("bundles", JSON.stringify(updated))
        setHoliday({...holiday, bundles: [...holiday.bundles, newBundleId]})

        const updatedEquipment = equipment.map(item => newBundleItems.includes(item.id) ? {
            ...item,
            bundles: [...item.bundles, newBundleId]
        } : item)
        setEquipment(updatedEquipment)
        await AsyncStorage.setItem("equipment", JSON.stringify(updatedEquipment))

        setAdd(false)
        setNewBundle("")
        setNewBundleItems([])
    }

    const removeBundle = async (bundleId: number) => {
        const updated = bundles.filter(bundle => bundle.id !== bundleId)
        setBundles(updated)
        await AsyncStorage.setItem("bundles", JSON.stringify(updated))
        setHoliday({...holiday, bundles: holiday.bundles.filter(b => b !== bundleId)})

        const updatedEquipment = equipment.map(item => ({
            ...item,
            bundles: item.bundles.filter(b => b !== bundleId)
        }))
        setEquipment(updatedEquipment)
        await AsyncStorage.setItem("equipment", JSON.stringify(updatedEquipment))
    }

    return (
        <ThemedView style={styles.outtestContainer}>
            <ThemedText type="title">Add new holiday</ThemedText>
            <ThemedView style={styles.form}>
                <ThemedView style={styles.inputPair}>
                    <ThemedText>Location</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Location..." placeholderTextColor="#888"
                        onChangeText={value => setHoliday({...holiday, location: value})}/>
                </ThemedView>
                <ThemedView>
                    <ThemedText>Bundles</ThemedText>
                    <ThemedView style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <Dropdown
                            style={[styles.dropdown, {width: "70%"}]}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            containerStyle={styles.dropdownContainer}
                            itemTextStyle={styles.dropdownItemText}
                            activeColor="#2C2C2E"
                            data={bundles}
                            labelField="name"
                            valueField="id"
                            placeholder="Bundle..."
                            onChange={(selected) =>
                                selectBundle(selected.id)
                            }
                        />
                        <Pressable onPress={() => setEdit(!edit)}>
                            <Ionicons name="pencil-sharp" size={24} color="white"/>
                        </Pressable>
                        <Pressable onPress={() => setAdd(true)}>
                            <Ionicons name="add" size={24} color="white"/>
                        </Pressable>
                    </ThemedView>
                    {add &&
                        <ThemedView style={{alignSelf: "center", width: "90%"}}>
                            <TextInput
                                style={styles.input}
                                placeholder="New Bundle..." placeholderTextColor="#888"
                                onChangeText={value => setNewBundle(value)}
                            />
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholder}
                                selectedTextStyle={styles.selectedText}
                                containerStyle={styles.dropdownContainer}
                                itemTextStyle={styles.dropdownItemText}
                                activeColor="#2C2C2E"
                                data={equipment}
                                labelField="name"
                                valueField="id"
                                placeholder="Item..."
                                onChange={(selected) =>
                                    setNewBundleItems(prev => prev.includes(selected.id) ? prev : [...prev, selected.id])
                                }
                            />
                            <ThemedView style={styles.selectedMultiDropdown}>
                                {newBundleItems.map(itemId => (
                                    <Pressable key={itemId} style={styles.selectedMultiDropdownItem}
                                               onPress={() => setNewBundleItems(newBundleItems.filter(id => id !== itemId))}>
                                        <ThemedText>{equipment.find(b => b.id === itemId)?.name}</ThemedText>
                                    </Pressable>
                                ))}
                            </ThemedView>
                            <ThemedView style={styles.rowContainer}>
                                <Button title={"Cancel"} onPress={() => setAdd(false)}/>
                                <Button title={"Save"} onPress={addBundle}/>
                            </ThemedView>
                        </ThemedView>
                    }
                    {edit &&
                        <>
                            <ThemedView style={styles.separator} />
                            <ThemedText>{bundles.filter(bundle => !holidays.some(h => h.bundles.includes(bundle.id))).length < 1 && "No"} Removable Bundles</ThemedText>
                            <ThemedView style={styles.selectedMultiDropdown}>
                                {bundles.filter(bundle => !holidays.some(h => h.bundles.includes(bundle.id))).map(bundle => (
                                    <ThemedView key={bundle.id} style={styles.bundleEdit}>
                                        <ThemedText>{bundle.name}</ThemedText>
                                        <Ionicons name="trash" size={24} color="white" onPress={() => removeBundle(bundle.id)}/>
                                    </ThemedView>
                                ))}
                            </ThemedView>
                            <ThemedView style={styles.separator} />
                        </>
                    }
                    <ThemedView style={styles.selectedMultiDropdown}>
                        {holiday.bundles.map(bundleId => (
                            <Pressable key={bundleId} style={styles.selectedMultiDropdownItem}
                                       onPress={() => setHoliday({
                                           ...holiday,
                                           bundles: holiday.bundles.filter(b => b !== bundleId)
                                       })}>
                                <ThemedText>{bundles.find(b => b.id === bundleId)?.name}</ThemedText>
                            </Pressable>
                        ))}
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.inputPair}>
                    <ThemedText>Start Date</ThemedText>
                    <Pressable style={styles.datePicker} onPress={showDatePicker}>
                        <FontAwesome5 name="calendar-alt" size={24} color="white"/>
                        <ThemedText>{holiday.startDate}</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.rowContainer}>
                <Button title={"Cancel"} onPress={onCancel}/>
                <Button title={"Save"} onPress={() => onSubmit(holiday)}/>
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
        gap: 20,
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
    selectedMultiDropdown: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start"
    },
    selectedMultiDropdownItem: {
        backgroundColor: "#2D2D2D",
        borderRadius: 3,
        margin: 4,
        padding: 2,
        paddingHorizontal: 4,
    },
    datePicker: {
        marginTop: 3,
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
        backgroundColor: "#2D2D2D",
        padding: 10,
        borderRadius: 10,
    },
    bundleEdit: {
        flexDirection: "row",
        backgroundColor: "#2D2D2D",
        borderRadius: 3,
        padding: 4,
        margin: 4,
        gap: 4,
    },
    separator: {
        height: 1,
        backgroundColor: "#555",
        marginVertical: 10,
    },
});