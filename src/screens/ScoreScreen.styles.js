import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#eef4fa",
  white: "#ffffff",
  black: "#000000",
  navy: "#0f1e36",
  blue1: "#2f58b7",
  blue2: "#3b6fe0",
  slate: "#2f3338",
  grey: "#9ba3ae",
  accentYellow: "#F9DABA",
  accentYellowBorder: "#a68050",
};

const BORDER_W = 1;

// centralised numbers so JS can estimate footer space for scroll padding
export const FOOTER_METRICS = { padTop: 10, padBot: 12, padH: 16, btnHeight: 48 };

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: 12, paddingTop: 12 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  score: { fontSize: 36, fontWeight: "800", marginBottom: 10 },

  row: { flexDirection: "row", justifyContent: "space-between" },
  actBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  btnPrimary: { backgroundColor: COLORS.blue1 },
  btnSecondary: { backgroundColor: COLORS.blue2 },
  actTxt: { fontSize: 14, fontWeight: "700", color: COLORS.white },

  smallBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginTop: 8,
  },
  btnUndo: { backgroundColor: COLORS.slate },
  btnReset: { backgroundColor: COLORS.grey },
  smallTxt: { fontSize: 14, fontWeight: "700", color: COLORS.white },

  /* === Absolute footer (flush to tab bar) === */
  footerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    // bottom is set dynamically in ScoreScreen via tabBarHeight
    backgroundColor: COLORS.navy,
    borderTopWidth: BORDER_W,
    borderTopColor: COLORS.black,
    paddingTop: FOOTER_METRICS.padTop,
    paddingBottom: FOOTER_METRICS.padBot,
    paddingHorizontal: FOOTER_METRICS.padH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cta: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaSave: {
    backgroundColor: COLORS.accentYellow,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.accentYellowBorder,
  },
  ctaEnd: { backgroundColor: "#b23b2e", marginLeft: 8 },
  ctaSaveText: { color: "#111", fontWeight: "900", fontSize: 16 },
  ctaEndText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});

export default styles;
