/**
 * Uni App – 2 styles (gold look)
 * Red header band, navy subnav/footer, white cards, blue tiles/buttons.
 * Safe-area friendly. No gradients.
 */
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
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // Top red band title
  topRedBand: {
    backgroundColor: COLORS.redBand,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  topRedText: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  // Navy sub-nav with back + centered title
  subNav: {
    backgroundColor: COLORS.navy,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subNavTitle: {
    flex: 1,
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: "800",
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#0a142d",
    backgroundColor: "#112245",
  },
  backBtnText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: "800",
  },

  // Page content
  contentWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  // Player card
  card: {
    width: "48%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#1b2438",
    padding: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 12,
  },

  // Score tile
  scoreTile: {
    backgroundColor: COLORS.blueTile,
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0d1b3a",
    marginBottom: 12,
  },
  scoreValue: {
    color: COLORS.textLight,
    fontSize: 48,
    fontWeight: "900",
  },

  // Big +10/+5 buttons
  rowBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  bigBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  bigBtnBlue: {
    backgroundColor: COLORS.blueBtn,
    borderColor: "#173b87",
  },
  bigBtnText: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  // Undo / Reset row
  smallRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  smallUndo: {
    backgroundColor: COLORS.darkGrey,
    borderColor: "#14181d",
  },
  smallReset: {
    backgroundColor: COLORS.greyBtn,
    borderColor: "#717984",
  },
  smallText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: "800",
  },

  // Floating footer above tab bar
  footerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: COLORS.navy,
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    zIndex: 20,
    elevation: 8,
  },
  footerRow: {
    flexDirection: "row",
    gap: 16,
  },
  footerPill: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: "center",
  },
  footerSave: {
    backgroundColor: COLORS.green,
    borderColor: "#224f25",
  },
  footerEnd: {
    backgroundColor: COLORS.red,
    borderColor: "#7a241d",
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: "900",
  },
});

export default styles;
