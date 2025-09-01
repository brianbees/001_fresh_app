import { StyleSheet } from "react-native";

export const COLORS = {
  red: "#D32F2F",
  backBar: "#1F2B4D",
  bottomStrip: "#1F2B4D",
  black: "#000000",
  white: "#FFFFFF",
  text: "#111111",
  blue1: "#0D47A1",
  blue2: "#1565C0",
  slate: "#424242",
  grey: "#9E9E9E",
  scoreBlue: "#1A2E6E",
  saveFill: "#2E7D32",
  endFill: "#C62828",
};

const BORDER_W = 2;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  redBand: { backgroundColor: COLORS.red, paddingVertical: 10, alignItems: "center", justifyContent: "center", borderBottomWidth: 1.5, borderBottomColor: COLORS.black },
  redBandText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  backBar: { backgroundColor: COLORS.backBar, borderBottomWidth: BORDER_W, borderBottomColor: COLORS.black, paddingVertical: 8, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { minWidth: 64, paddingVertical: 8, paddingHorizontal: 10, borderWidth: BORDER_W, borderColor: COLORS.black, borderRadius: 10, backgroundColor: "#22325e", alignItems: "center", justifyContent: "center" },
  backBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14 },
  backBarTitle: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  container: { flex: 1, paddingHorizontal: 12, paddingTop: 12 },
  listPad: { paddingBottom: 96 },
  wrapRow: { justifyContent: "space-between", marginBottom: 12 },
  col1: { width: "100%" }, col2: { width: "48%" }, col3: { width: "31.5%" },
  card: { backgroundColor: COLORS.white, borderWidth: BORDER_W, borderColor: COLORS.black, borderRadius: 12, padding: 12 },
  playerLabel: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 8 },
  scoreBox: { backgroundColor: COLORS.scoreBlue, borderWidth: BORDER_W, borderColor: COLORS.black, borderRadius: 10, alignItems: "center", justifyContent: "center", paddingVertical: 14, marginBottom: 10 },
  scoreText: { color: COLORS.white, fontSize: 38, fontWeight: "900" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 8 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: BORDER_W, borderColor: COLORS.black, alignItems: "center", justifyContent: "center" },
  btnSmall: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: BORDER_W, borderColor: COLORS.black, alignItems: "center", justifyContent: "center" },
  btnPrimary: { backgroundColor: COLORS.blue1 }, btnSecondary: { backgroundColor: COLORS.blue2 },
  btnUndo: { backgroundColor: COLORS.slate }, btnReset: { backgroundColor: COLORS.grey },
  btnText: { color: COLORS.white, fontWeight: "800", fontSize: 16 }, btnTextSmall: { color: COLORS.white, fontWeight: "800", fontSize: 14 },
  bottomStripWrapper: { position: "absolute", left: 0, right: 0, bottom: 0 },
  bottomStripSafe: { backgroundColor: "transparent" },
  bottomStrip: { backgroundColor: COLORS.bottomStrip, borderTopWidth: BORDER_W, borderTopColor: COLORS.black, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10, flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" },
  actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: BORDER_W, borderColor: COLORS.black, alignItems: "center", justifyContent: "center" },
  saveBtn: { backgroundColor: COLORS.saveFill }, endBtn: { backgroundColor: COLORS.endFill },
  actionBtnText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
  pressed: { opacity: 0.85 },
});

export default styles;
