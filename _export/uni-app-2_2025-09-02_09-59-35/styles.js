import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#0f1216",
  cardBg: "#ffffff",
  navy: "#1f2d50",
  redBand: "#c24236",
  blueTile: "#223b7a",
  blueBtn: "#2f58b7",
  greyBtn: "#9ba3ae",
  darkGrey: "#2f3338",
  textDark: "#0f1216",
  textLight: "#ffffff",
  tabBar: "#d6eefb",
  green: "#2f7d32",
  red: "#c0392b",
  border: "#0e1422",
  accentYellow: "#F9DABA",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#eef4fa" },

  // Settings / common text styles
  appContainer: { flex: 1, backgroundColor: "#fff" },
  h1: { fontSize: 22, fontWeight: "800", color: "#111" },
  h2: { fontSize: 18, fontWeight: "800", color: "#111", marginTop: 12 },
  p: { fontSize: 14, color: "#333" },
  pillButton: {
    backgroundColor: "#0f1e36",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  pillText: { color: "#fff", fontWeight: "800" },

  // Dev pill
  devPill: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    zIndex: 1000,
  },
  devPillText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  // Footer (if used by shared components)
  footerWrap: {
    backgroundColor: "#1f2d50",
    borderTopWidth: 2,
    borderTopColor: "#0e1422",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  footerRow: { flexDirection: "row", gap: 16 },
  footerPill: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: "center",
  },
  footerSave: {
    backgroundColor: "#F9DABA",
    borderColor: "#a68050",
  },
  footerEnd: { backgroundColor: "#c0392b", borderColor: "#7a241d" },
  footerText: { color: "#111", fontSize: 18, fontWeight: "900" },
});

export default styles;
