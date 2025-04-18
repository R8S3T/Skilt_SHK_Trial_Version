import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Linking, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { searchSubchapters } from 'src/database/databaseServices';
import { SubchapterWithPreviewExtended } from 'src/utils/searchUtils';
import { RootStackParamList } from 'src/types/navigationTypes';
import { handleSearch } from 'src/utils/searchUtils';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';
import { Ionicons } from '@expo/vector-icons';
import SubchapterInfoModal from '../Chapters/SubchapterInfoModal';

const RECENT_SEARCHES_KEY = 'recent_searches';
const RESULTS_PER_PAGE = 5;

const suggestionPool = [
  'Membranausdehnungsgefäß',
  'Kundenauftrag',
  'Brennstoffzellen',
  'Heizkennlinie',
  'PVC',
  'Schallschutz',
  'Druckminderer',
  'DIN EN 1717',
];

// Hilfsfunktion, die count zufällige Vorschläge aus der Liste auswählt
const getRandomSuggestions = (count: number = 5): string[] => {
  const shuffled = [...suggestionPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SubchapterWithPreviewExtended[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { theme, isDarkMode } = useTheme();
  // New state for handling locked search result modal:
  const [modalVisible, setModalVisible] = useState(false);
  const [lockedItem, setLockedItem] = useState<SubchapterWithPreviewExtended | null>(null);

  // Lade persistente "Letzte Suchen" beim Mounten
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading recent searches", error);
      }
    };
    loadRecentSearches();
  }, []);

  // Speichere "Letzte Suchen", wenn sie sich ändern
  useEffect(() => {
    const saveRecentSearches = async () => {
      try {
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
      } catch (error) {
        console.error("Error saving recent searches", error);
      }
    };
    saveRecentSearches();
  }, [recentSearches]);

  const handleQueryChange = (text: string) => {
    setQuery(text);
  };

  const handleQuerySubmit = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Speichere den finalen Suchbegriff (max. 5 Einträge, keine Duplikate)
    setRecentSearches(prev => {
      const newList = [trimmedQuery, ...prev.filter(q => q !== trimmedQuery)];
      return newList.slice(0, 5);
    });

    const searchResults = await handleSearch(trimmedQuery, searchSubchapters);
    setResults(searchResults);
    setCurrentPage(0);
  };

  // Sortiere die Ergebnisse so, dass erst die freigegebenen (unlocked) und dann die gesperrten (locked) angezeigt werden
  const sortedResults = [...results].sort((a, b) => {
    if (a.locked === b.locked) return 0;
    return a.locked ? 1 : -1;
  });

  const paginatedResults = sortedResults.slice(
    currentPage * RESULTS_PER_PAGE,
    (currentPage + 1) * RESULTS_PER_PAGE
  );
  const hasNextPage = (currentPage + 1) * RESULTS_PER_PAGE < sortedResults.length;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: isDarkMode ? '#1c1c1e' : '#f8f8f8',
      },
      headerShadowVisible: false,
    });
  }, [navigation, isDarkMode]);

  const getDisplaySuggestions = (): string[] => {
    return recentSearches.length > 0 ? recentSearches.slice(0, 5) : getRandomSuggestions(5);
  };

  const displaySuggestions = getDisplaySuggestions();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: '#e8630a',
              borderWidth: 2,
              backgroundColor: isDarkMode ? '#666' : '#fff',
            },
          ]}
        >
          <TextInput
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={handleQuerySubmit}
            placeholder="Suche..."
            placeholderTextColor={theme.secondaryText}
            style={[styles.textInput, { color: theme.primaryText }]}
          />
          <View style={styles.iconContainer}>
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons
                  name="close"
                  size={screenWidth > 600 ? 30 : 26}
                  color={theme.secondaryText}
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleQuerySubmit}>
              <Ionicons
                name="search"
                size={screenWidth > 600 ? 32 : 28}
                color={theme.secondaryText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {query.trim().length === 0 ? (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: theme.primaryText }]}>
            {recentSearches.length > 0 ? 'Letzte Suchen' : 'Vorschläge'}
          </Text>
          <View style={styles.suggestionsRow}>
            {displaySuggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionButton,
                  { backgroundColor: isDarkMode ? '#444' : '#e0e0e0' },
                ]}
                onPress={() => {
                  setQuery(item);
                  handleQuerySubmit();
                }}
              >
                <Text style={[styles.suggestionText, { color: theme.secondaryText }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={paginatedResults}
          keyExtractor={(item) => item.SubchapterId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              // Changed onPress: if item.locked then show modal, else navigate normally
              onPress={() => {
                if (item.locked) {
                  setLockedItem(item);
                  setModalVisible(true);
                } else {
                  navigation.navigate('Learn', {
                    screen: 'SubchapterContentScreen',
                    params: {
                      subchapterId: item.SubchapterId,
                      subchapterTitle: item.SubchapterName,
                      chapterId: item.ChapterId || 0,
                      chapterTitle: item.ChapterTitle || 'Unknown Chapter',
                      origin: 'SearchScreen',
                    },
                  });
                }
              }}
              style={[styles.resultItem, item.locked && styles.lockedItem]}
            >
              <Text style={[styles.resultTitle, item.locked && styles.lockedText]}>
                {item.SubchapterName}
              </Text>
              <Text style={[styles.resultPreview, item.locked && styles.lockedText]}>
                {item.cleanedPreview.join(' ')}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            results.length > RESULTS_PER_PAGE ? (
              <View style={[styles.paginationContainer, { backgroundColor: theme.background }]}>
                <TouchableOpacity
                  onPress={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
                  disabled={currentPage === 0}
                >
                  <Ionicons
                    name="arrow-back-circle"
                    size={40}
                    color={currentPage === 0 ? theme.secondaryText : theme.accent}
                  />
                </TouchableOpacity>
                <Text style={[styles.paginationText, { fontSize: 18, color: theme.primaryText }]}>
                  Seite {currentPage + 1} von {Math.ceil(results.length / RESULTS_PER_PAGE)}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setCurrentPage((prevPage) =>
                      Math.min(prevPage + 1, Math.ceil(results.length / RESULTS_PER_PAGE) - 1)
                    )
                  }
                  disabled={!hasNextPage}
                >
                  <Ionicons
                    name="arrow-forward-circle"
                    size={40}
                    color={!hasNextPage ? theme.secondaryText : theme.accent}
                  />
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}

      {/* Modal for locked search result */}
{/* Modal for locked search result */}
{modalVisible && lockedItem && (
    <SubchapterInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        subchapterName={lockedItem?.SubchapterName || "Kapitel"}
        message={"Dieses Kapitel ist in der Basisversion nicht verfügbar.\nHol dir jetzt alle Inhalte hier:"}
        onReviewLesson={() => setModalVisible(false)}
        isJumpAhead={false}
        showPurchaseButton={true}  // Button anzeigen
    />
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: screenWidth > 600 ? 32 : 16,
  },
  headerContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: screenWidth > 600 ? 24 : 18,
    height: screenWidth > 600 ? 60 : 50,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontFamily: 'Lato-Bold',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  suggestionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  resultItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  lockedItem: {
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  resultTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: screenWidth > 600 ? 20 : 18,
  },
  resultPreview: {
    fontFamily: 'OpenSans-Regular',
    fontSize: screenWidth > 600 ? 18 : 16,
  },
  lockedText: {
    color: '#888', // gray text for locked items
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenWidth > 600 ? 26 : 20,
    paddingVertical: 10,
  },
  paginationText: {
    marginHorizontal: 16,
    fontSize: screenWidth > 600 ? 20 : 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    fontSize: 16,
    color: '#e8630a',
    fontWeight: 'bold',
  },
});

export default SearchScreen;
