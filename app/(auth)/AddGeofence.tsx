import AddGeofencingPage from '@/components/pages/AddGeofencingPage'
import Styles from '@/constants/Styles'
import React from 'react'
import { StyleSheet, View } from 'react-native'

type Props = {}

const AddGeofence = (props: Props) => {
  return (
    <View style={Styles.container}>
        <AddGeofencingPage/>
    </View>
  )
}

export default AddGeofence