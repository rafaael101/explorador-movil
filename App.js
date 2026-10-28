import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Camara from "./components/Camara";
import Ubicacion from "./components/Ubicacion";
import Brujula from "./components/Brujula";

export default function App() {
  const [modulo, setModulo] = useState("camara");

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Explorador móvil</Text>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, modulo === "camara" && styles.tabActiva]}
          onPress={() => setModulo("camara")}
        >
          <Text style={styles.textoTab}>Cámara</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, modulo === "ubicacion" && styles.tabActiva]}
          onPress={() => setModulo("ubicacion")}
        >
          <Text style={styles.textoTab}>Ubicación</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, modulo === "brujula" && styles.tabActiva]}
          onPress={() => setModulo("brujula")}
        >
          <Text style={styles.textoTab}>Brújula</Text>
        </Pressable>
      </View>

      <View style={styles.contenido}>
        {modulo === "camara" && <Camara />}
        {modulo === "ubicacion" && <Ubicacion />}
        {modulo === "brujula" && <Brujula />}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, paddingTop: 50, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc" },
  tab: { flex: 1, padding: 12, alignItems: "center" },
  tabActiva: { borderBottomWidth: 3, borderColor: "#2563eb" },
  textoTab: { fontSize: 16 },
  contenido: { flex: 1, padding: 16 },
});