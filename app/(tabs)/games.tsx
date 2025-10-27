import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";

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
    ? "https://bettingprojheroku-0f16500feb98.herokuapp.com/api"
    : "https://bettingprojheroku-0f16500feb98.herokuapp.com/api";

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null); // "scheduled", "completed", or null

  const fetchGames = async (status?: string) => {
    try {
      setLoading(true);
      const url = status
        ? `${BASE}/games?status=${encodeURIComponent(status)}`
        : `${BASE}/games`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const data = await res.json();
      setGames(data);
      setFilter(status ?? null);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGame = async () => {
    try {
      setLoading(true);
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
      await fetchGames(filter || undefined);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#1e1e1e", padding: 16 }}>
      <Text
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        NFL Games
      </Text>

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Button title="Show All" onPress={() => fetchGames()} />
        <Button title="Scheduled" onPress={() => fetchGames("scheduled")} />
        <Button title="Completed" onPress={() => fetchGames("completed")} />
        <Button title="Add Test Game" onPress={createGame} color="#ffd33d" />
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#ffd33d" style={{ marginTop: 20 }} />
      )}

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
        ListEmptyComponent={
          !loading ? (
            <Text style={{ color: "gray", marginTop: 20, textAlign: "center" }}>
              No games found.
            </Text>
          ) : null
        }
      />
    </View>
  );
}
