export interface Weather {
    current: {
        time: string;
        interval: number;
        temperature_2m: number;
        precipitation: number;
        wind_speed_10m: number;
        weather_code: number;
    };
}