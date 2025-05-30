import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SearchInput } from '@/components/SearchInput';
import { FilterBar } from '@/components/FilterBar';
import { colors } from '@/constants/colors';
import { mockServiceProviders } from '@/data/mockData';
import {
  ChevronLeft,
  ChevronRight,
  Wrench,
  Scissors,
  Home,
  Brush,
  Car,
  Book,
  Heart,
  Coffee,
  ShoppingBag,
  Laptop,
  User as UserIcon,
} from 'lucide-react-native';
import { ServiceProviderCard } from '@/components/ServiceProviderCard';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '@/context/AuthContext';

const categories = [
  { id: '1', name: 'Manutenção', icon: Wrench },
  { id: '2', name: 'Beleza', icon: Scissors },
  { id: '3', name: 'Domésticos', icon: Home },
  { id: '4', name: 'Pintura', icon: Brush },
  { id: '5', name: 'Mecânica', icon: Car },
  { id: '6', name: 'Educação', icon: Book },
  { id: '7', name: 'Saúde', icon: Heart },
  { id: '8', name: 'Alimentação', icon: Coffee },
  { id: '9', name: 'Vendas', icon: ShoppingBag },
  { id: '10', name: 'Tecnologia', icon: Laptop },
];

export default function HomeScreen() {
  const { user, loading } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const scrollViewRef = useCallback((node) => {
    if (node !== null) {
      categoryScrollRef.current = node;
    }
  }, []);
  const categoryScrollRef = React.useRef<ScrollView>(null);
  const router = useRouter();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollTo({
        x: direction === 'left' ? -120 : 120,
        animated: true,
      });
    }
  };

  const filteredProviders = mockServiceProviders.filter((provider) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      provider.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === '' || provider.location === selectedLocation;
    const matchesSpecialization =
      selectedSpecialization === '' ||
      provider.specialization === selectedSpecialization;
    return matchesSearch && matchesLocation && matchesSpecialization;
  });

  // Novos: nome e imagem do user autenticado
  const userName = user?.nome ? `Olá, ${user.nome.split(' ')[0]}!` : 'Olá!';
  const profileImageUri = user?.imagemPerfil || '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          {profileImageUri ? (
            <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <UserIcon size={20} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar prestadores..."
        />

        <View style={styles.categoriesContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => setSelectedSpecialization(category.name)}
              >
                <View style={styles.categoryIcon}>
                  <category.icon size={24} color={colors.primary} />
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FilterBar
          selectedLocation={selectedLocation}
          selectedSpecialization={selectedSpecialization}
          onLocationChange={setSelectedLocation}
          onSpecializationChange={setSelectedSpecialization}
        />

        {filteredProviders.length > 0 ? (
          <FlatList
            data={filteredProviders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ServiceProviderCard provider={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum prestador encontrado</Text>
            <Text style={styles.emptySubtext}>Tente ajustar seus filtros</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.textDark,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  scrollButton: {
    padding: 8,
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesScroll: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: colors.textDark,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
});
