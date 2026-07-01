import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

const SPOTS = [
  {
    id: '1',
    title: 'AeroLog Basis',
    description: 'Drohnen-Übungsplatz Winterthur',
    latitude: 47.5,
    longitude: 8.7241,
    pinColor: '#3b82f6',
  },
  {
    id: '2',
    title: 'Rheinfall',
    description: 'Fotoszenario über dem Rhein',
    latitude: 47.6779,
    longitude: 8.6156,
    pinColor: '#10b981',
  },
];


interface Waypoint {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: 'Cinematic' | 'Freestyle' | 'CamaraDrone';
}

export default function MapScreen() {
  const OPENAIP_API_KEY = '845d06205588a18ca5ed63827e287d5f';
  const SWISSTOPO_DRONE_LAYER =
    'https://wmts.geo.admin.ch/1.0.0/ch.bazl.einschraenkungen-drohnen/default/current/3857/{z}/{x}/{y}.png';
  const EUROPA_DRONE_LAYER = `https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${OPENAIP_API_KEY}&airspaceTypes=0,1,2,3,4,8,9&maxCeiling=500ft`;

  const [showEuropaLayer, setShowEuropaLayer] = useState(false);
  const [showSwissLayer, setShowSwissLayer] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { id: '1', title: 'AeroLog Basis', description: 'Drohnen-Übungsplatz Winterthur', latitude: 47.5, longitude: 8.7241, category: 'CamaraDrone' },
    { id: '2', title: 'Rheinfall', description: 'Fotoszenario über dem Rhein', latitude: 47.6779, longitude: 8.6156, category: 'Cinematic' },
  ]);

  return (
    <View style={styles.container}>
      {/* 1. KARTEN BEREICH: Jetzt ganz hinten und füllt alles aus */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 47.37790,
          longitude: 8.54041,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        showsUserLocation
        mapPadding={{
          top: 140,
          bottom: 80,
          left: 10,
          right: 10,
        }}
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
          <UrlTile urlTemplate={EUROPA_DRONE_LAYER} tileSize={256} opacity={0.6} zIndex={110} maximumZ={18} />
        )}
        {SPOTS.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.title}
            description={spot.description}
            pinColor={spot.pinColor}
          />
        ))}
      </MapView>

      {/* 2. OBERER BEREICH: Liegt absolut über der Karte, nutzt Standard-Hintergrund */}
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.title}>Drohnen-Karte</ThemedText>

        <Collapsible title="Karteneinstellungen">
          <ThemedView style={styles.collapsibleContent}>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <ThemedView style={styles.modalContent}>

            <ThemedView style={styles.coordsContainer}>
              <ThemedText style={styles.coordsText}>
                Lat: {selectedCoords?.latitude.toFixed(5)}
              </ThemedText>
              <ThemedText style={styles.coordsText}>
                Lng: {selectedCoords?.longitude.toFixed(5)}
              </ThemedText>
            </ThemedView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <ThemedText style={styles.modalCloseButtonText}>Abbrechen</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>

      <ThemedView style={styles.legendContainer}>
        <View style={styles.legendContent}>

          <View style={styles.legendItemsGroup}>
            {[
              { color: '#3b82f6', label: 'Basis' },
              { color: '#10b981', label: 'Fotospot' },
              { color: '#ef4444', label: 'Verbot' },
            ].map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <ThemedText style={styles.legendText}>{item.label}</ThemedText>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.legendAddButton}
            activeOpacity={0.7}
            onPress={() => { }}
          >
            <ThemedText style={styles.addButtonIcon}>＋</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Karte ist fest im Hintergrund verankert
  },
  headerContainer: {
    position: 'absolute', // Schwebend über der Karte verankert
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60, // Platz für Statusbar
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10, // Liegt über der Map
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  collapsibleContent: {
    marginTop: 8,
    alignItems: 'center',
    gap: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '90%',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  // NEW: Styles für das Dialog-Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dunkelt die Karte im Hintergrund ab
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    textAlign: 'center',
    color: '#94a3b8',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalCloseButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  coordsContainer: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  coordsText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Monospace sieht bei Zahlen sauberer aus
    color: '#3b82f6',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 24,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8, // Weniger Padding rechts, damit der runde Button bündig sitzt
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  legendContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendItemsGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  legendAddButton: {
    backgroundColor: '#3b82f6', // AeroLog Blau
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  addButtonIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -1, // Feinjustierung des Plus-Zeichens in der Mitte
  },


});