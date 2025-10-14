import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const API_BASE = "http://10.0.2.2:8080"; // Android emulator -> to the local (was working for mac)

export default function ApiTestScreen() {
  const [text, setText] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/greeting?name=Team12`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const t = await res.text();
        setText(t);
      } catch (e: any) {
        setErr(e.message);
      }
    };
    run();
  }, []);

  if (!text && !err) return <ActivityIndicator style={styles.center} />;
  return (
    <View style={styles.center}>
      <Text>{err ? `Error: ${err}` : text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
