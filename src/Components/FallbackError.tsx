import {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

interface ComProps {
  resetError: () => void;
}

const FallbackError: FC<ComProps> = ({resetError}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{marginBottom: 10}}>
        <Text style={{fontSize: 20, color: '#000'}}>
          Ups! Something went wrong
        </Text>
      </View>
      <View>
        <Text style={{color: '#333'}}>
          Our team has been notified and will get this fixed for you ASAP
        </Text>
      </View>
      <View style={{marginTop: 20}}>
        <TouchableOpacity onPress={resetError}>
          <View
            style={{
              backgroundColor: 'green',
              padding: 10,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 5,
            }}>
            <Text style={{color: '#fff'}}>RELOAD APP</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FallbackError;
