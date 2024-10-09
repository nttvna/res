import {FC} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  leftIcon: string;
  text: string;
  bgColor: string;
  onPress: () => void;
  isLoading: boolean;
}

const IconButton: FC<Props> = ({
  leftIcon,
  text,
  bgColor,
  onPress,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: bgColor,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 12,
          borderRadius: 5,
        }}>
        <ActivityIndicator size="small" color="#fff" style={{marginRight: 8}} />
        <Text style={{color: '#fff'}}>Please wait...</Text>
      </View>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            backgroundColor: bgColor,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 12,
            borderRadius: 5,
          }}>
          {leftIcon && (
            <Icon
              name={leftIcon}
              style={{color: '#fff', fontSize: 25, marginRight: 8}}
            />
          )}

          <Text style={{color: '#fff'}}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

export default IconButton;
