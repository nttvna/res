import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const LeftMenu = () => {
  const navigation = useNavigation<any>();
  return (
    <ScrollView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home', { rand: Math.random() })}>
        <View style={s.menuItem}>
          <Icon name={'home'} style={{ color: '#000' }} size={23} />
          <Text numberOfLines={1} style={{ color: '#000' }}>
            Home
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={s.menuItem}>
          <Icon name={'grid-outline'} style={{ color: '#e5e5e5' }} size={23} />
          <Text numberOfLines={1} style={{ color: '#e5e5e5' }}>
            Menus
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={s.menuItem}>
          <Icon
            name={'pie-chart-outline'}
            style={{ color: '#e5e5e5' }}
            size={23}
          />
          <Text numberOfLines={1} style={{ color: '#e5e5e5' }}>
            Reports
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ManagerLogin')}>
        <View style={s.menuItem}>
          <Icon name={'settings-outline'} style={{ color: '#000' }} size={23} />
          <Text numberOfLines={1} style={{ color: '#000' }}>
            Settings
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default LeftMenu;

const s = StyleSheet.create({
  menuItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
