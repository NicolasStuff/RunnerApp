import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import MapView , {Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getDistance, getPreciseDistance } from 'geolib';

export default function App() {
  const [maptrip, setMaptrip] = useState([
    { latitude: 37.8025259, longitude: -122.4351431 },
    { latitude: 37.7896386, longitude: -122.421646 },
    { latitude: 37.7665248, longitude: -122.4161628 },
    { latitude: 37.7734153, longitude: -122.4577787 },
    { latitude: 37.7948605, longitude: -122.4596065 },
    { latitude: 37.8025259, longitude: -122.4351431 }
  ])
  const [maptriplive, setMaptriplive] = useState([])
  const [location, setLocation] = useState({coords: { latitude: 49.1240072, longitude: 2.2371419}})  

  _getPreciseDistance = () => {
    var pdis = getPreciseDistance(
      { latitude: 20.0504188, longitude: 64.4139099 },
      { latitude: 51.528308, longitude: -0.3817765 },
      //{ latitude: 37.8025259, longitude: -122.4351431 },
    );
    alert(`Precise Distance\n\n${pdis / 1000} KM`);
  };

  useEffect(() => {
    async function askPermissions() {
      var { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        Location.watchPositionAsync({distanceInterval: 2},
          (location) => {
            //console.log('ma position',location)
            setMaptriplive([...maptriplive, {latitude: location.coords.latitude, longitude: location.coords.longitude}])
            //setMaptrip( [...maptrip, location])
            // console.log('contenu de maptrip', maptrip)
          }
        );
      }
    }
    askPermissions();
  }, []);

  console.log('La position',maptriplive)
  //console.log('maptrip',maptrip)


var OnPolylineDisplay = () => {
  if(maptriplive !== null) {
    return (
      <Polyline
        coordinates=
          {maptriplive}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          '#7F0000',
          '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
          '#B24112',
          '#E5845C',
          '#238C23',
          '#7F0000'
        ]}
        strokeWidth={6}
      />
    )
  }
}
  return (
    <View>
      <MapView style={styles.mapStyle}
        region = { { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } }
        showsUserLocation = { false }
        showsCompass = { false }
        enableHighAccuracy = {true}
        rotateEnabled = { true }
        provider={ PROVIDER_GOOGLE }>
          <OnPolylineDisplay/>
      </MapView>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => {
          _getPreciseDistance();
        }}>
        <Text style={{color: 'white'}}>Get Precise Distance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonStyle: {
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    padding: 20,
    backgroundColor: 'red',
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
