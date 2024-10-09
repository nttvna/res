import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconButton from '../../Components/IconButton';
import InputWithIcon from '../../Components/InputWithIcon';
import Layout from '../../Layout';
import { useAppSelector } from '../../Redux/hooks';
import { info_700 } from '../../const';

const ManagerLogin = () => {
    const navigation = useNavigation<any>();
    const { Manager } = useAppSelector(state => state.Account);
    const [password, setPassword] = useState<string>('');


    const validatePassword = () => {
        Keyboard.dismiss();
        if (!password) {
            ToastAndroid.show('Password is required!', ToastAndroid.SHORT);
            return;
        }
        if (password != Manager) {
            ToastAndroid.show('Password is not correct!', ToastAndroid.SHORT);
            return;
        }
        setPassword('');
        navigation.navigate('RestaurantInfo');
    }

    const renderContent = () => {
        return (
            <>
                <View style={{ marginBottom: 24, marginTop: 8 }}>
                    <Text style={{ color: '#333', fontSize: 18, fontWeight: 'bold', }}>
                        Enter Manager password to use this feature
                    </Text>

                </View>
                <View
                    style={{
                        paddingTop: 20,
                        marginTop: 20,
                        borderTopWidth: 1,
                        borderTopColor: '#888',
                    }}>
                    <View style={{ marginBottom: 10 }}>
                        <InputWithIcon
                            inputValue={password}
                            placeHolder="Password..."
                            leftIcon="key-outline"
                            keyboardType="password"
                            onChange={val => setPassword(val)}
                        />
                    </View>
                    <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                        <IconButton
                            text="OK"
                            leftIcon="log-in-outline"
                            bgColor="green" onPress={validatePassword} isLoading={false} />
                    </View>
                </View>
            </>
        );
    }

    return (
        <Layout screenName="ManagerLogin">
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon
                            name={'arrow-back-outline'}
                            style={{ color: '#333', fontSize: 25, marginRight: 8 }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ flexGrow: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: '#333', fontSize: 18 }}>
                        Manager
                    </Text>
                </View>
            </View>
            <View style={{
                margin: 12,
                padding: 12,
                marginTop: 0,
                flexGrow: 1,
                borderTopWidth: 2,
                borderTopColor: '#e5e5e5',
                paddingBottom: 130,
                backgroundColor: '#fff'
            }}>
                {renderContent()}
            </View>
        </Layout>
    );
};

export default ManagerLogin;

const s = StyleSheet.create({
    header: {
        fontWeight: 'bold', color: info_700,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemcenter: {
        alignItems: 'center',
        color: '#333'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '50%',
    },
    row: {
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        alignItems: 'center',
    },
    rowLeft: {
        width: 150,
    },
    rowRight: {
        flexGrow: 1,
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 5,
        color: '#000',
        paddingLeft: 10
    }
});
