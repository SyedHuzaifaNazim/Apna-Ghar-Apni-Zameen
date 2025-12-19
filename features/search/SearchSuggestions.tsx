import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface SearchSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
  onClearRecentSearches: () => void;
  recentSearches?: string[];
  popularSearches?: string[];
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSelectSuggestion,
  onClearRecentSearches,
  recentSearches = [],
  popularSearches = []
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        {/* Recent Searches */}
        {recentSearches && recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <AppText variant="h3" weight="bold">Recent Searches</AppText>
              <Pressable onPress={onClearRecentSearches} hitSlop={8}>
                <AppText variant="small" color="primary">Clear all</AppText>
              </Pressable>
            </View>
            <View style={styles.list}>
              {recentSearches.map((search, index) => (
                <Pressable
                  key={index}
                  onPress={() => onSelectSuggestion(search)}
                  style={({ pressed }) => [
                    styles.recentItem,
                    pressed && styles.recentItemPressed
                  ]}
                >
                  <Ionicons name="time-outline" size={20} color={Colors.text.secondary} />
                  <View style={styles.recentTextContainer}>
                    <AppText variant="body">{search}</AppText>
                  </View>
                  <Ionicons name="arrow-up-outline" size={16} color={Colors.text.disabled} style={styles.arrowIcon} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Popular Searches */}
        {popularSearches && popularSearches.length > 0 && (
          <View style={styles.section}>
            <AppText variant="h3" weight="bold" style={styles.sectionTitle}>Popular Searches</AppText>
            <View style={styles.popularContainer}>
              {popularSearches.map((search, index) => (
                <Pressable
                  key={index}
                  onPress={() => onSelectSuggestion(search)}
                  style={({ pressed }) => [
                    styles.popularTag,
                    pressed && styles.popularTagPressed
                  ]}
                >
                  <AppText variant="body" color="secondary">{search}</AppText>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  list: {
    gap: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  recentItemPressed: {
    backgroundColor: '#F9FAFB', // gray.50
    borderRadius: 8,
    paddingHorizontal: 8, // Add padding when pressed to show background nicely
    marginHorizontal: -8, // Offset padding to keep alignment
  },
  recentTextContainer: {
    flex: 1,
  },
  arrowIcon: {
    transform: [{ rotate: '-45deg' }], // Angled arrow for "fill search"
  },
  popularContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularTag: {
    backgroundColor: '#F3F4F6', // gray.100
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  popularTagPressed: {
    backgroundColor: '#E5E7EB', // gray.200
  },
});

export default SearchSuggestions;