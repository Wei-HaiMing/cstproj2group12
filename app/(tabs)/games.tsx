import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, ActivityIndicator, Platform, Alert } from "react-native";

type Game = {
  id?: number;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  startTime?: string;
  status?: string;
  oddsHome?: number;
  oddsAway?: number;
};

const BASE =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api"
    : "http://localhost:8080/api";

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/games`);
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const data = await res.json();
      setGames(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGame = async () => {
    try {
      const res = await fetch(`${BASE}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          league: "NFL",
          homeTeam: "Kansas City Privates",
          awayTeam: "New England Partisans",
          startTime: "2025-11-10T13:00:00",
          status: "scheduled",
          oddsHome: 1.8,
          oddsAway: 2.1,
        }),
      });
      if (!res.ok) throw new Error(`POST failed: ${res.status}`);
      fetchGames();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#1e1e1e", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        NFL Games
      </Text>

      <Button title="Refresh" onPress={fetchGames} color="#ffd33d" />
      <Button title="Add Test Game" onPress={createGame} />

      {loading && <ActivityIndicator size="large" color="#ffd33d" style={{ marginTop: 20 }} />}

      <FlatList
        data={games}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#25292e",
              marginVertical: 8,
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#ffd33d", fontWeight: "bold" }}>
              {item.homeTeam} vs {item.awayTeam}
            </Text>
            <Text style={{ color: "#fff" }}>Status: {item.status}</Text>
            <Text style={{ color: "#fff" }}>
              Odds: {item.oddsHome} / {item.oddsAway}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
