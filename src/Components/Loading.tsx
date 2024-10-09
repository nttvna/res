import {FC} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

interface Props {
  isHorizontal: boolean;
}

const LoadingComponent: FC<Props> = ({isHorizontal}) => {
  return (
    <View
      style={{
        padding: 20,
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator color="#888" style={{marginRight: 8}} />
      <Text style={{color: '#888'}}>Please wait...</Text>
    </View>
  );
};
export default LoadingComponent;
