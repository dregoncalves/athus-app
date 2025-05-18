import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MapPin, Briefcase, Filter, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from './Button';

const LOCATIONS = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Salvador, BA', 'Recife, PE'];
const SPECIALIZATIONS = ['Eletricista', 'Encanador', 'Pedreiro', 'Pintor', 'Diarista', 'Mecânico', 'Cabeleireiro', 'Manicure'];

interface FilterBarProps {
  selectedLocation: string;
  selectedSpecialization: string;
  onLocationChange: (location: string) => void;
  onSpecializationChange: (specialization: string) => void;
}

export function FilterBar({
  selectedLocation,
  selectedSpecialization,
  onLocationChange,
  onSpecializationChange,
}: FilterBarProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [tempLocation, setTempLocation] = useState(selectedLocation);
  const [tempSpecialization, setTempSpecialization] = useState(selectedSpecialization);

  const handleApplyLocation = () => {
    onLocationChange(tempLocation);
    setShowLocationModal(false);
  };

  const handleApplySpecialization = () => {
    onSpecializationChange(tempSpecialization);
    setShowSpecializationModal(false);
  };

  const handleClearAllFilters = () => {
    onLocationChange('');
    onSpecializationChange('');
  };

  const handleClearLocationFilter = () => {
    onLocationChange('');
  };

  const handleClearSpecializationFilter = () => {
    onSpecializationChange('');
  };

  const hasActiveFilters = selectedLocation !== '' || selectedSpecialization !== '';

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <TouchableOpacity 
          style={[styles.filterButton, selectedLocation ? styles.activeFilterButton : {}]}
          onPress={() => {
            setTempLocation(selectedLocation);
            setShowLocationModal(true);
          }}
        >
          <MapPin size={16} color={selectedLocation ? colors.primary : colors.textDark} />
          <Text style={[styles.filterText, selectedLocation ? styles.activeFilterText : {}]}>
            {selectedLocation || 'Localização'}
          </Text>
          {selectedLocation && (
            <TouchableOpacity
              style={styles.clearButtonSmall}
              onPress={handleClearLocationFilter}
            >
              <X size={12} color={colors.primary} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterButton, selectedSpecialization ? styles.activeFilterButton : {}]}
          onPress={() => {
            setTempSpecialization(selectedSpecialization);
            setShowSpecializationModal(true);
          }}
        >
          <Briefcase size={16} color={selectedSpecialization ? colors.primary : colors.textDark} />
          <Text style={[styles.filterText, selectedSpecialization ? styles.activeFilterText : {}]}>
            {selectedSpecialization || 'Especialidade'}
          </Text>
          {selectedSpecialization && (
            <TouchableOpacity
              style={styles.clearButtonSmall}
              onPress={handleClearSpecializationFilter}
            >
              <X size={12} color={colors.primary} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearAllFilters}
          >
            <Text style={styles.clearButtonText}>Limpar filtros</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Location Filter Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a localização</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <X size={20} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {LOCATIONS.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.optionItem,
                    tempLocation === location && styles.selectedOption,
                  ]}
                  onPress={() => setTempLocation(location)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      tempLocation === location && styles.selectedOptionText,
                    ]}
                  >
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button 
                title="Aplicar" 
                onPress={handleApplyLocation} 
                style={styles.applyButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Specialization Filter Modal */}
      <Modal
        visible={showSpecializationModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a especialidade</Text>
              <TouchableOpacity onPress={() => setShowSpecializationModal(false)}>
                <X size={20} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {SPECIALIZATIONS.map((specialization) => (
                <TouchableOpacity
                  key={specialization}
                  style={[
                    styles.optionItem,
                    tempSpecialization === specialization && styles.selectedOption,
                  ]}
                  onPress={() => setTempSpecialization(specialization)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      tempSpecialization === specialization && styles.selectedOptionText,
                    ]}
                  >
                    {specialization}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button 
                title="Aplicar" 
                onPress={handleApplySpecialization} 
                style={styles.applyButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  filtersContainer: {
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginRight: 8,
  },
  activeFilterButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textDark,
    marginLeft: 4,
  },
  activeFilterText: {
    color: colors.primary,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
  },
  clearButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: colors.primary,
  },
  clearButtonSmall: {
    marginLeft: 4,
    padding: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textDark,
  },
  modalScroll: {
    maxHeight: '60%',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  selectedOptionText: {
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  applyButton: {
    marginBottom: 0,
  },
});