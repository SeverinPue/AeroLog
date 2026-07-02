import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  // ─────────────────────────────────────────
  // LAYOUT / CONTAINER
  // ─────────────────────────────────────────

  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },


  // ─────────────────────────────────────────
  // HEADER (Drohnen-Karte Titel + Einstellungen)
  // ─────────────────────────────────────────

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    zIndex: 10,
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


  // ─────────────────────────────────────────
  // mapTypeRow 
  // ─────────────────────────────────────────
  mapTypeRow: {
    marginTop: 12,
    flexDirection: 'row',
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderRadius: 14,
    padding: 4,
    width: '90%',
    marginBottom: 12,
  },
  mapTypeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  mapTypeButtonActive: {
    backgroundColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapTypeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  mapTypeButtonTextActive: {
    color: '#ffffff',
  },

  // ─────────────────────────────────────────
  // LEGENDE (unten)
  // ─────────────────────────────────────────

  legendContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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


  // ─────────────────────────────────────────
  // BEARBEITUNGS-MODUS (Edit-Button & Banner)
  // ─────────────────────────────────────────

  editButton: {
    position: 'absolute',
    bottom: 170,
    right: 16,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  editBanner: {
    position: 'absolute',
    top: 145,
    left: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editBannerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },


  // ─────────────────────────────────────────
  // WAYPOINT Import
  // ─────────────────────────────────────────

  importButton: {
    position: 'absolute',
    bottom: 250,
    right: 16,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },


  // ─────────────────────────────────────────
  // WAYPOINT INFO-PANEL (absolut über Karte)
  // ─────────────────────────────────────────

  waypointPanel: {
    position: 'absolute',
    top: 150,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 14,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  waypointPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  waypointCategoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  waypointCloseButton: {
    padding: 4,
  },
  waypointCoords: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3b82f6',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  waypointCategoryLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  waypointTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  waypointDescription: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 16,
    marginBottom: 6,
  },
  waypointPanelHeaderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  weatherStatusContainer: {
    marginTop: 12,
    width: '100%',
  },
  weatherBadge: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  weatherBadgeRegen: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  weatherBadgeWind: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  weatherBadgePerfekt: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  weatherTextRegen: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 13,
  },
  weatherTextWind: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 13,
  },
  weatherTextPerfekt: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 13,
  },
  weatherLoadingText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 8,
  },
  sunStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
    width: '100%',
  },
  sunBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  sunText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },


  // ─────────────────────────────────────────
  // MODAL (Waypoint erstellen / bearbeiten)
  // ─────────────────────────────────────────

  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalInput: {
    width: '100%',
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  modalInputMultiline: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#3b82f6',
  },


  // ─────────────────────────────────────────
  // MODAL – KATEGORIE-AUSWAHL BUTTONS
  // ─────────────────────────────────────────

  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#333',
    fontSize: 13,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },


  // ─────────────────────────────────────────
  // MODAL – AKTIONS-BUTTONS (Speichern, Abbrechen, Löschen)
  // ─────────────────────────────────────────

  modalButtonColumn: {
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
  modalCancelButton: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalDeleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  modalCancelText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  modalActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },


  // ─────────────────────────────────────────
  // NICHT MEHR GENUTZT (legacy, callout-basiert)
  // ─────────────────────────────────────────

  calloutOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 120,
  },
  calloutBubble: {
    width: 220,
    height: 110,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  calloutDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  calloutCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 16,
    marginBottom: 6,
  },
});
