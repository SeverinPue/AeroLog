# Systemdokumentation: AeroLog

AeroLog ist ein kompakter Begleiter für Drohnenpiloten zur Verwaltung von Flugspots, Drohnen-Equipment und zur Planung von Reisen (Ferienplaner).

---

## 1. Grundkonzept
Die App hilft Drohnenpiloten, ihre Spots auf einer interaktiven Karte zu verwalten (inkl. Flugverbotszonen und Live-Wetter), den Zustand ihrer Akkus (Ladezustand, Alterung) zu überwachen und Packlisten für anstehende Drohnenreisen (Ferien) zu erstellen.

---

## 2. Architektur & Struktur
- **Frontend:** React Native / Expo (hybride iOS & Android App).
- **Navigation:** Expo Router (Tab-basiert).
- **Datenhaltung:** Lokaler Speicher über `AsyncStorage` (keine externe Datenbank notwendig, komplett offline-fähig).
- **APIs:** 
  - `Open-Meteo API` für Echtzeit-Wetterdaten.
  - `Sunrise-Sunset API` für Sonnenzeiten.
  - `Swisstopo & OpenAIP` für die Karteneinblendung der Flugverbotszonen.

---

## 3. Einzelne Umsetzungspunkte

### 3.1 Dronespot-Karte (Map)
- **Flugverbotszonen:** Schweizer Zonen (Swisstopo) und weltweite Zonen (OpenAIP) können als Layer über die Karte gelegt werden.
- **Wegpunkte:** Erstellen von Spots in den Kategorien: *Kamera-Drohne*, *Cinematic* und *Freestyle*.
- **Wetter & Sonne:** Beim Klick auf einen Spot werden Live-Wetter (Temperatur, Regen, Wind) und Sonnenauf-/-untergangszeiten geladen. Wind- (>15 km/h) und Regen-Warnungen (>0.5 mm) werden farblich hervorgehoben.
- **Teilen & Import:** Wegpunkte können als strukturierter Text geteilt und über ein Import-Feld wieder direkt hinzugefügt werden.

### 3.2 Equipment-Manager
- **Akku-Lebensdauer (Battery Life):** Berechnet automatisch einen Abzug von **2% pro Monat** seit dem Kaufdatum.
- **Ladezustand (Charge State):** Trackt den Zustand der Akkus:
  - *Voll* (grün/weiß)
  - *Leer* (rot/weiß)
  - *Storage / Lagerspannung* (blau, ideal für die Aufbewahrung von LiPo-Akkus).

### 3.3 Ferienplaner (Holiday Planner)
- **Reiseverwaltung:** Anlegen von neuen Drohnenreisen mit Reiseziel, Startdatum und zugewiesenen Drohnen-Bundles (z. B. Freestyle Drone, Cine Drone).
- **Dynamische Packliste:** Generiert automatisch eine interaktive Checkliste mit allen Ausrüstungsgegenständen aus den ausgewählten Bundles.
- **Status-Speicherung:** Der Erledigungsstatus der gepackten Gegenstände wird in Echtzeit in `AsyncStorage` persistiert, sodass der Pilot beim Kofferpacken den Fortschritt nicht verliert.
