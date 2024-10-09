import {FC, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  categoryName: string | undefined;
}

const OrderByCode: FC<Props> = ({categoryName}) => {
  const [code, setCode] = useState<string>('');

  const renderSearchInput = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#888',
          marginRight: 5,
        }}>
        <View
          style={{
            justifyContent: 'flex-end',
            marginRight: 5,
          }}>
          <Icon
            name={'search-outline'}
            style={{color: 'green', fontSize: 24, marginBottom: 5}}
          />
        </View>
        <View style={{flexGrow: 1}}>
          <TextInput
            onChangeText={val => setCode(val)}
            value={code}
            placeholder={'Order by item code...'}
            keyboardType={'number-pad'}
            style={{
              fontWeight: 'bold',
              paddingBottom: 5,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
      }}>
      <View
        style={{
          display: 'flex',
          flex: 3,
          flexDirection: 'row',
          alignSelf: 'flex-end',
        }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#888',
            paddingBottom: 3,
          }}>
          {categoryName && (
            <Text
              style={{
                color: 'green',
                fontSize: 16,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                paddingRight: 10,
              }}
              numberOfLines={1}>
              {categoryName}
            </Text>
          )}
        </View>
      </View>
      <View style={{display: 'flex', flex: 1, marginTop: 2}}>
        {renderSearchInput()}
      </View>
    </View>
  );
};
export default OrderByCode;
