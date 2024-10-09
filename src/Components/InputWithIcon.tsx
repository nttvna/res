import React, {FC} from 'react';
import {View, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  leftIcon: string;
  inputValue: string;
  placeHolder: string;
  keyboardType:
    | 'numeric'
    | 'email-address'
    | 'number-pad'
    | 'phone-pad'
    | 'default'
    | 'password';
  onChange: (val: string) => void;
}

const InputWithIcon: FC<Props> = ({
  leftIcon,
  inputValue,
  placeHolder,
  keyboardType,
  onChange,
}) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          paddingRight: 10,
          paddingLeft: 10,
          justifyContent: 'center',
        }}>
        <Icon name={leftIcon} style={{color: '#333', fontSize: 25}} />
      </View>
      <View style={{flexGrow: 1}}>
        <TextInput
          onChangeText={val => onChange(val)}
          value={inputValue}
          placeholder={placeHolder}
          keyboardType={keyboardType !== 'password' ? keyboardType : 'default'}
          secureTextEntry={keyboardType === 'password'}
        />
      </View>
    </View>
  );
};

export default InputWithIcon;
