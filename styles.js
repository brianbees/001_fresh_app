import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#FFFFFF',
  text: '#111111',
  primary: '#1F4FFF',
  accent: '#F9DABA',
  card: '#F5F7FB',
  border: '#222222',
  muted: '#888',
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  h1: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  p:  { fontSize: 14, color: COLORS.text },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  bigButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    flexBasis: '48%',
  },
  bigButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },

  playerCard: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  playerName: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: COLORS.text },
  score: { fontSize: 28, fontWeight: '800', marginBottom: 8, color: COLORS.text },
  row: { flexDirection: 'row', alignItems: 'center' },
  space: { height: 8 },
  pillButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: 'white',
    marginRight: 8,
  },
  pillText: { fontWeight: '700', color: COLORS.text },

  savePill: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },

  historyItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
  },

  devPill: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#000',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    opacity: 0.8,
  },
  devPillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  }
});

export default styles;
