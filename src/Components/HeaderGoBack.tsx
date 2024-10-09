import {FC} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  name: string;
  showBackButton: boolean;
}

const HeaderGoBack: FC<Props> = ({name, showBackButton}) => {
  const navigation = useNavigation<any>();
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
      {showBackButton && (
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name={'arrow-back-outline'}
              style={{color: '#333', fontSize: 25, marginRight: 8}}
            />
          </TouchableOpacity>
        </View>
      )}
      <View>
        <Text style={{fontWeight: 'bold', color: '#333', fontSize: 18}}>
          {name}
        </Text>
      </View>
    </View>
  );
};
export default HeaderGoBack;
