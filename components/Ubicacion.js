import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function Ubicacion() {
  const [permiso, setPermiso] = useState("pendiente");
  const [cargando, setCargando] = useState(false);
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  async function obtenerUbicacion() {
    setCargando(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermiso("denegado");
        setError("Permiso de ubicación denegado. No se pueden obtener las coordenadas.");
        return;
      }
      setPermiso("concedido");

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords(pos.coords);
    } catch (e) {
      setError("No se pudo obtener la ubicación. Verifica que el GPS esté activado.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <View>
      <Text style={styles.subtitulo}>Ubicación</Text>
      <Text style={styles.texto}>Permiso de ubicación: {permiso}</Text>

      <Pressable
        style={[styles.boton, cargando && styles.botonDeshabilitado]}
        onPress={obtenerUbicacion}
        disabled={cargando}
      >
        <Text style={styles.textoBoton}>Obtener mi ubicación</Text>
      </Pressable>

      {cargando && <ActivityIndicator size="large" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {coords && !cargando && (
        <View>
          <Text style={styles.texto}>Latitud: {coords.latitude.toFixed(6)}</Text>
          <Text style={styles.texto}>Longitud: {coords.longitude.toFixed(6)}</Text>
          <Text style={styles.texto}>
            Precisión reportada:{" "}
            {coords.accuracy != null ? `${coords.accuracy.toFixed(0)} m` : "no disponible"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  texto: { fontSize: 16, marginBottom: 8 },
  error: { fontSize: 16, color: "red", marginBottom: 8 },
  boton: { backgroundColor: "#2563eb", padding: 12, borderRadius: 6, alignItems: "center", marginBottom: 10 },
  botonDeshabilitado: { backgroundColor: "#9ca3af" },
  textoBoton: { color: "#fff", fontSize: 16 },
});