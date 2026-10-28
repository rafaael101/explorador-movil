import { useRef, useState } from "react";
import { View, Text, Pressable, Image, ScrollView, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function Camara() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [fotoUri, setFotoUri] = useState(null);
  const [lista, setLista] = useState(false);
  const [tomando, setTomando] = useState(false);
  const [error, setError] = useState(null);

  async function tomarFoto() {
    if (!lista || tomando || !cameraRef.current) return;
    setTomando(true);
    setError(null);
    try {
      const foto = await cameraRef.current.takePictureAsync();
      if (foto?.uri) setFotoUri(foto.uri);
    } catch (e) {
      setError("No se pudo tomar la foto. Intenta de nuevo.");
    } finally {
      setTomando(false);
    }
  }

  if (!permission) {
    return <Text style={styles.texto}>Permiso de cámara: cargando...</Text>;
  }

  if (!permission.granted) {
    const estado = permission.status === "denied" ? "denegado" : "pendiente";
    return (
      <View>
        <Text style={styles.subtitulo}>Cámara</Text>
        <Text style={styles.texto}>Permiso de cámara: {estado}</Text>
        <Text style={styles.texto}>
          La aplicación necesita acceso a la cámara para mostrar la vista previa y tomar fotos.
        </Text>
        {!permission.canAskAgain && (
          <Text style={styles.error}>
            El permiso fue bloqueado. Actívalo desde la configuración del teléfono.
          </Text>
        )}
        <Pressable style={styles.boton} onPress={requestPermission}>
          <Text style={styles.textoBoton}>Solicitar permiso</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView>
      <Text style={styles.subtitulo}>Cámara</Text>
      <Text style={styles.texto}>Permiso de cámara: concedido</Text>

      <CameraView
        ref={cameraRef}
        style={styles.camara}
        facing="back"
        onCameraReady={() => setLista(true)}
      />
      {!lista && <Text style={styles.texto}>Cargando cámara...</Text>}

      <Pressable
        style={[styles.boton, (!lista || tomando) && styles.botonDeshabilitado]}
        onPress={tomarFoto}
        disabled={!lista || tomando}
      >
        <Text style={styles.textoBoton}>{tomando ? "Tomando..." : "Tomar foto"}</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      {fotoUri && (
        <View>
          <Text style={styles.texto}>Foto capturada:</Text>
          <Image source={{ uri: fotoUri }} style={styles.foto} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subtitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  texto: { fontSize: 16, marginBottom: 8 },
  error: { fontSize: 16, color: "red", marginBottom: 8 },
  camara: { height: 300, marginBottom: 10 },
  foto: { width: "100%", height: 300, resizeMode: "contain" },
  boton: { backgroundColor: "#2563eb", padding: 12, borderRadius: 6, alignItems: "center", marginBottom: 10 },
  botonDeshabilitado: { backgroundColor: "#9ca3af" },
  textoBoton: { color: "#fff", fontSize: 16 },
});