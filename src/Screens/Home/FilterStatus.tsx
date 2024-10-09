import {Text, TouchableOpacity, View} from 'react-native';
import Badge from '../../Components/Badge';
import {getStatusColor} from '../../common';

const FilterStatus = () => {
  const renderButton = (label: string, total: string) => {
    return (
      <TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: label === 'CANCEL' ? 0 : 1,
            borderBottomColor: '#e5e5e5',
          }}>
          <View style={{flexGrow: 1}}>
            <Text style={{color: '#000'}}>{label}</Text>
          </View>
          <View>
            <Badge text={total} color={getStatusColor(label)} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 5,
      }}>
      {renderButton('NEW', '0')}
      {renderButton('PREPARE', '0')}
      {renderButton('READY', '0')}
      {renderButton('FINISH', '0')}
      {renderButton('REFUSE', '0')}
      {renderButton('CANCEL', '0')}
    </View>
  );
};
export default FilterStatus;
