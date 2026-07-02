import { Stack } from "expo-router";

export default function HolidayPlannerLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    presentation: "modal",
                    title: "Holiday Details",
                }}
            />
        </Stack>
    );
}