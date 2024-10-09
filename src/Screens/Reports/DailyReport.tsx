import { useNavigation, useRoute } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Switch, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLazyDeleteCategoryTypeQuery, useLazyGetCategoryTypeQuery, useUpdateCategoryTypeMutation } from '../../Apis/settings';
import FlatListEmpty from '../../Components/FlatListEmpty';
import IconButton from '../../Components/IconButton';
import LoadingComponent from '../../Components/Loading';
import Layout from '../../Layout';
import { CategoryTypeItem, CategoryTypeParam, reportRouteParam } from '../../Models/setting';
import { formatNumber } from '../../common';
import { info_700 } from '../../const';

const DailyReport:FC<reportRouteParam> = (pr) => {
    const route = useRoute<any>();
    let _rand: number = 0;
    if (route.params && route.params.rand) {
        _rand = route.params.rand;
    }
    const navigation = useNavigation<any>();
    const [getData, { data, isLoading }] = useLazyGetCategoryTypeQuery();
    const [deleteItem] = useLazyDeleteCategoryTypeQuery();
    const [updateItem, { isLoading: isUpdating }] = useUpdateCategoryTypeMutation();
    const [itemParam, setItemParam] = useState<CategoryTypeParam>({
        Id: 0,
        Name: '',
        RateText: '0.00',
        IsActive: true,
        modalVisible: false,
    })
    useEffect(() => {
        getData();
    }, [_rand]);

    const renderHeader = () => {
        return <View style={{
            flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            backgroundColor: '#f8f8f8', padding: 12
        }}>
            <View style={{ flex: 1 / 10 }}>
                <Text style={s.header}>#</Text>
            </View>
            <View style={{ flex: 4 / 10 }}>
                <Text style={[s.header, { justifyContent: 'flex-start', alignItems: 'center' }]}>Name</Text>
            </View>
            <View style={{ flex: 2 / 10 }}>
                <Text style={s.header}>Rate (%)</Text>
            </View>
            <View style={{ flex: 1 / 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={s.header}>Active</Text>
            </View>
            <View style={{ flex: 2 / 10, justifyContent: 'center', alignItems: 'center' }}>
            </View>
        </View>

    };

    const EditItem = (item: CategoryTypeItem) => {
        setItemParam({
            Id: item.Id,
            Name: item.Name,
            RateText: formatNumber(item.Rate),
            IsActive: item.IsActive,
            modalVisible: true,
        });
    }

    const AddNewItem = () => {
        setItemParam({
            Id: 0,
            Name: '',
            RateText: '',
            IsActive: true,
            modalVisible: true,
        });
    }
    const renderItem = (item: CategoryTypeItem, index: number) => {
        return <View style={{
            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12,
            borderBottomWidth: 1, borderBottomColor: '#e5e5e5'
        }}>
            <View style={{ flex: 1 / 10 }}>
                <Text style={s.itemcenter}>{index + 1}</Text>
            </View>
            <View style={{ flex: 4 / 10 }}>
                <Text style={[s.itemcenter, { alignItems: 'flex-start', fontWeight: 'bold' }]}>{item.Name}</Text>
            </View>
            <View style={{ flex: 2 / 10 }}>
                <Text style={s.itemcenter}>{formatNumber(item.Rate)}</Text>
            </View>
            <View style={{ flex: 1 / 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={item.IsActive ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    value={item.IsActive}
                />
                <Text style={{ color: '#333' }}>{'  '}{item.IsActive ? 'Active' : 'Inactive'}</Text>
            </View>
            <View style={{ flex: 2 / 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                {item.CanDelete && <Pressable onPress={() => DeleteConfirm(item)} style={{
                    alignItems: 'center',
                    backgroundColor: 'rgba(252,231,243,1.00)',
                    padding: 10,
                    borderRadius: 3,
                    marginRight: 10
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="trash-outline" size={18} color={'rgb(131,24,67)'} />
                        <Text style={{ color: 'rgb(131,24,67)', marginLeft: 1 }}></Text>
                    </View>
                </Pressable>
                }
                <Pressable onPress={() => EditItem(item)} style={{
                    alignItems: 'center',
                    backgroundColor: 'rgba(207,250,254,1.00)',
                    padding: 10,
                    borderRadius: 3
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="create-outline" size={18} color={'rgb(22,78,99)'} />
                        <Text style={{ color: 'rgb(22,78,99)', marginLeft: 1 }}></Text>
                    </View>
                </Pressable>

            </View>
        </View>
    };
    const SaveItem = () => {
        if (!itemParam.Name || itemParam.Name.trim().length == 0) {
            ToastAndroid.show('Please enter Name', ToastAndroid.SHORT);
            return;
        }
        if (!itemParam.RateText) {
            ToastAndroid.show('Rate is not valid', ToastAndroid.SHORT);
            return;
        }
        let ratevalue: number = parseFloat(itemParam.RateText);
        if (isNaN(ratevalue) || ratevalue < 0 || ratevalue > 100) {
            ToastAndroid.show('Rate is not valid', ToastAndroid.SHORT);
            return;
        }
        updateItem({
            Id: itemParam.Id,
            Name: itemParam.Name,
            Rate: ratevalue,
            IsActive: itemParam.IsActive
        }).unwrap().then(({ Message }) => {
            if (Message == 'Success') {
                ToastAndroid.show(
                    'Successfully.',
                    ToastAndroid.SHORT,
                );
                setItemParam(prevState => {
                    return ({
                        ...prevState,
                        modalVisible: false
                    });
                });
                getData();
            }
            else ToastAndroid.show(Message, ToastAndroid.SHORT);
        }).catch((err) => ToastAndroid.show(err, ToastAndroid.SHORT));
    }
    const ModalEdit = () => {
        return <Modal
            animationType="slide"
            transparent={true}
            visible={itemParam.modalVisible}
            onRequestClose={() => {
                setItemParam(prevState => {
                    return ({
                        ...prevState,
                        modalVisible: false
                    });
                });
            }}>
            <View style={s.centeredView}>
                <View style={s.modalView}>
                    <View
                        style={{
                            borderBottomColor: '#e5e5e5',
                            borderBottomWidth: 1,
                            paddingBottom: 10,
                            marginBottom: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Icon
                            name={'checkmark-circle-outline'}
                            style={{ color: '#000', fontSize: 25, marginRight: 8 }}
                        />
                        <Text style={{ color: '#000', fontWeight: 'bold' }}>{itemParam.Id == 0 ? "NEW CATEGORY TYPE" : itemParam.Name}</Text>
                    </View>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <Text style={{ color: '#333' }}>Name:</Text>
                        </View>
                        <View style={s.rowRight}>
                            <TextInput
                                onChangeText={val => {
                                    setItemParam(prevState => {
                                        return ({
                                            ...prevState,
                                            Name: val
                                        });
                                    });
                                }}
                                value={itemParam.Name}
                                placeholder={'Enter name'}
                                style={s.inputStyle}
                            />
                        </View>
                    </View>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <Text style={{ color: '#333' }}>Rate:</Text>
                        </View>
                        <View style={s.rowRight}>
                            <TextInput
                                onChangeText={val => {
                                    setItemParam(prevState => {
                                        return ({
                                            ...prevState,
                                            RateText: val
                                        });
                                    });
                                }}
                                value={itemParam.RateText}
                                placeholder={'Enter rate'}
                                style={s.inputStyle}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>
                    {itemParam.Id > 0 && <View style={s.row}>
                        <View style={{ paddingLeft: 150, flexGrow: 1, flexDirection: 'row' }}>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={itemParam.IsActive ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {
                                    setItemParam(prevState => {
                                        return ({
                                            ...prevState,
                                            IsActive: !itemParam.IsActive
                                        });
                                    });
                                }}
                                value={itemParam.IsActive}
                            />
                            <Text style={{ color: '#333' }}>{'  '}{itemParam.IsActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>}
                    <View
                        style={{
                            paddingTop: 20,
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}>
                        <View style={{ marginRight: 30 }}>
                            <IconButton
                                text="CANCEL"
                                leftIcon="close-outline"
                                onPress={() => {
                                    setItemParam(prevState => {
                                        return ({
                                            ...prevState,
                                            modalVisible: false
                                        });
                                    });
                                }}
                                bgColor="#888"
                                isLoading={isUpdating}
                            />
                        </View>

                        <IconButton
                            text="ACCEPT   "
                            leftIcon="checkmark-outline"
                            onPress={SaveItem}
                            bgColor="#22c55e"
                            isLoading={isUpdating}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    }

    const deleteCategoryType = (itm: CategoryTypeItem) => {
        deleteItem({ Id: itm.Id }).unwrap().then(({ Message }) => {
            if (Message == 'Success') {
                ToastAndroid.show(
                    'Delete successfully.',
                    ToastAndroid.SHORT,
                );
                getData();
            }
            else ToastAndroid.show('Unable to delete [' + itm.Name + ']', ToastAndroid.SHORT);
        }).catch((err) => ToastAndroid.show(err, ToastAndroid.SHORT));
    }
    const DeleteConfirm = (itm: CategoryTypeItem) => {
        Alert.alert(
            'Confirm',
            'Are you sure you want to delete [' + itm.Name + ']',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => deleteCategoryType(itm),
                    style: 'destructive',
                },
            ],
            {
                cancelable: true,
            },
        );
    }

    return (
        <Layout screenName="CatetoryType">
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
                        Category Types
                    </Text>
                </View>
                <View>
                    <IconButton
                        text="ADD NEW"
                        leftIcon="add-outline"
                        bgColor="green"
                        onPress={AddNewItem} isLoading={false}
                    />
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
                {isLoading ? <LoadingComponent isHorizontal={false} />
                    : <FlatList
                        data={data?.Data}
                        renderItem={({ item, index }) => renderItem(item, index)}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={<FlatListEmpty />}
                    />}
                {ModalEdit()}
            </View>
        </Layout>
    );
};

export default DailyReport;

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
