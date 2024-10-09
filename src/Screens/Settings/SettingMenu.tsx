import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  currentScreen: string;
}

const SettingMenu: FC<Props> = ({ currentScreen }) => {
  const navigation = useNavigation<any>();
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('RestaurantInfo')}>
        <View style={s.wrBtn}>
          <Icon name={'storefront-outline'} style={{ color: '#000' }} size={23} />
          <Text
            style={{
              color: '#000',
              marginLeft: 10,
              fontWeight: currentScreen === 'Info' ? 'bold' : 'normal',
            }}>
            Restaurant
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
        <View style={s.wrBtn}>
          <Icon name={'time-outline'} style={{ color: '#000' }} size={23} />
          <Text
            style={{
              color: '#000',
              marginLeft: 10,
              fontWeight: currentScreen === 'OpenHourse' ? 'bold' : 'normal',
            }}>
           Reports
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
        <View style={s.wrBtn}>
          <Icon name={'time-outline'} style={{ color: '#000' }} size={23} />
          <Text
            style={{
              color: '#000',
              marginLeft: 10,
              fontWeight: currentScreen === 'OpenHourse' ? 'bold' : 'normal',
            }}>
            Categories
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <View style={s.wrBtn}>
          <Icon name={'print-outline'} style={{ color: '#000' }} size={23} />
          <Text
            style={{
              color: '#000',
              marginLeft: 10,
              fontWeight: currentScreen === 'Print' ? 'bold' : 'normal',
            }}>
            Print Setting
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default React.memo(SettingMenu);

const s = StyleSheet.create({
  wrBtn: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
