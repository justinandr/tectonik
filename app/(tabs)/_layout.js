import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from 'react-native'
import React from 'react'

export default function TabLayout() {

  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="new-ticket"
        options={{
          title: 'New Ticket',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'add' : 'add-outline'} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({color, focused}) =>(
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
