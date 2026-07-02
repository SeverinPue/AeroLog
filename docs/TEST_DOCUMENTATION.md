# Testdokumentation: AeroLog

Systematische und einfache Vorgehensweise zum Testen der AeroLog-Funktionen.

---

## 1. Dronespot-Karte & Flugverbotszonen
- **Konzept:** Einblenden der externen Karten-Layer für Flugzonen.
- **Testen:**
  - Karteneinstellungen öffnen.
  - "Schweizer Flugverbotszonen" einschalten -> Prüfen, ob rote Zonen geladen werden.
  - "Weltweite Flugverbotszonen" einschalten -> Prüfen, ob zusätzliche Luftraum-Zonen geladen werden.

## 2. Wegpunkte (Erstellen, Bearbeiten, Löschen)
- **Konzept:** Lokale Speicherung von Drohnenspots.
- **Testen:**
  - Lang auf eine beliebige Stelle auf der Karte drücken.
  - Name, Beschreibung eingeben, Kategorie wählen und speichern.
  - Prüfen, ob der Marker mit der richtigen Farbe (Kamera = gelb/grün, Freestyle = rot, Cinematic = grün) auf der Karte erscheint.
  - Bearbeitungsmodus (Stift-Symbol) aktivieren, auf Marker tippen, Werte ändern oder löschen und prüfen, ob es übernommen wird.

## 3. Wetter & Sonnenzeiten
- **Konzept:** Abfrage der Live-Wetterdaten und Sonnenzeiten am ausgewählten Ort.
- **Testen:**
  - Auf einen erstellten Marker tippen.
  - Prüfen, ob das Info-Panel unten aufklappt.
  - Wetter checken: Zeigt es "Perfektes Flugwetter" oder bei entsprechendem Wetter "Regen" / "Starker Wind" an?
  - Sonnenaufgangs- und Sonnenuntergangszeiten prüfen.

## 4. Wegpunkt Import / Export
- **Konzept:** Teilen und Einspielen von Wegpunktdaten per Text-String.
- **Testen:**
  - Einen Marker anklicken und auf das Teilen-Symbol tippen.
  - Kopierten Text in die Zwischenablage nehmen.
  - Auf das Import-Symbol (Pfeil nach unten) auf der Karte tippen.
  - Text einfügen und "Importieren" drücken.
  - Prüfen, ob der Spot importiert wurde und die Karte dorthin navigiert.

## 5. Equipment Manager & Akkus
- **Konzept:** Überwachung des Lipo-Ladezustands und automatische Alterung.
- **Testen:**
  - **Akkualterung:** Neues Equipment erstellen, Haken bei "Akkulaufzeit berechnen" setzen. Ein Kaufdatum wählen, das z. B. 5 Monate zurückliegt. Prüfen, ob die Lebensdauer bei 90% liegt (2% Abzug pro Monat) und die Farbe von weiß auf grün wechselt.
  - **Ladezustand:** Auf das Akku-Icon tippen (wechselt von voll auf leer).
  - **Storage:** Das Akku-Icon gedrückt halten -> Prüfen, ob es auf "Storage" (halbe blaue Batterie) wechselt.
