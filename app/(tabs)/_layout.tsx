import {Tabs} from 'expo-router';
import React, {useEffect} from 'react';

import categoriesList from '@/data/categories.json';
import equipmentList from '@/data/equipment.json';
import bundlesList from '@/data/bundles.json';
import {HapticTab} from '@/components/haptic-tab';
import {IconSymbol} from '@/components/ui/icon-symbol';
import {Colors} from '@/constants/theme';
import {useColorScheme} from '@/hooks/use-color-scheme';
import {FontAwesome5} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        const loadExampleEquipment = async () => {
            const stored = await AsyncStorage.getItem("equipment");
            if (!stored) {
                await AsyncStorage.setItem("equipment", JSON.stringify(equipmentList));
            }
        };
        const loadExampleCategories = async () => {
            const stored = await AsyncStorage.getItem("categories");
            if (!stored) {
                await AsyncStorage.setItem("categories", JSON.stringify(categoriesList));
            }
        };
        const loadExampleBundles = async () => {
            const stored = await AsyncStorage.getItem("bundles");
            if (!stored) {
                await AsyncStorage.setItem("bundles", JSON.stringify(bundlesList));
            }
        };
        loadExampleEquipment();
        loadExampleCategories();
        loadExampleBundles();
    }, []);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
            }}>
            <Tabs.Screen
                name="map/index"
                options={{
                    title: 'Map',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="map.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="checklist/index"
                options={{
                    title: 'Checklist',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="checklist" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="holidayplaner"
                options={{
                    title: 'Holidayplaner',
                    tabBarIcon: ({color}) => <FontAwesome5 name="umbrella-beach" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="equipmantManager/index"
                options={{
                    title: 'Equipment',
                    tabBarIcon: ({color}) => <FontAwesome5 name="wrench" size={24} color={color}/>,
                }}
            />
        </Tabs>
    );
}
