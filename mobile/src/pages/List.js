import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, AsyncStorage, Image, StyleSheet, Text, Platform, StatusBar, Alert, TouchableOpacity } from 'react-native';
import socketio from 'socket.io-client';

import SpotList from '../components/SpotList';
import logo from '../assets/logo.png';

export default function List({ navigation }) {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then(user_id => {
      const socket = socketio('http://192.168.1.12:3333', {
        query: { user_id }
      });

      socket.on('booking_response', booking => {
        Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`)
      });
    })
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('techs').then(storageTechs => {
      const techsArray = storageTechs.split(',').map(tech => tech.trim());
      setTechs(techsArray);
    })
  }, [])

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={[styles.container, styles.AndroidSafeArea]}>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
      <ScrollView>
        { techs.map((tech, index) => <SpotList key={index} tech={tech} />) }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  container: {
    flex: 1
  },

  logo: {
    height: 32,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 15
  }
});