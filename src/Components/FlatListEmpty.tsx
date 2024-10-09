import React from "react";
import { Text, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const FlatListEmpty = () => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 40
            }}>
            <Icon name="receipt-outline" size={30} />
            <Text style={{ fontSize: 18 }}>There is no data</Text>
        </View>
    );
};
export default React.memo(FlatListEmpty);
