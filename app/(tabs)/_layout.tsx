import {Tabs} from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
    const colorScheme = useColorScheme();

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
