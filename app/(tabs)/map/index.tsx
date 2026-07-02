import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { SunriseSunset } from '@/data/types/sunriseSunset';
import { Category, Waypoint } from '@/data/types/waypoints';
import { Weather } from '@/data/types/weather';
import { Entypo, Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Share, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { styles } from './_styles';

const getCategoryColor = (category: Waypoint['category']) => {
  switch (category) {
    case 'CameraDrone':
      return '#00b140ff';
    case 'Cinematic':
      return '#cece3dff';
    case 'Freestyle':
      return '#ff0000ff';
    default:
      return '#ffffff';
  }
};

const getCategoryLabel = (category: Waypoint['category']) => {
  switch (category) {
    case 'CameraDrone':
      return 'Kamera Drone';
    case 'Cinematic':
      return 'Cinematic';
    case 'Freestyle':
      return 'Freestyle';
    default:
      return category;
  }
};

export default function MapScreen() {
  const OPENAIP_API_KEY = '845d06205588a18ca5ed63827e287d5f';
  const SWISSTOPO_DRONE_LAYER =
    'https://wmts.geo.admin.ch/1.0.0/ch.bazl.einschraenkungen-drohnen/default/current/3857/{z}/{x}/{y}.png';
  const EUROPA_DRONE_LAYER = `https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${OPENAIP_API_KEY}&airspaceTypes=0,1,2,3,4,8,9&maxCeiling=500ft`;

  const [showEuropaLayer, setShowEuropaLayer] = useState(false);
  const [showSwissLayer, setShowSwissLayer] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingWaypoint, setEditingWaypoint] = useState<Waypoint | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);

  const [weather, setWeather] = useState<Weather | null>(null);
  const [sunriseSunset, setSunriseSunset] = useState<SunriseSunset | null>(null);

  const [wpTitle, setWpTitle] = useState('');
  const [wpDescription, setWpDescription] = useState('');
  const [wpCategory, setWpCategory] = useState<Category>(Category.CameraDrone);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const [importText, setImportText] = useState('');
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  const [currentMapType, setCurrentMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const stored = await AsyncStorage.getItem("waypoints");
        if (stored) setWaypoints(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Berechtigung für den Standort wurde abgelehnt');
        return;
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    const loadWaypoints = async () => {
      try {
        const stored = await AsyncStorage.getItem("waypoints");
        if (stored) {
          setWaypoints(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Fehler beim Laden der Wegpunkte:", error);
      }
    };
    loadWaypoints();
  }, []);

  const getWeatherOnThisPoint = async (latitude: number, longitude: number) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m,weather_code&timezone=Europe/Berlin`;
      const response = await fetch(url);

      const data: Weather = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Fehler beim Abrufen des Wetters:", error);
    }
  };

  const getSunriseSunsetOnThisPoint = async (latitude: number, longitude: number) => {
    try {
      const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;
      const response = await fetch(url);
      const data: SunriseSunset = await response.json();

      setSunriseSunset(data);
    } catch (error) {
      console.error("Fehler beim Abrufen von Sunrise/Sunset:", error);
    }
  };

  const handleShareWaypoint = async () => {
    try {
      const waypoint = selectedWaypoint;
      if (!waypoint) return;
      const message = `Schau dir diesen Ort an:\n${waypoint.title}\n${waypoint.description}\n${waypoint.latitude.toFixed(5)}, ${waypoint.longitude.toFixed(5)}, ${waypoint.category}`;
      await Share.share({
        message,
        title: "Wegpunkt teilen",
      });
    } catch (error) {
      console.error("Fehler beim Teilen des Wegpunkts:", error);
    }
  };


  const importWaypoints = async () => {
    try {
      const lines = importText.split('\n');

      const title = lines[1];
      const description = lines[2];
      const geoDetails = lines[3].split(', ');

      const newWaypoint: Waypoint = {
        id: Date.now().toString(),
        title: title || "Importierter Ort",
        description: description || "",
        latitude: parseFloat(geoDetails[0]),
        longitude: parseFloat(geoDetails[1]),
        category: geoDetails[2] as Category,
      };

      const updatedWaypoints = [...waypoints, newWaypoint];
      setWaypoints(updatedWaypoints);

      await AsyncStorage.setItem('waypoints', JSON.stringify(updatedWaypoints));

      setIsImportModalVisible(false);
      setImportText('');
      setSelectedWaypoint(newWaypoint);

      mapRef.current?.animateToRegion({
        latitude: newWaypoint.latitude,
        longitude: newWaypoint.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);

    } catch (error) {
      console.error("Fehler beim Importieren:", error);
      alert("Ein Fehler ist beim Importieren aufgetreten.");
    }
  };

  const handleSaveWaypoint = async () => {
    if (editingWaypoint) {
      const updatedWaypoints = waypoints.map((wp) =>
        wp.id === editingWaypoint.id
          ? {
            ...wp,
            title: wpTitle || "Unbenannt",
            description: wpDescription,
            category: Category[wpCategory],
          }
          : wp
      );
      setWaypoints(updatedWaypoints);
      try {
        await AsyncStorage.setItem('waypoints', JSON.stringify(updatedWaypoints));
      } catch (error) {
        console.error("Fehler beim Aktualisieren des Wegpunkts:", error);
      }
      setIsModalVisible(false);
      setEditingWaypoint(null);
      setWpTitle('');
      setWpDescription('');
      return;
    }

    if (!selectedCoords) return;

    const newWaypoint: Waypoint = {
      id: Date.now().toString(),
      title: wpTitle || "Neuer Ort",
      description: wpDescription,
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
      category: Category[wpCategory],
    };

    const updatedWaypoints = [...waypoints, newWaypoint];
    setWaypoints(updatedWaypoints);

    try {
      await AsyncStorage.setItem('waypoints', JSON.stringify(updatedWaypoints));
    } catch (error) {
      console.error("Fehler beim Speichern des Wegpunkts:", error);
    }

    setIsModalVisible(false);
    setWpTitle('');
    setWpDescription('');
  };

  const handleDeleteWaypoint = async () => {
    if (!editingWaypoint) return;

    const updatedWaypoints = waypoints.filter((wp) => wp.id !== editingWaypoint.id);
    setWaypoints(updatedWaypoints);

    try {
      await AsyncStorage.setItem('waypoints', JSON.stringify(updatedWaypoints));
    } catch (error) {
      console.error("Fehler beim Löschen des Wegpunkts:", error);
    }

    setIsModalVisible(false);
    setEditingWaypoint(null);
    setWpTitle('');
    setWpDescription('');
  };

  return (
    <View style={styles.container}>

      <MapView
        style={styles.map}
        ref={mapRef}
        mapType={currentMapType}
        initialRegion={{
          latitude: 47.37790,
          longitude: 8.54041,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapPadding={{ top: 140, bottom: 100, left: 10, right: 10 }}
        onLongPress={(e) => {
          const coords = e.nativeEvent.coordinate;
          setSelectedCoords(coords);
          setIsModalVisible(true);
        }}
      >
        {showSwissLayer && (
          <UrlTile urlTemplate={SWISSTOPO_DRONE_LAYER} tileSize={256} opacity={0.6} zIndex={100} />
        )}
        {showEuropaLayer && (
          <UrlTile urlTemplate={EUROPA_DRONE_LAYER} tileSize={256} opacity={0.8} zIndex={110} maximumZ={18} />
        )}
        {waypoints.map((waypoint) => (
          <Marker
            key={`${waypoint.id}-${waypoint.category}-${waypoint.title}-${waypoint.description}`}
            coordinate={{ latitude: waypoint.latitude, longitude: waypoint.longitude }}
            pinColor={getCategoryColor(waypoint.category)}
            onPress={(e) => {
              e.stopPropagation();
              if (isEditing) {
                setEditingWaypoint(waypoint);
                setWpTitle(waypoint.title);
                setWpDescription(waypoint.description);
                setWpCategory(waypoint.category);
                setIsModalVisible(true);
                setIsEditing(false);
              } else {
                getWeatherOnThisPoint(waypoint.latitude, waypoint.longitude);
                getSunriseSunsetOnThisPoint(waypoint.latitude, waypoint.longitude)
                setSelectedWaypoint(prev => prev?.id === waypoint.id ? null : waypoint);
              }
            }}
          />
        ))}
      </MapView>

      {/* ── WAYPOINT INFO-PANEL ── */}
      {selectedWaypoint && !isEditing && (
        <ThemedView style={styles.waypointPanel}>
          <View style={styles.waypointPanelHeader}>
            <View style={[styles.waypointCategoryDot, { backgroundColor: getCategoryColor(selectedWaypoint.category) }]} />
            <ThemedText style={styles.waypointCategoryLabel}>{getCategoryLabel(selectedWaypoint.category)}</ThemedText>
            <View style={styles.waypointPanelHeaderButtons}>
              <TouchableOpacity onPress={handleShareWaypoint} style={styles.waypointCloseButton}>
                <Entypo name="share" size={24} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedWaypoint(null)} style={styles.waypointCloseButton}>
                <Ionicons name="close" size={28} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>
          <ThemedText style={styles.waypointTitle}>{selectedWaypoint.title}</ThemedText>
          {selectedWaypoint.description ? (
            <ThemedText style={styles.waypointDescription}>{selectedWaypoint.description}</ThemedText>
          ) : null}
          <ThemedText style={styles.waypointCoords}>
            {selectedWaypoint.latitude.toFixed(5)}, {selectedWaypoint.longitude.toFixed(5)}
          </ThemedText>
          {weather && weather.current ? (
            <View style={styles.weatherStatusContainer}>
              {weather.current.precipitation > 0.5 ? (
                <View style={[styles.weatherBadge, styles.weatherBadgeRegen]}>
                  <ThemedText style={styles.weatherTextRegen}>
                    {'🌧️ Regen: ' + weather.current.precipitation + ' mm'}
                  </ThemedText>
                </View>
              ) : weather.current.wind_speed_10m > 15 ? (
                <View style={[styles.weatherBadge, styles.weatherBadgeWind]}>
                  <ThemedText style={styles.weatherTextWind}>
                    {'💨 Starker Wind: ' + weather.current.wind_speed_10m + ' km/h'}
                  </ThemedText>
                </View>
              ) : (
                <View style={[styles.weatherBadge, styles.weatherBadgePerfekt]}>
                  <ThemedText style={styles.weatherTextPerfekt}>
                    {'☀️ Perfektes Flugwetter (' + weather.current.temperature_2m + '°C)'}
                  </ThemedText>
                </View>
              )}
            </View>
          ) : null}
          {sunriseSunset && (
            <View style={styles.sunStatusContainer}>
              <View style={styles.sunBadge}>
                <ThemedText style={styles.sunText}>
                  {'☀️ ' + new Date(sunriseSunset.results.sunrise).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
                </ThemedText>
              </View>
              <View style={styles.sunBadge}>
                <ThemedText style={styles.sunText}>
                  {'🌙 ' + new Date(sunriseSunset.results.sunset).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
                </ThemedText>
              </View>
            </View>
          )}
        </ThemedView>
      )}

      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
        <ThemedText style={styles.legendText}>
          <Ionicons name="pencil-sharp" size={30} color={isEditing ? "#3b82f6" : "white"} />
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.importButton} onPress={() => setIsImportModalVisible(true)}>
        <ThemedText style={styles.legendText}>
          <AntDesign name="import" size={30} color="white" />
        </ThemedText>
      </TouchableOpacity>

      {isEditing && (
        <ThemedView style={styles.editBanner}>
          <ThemedText style={styles.editBannerText}>
            Bearbeitungsmodus: Tippe auf einen Wegpunkt zum Bearbeiten/Löschen
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.title}>Drohnen-Karte</ThemedText>
        <Collapsible title="Karteneinstellungen">
          <ThemedView style={styles.collapsibleContent}>
            <View style={styles.mapTypeRow}>
              {(['standard', 'hybrid'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.mapTypeButton,
                    currentMapType === type && styles.mapTypeButtonActive
                  ]}
                  onPress={() => setCurrentMapType(type)}
                >
                  <ThemedText style={[
                    styles.mapTypeButtonText,
                    currentMapType === type && styles.mapTypeButtonTextActive
                  ]}>
                    {type === 'standard' ? 'Standard' : 'Sateliten'}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <ThemedView style={styles.switchContainer}>
              <ThemedText style={styles.switchLabel}>Schweizer Flugverbotszonen</ThemedText>
              <Switch
                value={showSwissLayer}
                onValueChange={(value) => setShowSwissLayer(value)}
                trackColor={{ false: '#334155', true: '#3b82f6' }}
                thumbColor={showSwissLayer ? '#fff' : '#94a3b8'}
              />
            </ThemedView>
            <ThemedView style={styles.switchContainer}>
              <ThemedText style={styles.switchLabel}>Weltweite Flugverbotszonen</ThemedText>
              <Switch
                value={showEuropaLayer}
                onValueChange={(value) => setShowEuropaLayer(value)}
                trackColor={{ false: '#334155', true: '#3b82f6' }}
                thumbColor={showEuropaLayer ? '#fff' : '#94a3b8'}
              />
            </ThemedView>
          </ThemedView>
        </Collapsible>
      </ThemedView>

      {/* ── MODAL (Waypoint erstellen / bearbeiten) ── */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
          setEditingWaypoint(null);
          setWpTitle('');
          setWpDescription('');
        }}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>
              {editingWaypoint ? 'Wegpunkt bearbeiten' : 'Neuer Wegpunkt Erstellen'}
            </ThemedText>

            <TextInput
              style={styles.modalInput}
              placeholder="Wegpunkt Name"
              placeholderTextColor="#64748b"
              onChangeText={setWpTitle}
              value={wpTitle}
            />

            <TextInput
              style={styles.modalInputMultiline}
              placeholder="Beschreibung..."
              placeholderTextColor="#64748b"
              multiline
              onChangeText={setWpDescription}
              value={wpDescription}
            />

            <ThemedView style={styles.coordsContainer}>
              <ThemedText style={styles.coordsText}>
                Lat: {(editingWaypoint ? editingWaypoint.latitude : selectedCoords?.latitude)?.toFixed(5)}
              </ThemedText>
              <ThemedText style={styles.coordsText}>
                Lng: {(editingWaypoint ? editingWaypoint.longitude : selectedCoords?.longitude)?.toFixed(5)}
              </ThemedText>
            </ThemedView>

            <View style={styles.categoryRow}>
              {Object.values(Category).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, category === wpCategory && styles.categoryButtonActive]}
                  onPress={() => setWpCategory(category)}
                >
                  <ThemedText style={[styles.categoryButtonText, category === wpCategory && styles.categoryButtonTextActive]}>
                    {getCategoryLabel(category)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtonColumn}>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setIsModalVisible(false);
                    setEditingWaypoint(null);
                    setWpTitle('');
                    setWpDescription('');
                  }}
                >
                  <ThemedText style={styles.modalCancelText}>Abbrechen</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleSaveWaypoint}
                >
                  <ThemedText style={styles.modalActionText}>
                    {editingWaypoint ? 'Speichern' : 'Erstellen'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {editingWaypoint && (
                <TouchableOpacity
                  style={styles.modalDeleteButton}
                  onPress={handleDeleteWaypoint}
                >
                  <ThemedText style={styles.modalActionText}>Wegpunkt löschen</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </ThemedView>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isImportModalVisible}
        onRequestClose={() => {
          setIsImportModalVisible(false);
          setImportText('');
        }}
      >

        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>
              Importieren
            </ThemedText>
            <TextInput
              style={styles.modalInputMultiline}
              placeholder="Import Text..."
              placeholderTextColor="#64748b"
              multiline
              onChangeText={setImportText}
              value={importText}
            />

            <View style={styles.modalButtonColumn}>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setIsImportModalVisible(false);
                    setImportText('');
                  }}
                >
                  <ThemedText style={styles.modalCancelText}>Abbrechen</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={importWaypoints}
                >
                  <ThemedText style={styles.modalActionText}>Importieren</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>
        </View>
      </Modal>

      <ThemedView style={styles.legendContainer}>
        {[
          { color: '#cece3dff', label: getCategoryLabel(Category.CameraDrone) },
          { color: '#ff0000ff', label: getCategoryLabel(Category.Freestyle) },
          { color: '#00b140ff', label: getCategoryLabel(Category.Cinematic) },
        ].map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <ThemedText style={styles.legendText}>{item.label}</ThemedText>
          </View>
        ))}
      </ThemedView>

    </View>
  );
}