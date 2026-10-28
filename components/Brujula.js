import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Magnetometer } from "expo-sensors";

function direccion(angulo) {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(angulo / 45) % 8];
}

export default function Brujula() {
  const [disponible, setDisponible] = useState(null); 
  const [datos, setDatos] = useState({ x: 0, y: 0, z: 0 });
  const [angulo, setAngulo] = useState(0);

  useEffect(() => {
    let sub = null;
    let activo = true;

    async function iniciar() {
      try {
        const ok = await Magnetometer.isAvailableAsync();
        if (!activo) return; 
        setDisponible(ok);
        if (!ok) return;

        Magnetometer.setUpdateInterval(250);
        sub = Magnetometer.addListener(({ x, y, z }) => {
          setDatos({ x, y, z });
          setAngulo((Math.atan2(y, x) * 180 / Math.PI + 360) % 360);
        });
      } catch (e) {
        if (activo) setDisponible(false);
      }
    }

    iniciar();

    return () => {
      activo = false;
      sub?.remove();
    };
  }, []);

  if (disponible === null) {
    return <Text style={styles.texto}>Verificando sensor...</Text>;
  }

  if (!disponible) {
    return (
      <View>
        <Text style={styles.subtitulo}>Brújula</Text>
        <Text style={styles.error}>Sensor no disponible</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.subtitulo}>Brújula</Text>
      <Text style={styles.texto}>X: {datos.x.toFixed(2)} µT</Text>
      <Text style={styles.texto}>Y: {datos.y.toFixed(2)} µT</Text>
      <Text style={styles.texto}>Z: {datos.z.toFixed(2)} µT</Text>
      <Text style={styles.angulo}>
        {angulo.toFixed(0)}° ({direccion(angulo)})
      </Text>
      <Text style={styles.nota}>
        Dirección aproximada. Mantén el teléfono horizontal. No está calibrada ni corrige
        declinación magnética o inclinación.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  texto: { fontSize: 16, marginBottom: 8 },
  error: { fontSize: 16, color: "red" },
  angulo: { fontSize: 36, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  nota: { fontSize: 14, color: "#555" },
});