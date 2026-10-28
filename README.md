# Explorador móvil

Aplicación en Expo + React Native que permite tomar una foto, consultar la ubicación actual y ver la orientación aproximada del teléfono.

## Instalación

```bash
npx create-expo-app@latest explorador-movil --template blank
cd explorador-movil
npx expo install expo-camera expo-location expo-sensors
```

Copiar `App.js` y la carpeta `components/` en la raíz del proyecto.

## Ejecución

```bash
npx expo start
```

Escanear el código QR con Expo Go en un teléfono físico. Si la conexión local falla:

```bash
npx expo start --tunnel
```

## Estructura

- `App.js`: navegación entre los tres módulos.
- `components/Camara.js`: permiso de cámara, vista previa y captura de foto.
- `components/Ubicacion.js`: permiso de ubicación, latitud, longitud y precisión.
- `components/Brujula.js`: lectura del magnetómetro y dirección aproximada.

## Limitaciones conocidas

- Debe probarse en un teléfono físico; los simuladores pueden no tener cámara, magnetómetro ni ubicación real.
- La foto solo se muestra en pantalla, no se guarda en la galería.
- La precisión de la ubicación depende de la señal; en interiores suele ser peor. La precisión reportada es una estimación, no un error garantizado.
- La ubicación no se guarda ni se envía a ningún lado.
- La brújula calcula el ángulo solo con X e Y, por lo que supone que el teléfono está horizontal. No está calibrada, no corrige la declinación magnética ni la inclinación.
- El ángulo puede no coincidir con el norte por: interferencia de objetos metálicos o imanes cercanos, falta de calibración del sensor, inclinación del teléfono, la diferencia entre norte magnético y norte geográfico, y que el ángulo se mide respecto a los ejes del teléfono.
- Si el permiso se bloquea ("no volver a preguntar"), hay que activarlo desde la configuración del teléfono.

## Relfexión
Durante la práctica, lo que más se me complicó fue el manejo de los permisos. Al principio la aplicación no me pedía acceso a la cámara ni a la ubicación, y me di cuenta de que era porque la app de Expo Go ya los tenía guardados. Después, cuando quise probar rechazándolos en mi iPhone, el sistema ya no me volvió a mostrar el aviso porque iOS solo te pregunta una vez. Para poder seguir haciendo pruebas, tuve que ir a la configuración del teléfono o reinstalar Expo Go.

Con esto me quedó claro que la aplicación no puede depender de que el usuario siempre acepte los permisos a la primera. Por eso, me aseguré de que cada módulo muestre un mensaje dependiendo de si el permiso está pendiente, aceptado o denegado. Así, si el usuario decide no dar acceso, la aplicación sigue funcionando y muestra un aviso en lugar de quedarse con la pantalla en blanco.

Por otro lado, pude ver bien la diferencia entre el GPS y la brújula. El GPS te da las coordenadas de dónde estás, pero su precisión depende mucho de la señal (en interiores noté que le costaba un poco más). En cambio, el magnetómetro no sabe tu ubicación, solo detecta hacia dónde apunta el celular basándose en el campo magnético. Me di cuenta de que el ángulo no siempre marcaba el norte exacto, y esto pasa porque la fórmula asume que tienes el teléfono completamente acostado, no corrige la declinación magnética, y además cualquier objeto de metal cercano llega a alterar los valores.