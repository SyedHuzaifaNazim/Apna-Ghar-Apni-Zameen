import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import AppText from '../../components/base/AppText';
import { SearchHistoryItem } from '../../hooks/useSearch';

interface RecentSearchesProps {
  items: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onClear?: () => void;
  onRemove?: (id: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  items,
  onSelect,
  onClear,
  onRemove,
}) => {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={32} color={Colors.text.disabled} />
        <AppText variant="body" color="secondary" align="center" style={styles.emptyText}>
          Start searching to build your history
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          Recent Searches
        </AppText>
        {onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={Colors.error[500]} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.list}>
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect(item)}
            style={styles.itemContainer}
            activeOpacity={0.7}
          >
            <View style={styles.itemLeft}>
              <Ionicons name="time-outline" size={18} color={Colors.text.secondary} />
              <View style={styles.textContainer}>
                <AppText variant="body" numberOfLines={1}>
                  {item.query}
                </AppText>
                <AppText variant="small" color="secondary">
                  {new Date(item.timestamp).toLocaleString()}
                </AppText>
              </View>
            </View>

            {onRemove && (
              <TouchableOpacity
                onPress={() => onRemove(item.id)}
                style={styles.removeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={16} color={Colors.text.disabled} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
  },
  container: {
    flex: 1,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clearButton: {
    padding: 4,
  },
  list: {
    gap: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB', // gray.50
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default RecentSearches;