// index.tsx
import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  FlatList,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

type Quote = {
  id: string;
  author: string;
  text_en: string;
  text_fr: string;
  explanation_en: string;
  explanation_fr: string;
};

const QUOTES: Quote[] = [
  {
    id: 'q1',
    author: 'René Descartes',
    text_en: 'I think, therefore I am.',
    text_fr: "Je pense, donc je suis.",
    explanation_en:
      "Descartes means that the very act of doubting one's existence proves that there is a thinking mind — existence is realized through thought.",
    explanation_fr:
      "Descartes affirme que le fait même de douter de son existence prouve qu'il existe un esprit pensant — l'existence est réalisée par la pensée.",
  },
  {
    id: 'q2',
    author: 'Socrates',
    text_en: 'The unexamined life is not worth living.',
    text_fr: "La vie sans examen ne vaut pas la peine d'être vécue.",
    explanation_en:
      "Socrates emphasizes critical self-reflection: living without examining your beliefs, morals, and actions is shallow and incomplete.",
    explanation_fr:
      "Socrate insiste sur l'importance de l'examen de soi : vivre sans interroger ses croyances, sa morale et ses actions est superficiel.",
  },
  {
    id: 'q3',
    author: 'Jean-Paul Sartre',
    text_en: 'Man is condemned to be free.',
    text_fr: "L'homme est condamné à être libre.",
    explanation_en:
      "Sartre argues that humans have no predetermined essence — freedom is inescapable and with it comes responsibility.",
    explanation_fr:
      "Sartre soutient que l'homme n'a pas d'essence prédéfinie — la liberté est inévitable et entraîne la responsabilité.",
  },
  {
    id: 'q4',
    author: 'Friedrich Nietzsche',
    text_en: 'He who has a why to live can bear almost any how.',
    text_fr: "Celui qui a un pourquoi peut supporter presque n'importe quel comment.",
    explanation_en:
      "Nietzsche explains that having a purpose (a why) gives strength to endure hardships (the how). Purpose gives resilience.",
    explanation_fr:
      "Nietzsche explique que trouver un sens (un pourquoi) permet de supporter les difficultés (le comment). Le sens donne de la résilience.",
  },
];

export default function QuoteGenerator() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [index, setIndex] = useState(0);
  const [showExplain, setShowExplain] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, Quote>>({});
  const [showFavList, setShowFavList] = useState(false);

  const quotes = useMemo(() => QUOTES, []);
  const current = quotes[index];

  const next = () => {
    setShowExplain(false);
    setIndex((prev) => (prev + 1) % quotes.length);
  };
  const prev = () => {
    setShowExplain(false);
    setIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };
  const randomize = () => {
    setShowExplain(false);
    let r = Math.floor(Math.random() * quotes.length);
    while (r === index) r = Math.floor(Math.random() * quotes.length);
    setIndex(r);
  };
  const toggleFavorite = (q: Quote) => {
    setFavorites((prev) => {
      const copy = { ...prev };
      if (copy[q.id]) delete copy[q.id];
      else copy[q.id] = q;
      return copy;
    });
  };
  const shareQuote = async (q: Quote) => {
    const text =
      lang === 'fr'
        ? `"${q.text_fr}" — ${q.author}\n\nExplication: ${q.explanation_fr}`
        : `"${q.text_en}" — ${q.author}\n\nExplanation: ${q.explanation_en}`;
    try {
      await Share.share({ message: text });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Citations Célèbres</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.langBtn, lang === 'fr' ? styles.langActive : null]}
            onPress={() => setLang('fr')}
          >
            <Text style={styles.langText}>FR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, lang === 'en' ? styles.langActive : null]}
            onPress={() => setLang('en')}
          >
            <Text style={styles.langText}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favListBtn}
            onPress={() => setShowFavList(true)}
          >
            <Ionicons name="star" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* CARD */}
        <Animated.View key={current.id} entering={FadeIn.springify().mass(0.5)}>
          <LinearGradient
            colors={['#4f46e5', '#2563eb']}
            style={styles.card}
          >
            <Text style={styles.quoteText}>
              {lang === 'fr' ? current.text_fr : current.text_en}
            </Text>
            <Text style={styles.authorText}>— {current.author}</Text>

            {/* NAVIGATION */}
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.controlBtn} onPress={prev}>
                <Ionicons name="arrow-back" size={18} color="#fff" />
                <Text style={styles.controlBtnText}>Précédent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtnAccent} onPress={randomize}>
                <Ionicons name="shuffle" size={18} color="#fff" />
                <Text style={styles.controlBtnAccentText}>Aléatoire</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={next}>
                <Text style={styles.controlBtnText}>Suivant</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* ACTIONS */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setShowExplain(true)}
              >
                <Ionicons name="information-circle-outline" size={18} color="#fff" />
                <Text style={styles.actionText}>
                  {lang === 'fr' ? 'Explication' : 'Explain'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => toggleFavorite(current)}
              >
                <Ionicons
                  name={favorites[current.id] ? 'star' : 'star-outline'}
                  size={18}
                  color="#fff"
                />
                <Text style={styles.actionText}>
                  {favorites[current.id] ? 'Retirer' : 'Ajouter'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => shareQuote(current)}
              >
                <MaterialIcons name="share" size={18} color="#fff" />
                <Text style={styles.actionText}>
                  {lang === 'fr' ? 'Partager' : 'Share'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      {/* MODALE EXPLICATION */}
      <Modal visible={showExplain} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {lang === 'fr' ? 'Explication' : 'Explanation'}
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>
                {lang === 'fr' ? current.explanation_fr : current.explanation_en}
              </Text>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#1f2937' }]}
                onPress={() => setShowExplain(false)}
              >
                <Text style={styles.modalBtnText}>
                  {lang === 'fr' ? 'Fermer' : 'Close'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#2563eb' }]}
                onPress={() => {
                  setShowExplain(false);
                  shareQuote(current);
                }}
              >
                <Text style={styles.modalBtnText}>
                  {lang === 'fr' ? 'Partager' : 'Share'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 18 : StatusBar.currentHeight || 18,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0b3a59',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  langBtn: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginLeft: 8,
  },
  langActive: { backgroundColor: '#2563eb' },
  langText: { color: '#fff', fontWeight: '700' },
  favListBtn: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f59e0b',
  },

  container: { padding: 20, paddingBottom: 40 },
  card: {
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    
  },
  quoteText: {
    color: '#fff',
    fontSize: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 28,
  },
  authorText: { color: '#d1d5db', textAlign: 'center', marginBottom: 16, fontWeight: '600' },

  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  controlBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10, marginHorizontal: 6, borderRadius: 10, backgroundColor: '#1e293b' },
  controlBtnText: { color: '#fff', marginLeft: 4, fontWeight: '700' },
  controlBtnAccent: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10, marginHorizontal: 6, borderRadius: 10, backgroundColor: '#2563eb' },
  controlBtnAccentText: { color: '#fff', marginLeft: 4, fontWeight: '700' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, marginHorizontal: 6, borderRadius: 10, backgroundColor: '#1e40af' },
  actionText: { color: '#fff', marginLeft: 6, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(3,7,18,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modal: { width: '100%', maxWidth: 720, backgroundColor: '#fff', borderRadius: 12, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8, color: '#071233' },
  modalText: { color: '#111827', fontSize: 16, lineHeight: 22 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginLeft: 8 },
  modalBtnText: { color: '#fff', fontWeight: '700' },
});
